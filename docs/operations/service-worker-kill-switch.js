// spellbook:service-worker-kill-switch
//
// Spellbook's service worker kill switch.
//
// To retire the worker from every browser that installed it:
//
//   1. copy this file over public/sw.js;
//   2. delete the registerServiceWorker() call, and its import, from src/main.jsx;
//   3. deploy, and leave it in place for a few weeks.
//
// Nothing else has to change. The first line above is how scripts/assert-site.mjs (so
// `npm run build`, the Pages build and the image build), the unit tests and tests/pwa.spec.js
// recognise this file: with it as public/sw.js they stop requiring what it has none of on
// purpose (an offline page, a precache list, a cache fingerprint, a registration in the
// bundle). They still check the manifest, the head tags and the `Cache-Control: no-cache`
// rule for /sw.js, which this file needs as much as the worker did.
//
// Reverting the commit that added the worker is NOT enough. With /sw.js gone, a browser's
// update check gets a 404, the update fails, and the old worker stays installed and keeps
// answering page loads. A worker only goes away when the browser finds a new /sw.js that
// removes it, and browsers look for one when a page loads, so the file has to stay up
// until every returning visitor has been seen.
//
// This worker has no fetch handler, so while it is installed every request goes straight
// to the network. On activation it deletes the offline cache and unregisters itself.
// src/lib/serviceWorker.test.js runs this file, so it cannot rot unnoticed.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('ci-spellbook-offline-')).map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
  );
});
