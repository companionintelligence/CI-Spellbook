import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import { isKillSwitch, precacheFingerprint } from '../../scripts/assert-site.mjs';
import { SERVICE_WORKER_URL, registerServiceWorker } from './serviceWorker.js';

const ORIGIN = 'https://magic.ci.computer';
const SW_SOURCE = readFileSync(resolve(process.cwd(), 'public/sw.js'), 'utf8');
const KILL_SWITCH_SOURCE = readFileSync(resolve(process.cwd(), 'docs/operations/service-worker-kill-switch.js'), 'utf8');
/** The cache name public/sw.js declares. */
const CACHE_NAME = /const CACHE = '([^']+)'/.exec(SW_SOURCE)?.[1] ?? '';
/**
 * With the kill switch as public/sw.js the worker has been retired on purpose (README: Rolling
 * back), and the tests of the worker's own behaviour have nothing to run against.
 */
const RETIRED = isKillSwitch(SW_SOURCE);

// ---- registration (src/lib/serviceWorker.js) ----------------------------------

/** @param {{ readyState?: string, serviceWorker?: any, capacitor?: any }} [options] */
function fakeWindow({ readyState = 'complete', serviceWorker = { register: vi.fn(() => Promise.resolve()) }, capacitor } = {}) {
  const navigator = serviceWorker ? { serviceWorker } : {};
  return /** @type {any} */ ({
    navigator,
    document: { readyState },
    Capacitor: capacitor,
    addEventListener: vi.fn((type, handler) => {
      if (type === 'load') handler();
    })
  });
}

describe('registerServiceWorker', () => {
  it('registers /sw.js with the whole origin as its scope', () => {
    const win = fakeWindow();
    expect(registerServiceWorker({ production: true, win })).toBe(true);
    expect(win.navigator.serviceWorker.register).toHaveBeenCalledWith(SERVICE_WORKER_URL, { scope: '/' });
    expect(SERVICE_WORKER_URL).toBe('/sw.js');
  });

  it('waits for the page to load, so the worker never competes with the first render', () => {
    const win = fakeWindow({ readyState: 'loading' });
    win.addEventListener.mockImplementation(() => {}); // the load event has not fired yet
    registerServiceWorker({ production: true, win });
    expect(win.navigator.serviceWorker.register).not.toHaveBeenCalled();

    const [type, handler, options] = win.addEventListener.mock.calls[0];
    expect(type).toBe('load');
    expect(options).toEqual({ once: true });
    handler();
    expect(win.navigator.serviceWorker.register).toHaveBeenCalledTimes(1);
  });

  it('does nothing outside a production build (the default under the test runner)', () => {
    const win = fakeWindow();
    expect(registerServiceWorker({ win })).toBe(false);
    expect(registerServiceWorker({ production: false, win })).toBe(false);
    expect(win.navigator.serviceWorker.register).not.toHaveBeenCalled();
  });

  it('does nothing where the browser has no service workers (plain http, old WebViews)', () => {
    const win = fakeWindow({ serviceWorker: null });
    expect(registerServiceWorker({ production: true, win })).toBe(false);
  });

  it('does nothing inside the Capacitor iOS and Android shells, which load this bundle from the app', () => {
    const win = fakeWindow({ capacitor: { isNativePlatform: () => true } });
    expect(registerServiceWorker({ production: true, win })).toBe(false);
    expect(win.navigator.serviceWorker.register).not.toHaveBeenCalled();
  });

  it('still registers in a browser that happens to define window.Capacitor', () => {
    const win = fakeWindow({ capacitor: { isNativePlatform: () => false } });
    expect(registerServiceWorker({ production: true, win })).toBe(true);
  });

  it('logs a failed registration and does not throw, because the site works without the worker', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const win = fakeWindow({ serviceWorker: { register: vi.fn(() => Promise.reject(new Error('blocked'))) } });
    registerServiceWorker({ production: true, win });
    await Promise.resolve();
    await Promise.resolve();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  // This runs before the first render, so a throw here would blank the site for the sake
  // of an optional feature.
  it('never throws when the browser refuses to hand over navigator.serviceWorker (a SecurityError)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const navigator = {};
    Object.defineProperty(navigator, 'serviceWorker', {
      enumerable: true,
      get() {
        throw new DOMException('The operation is insecure.', 'SecurityError');
      }
    });
    const win = fakeWindow();
    win.navigator = navigator;

    expect(() => registerServiceWorker({ production: true, win })).not.toThrow();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('never throws when register() throws instead of rejecting', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const win = fakeWindow({
      serviceWorker: {
        register: vi.fn(() => {
          throw new DOMException('The operation is insecure.', 'SecurityError');
        })
      }
    });

    expect(() => registerServiceWorker({ production: true, win })).not.toThrow();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('never throws when asking Capacitor whether this is a native shell throws, and then does not register', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const win = fakeWindow({
      capacitor: {
        isNativePlatform: () => {
          throw new Error('bridge not ready');
        }
      }
    });

    expect(registerServiceWorker({ production: true, win })).toBe(false);
    expect(win.navigator.serviceWorker.register).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(1);
  });
});

// ---- the worker (public/sw.js), run against fakes -----------------------------

/** A fetch Request as the worker sees it: relative URLs resolve against the worker's origin. */
class FakeRequest {
  /**
   * @param {string} input
   * @param {{ cache?: string }} [init]
   */
  constructor(input, init = {}) {
    this.url = new URL(input, ORIGIN).href;
    this.method = 'GET';
    this.mode = 'cors';
    this.cache = init.cache ?? 'default';
  }
}

/** The path a cache entry is keyed by: the tests only ever store one entry per path. */
const keyOf = (input) => new URL(typeof input === 'string' ? input : input.url, ORIGIN).pathname;

/**
 * Loads public/sw.js with a Cache Storage and a fetch that are fakes, and returns the
 * listeners it registered. `writes` records every write to any cache, so a test can
 * assert what the worker stored and when.
 */
function loadWorker({ network = {}, offline = false } = {}) {
  const handlers = {};
  const stores = new Map();
  const writes = [];

  const fetchFake = vi.fn(async (request) => {
    if (offline) throw new TypeError('Failed to fetch');
    const path = keyOf(request);
    const body = network[path];
    if (body === undefined) return new Response('not found', { status: 404 });
    return typeof body === 'number' ? new Response('server said no', { status: body }) : new Response(body, { status: 200 });
  });

  const storeFor = (name) => {
    if (!stores.has(name)) stores.set(name, new Map());
    return stores.get(name);
  };

  const caches = {
    open: async (name) => {
      const store = storeFor(name);
      return {
        addAll: async (requests) => {
          for (const request of requests) {
            const response = await fetchFake(request);
            if (!response.ok) throw new TypeError(`addAll: ${request.url} answered ${response.status}`);
            writes.push({ cache: name, path: keyOf(request), via: 'addAll', mode: request.cache });
            store.set(keyOf(request), response);
          }
        },
        put: async (request, response) => {
          writes.push({ cache: name, path: keyOf(request), via: 'put' });
          store.set(keyOf(request), response);
        },
        add: async (request) => {
          writes.push({ cache: name, path: keyOf(request), via: 'add' });
        }
      };
    },
    match: async (input) => {
      for (const store of stores.values()) {
        const hit = store.get(keyOf(input));
        if (hit) return hit.clone();
      }
      return undefined;
    },
    keys: async () => [...stores.keys()],
    delete: async (name) => stores.delete(name)
  };

  const self = {
    location: new URL(`${ORIGIN}/sw.js`),
    addEventListener: (type, handler) => {
      handlers[type] = handler;
    },
    skipWaiting: vi.fn(),
    clients: { claim: vi.fn(() => Promise.resolve()) }
  };

  new Function('self', 'caches', 'fetch', 'Request', SW_SOURCE)(self, caches, fetchFake, FakeRequest);

  /** Dispatch a lifecycle event and wait for everything it handed to waitUntil. */
  const lifecycle = async (type) => {
    const pending = [];
    handlers[type]({ waitUntil: (promise) => pending.push(promise) });
    await Promise.all(pending);
  };

  /** Dispatch a fetch; resolves to the response the worker supplied, or null if it left the request alone. */
  const dispatch = async (path, { method = 'GET', mode = 'cors', origin = ORIGIN } = {}) => {
    const request = { url: new URL(path, origin).href, method, mode };
    let supplied = null;
    handlers.fetch({ request, respondWith: (promise) => (supplied = promise) });
    return supplied ? await supplied : null;
  };

  return { self, stores, writes, fetch: fetchFake, lifecycle, dispatch, storeFor };
}

const SITE = {
  '/offline/': '<h1>Spellbook is offline</h1>',
  '/offline/offline.css': 'body{}',
  '/offline/mark.svg': '<svg id="offline-mark"/>',
  // The app's own header brand mark: a different file from the offline page's copy.
  '/logo/mark.svg': '<svg id="header-mark"/>',
  '/': '<div id="root"></div>',
  '/markdown/ai-agents.md': '# agents'
};

const PRECACHED = ['/offline/', '/offline/offline.css', '/offline/mark.svg'];

describe.skipIf(RETIRED)('public/sw.js: lifecycle', () => {
  it('precaches the offline page, its stylesheet and the mark, straight from the network, and takes over at once', async () => {
    const worker = loadWorker({ network: SITE });
    await worker.lifecycle('install');

    expect(worker.writes.map((w) => w.path)).toEqual(PRECACHED);
    expect(worker.writes.every((w) => w.mode === 'reload')).toBe(true);
    expect(worker.self.skipWaiting).toHaveBeenCalledTimes(1);
  });

  it('fails the install, rather than half-installing, when a precached file cannot be fetched', async () => {
    const worker = loadWorker({ network: { ...SITE, '/offline/offline.css': undefined } });
    await expect(worker.lifecycle('install')).rejects.toThrow(/offline\.css/);
  });

  it('on activation deletes its own older caches, leaves every other cache alone, and claims open pages', async () => {
    const worker = loadWorker({ network: SITE });
    await worker.lifecycle('install');
    worker.storeFor('ci-spellbook-offline-111111111111');
    worker.storeFor('some-other-apps-cache');

    await worker.lifecycle('activate');

    expect([...worker.stores.keys()].sort()).toEqual([CACHE_NAME, 'some-other-apps-cache'].sort());
    expect(worker.self.clients.claim).toHaveBeenCalledTimes(1);
  });
});

describe.skipIf(RETIRED)('public/sw.js: page loads', () => {
  it('is network first: an online page load is the network answer, and is not stored', async () => {
    const worker = loadWorker({ network: SITE });
    await worker.lifecycle('install');
    const before = worker.writes.length;

    const response = await worker.dispatch('/', { mode: 'navigate' });

    expect(await response.text()).toBe(SITE['/']);
    expect(worker.writes).toHaveLength(before);
  });

  it('shows a server error as the server sent it, not as the offline page', async () => {
    const worker = loadWorker({ network: { ...SITE, '/broken': 503 } });
    await worker.lifecycle('install');

    const response = await worker.dispatch('/broken', { mode: 'navigate' });
    expect(response.status).toBe(503);
  });

  it('answers a page load with no network with the offline page', async () => {
    const worker = loadWorker({ network: SITE });
    await worker.lifecycle('install');
    worker.fetch.mockRejectedValue(new TypeError('Failed to fetch'));

    for (const path of ['/', '/?utm_source=x', '/somewhere/deep']) {
      const response = await worker.dispatch(path, { mode: 'navigate' });
      expect(response.status).toBe(200);
      expect(await response.text()).toBe(SITE['/offline/']);
    }
  });

  it('falls back to the browser error page, not an exception, if the offline page was evicted', async () => {
    const worker = loadWorker({ offline: true });
    const response = await worker.dispatch('/', { mode: 'navigate' });
    expect(response.type).toBe('error');
  });

  it('never hands a navigation a redirected response, which the browser refuses', async () => {
    const worker = loadWorker({ offline: true });
    worker.storeFor(CACHE_NAME).set('/offline/', {
      redirected: true,
      body: 'offline page',
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'text/html' }),
      clone() {
        return this;
      }
    });

    const response = await worker.dispatch('/', { mode: 'navigate' });
    expect(response.redirected).toBe(false);
    expect(await response.text()).toBe('offline page');
  });
});

describe.skipIf(RETIRED)('public/sw.js: everything else is left to the browser', () => {
  it('serves the files the offline page needs from the cache, and from the network if they are not there', async () => {
    const worker = loadWorker({ network: SITE });
    await worker.lifecycle('install');
    worker.fetch.mockClear();

    for (const path of ['/offline/offline.css', '/offline/mark.svg']) {
      const response = await worker.dispatch(path);
      expect(await response.text()).toBe(SITE[path]);
    }
    expect(worker.fetch).not.toHaveBeenCalled();

    worker.stores.clear();
    const response = await worker.dispatch('/offline/offline.css');
    expect(await response.text()).toBe(SITE['/offline/offline.css']);
    expect(worker.fetch).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['the app bundle', '/assets/main-4Fvp3YeE.js'],
    ['the catalog markdown', '/markdown/ai-agents.md'],
    ['the telemetry consent answer', '/api/config/telemetry'],
    ['the web manifest', '/site.webmanifest'],
    // The header brand mark (src/App.jsx) and the page icon: the worker once cached the first
    // of these, and an answer from the cache is never revalidated.
    ['the header brand mark, which the app itself requests', '/logo/mark.svg'],
    ['the app icons', '/logo/mark-192.png'],
    ['a shelf image', '/assets/background1-I_lLgND_.webp'],
    ['an API-looking path', '/api/anything?token=secret']
  ])('does not intercept %s', async (_label, path) => {
    const worker = loadWorker({ network: SITE });
    await worker.lifecycle('install');

    expect(await worker.dispatch(path)).toBeNull();
  });

  it('does not intercept other origins, or anything that is not a GET', async () => {
    const worker = loadWorker({ network: SITE });
    await worker.lifecycle('install');

    expect(await worker.dispatch('/offline/', { origin: 'https://example.com' })).toBeNull();
    expect(await worker.dispatch('/offline/', { origin: 'https://example.com', mode: 'navigate' })).toBeNull();
    expect(await worker.dispatch('/', { method: 'POST', mode: 'navigate' })).toBeNull();
    expect(await worker.dispatch('/offline/offline.css', { method: 'POST' })).toBeNull();
  });

  it('writes to a cache only while installing, whatever the page loads afterwards', async () => {
    const worker = loadWorker({ network: SITE });
    await worker.lifecycle('install');
    await worker.lifecycle('activate');
    const afterInstall = worker.writes.length;

    for (const path of ['/', '/?token=abc123', '/assets/main-4Fvp3YeE.js', '/markdown/ai-agents.md', '/api/anything']) {
      await worker.dispatch(path, { mode: path === '/' || path.startsWith('/?') ? 'navigate' : 'cors' });
    }
    await worker.dispatch('/offline/offline.css');

    expect(worker.writes).toHaveLength(afterInstall);
    expect(worker.writes.every((w) => w.via === 'addAll')).toBe(true);
  });
});

describe.skipIf(RETIRED)('public/sw.js: what it may hold, and when a browser fetches it again', () => {
  it('holds only files under /offline/, a path nothing in the app requests', async () => {
    const worker = loadWorker({ network: SITE });
    await worker.lifecycle('install');

    for (const { path } of worker.writes) {
      expect(path.startsWith('/offline/'), `${path} is outside /offline/`).toBe(true);
    }
  });

  // A browser fetches the precached files again only when public/sw.js changes, so the cache
  // name has to change with them. scripts/assert-site.mjs fails the build on the same thing
  // (it is what stops a Pages deploy); this checks the name the loaded worker really installs under.
  it('names its cache after a fingerprint of the files it precaches', async () => {
    const worker = loadWorker({ network: SITE });
    await worker.lifecycle('install');

    const fingerprint = precacheFingerprint(
      resolve(process.cwd(), 'public'),
      worker.writes.map((write) => write.path)
    );
    const expected = `ci-spellbook-offline-${fingerprint}`;

    expect(worker.writes[0].cache, `a precached file changed: set CACHE in public/sw.js to '${expected}'`).toBe(expected);
  });
});

// The container image is the one path no test here can run (no nginx binary in CI, and the
// image build is a separate workflow), so the two rules the install depends on are at least
// pinned in the config text.
describe('nginx/default.conf', () => {
  const NGINX = readFileSync(resolve(process.cwd(), 'nginx/default.conf'), 'utf8');
  /** The body of an exact-match `location = <path> { ... }`. */
  const exactLocation = (/** @type {string} */ path) =>
    new RegExp(`location = ${path.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')} \\{([^}]*)\\}`).exec(NGINX)?.[1] ?? '';

  it('revalidates the service worker script, as public/_headers does on Pages', () => {
    expect(exactLocation('/sw.js')).toMatch(/add_header Cache-Control "no-cache";/);
  });

  it('serves the manifest as application/manifest+json, which the stock mime.types has no entry for', () => {
    expect(exactLocation('/site.webmanifest')).toMatch(/default_type application\/manifest\+json;/);
  });
});

describe('docs/operations/service-worker-kill-switch.js', () => {
  /** @param {string[]} cacheNames */
  function loadKillSwitch(cacheNames) {
    /** @type {Record<string, (event?: any) => void>} */
    const handlers = {};
    /** @type {string[]} */
    const deleted = [];
    const self = {
      addEventListener: (/** @type {string} */ type, /** @type {(event?: any) => void} */ handler) => {
        handlers[type] = handler;
      },
      skipWaiting: vi.fn(),
      registration: { unregister: vi.fn(() => Promise.resolve(true)) }
    };
    const caches = {
      keys: async () => cacheNames,
      delete: async (/** @type {string} */ name) => {
        deleted.push(name);
        return true;
      }
    };
    new Function('self', 'caches', KILL_SWITCH_SOURCE)(self, caches);
    return { handlers, deleted, self };
  }

  it('takes over at once, deletes the offline caches and only those, then unregisters itself', async () => {
    // Fixed names, not the real worker's: when the kill switch IS public/sw.js there is no CACHE to read.
    const caches = ['ci-spellbook-offline-aaaaaaaaaaaa', 'ci-spellbook-offline-111111111111'];
    const { handlers, deleted, self } = loadKillSwitch([...caches, 'some-other-apps-cache']);

    handlers.install();
    expect(self.skipWaiting).toHaveBeenCalledTimes(1);

    /** @type {Promise<unknown>[]} */
    const pending = [];
    handlers.activate({ waitUntil: (/** @type {Promise<unknown>} */ promise) => pending.push(promise) });
    await Promise.all(pending);

    expect(deleted.sort()).toEqual([...caches].sort());
    expect(self.registration.unregister).toHaveBeenCalledTimes(1);
  });

  it('has no fetch handler, so pages load straight from the network while it is installed', () => {
    const { handlers } = loadKillSwitch([]);
    expect(Object.keys(handlers).sort()).toEqual(['activate', 'install']);
  });

  // scripts/assert-site.mjs, these tests and tests/pwa.spec.js stop requiring the real worker's
  // offline page, precache list and registration when public/sw.js starts with this line.
  it('starts with the line that tells the build and the tests it is the kill switch', () => {
    expect(isKillSwitch(KILL_SWITCH_SOURCE)).toBe(true);
    expect(KILL_SWITCH_SOURCE.split('\n')[0]).toBe('// spellbook:service-worker-kill-switch');
  });
});
