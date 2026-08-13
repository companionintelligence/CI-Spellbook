import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  scrubBrowserEvent,
  scrubString,
  scrubUrl,
  scrubValue,
  shouldDropEvent,
} from './telemetry.js';
import { MAX_STRING_LENGTH, SCRUB_CASES } from './telemetryScrubFixtures.js';

const FAKE_DSN = 'https://abc123@o1.ingest.us.sentry.io/9999999';

describe('scrubUrl', () => {
  it('drops the query string and hash', () => {
    expect(scrubUrl('https://spellbook.localhost/search?q=my+private+note#results')).toBe(
      'https://spellbook.localhost/search',
    );
  });

  it('keeps a bare path intact', () => {
    expect(scrubUrl('/markdown/MCP Servers & Connectors.md')).toBe(
      '/markdown/MCP Servers & Connectors.md',
    );
  });

  it('leaves the origin and path exactly as written', () => {
    expect(scrubUrl('https://spellbook.localhost/a b/c')).toBe('https://spellbook.localhost/a b/c');
  });

  it('handles unparseable input without throwing', () => {
    expect(scrubUrl('::not a url::?q=secret')).toBe('::not a url::');
  });
});

describe('shouldDropEvent', () => {
  it.each([
    'Loading chunk 42 failed',
    'Failed to fetch dynamically imported module: /assets/x.js',
    'Importing a module script failed',
    'ResizeObserver loop completed with undelivered notifications',
    'Non-Error promise rejection captured with value: undefined',
  ])('drops known noise: %s', (message) => {
    expect(shouldDropEvent({ message })).toBe(true);
  });

  it('keeps a real application error', () => {
    expect(shouldDropEvent({ message: 'Cannot read properties of undefined' })).toBe(false);
  });

  it('inspects exception values, not just the message', () => {
    expect(shouldDropEvent({ exception: { values: [{ value: 'Loading chunk 7 failed' }] } })).toBe(true);
  });

  it('tolerates an event with neither message nor exception', () => {
    expect(shouldDropEvent({})).toBe(false);
  });
});

describe('scrubString — shared fixtures, parity with the CI-Server scrubbers', () => {
  it.each(SCRUB_CASES.map((testCase) => [testCase.name, testCase]))('%s', (_name, testCase) => {
    const actual = scrubString(testCase.input);

    if (testCase.expected !== undefined) {
      expect(actual).toBe(testCase.expected);
    }

    for (const forbidden of testCase.mustNotContain ?? []) {
      expect(actual).not.toContain(forbidden);
    }
  });

  it('truncates at the shared limit', () => {
    expect(scrubString('a'.repeat(MAX_STRING_LENGTH + 1000))).toHaveLength(
      MAX_STRING_LENGTH + '… [truncated]'.length,
    );
  });

  it('applies the Windows rules before the macOS one', () => {
    // Regression: the macOS pattern used to match inside `C:/Users/liam` and
    // leave a stranded `C:~/…`.
    expect(scrubString('C:/Users/liam/AppData/ci')).not.toContain('C:');
  });

  it('redacts an x-api-key style header value', () => {
    expect(scrubString('x-api-key: sk-live-abcdef')).not.toContain('sk-live-abcdef');
  });
});

describe('scrubValue', () => {
  it('filters sensitive keys at any depth', () => {
    expect(scrubValue({ a: { b: { password: 'hunter2', ok: 'fine' } } })).toEqual({
      a: { b: { password: '[Filtered]', ok: 'fine' } },
    });
  });

  it.each([
    'password',
    'secret',
    'token',
    'Authorization',
    'cookie',
    'jwt',
    'api-key',
    'api_key',
    'x-api-key',
    'SENTRY_DSN',
    'pepper',
    'private_key',
    'x-ci-hub-user',
  ])('filters the %s key', (key) => {
    expect(scrubValue({ [key]: 'sensitive-value' })[key]).toBe('[Filtered]');
  });

  it('scrubs strings inside arrays', () => {
    expect(scrubValue(['/Users/liam/x', 'Bearer abcdefghijkl'])).toEqual(['~/x', '[Filtered]']);
  });

  it('leaves non-string primitives alone', () => {
    expect(scrubValue({ n: 1, b: true, z: null })).toEqual({ n: 1, b: true, z: null });
  });

  it('guards depth rather than recursing forever', () => {
    const cyclic = {};
    cyclic.self = cyclic;

    expect(() => scrubValue(cyclic)).not.toThrow();
    expect(JSON.stringify(scrubValue(cyclic))).toContain('[Truncated]');
  });
});

describe('scrubBrowserEvent', () => {
  it('returns null for dropped noise', () => {
    expect(scrubBrowserEvent({ message: 'Loading chunk 3 failed' })).toBeNull();
  });

  it('passes a clean event through untouched', () => {
    expect(scrubBrowserEvent({ message: 'real failure' })).toEqual({ message: 'real failure' });
  });

  it('scrubs the request url and removes cookies, body and query string', () => {
    const scrubbed = scrubBrowserEvent({
      message: 'boom',
      request: {
        url: 'https://spellbook.localhost/search?q=private',
        cookies: { sessionToken: 'abc' },
        query_string: 'q=private',
        data: { note: 'a private note' },
      },
    });

    expect(scrubbed.request.url).toBe('https://spellbook.localhost/search');
    expect(scrubbed.request.cookies).toBeUndefined();
    expect(scrubbed.request.query_string).toBeUndefined();
    expect(scrubbed.request.data).toBeUndefined();
  });

  it('deletes server_name, which identifies the household machine', () => {
    expect(scrubBrowserEvent({ message: 'boom', server_name: 'liams-macbook.local' })).toEqual({
      message: 'boom',
    });
  });

  it('scrubs navigation breadcrumbs', () => {
    const scrubbed = scrubBrowserEvent({
      message: 'boom',
      breadcrumbs: [{ category: 'navigation', data: { from: '/a?q=x', to: '/b?q=y' } }],
    });

    expect(scrubbed.breadcrumbs[0].data).toEqual({ from: '/a', to: '/b' });
  });
});

describe('scrubBrowserEvent — leaks confirmed by adversarial review', () => {
  it('scrubs fetch/xhr breadcrumb urls, which carry the query string', () => {
    const scrubbed = scrubBrowserEvent({
      message: 'boom',
      breadcrumbs: [{ category: 'fetch', data: { url: '/markdown/notes.md?token=sk-live-1234' } }],
    });

    expect(scrubbed.breadcrumbs[0].data.url).toBe('/markdown/notes.md');
  });

  it('scrubs non-url breadcrumb data values too', () => {
    const scrubbed = scrubBrowserEvent({
      message: 'boom',
      breadcrumbs: [{ category: 'xhr', data: { url: '/a', response_body: 'password: hunter2' } }],
    });

    expect(scrubbed.breadcrumbs[0].data.response_body).not.toContain('hunter2');
  });

  it('scrubs console breadcrumb message and raw arguments', () => {
    const scrubbed = scrubBrowserEvent({
      message: 'boom',
      breadcrumbs: [
        {
          category: 'console',
          message: 'token=abc123456 at /Users/liam/x',
          data: { arguments: ['Bearer abcdefghijkl'] },
        },
      ],
    });
    const crumb = scrubbed.breadcrumbs[0];

    expect(crumb.message).not.toContain('abc123456');
    expect(crumb.message).toContain('~/x');
    expect(JSON.stringify(crumb.data.arguments)).not.toContain('abcdefghijkl');
  });

  it('scrubs the referer header put there by httpContextIntegration', () => {
    const scrubbed = scrubBrowserEvent({
      message: 'boom',
      request: { headers: { Referer: 'https://x/spell?search=oncology' } },
    });

    expect(scrubbed.request.headers.Referer).toBe('https://x/spell');
  });

  it.each(['Referer', 'referrer', 'Location'])('scrubs the %s header', (header) => {
    const scrubbed = scrubBrowserEvent({
      message: 'boom',
      request: { headers: { [header]: 'https://x/page?q=private' } },
    });

    expect(scrubbed.request.headers[header]).toBe('https://x/page');
  });

  it('filters sensitive request headers by name', () => {
    const scrubbed = scrubBrowserEvent({
      message: 'boom',
      request: { headers: { 'x-api-key': 'sk-live-1', Authorization: 'Bearer t', Accept: 'text/html' } },
    });

    expect(scrubbed.request.headers['x-api-key']).toBe('[Filtered]');
    expect(scrubbed.request.headers.Authorization).toBe('[Filtered]');
    expect(scrubbed.request.headers.Accept).toBe('text/html');
  });

  it('applies the shared secret and home-path rules to message, exception and extra', () => {
    const scrubbed = scrubBrowserEvent({
      message: 'failed at /Users/liam/notes with api_key=sk-live-123456',
      exception: { values: [{ value: 'Bearer eyJhbGciOiJIUzI1NiJ9.a.b rejected' }] },
      extra: { password: 'hunter2', path: '/home/ci/spellbook' },
    });

    expect(scrubbed.message).toContain('~/notes');
    expect(scrubbed.message).not.toContain('sk-live-123456');
    expect(scrubbed.exception.values[0].value).not.toContain('eyJhbGciOiJIUzI1NiJ9');
    expect(scrubbed.extra.password).toBe('[Filtered]');
    expect(scrubbed.extra.path).toBe('~/spellbook');
  });

  it('drops captured stack-frame locals and collapses home paths in filenames', () => {
    const scrubbed = scrubBrowserEvent({
      message: 'boom',
      exception: {
        values: [
          {
            value: 'boom',
            stacktrace: {
              frames: [
                {
                  filename: '/Users/liam/devel/ci/CI-Spellbook/src/App.jsx',
                  abs_path: '/Users/liam/devel/ci/CI-Spellbook/src/App.jsx',
                  vars: { note: 'a private note' },
                },
              ],
            },
          },
        ],
      },
    });
    const frame = scrubbed.exception.values[0].stacktrace.frames[0];

    expect(frame.vars).toBeUndefined();
    // Home-dir collapse only — Sentry groups issues on `filename`, so the body
    // of the path must survive.
    expect(frame.filename).toBe('~/devel/ci/CI-Spellbook/src/App.jsx');
    expect(frame.abs_path).toBe('~/devel/ci/CI-Spellbook/src/App.jsx');
  });

  it('truncates an oversized exception value', () => {
    const scrubbed = scrubBrowserEvent({
      exception: { values: [{ value: 'x'.repeat(MAX_STRING_LENGTH + 500) }] },
    });

    expect(scrubbed.exception.values[0].value).toContain('… [truncated]');
  });
});

/**
 * Every value in this block is innocuous on its own — no `SECRET_PATTERNS` rule
 * matches any of them — so the KEY is the only signal there is. That is the
 * point: `scrubBreadcrumb` used to hand `scrubValue` each crumb *value* rather
 * than the crumb's `data` object, and `scrubValue` only consults the key while
 * walking an object's own entries. Top-level crumb keys were therefore never
 * checked at all.
 *
 * `authorization` is deliberately absent from these cases. A `Bearer …` value is
 * caught by `SECRET_PATTERNS` no matter how the walk is shaped, so an
 * Authorization spot check looked clean while every other key leaked — which is
 * exactly how this survived review.
 */
describe('scrubBrowserEvent — breadcrumb data is filtered by KEY, not only by value', () => {
  const crumbWith = (key, value) =>
    scrubBrowserEvent({ message: 'boom', breadcrumbs: [{ category: 'console', data: { [key]: value } }] })
      .breadcrumbs[0].data;

  it.each([
    ['token', 'a1b2c3d4e5'],
    ['password', 'correcthorsebattery'],
    ['secret', 'shhh'],
    ['cookie', 'sid=9f3a'],
    ['jwt', 'header.payload.sig'],
    ['x-api-key', 'k-42'],
    ['api_key', 'k-42'],
    ['SENTRY_DSN', 'https://k@o1.ingest.us.sentry.io/2'],
    ['pepper', 'nacl'],
    ['private_key', 'MIIEvQIBADAN'],
  ])('filters breadcrumb data.%s, whose value alone matches nothing', (key, value) => {
    // Guard against a vacuous pass: if the value were self-redacting the crumb
    // would be clean for the wrong reason.
    expect(scrubString(value)).toBe(value);
    expect(crumbWith(key, value)[key]).toBe('[Filtered]');
  });

  it('still filters a nested sensitive key under an innocuous crumb key', () => {
    expect(crumbWith('response', { token: 'a1b2c3d4e5' }).response.token).toBe('[Filtered]');
  });

  it('leaves an ordinary crumb key alone', () => {
    expect(crumbWith('status_code', 500).status_code).toBe(500);
  });
});

describe('scrubValue — the fleet key contract', () => {
  it.each([
    ['signature', 'd34db33f'],
    ['x-ci-hub-signature', 'd34db33f'],
  ])('filters the credential key %s', (key, value) => {
    expect(scrubString(value)).toBe(value);
    expect(scrubValue({ [key]: value })[key]).toBe('[Filtered]');
  });

  it.each([
    ['x-ci-hub-user', 'liam'],
    ['user', 'liam'],
    ['hub_user', 'liam'],
    ['owner', 'liam'],
    ['account_owner', 'liam'],
    ['username', 'liam'],
    ['email', 'liam@example.com'],
    ['x-forwarded-for', '192.168.0.5'],
    ['x-forwarded-user', 'liam'],
    ['remote-addr', '192.168.0.5'],
  ])('filters the identity key %s — a name is a word, so no value rule can catch it', (key, value) => {
    expect(scrubString(value)).toBe(value);
    expect(scrubValue({ [key]: value })[key]).toBe('[Filtered]');
  });

  it.each([
    ['user-agent', 'Mozilla/5.0'],
    ['user_id', 'u-7'],
    ['userId', 'u-7'],
    ['owner_id', 'o-3'],
  ])('keeps the diagnostic key %s — the identity rules are anchored on purpose', (key, value) => {
    expect(scrubValue({ [key]: value })[key]).toBe(value);
  });

  it('filters identity keys inside breadcrumb data too', () => {
    const scrubbed = scrubBrowserEvent({
      message: 'boom',
      breadcrumbs: [{ category: 'fetch', data: { url: '/a', username: 'liam', status_code: 401 } }],
    });

    expect(scrubbed.breadcrumbs[0].data.username).toBe('[Filtered]');
    expect(scrubbed.breadcrumbs[0].data.status_code).toBe(401);
  });

  it('filters the signature header the Hub forward-auth injects', () => {
    const scrubbed = scrubBrowserEvent({
      message: 'boom',
      request: {
        headers: {
          'X-CI-Hub-User': 'liam',
          'X-CI-Hub-Signature': 'd34db33f',
          'X-CI-Hub-Timestamp': '1754179200',
          'User-Agent': 'Mozilla/5.0',
        },
      },
    });

    expect(scrubbed.request.headers['X-CI-Hub-User']).toBe('[Filtered]');
    expect(scrubbed.request.headers['X-CI-Hub-Signature']).toBe('[Filtered]');
    expect(scrubbed.request.headers['User-Agent']).toBe('Mozilla/5.0');
  });
});

describe('initTelemetry — the runtime gate', () => {
  /**
   * The module reads its DSN at import time (deliberately: that is what makes
   * the SDK tree-shakeable), so each case needs a fresh module registry.
   */
  async function load({ dsn, consent, consentStatus = 200 }) {
    delete globalThis.__SENTRY__;
    vi.resetModules();
    vi.stubEnv('VITE_SENTRY_DSN', dsn ?? '');

    const fetchMock = vi.fn(async () =>
      consent === 'unreachable'
        ? Promise.reject(new Error('network down'))
        : new Response(JSON.stringify(consent), {
            status: consentStatus,
            headers: { 'content-type': 'application/json' },
          }),
    );

    vi.stubGlobal('fetch', fetchMock);

    const telemetry = await import('./telemetry.js');
    const Sentry = await import('@sentry/react');

    await telemetry.initTelemetry();

    return { telemetry, Sentry, fetchMock };
  }

  afterEach(async () => {
    delete globalThis.__SENTRY__;
    vi.resetModules();
  });

  it('does nothing and makes no request without a DSN', async () => {
    const { telemetry, Sentry, fetchMock } = await load({ dsn: '', consent: { enabled: true } });

    expect(telemetry.isTelemetryEnabled()).toBe(false);
    expect(telemetry.telemetryDisabledReason()).toBe('no-dsn');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(Sentry.getClient()).toBeUndefined();
  });

  it('initialises with a DSN and permission', async () => {
    const { telemetry, Sentry, fetchMock } = await load({
      dsn: FAKE_DSN,
      consent: { enabled: true },
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/config/telemetry', expect.anything());
    expect(telemetry.isTelemetryEnabled()).toBe(true);
    expect(telemetry.telemetryDisabledReason()).toBeNull();
    expect(Sentry.getClient()).toBeDefined();
  });

  it('configures the client with tracing, replay, metrics and a scrubber', async () => {
    const { Sentry } = await load({ dsn: FAKE_DSN, consent: { enabled: true } });
    const options = Sentry.getClient().getOptions();

    expect(options.sendDefaultPii).toBe(false);
    expect(options.tracesSampleRate).toBe(0.1);
    expect(options.beforeSend).toBeTypeOf('function');
    expect(options.beforeBreadcrumb).toBeTypeOf('function');
    expect(options.integrations.map((integration) => integration.name)).toContain('Replay');
    expect(options.integrations.map((integration) => integration.name)).not.toContain(
      'BrowserProfiling',
    );
  });

  it('does not initialise when the container opted out', async () => {
    const { telemetry, Sentry } = await load({
      dsn: FAKE_DSN,
      consent: { enabled: false, reason: 'opt-out' },
    });

    expect(telemetry.isTelemetryEnabled()).toBe(false);
    expect(telemetry.telemetryDisabledReason()).toBe('opt-out');
    expect(Sentry.getClient()).toBeUndefined();
  });

  it('does not initialise in local-only mode', async () => {
    const { telemetry, Sentry } = await load({
      dsn: FAKE_DSN,
      consent: { enabled: false, reason: 'local-only' },
    });

    expect(telemetry.isTelemetryEnabled()).toBe(false);
    expect(telemetry.telemetryDisabledReason()).toBe('local-only');
    expect(Sentry.getClient()).toBeUndefined();
  });

  it('fails closed when the consent endpoint is unreachable', async () => {
    const { telemetry, Sentry } = await load({ dsn: FAKE_DSN, consent: 'unreachable' });

    expect(telemetry.isTelemetryEnabled()).toBe(false);
    expect(telemetry.telemetryDisabledReason()).toBe('consent-unavailable');
    expect(Sentry.getClient()).toBeUndefined();
  });

  it('fails closed on a 404 — the static-host case, where no endpoint exists', async () => {
    const { telemetry, Sentry } = await load({
      dsn: FAKE_DSN,
      consent: { enabled: true },
      consentStatus: 404,
    });

    expect(telemetry.isTelemetryEnabled()).toBe(false);
    expect(Sentry.getClient()).toBeUndefined();
  });

  it('fails closed when the SPA fallback returns HTML instead of JSON', async () => {
    delete globalThis.__SENTRY__;
    vi.resetModules();
    vi.stubEnv('VITE_SENTRY_DSN', FAKE_DSN);
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('<!doctype html><html></html>', { status: 200 })),
    );

    const telemetry = await import('./telemetry.js');
    const Sentry = await import('@sentry/react');

    await telemetry.initTelemetry();

    expect(telemetry.isTelemetryEnabled()).toBe(false);
    expect(Sentry.getClient()).toBeUndefined();
  });

  it('is idempotent — a second call does not re-fetch or re-init', async () => {
    const { telemetry, fetchMock } = await load({ dsn: FAKE_DSN, consent: { enabled: true } });

    await telemetry.initTelemetry();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(telemetry.isTelemetryEnabled()).toBe(true);
  });

  it('tags every event with the marketplace app id', async () => {
    const { Sentry } = await load({ dsn: FAKE_DSN, consent: { enabled: true } });

    expect(Sentry.getIsolationScope().getScopeData().tags.component).toBe('ci-spellbook');
  });

  it('captureException is inert while reporting is off', async () => {
    const { telemetry, Sentry } = await load({
      dsn: FAKE_DSN,
      consent: { enabled: false, reason: 'opt-out' },
    });

    expect(() => telemetry.captureException(new Error('boom'), { markdownPath: '/a.md' })).not.toThrow();
    expect(Sentry.getClient()).toBeUndefined();
  });

  it('captureException reports, with context, once enabled', async () => {
    const { telemetry, Sentry } = await load({ dsn: FAKE_DSN, consent: { enabled: true } });
    const captured = [];

    vi.spyOn(Sentry.getClient(), 'captureException').mockImplementation((error, hint, scope) => {
      captured.push({ error, extra: scope?.getScopeData().extra });
      return 'event-id';
    });

    telemetry.captureException(new Error('markdown failed'), { markdownPath: '/markdown/a.md' });

    expect(captured).toHaveLength(1);
    expect(captured[0].error.message).toBe('markdown failed');
    expect(captured[0].extra.markdownPath).toBe('/markdown/a.md');
  });

  it('captureException never throws into the caller', async () => {
    const { telemetry } = await load({ dsn: '', consent: { enabled: true } });

    expect(() => telemetry.captureException(undefined)).not.toThrow();
    expect(() => telemetry.captureException(new Error('x'), undefined)).not.toThrow();
  });

  it('routes events through the scrubber before they leave the browser', async () => {
    const { Sentry } = await load({ dsn: FAKE_DSN, consent: { enabled: true } });
    // scrubBrowserEvent (our beforeSend) only reads `.message`,
    // `.exception.values[]` and `.extra`/`.request`, and ignores the hint
    // arg — but @sentry/core's declared beforeSend type wants a full
    // ErrorEvent in and returns a union that includes PromiseLike<ErrorEvent>.
    // This fixture is deliberately a minimal fake, not a real Sentry event,
    // so both sides of the call are cast rather than padded out with fields
    // scrubBrowserEvent never looks at.
    const fakeEvent = /** @type {import('@sentry/react').ErrorEvent} */ ({
      message: 'boom at /Users/liam/x',
      request: { url: 'https://x/y?q=secret' },
    });
    const scrubbed = /** @type {{ message: string, request: { url: string } }} */ (
      Sentry.getClient().getOptions().beforeSend(fakeEvent, {})
    );

    expect(scrubbed.message).toBe('boom at ~/x');
    expect(scrubbed.request.url).toBe('https://x/y');
  });
});

describe('module shape — the tree-shaking contract', () => {
  let source;

  beforeEach(async () => {
    const [fs, path] = await Promise.all([import('node:fs/promises'), import('node:path')]);

    source = await fs.readFile(path.resolve(__dirname, 'telemetry.js'), 'utf8');
  });

  it('reads the DSN at module scope with no optional chaining', () => {
    // `import.meta.env.X?.trim()` does not constant-fold under rolldown, which
    // silently keeps the whole SDK in a DSN-less bundle. Guarded here as well
    // as by scripts/assert-bundle-without-dsn.mjs, because this line is the
    // thing a refactor would innocently "tidy up".
    expect(source).toContain('const DSN = import.meta.env.VITE_SENTRY_DSN;');
    expect(source).not.toContain('import.meta.env.VITE_SENTRY_DSN?.');
  });

  it('short-circuits on a falsy DSN before touching the SDK', () => {
    expect(source).toContain('if (!DSN) {');
  });
});
