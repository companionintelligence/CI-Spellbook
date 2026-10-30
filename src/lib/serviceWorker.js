// Registers public/sw.js, the service worker that makes Spellbook installable and gives
// a page load with no network the /offline/ page. What the worker does and does not do
// is written at the top of that file.
//
// It is registered from here, in the bundle, rather than from a script in index.html,
// because the page CSP (public/_headers) allows no inline script.

/** Where the worker is served from: the site root, so its scope is the whole origin. */
export const SERVICE_WORKER_URL = '/sw.js';

/**
 * Register the service worker once the page has loaded, so it never competes with the
 * app's first render. Returns whether a registration was started.
 *
 * It does nothing:
 *   - outside a production build: the dev server would otherwise be served from a
 *     worker's idea of the page;
 *   - without `navigator.serviceWorker`, which browsers expose only on https or
 *     localhost, so a plain-http LAN address quietly stays an ordinary web page;
 *   - inside the iOS and Android shells (apps/ios, apps/android). They load this same
 *     bundle from the app itself, which already works offline, and a worker there
 *     would sit between the WebView and its bundled files for no gain.
 *
 * It never throws. The site is an ordinary web page without the worker, and this runs
 * before the first render, so an exception here would blank the site for something
 * optional. Browsers do throw in places: reading `navigator.serviceWorker` raises a
 * SecurityError in a sandboxed frame, and some browsers do the same with site data blocked.
 *
 * @param {{ production?: boolean, win?: Window & typeof globalThis }} [options] injected by tests
 */
export function registerServiceWorker({ production = import.meta.env.PROD, win = window } = {}) {
  if (!production) return false;

  // Not worth interrupting the reader or the crash-report budget for.
  const skip = (/** @type {unknown} */ err) => console.warn('Spellbook: could not register the service worker', err);

  try {
    if (!('serviceWorker' in win.navigator)) return false;
    if (/** @type {any} */ (win).Capacitor?.isNativePlatform?.()) return false;

    const register = () => {
      try {
        win.navigator.serviceWorker.register(SERVICE_WORKER_URL, { scope: '/' }).catch(skip);
      } catch (err) {
        skip(err);
      }
    };

    if (win.document.readyState === 'complete') register();
    else win.addEventListener('load', register, { once: true });
    return true;
  } catch (err) {
    skip(err);
    return false;
  }
}
