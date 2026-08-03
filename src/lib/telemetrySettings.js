/**
 * Telemetry (Sentry) gate resolution for CI-Spellbook.
 *
 * Error reporting is **opt-in and off by default**: with no `VITE_SENTRY_DSN`
 * baked in at build time, no Sentry code initialises, no network call is ever
 * made, and the SDK is tree-shaken out of the bundle entirely.
 *
 * Spellbook is a *static* bundle — nginx (or Cloudflare Pages) serves files and
 * nothing else, so there is no server process that could read `CI_TELEMETRY` on
 * the app's behalf. Two things bridge that gap, and both use the functions
 * below:
 *
 *   - `nginx/40-telemetry-config.sh` runs at container start and writes the
 *     resolved consent to `/api/config/telemetry`. It is a shell mirror of
 *     `resolveTelemetryConsent`; `telemetryConsentEndpoint.test.js` asserts the
 *     two agree over the whole env matrix.
 *   - the Vite dev/preview server serves the same path from `process.env`
 *     (see `vite.config.js`), so the switches behave identically in development.
 *
 * Kill switches, so an operator (or the marketplace "Share crash reports"
 * toggle, which sets `CI_TELEMETRY` on the container) can turn reporting off
 * without rebuilding the image the DSN is baked into:
 *
 *   - `CI_TELEMETRY=off`   — explicit opt-out
 *   - `CI_LOCAL_ONLY=true` — local-only mode must mean zero phone-home, see
 *     CI-Engineering/proposals/local-only-mode.md
 *
 * Precedence: local-only > opt-out > no-dsn.
 */

/** Where the browser asks whether reporting is permitted right now. */
export const TELEMETRY_CONFIG_PATH = '/api/config/telemetry';

/** Path of the file the container entrypoint writes, relative to the web root. */
export const TELEMETRY_CONFIG_FILE = 'api/config/telemetry.json';

const FALSEY = new Set(['off', 'false', '0', 'no', 'disabled']);
const TRUTHY = new Set(['on', 'true', '1', 'yes', 'enabled']);

function read(env, key) {
  const value = env && typeof env[key] === 'string' ? env[key].trim() : '';

  return value ? value : null;
}

/** `CI_TELEMETRY=off` (any falsey spelling) opts out; anything else leaves the DSN in charge. */
export function isTelemetryOptedOut(env) {
  const value = read(env, 'CI_TELEMETRY');

  return value !== null && FALSEY.has(value.toLowerCase());
}

/** Local-only mode forbids all egress, telemetry included. */
export function isLocalOnly(env) {
  const value = read(env, 'CI_LOCAL_ONLY');

  return value !== null && TRUTHY.has(value.toLowerCase());
}

/**
 * Runtime consent, resolved from the environment of whatever is serving the
 * bundle. Deliberately says nothing about the DSN: the DSN lives in the bundle,
 * not in the container, so the server side cannot know whether one exists.
 */
export function resolveTelemetryConsent(env) {
  // Order matters: report the operator's explicit choice ahead of anything
  // else, so the reason tells them why reporting is off.
  if (isLocalOnly(env)) {
    return { enabled: false, disabledReason: 'local-only' };
  }

  if (isTelemetryOptedOut(env)) {
    return { enabled: false, disabledReason: 'opt-out' };
  }

  return { enabled: true, disabledReason: null };
}

/**
 * The JSON body served at `TELEMETRY_CONFIG_PATH`.
 *
 * Never contains a DSN — it is a consent answer, not a configuration handout.
 */
export function telemetryConsentPayload(env) {
  const { enabled, disabledReason } = resolveTelemetryConsent(env);

  return enabled ? { enabled: true } : { enabled: false, reason: disabledReason };
}

/**
 * The complete gate: the build-time DSN AND the runtime consent answer.
 *
 * `consent` is `null` when the endpoint could not be read — a missing or
 * unparseable answer disables reporting (fail closed), because silently
 * reporting against a consent decision we could not read is the worse failure.
 */
export function resolveTelemetryState({ dsn, consent }) {
  const trimmedDsn = typeof dsn === 'string' ? dsn.trim() : '';

  if (consent && consent.disabledReason) {
    return { enabled: false, disabledReason: consent.disabledReason };
  }

  if (!trimmedDsn) {
    return { enabled: false, disabledReason: 'no-dsn' };
  }

  if (!consent || consent.enabled !== true) {
    return { enabled: false, disabledReason: 'consent-unavailable' };
  }

  return { enabled: true, disabledReason: null };
}
