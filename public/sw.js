// Spellbook's service worker.
//
// It does two things and nothing else:
//
//   1. It gives the browser the fetch handler some of them still look for before
//      they offer to install the app (public/site.webmanifest has the rest).
//   2. When a page load cannot reach the network at all (offline, or the host
//      is down), it answers with /offline/ instead of the browser's error page.
//
// What it deliberately does NOT do, because each of these has stranded visitors on
// a stale build somewhere else:
//
//   - It never caches the app. HTML, scripts, styles, shelf art and the catalog
//     markdown all go to the network exactly as they would without a worker, so a
//     deploy is live on the next load and the HTTP cache rules in public/_headers
//     stay the only cache policy.
//   - It never answers for a path the app itself requests. Everything it serves from
//     the cache lives under /offline/ (the offline page, its stylesheet and its own
//     copy of the mark), which nothing in the app links to. An answer from here is
//     never revalidated, so a shared path such as the header brand mark
//     (/logo/mark.svg, which this list once held) would have kept showing an old file
//     after a rebrand. assert-site.mjs and the unit tests fail if PRECACHE leaves /offline/.
//   - It never writes to the cache after install. The only cache entries are the
//     three files below, fetched once, so no URL a visitor opens (a deep link, a
//     query string) is ever stored.
//   - It never touches a request it does not name: other origins, non-GET
//     requests and every same-origin path that is not one of the files below are
//     left to the browser. There is no list of API paths to forget to extend.
//
// Updating it: a browser fetches the precached files again only when this file
// changes, so CACHE carries a fingerprint of those files (first 12 hex of the sha256
// of each URL and its bytes, in PRECACHE order). `npm run test:unit` fails, and prints
// the name to use, when one of them changes without CACHE following it.
//
// Retiring it: reverting the commit that added it does not do it. Once /sw.js is gone a
// browser's update check gets a 404, fails, and keeps the old worker. Ship
// docs/operations/service-worker-kill-switch.js as /sw.js instead, and delete the
// registration in src/lib/serviceWorker.js. Until then an old copy of this file is
// harmless: it serves a static page and nothing else.
//
// Served from the site root so its scope is the whole origin.

const CACHE = 'ci-spellbook-offline-4909cbee3b4f';
const OFFLINE_URL = '/offline/';
const PRECACHE = [OFFLINE_URL, '/offline/offline.css', '/offline/mark.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // `reload`: take the files from the network, not from the HTTP cache.
      .then((cache) => cache.addAll(PRECACHE.map((url) => new Request(url, { cache: 'reload' }))))
  );
  // Nothing about the app is cached, so there is no build for the new worker to
  // disagree with: it can take over at once.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key.startsWith('ci-spellbook-offline-') && key !== CACHE).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// A navigation answered with a redirected response fails ("a redirected response was
// used for a request whose redirect mode is not 'follow'"). /offline/ is the canonical
// URL on every host this ships to, but a host that redirects it would otherwise break
// the one page this worker exists to serve.
const unredirected = (response) =>
  response.redirected
    ? new Response(response.body, { status: response.status, statusText: response.statusText, headers: response.headers })
    : response;

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    // Network first, and the network's answer is final: a 404 or a 500 from a server
    // that did answer is shown as it is. Only a failed request gets the offline page.
    event.respondWith(
      fetch(request).catch(async () => {
        const offline = await caches.match(OFFLINE_URL);
        return offline ? unredirected(offline) : Response.error();
      })
    );
    return;
  }

  // The offline page's own stylesheet and mark, which must load with no network.
  if (PRECACHE.includes(url.pathname)) {
    event.respondWith(caches.match(request).then((hit) => hit ?? fetch(request)));
  }
});
