// Spellbook's service worker kill switch.
//
// To retire the worker from every browser that installed it, ship this file as /sw.js:
// copy it over public/sw.js in the same deploy that removes registerServiceWorker() from
// src/main.jsx, and leave it in place for a few weeks.
//
// Reverting the commit that added the worker is NOT enough. With /sw.js gone, a browser's
// update check gets a 404, the update fails, and the old worker stays installed and keeps
// answering page loads (measured in Chrome 156). A worker only goes away when the browser
// finds a new /sw.js that removes it, and browsers check on page loads, at most about
// once a day, so the file has to stay up until every returning visitor has been seen.
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
