/**
 * Browser error reporting for CI-Spellbook.
 *
 * Opt-out: a build with `VITE_SENTRY_DSN` baked in reports by default, until
 * `CI_TELEMETRY=off` or `CI_LOCAL_ONLY=true` on whatever serves the bundle says
 * otherwise. Without a DSN nothing initialises, the bundle makes no request to
 * Sentry, and the SDK is tree-shaken out of the build entirely — that is an
 * unconfigured build, not an opted-out one. `initTelemetry` is safe to call
 * more than once and safe to call when reporting is disabled.
 *
 * Nothing user-identifying is sent — `sendDefaultPii` is off, there is no
 * session replay and no tracing, and every payload goes through `beforeSend`
 * first.
 *
 * See `docs/operations/error-reporting.md`.
 */

import * as Sentry from '@sentry/react';

import { TELEMETRY_CONFIG_PATH, resolveTelemetryState } from './telemetrySettings.js';

let initialized = false;
let disabledReason = 'no-dsn';

const COMPONENT = 'ci-spellbook';

/** Noise that says nothing about a defect: a stale chunk after a redeploy. */
const CHUNK_LOAD_PATTERNS = [
  /Loading chunk \S+ failed/i,
  /Failed to fetch dynamically imported module/i,
  /Importing a module script failed/i,
  /error loading dynamically imported module/i,
];

/** Extension/browser noise the app can neither cause nor fix. */
const IGNORED_PATTERNS = [
  /ResizeObserver loop/i,
  /^Non-Error promise rejection captured/i,
  ...CHUNK_LOAD_PATTERNS,
];

function messagesOf(event) {
  const values = (event.exception && event.exception.values) || [];

  return [event.message, ...values.map((value) => value.value)].filter(
    (value) => typeof value === 'string' && value.length > 0,
  );
}

export function shouldDropEvent(event) {
  return messagesOf(event).some((text) => IGNORED_PATTERNS.some((pattern) => pattern.test(text)));
}

/**
 * Strip query and hash.
 *
 * Deliberately a plain split rather than `new URL()`: it leaves the origin and
 * path exactly as written (no percent-encoding, no base-URL guessing for
 * relative paths) and cannot throw.
 */
export function scrubUrl(url) {
  return url.split(/[?#]/)[0] ?? url;
}

// Kept in lockstep with the CI-Server scrubbers — the API's
// `common/telemetry/scrubEvent.ts`, its web bundle's `lib/telemetry.ts`, and
// the two Python twins. Duplicated rather than shared because they live in
// separate repos and separate build graphs; change all of them together. The
// shared redaction cases are in `telemetryScrubFixtures.js`.
const SECRET_PATTERNS = [
  /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi,
  /(?:api[-_ ]?key|token|password|secret|jwt|auth)[\s=:"']+[^\s"',}\]]+/gi,
  /tskey-[A-Za-z0-9-]+/gi,
  /\b[a-z][a-z0-9+.-]*:\/\/[^\s:@/]+:[^\s@/]+@/gi,
];

// Windows first: the macOS pattern otherwise matches inside `C:/Users/<name>`
// and leaves a stranded `C:~/…`.
const HOME_PATH_PATTERNS = [
  /[A-Za-z]:\\Users\\[^\\/\s]+/g, // Windows (backslash)
  /[A-Za-z]:\/Users\/[^/\s]+/g, // Windows (forward-slash)
  /\/Users\/[^/\s]+/g, // macOS
  /\/home\/[^/\s]+/g, // Linux
];

// `api[-_ ]?key` rather than `apikey|api_key`, so `x-api-key` matches too.
const SENSITIVE_KEY_PATTERN =
  /password|secret|token|authorization|cookie|jwt|api[-_ ]?key|dsn|pepper|private[-_]?key|signature/i;

// Keys that name a PERSON rather than carrying a credential. No value pattern
// can ever match these — a username is just a word — so the key is the only
// signal, the same reason we drop `server_name`. This matters behind CI-Hub's
// Traefik forward-auth: the SDK captures headers that ARRIVED, so a
// proxy-injected `x-ci-hub-user` reaches the event with no reference in our
// code at all. (`x-ci-hub-user` used to be covered by a `hub[-_]user` alternate
// here; `(?:^|[-_])user$` subsumes it and generalises to the rest of the fleet.)
//
// Anchored on purpose: `user-agent`, `user_id` and `owner_id` are diagnostic
// signal worth keeping, and a naive /user|owner/ would eat all three.
const IDENTITY_KEY_PATTERN = /(?:^|[-_])user$|(?:^|[-_])owner$|username|email|forwarded|^remote-/i;

/** Single predicate so credential and identity coverage cannot diverge. */
function isSensitiveKey(key) {
  return SENSITIVE_KEY_PATTERN.test(key) || IDENTITY_KEY_PATTERN.test(key);
}

const MAX_STRING_LENGTH = 8000;

const MAX_DEPTH = 8;

export function scrubString(value) {
  let scrubbed = value;

  for (const pattern of HOME_PATH_PATTERNS) {
    scrubbed = scrubbed.replace(pattern, '~');
  }

  for (const pattern of SECRET_PATTERNS) {
    scrubbed = scrubbed.replace(pattern, '[Filtered]');
  }

  if (scrubbed.length > MAX_STRING_LENGTH) {
    return `${scrubbed.slice(0, MAX_STRING_LENGTH)}… [truncated]`;
  }

  return scrubbed;
}

export function scrubValue(value, depth = 0) {
  if (depth > MAX_DEPTH) {
    return '[Truncated]';
  }

  if (typeof value === 'string') {
    return scrubString(value);
  }

  if (Array.isArray(value)) {
    return value.map((entry) => scrubValue(entry, depth + 1));
  }

  if (value && typeof value === 'object') {
    const result = {};

    for (const [key, nested] of Object.entries(value)) {
      result[key] = isSensitiveKey(key) ? '[Filtered]' : scrubValue(nested, depth + 1);
    }

    return result;
  }

  return value;
}

/** Breadcrumb `data` keys whose value is a URL (fetch/xhr/navigation crumbs). */
const URL_VALUED_KEYS = new Set(['url', 'from', 'to']);

/** Request headers whose value is a URL the user navigated from. */
const URL_VALUED_HEADERS = ['referer', 'referrer', 'location'];

/**
 * Scrub one breadcrumb in place.
 *
 * The default `breadcrumbsIntegration` records fetch, xhr, console and dom
 * crumbs. fetch/xhr carry `data.url` with the full query string, while console
 * crumbs carry the joined `message` plus the raw `data.arguments` — whatever
 * the app happened to log. Handling only navigation `from`/`to` leaves all of
 * that untouched.
 */
function scrubBreadcrumb(breadcrumb) {
  if (typeof breadcrumb.message === 'string') {
    breadcrumb.message = scrubString(breadcrumb.message);
  }

  if (!breadcrumb.data) {
    return;
  }

  // The WHOLE `data` object goes through `scrubValue`, not each value in turn:
  // `scrubValue` only consults `isSensitiveKey` while walking an object's own
  // entries, so handing it the values one at a time never checks the crumb's
  // own keys and a bare `data.token` ships intact. (The value alone matches no
  // secret pattern — `authorization` was the one key that looked fine, because
  // `Bearer …` is caught by the value rules whatever the walk does.)
  const data = scrubValue(breadcrumb.data);

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string' && URL_VALUED_KEYS.has(key)) {
      data[key] = scrubUrl(value);
    }
  }

  breadcrumb.data = data;
}

export function scrubBrowserEvent(event) {
  if (shouldDropEvent(event)) {
    return null;
  }

  if (event.message) {
    event.message = scrubString(event.message);
  }

  for (const exception of (event.exception && event.exception.values) || []) {
    if (exception.value) {
      exception.value = scrubString(exception.value);
    }
  }

  if (event.extra) {
    event.extra = scrubValue(event.extra);
  }

  // The machine hostname identifies the household the way a home path does.
  delete event.server_name;

  if (event.request) {
    if (event.request.url) {
      event.request.url = scrubUrl(event.request.url);
    }

    delete event.request.cookies;
    delete event.request.query_string;
    delete event.request.data;

    // httpContextIntegration puts `document.referrer` here, and the browser's
    // default referrer policy keeps the full same-origin URL — query string and
    // all — which is exactly what scrubUrl exists to remove.
    if (event.request.headers) {
      const headers = scrubValue(event.request.headers);

      for (const [key, value] of Object.entries(headers)) {
        if (URL_VALUED_HEADERS.includes(key.toLowerCase()) && typeof value === 'string') {
          headers[key] = scrubUrl(value);
        }
      }

      event.request.headers = headers;
    }
  }

  for (const breadcrumb of event.breadcrumbs || []) {
    scrubBreadcrumb(breadcrumb);
  }

  // Stack frames: collapse home directories in paths, and drop any captured
  // locals. `filename` is deliberately only home-collapsed and never redacted
  // further — Sentry groups issues on it.
  for (const exception of (event.exception && event.exception.values) || []) {
    for (const frame of (exception.stacktrace && exception.stacktrace.frames) || []) {
      delete frame.vars;

      if (typeof frame.filename === 'string') {
        frame.filename = scrubString(frame.filename);
      }

      if (typeof frame.abs_path === 'string') {
        frame.abs_path = scrubString(frame.abs_path);
      }
    }
  }

  return event;
}

export function isTelemetryEnabled() {
  return initialized;
}

/** Why reporting is off, for the probe and for operator-facing debugging. */
export function telemetryDisabledReason() {
  return initialized ? null : disabledReason;
}

// Read at module scope with NO optional chaining, so the `if (!DSN) return`
// below folds to statically dead code and the SDK is tree-shaken out of a
// DSN-less build entirely. `import.meta.env.X?.trim()` does NOT fold under
// rolldown (it does under Rollup) — a shape difference that silently put the
// whole SDK back into a sibling repo's DSN-less bundle. Keep this shape, and
// keep `scripts/assert-bundle-without-dsn.mjs` in CI to prove it.
const DSN = import.meta.env.VITE_SENTRY_DSN;

/**
 * Ask whatever is serving this bundle whether reporting is permitted right now.
 *
 * A DSN baked into the bundle at build time cannot be revoked afterwards, so
 * without this the `CI_TELEMETRY` / `CI_LOCAL_ONLY` kill switches — including
 * the marketplace "Share crash reports" toggle — would not apply to the browser
 * at all.
 *
 * Fails CLOSED: if the endpoint is missing, unreachable or malformed we do not
 * report. Spellbook is a static bundle, so the endpoint only exists where
 * something can resolve it from the environment — the nginx container image
 * (`nginx/40-telemetry-config.sh`) and the Vite dev/preview server. Anywhere
 * else, including a bare static host, this returns null and reporting stays
 * off. See `docs/operations/error-reporting.md`.
 */
async function fetchConsent() {
  try {
    const response = await fetch(TELEMETRY_CONFIG_PATH, {
      credentials: 'same-origin',
      headers: { accept: 'application/json' },
    });

    if (!response.ok) {
      return null;
    }

    const body = await response.json();

    if (!body || typeof body !== 'object') {
      return null;
    }

    return {
      enabled: body.enabled === true,
      disabledReason: body.enabled === true ? null : (body.reason ?? 'consent-unavailable'),
    };
  } catch {
    return null;
  }
}

/**
 * Start error reporting if permitted. Returns a promise for tests; callers may
 * ignore it — nothing is reported until consent is confirmed.
 */
export async function initTelemetry() {
  if (initialized || typeof window === 'undefined') {
    return;
  }

  // Static short-circuit. This is what makes the SDK disappear from a DSN-less
  // bundle; it only changes the *reason* reported, never the outcome, because
  // reporting is off without a DSN regardless of what consent says.
  if (!DSN) {
    disabledReason = 'no-dsn';
    return;
  }

  const state = resolveTelemetryState({ dsn: DSN, consent: await fetchConsent() });

  disabledReason = state.disabledReason;

  if (!state.enabled) {
    return;
  }

  // Re-check: an await elapsed, and a concurrent caller may have won.
  if (initialized) {
    return;
  }

  Sentry.init({
    dsn: DSN.trim(),
    environment: import.meta.env.VITE_CI_ENVIRONMENT?.trim() || import.meta.env.MODE,
    release: import.meta.env.VITE_SENTRY_RELEASE?.trim() || undefined,
    enabled: true,
    // Errors only — no tracing, no session replay, no profiling, no PII.
    tracesSampleRate: 0,
    sendDefaultPii: false,
    beforeSend: scrubBrowserEvent,
    // Belt and braces: `beforeSend` already scrubs the crumbs attached to an
    // event, but scrubbing at record time means an unsent crumb never sits in
    // the scope with a query string in it. Fails closed — a crumb we could not
    // scrub is dropped rather than sent.
    beforeBreadcrumb: (breadcrumb) => {
      try {
        scrubBreadcrumb(breadcrumb);
      } catch {
        return null;
      }

      return breadcrumb;
    },
  });

  initialized = true;
  disabledReason = null;
  Sentry.setTag('component', COMPONENT);
}

/**
 * Report an error the app caught and handled itself.
 *
 * A no-op unless reporting is running, so call sites need no guard of their own
 * — and because `initialized` can only be set inside the DSN-gated branch
 * above, Rollup proves this whole body dead in a DSN-less build too (measured:
 * a call site costs 6 bytes, not the 92 kB of the SDK). That property is
 * subtler than the `if (!DSN) return` one, so it is asserted on every PR by
 * `scripts/assert-bundle-without-dsn.mjs`; if a future bundler stops proving
 * it, CI fails loudly rather than silently shipping the SDK.
 */
export function captureException(error, context) {
  if (!initialized) {
    return;
  }

  Sentry.withScope((scope) => {
    for (const [key, value] of Object.entries(context ?? {})) {
      if (value !== undefined) {
        scope.setExtra(key, value);
      }
    }

    Sentry.captureException(error);
  });
}
