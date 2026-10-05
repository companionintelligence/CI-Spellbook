// ga4.mjs: Google Analytics 4 for the hosted site, and only for the hosted site.
//
// The measurement ID is a BUILD-TIME value, GA_MEASUREMENT_ID, read from the
// environment of the build and never committed. Nothing at all happens unless it
// looks like a real ID (G-XXXXXXXX): with it unset or malformed, index.html,
// 404.html and dist/_headers come out exactly as they are in the repository, with
// no Google host in the CSP and no analytics code in the page.
//
// Why a plugin and not a snippet in index.html:
//
//   - This bundle is built three ways: the Cloudflare Pages build (magic.ci.computer),
//     `npm run build`, and the Docker image build, whose container runs locally on a
//     person's own Companion Hub and promises not to phone home. Only the first sets
//     GA_MEASUREMENT_ID (a Pages build variable). The Dockerfile forwards nothing
//     but the VITE_* crash-reporting arguments, so the image stays analytics-free and
//     nginx/default.conf, which sets no CSP, never has to allow a Google host.
//   - Only the process environment is read, not .env files: `COPY . .` in the
//     Dockerfile would carry one into the image build.
//   - The page ships no inline script (public/_headers has no 'unsafe-inline'), so
//     the gtag init is an emitted same-origin file, /ga-init.js, not a <script> body.
//   - The CSP has to grow with the page. The policy in public/_headers is written
//     for a page with no analytics, so a snippet added without the matching
//     allowance would be silently blocked and the ID would measure nothing. The
//     plugin does both from one ID, so they cannot disagree, and
//     scripts/assert-site.mjs fails the build when they do.
//
// Idempotent: the tags are added to the HTML Vite has just produced and the CSP
// is extended on the freshly copied dist/_headers, and each is skipped if the
// Google host is already there, so building twice cannot double anything.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const GA_ENV = 'GA_MEASUREMENT_ID';

/** Emitted next to index.html; the one place the ID appears besides the loader URL. */
export const GA_INIT_FILE = 'ga-init.js';

export const GA_LOADER = 'https://www.googletagmanager.com/gtag/js';

/** Google's documented CSP hosts for gtag.js with a GA4 property. */
export const GA_SCRIPT_HOSTS = ['https://www.googletagmanager.com'];
export const GA_BEACON_HOSTS = ['https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com'];

/** Directive name -> the hosts GA needs in it. img-src is the beacon's image fallback. */
export const GA_CSP = {
  'script-src': GA_SCRIPT_HOSTS,
  'connect-src': GA_BEACON_HOSTS,
  'img-src': GA_BEACON_HOSTS
};

export const isGaId = (id) => typeof id === 'string' && /^G-[A-Z0-9]+$/.test(id);

/** The gtag bootstrap, as the body of an external script (no inline script on this site). */
export function gaInitSource(id) {
  return (
    'window.dataLayer=window.dataLayer||[];\n' +
    'function gtag(){dataLayer.push(arguments);}\n' +
    "gtag('js',new Date());\n" +
    `gtag('config','${id}');\n`
  );
}

/**
 * A Content-Security-Policy value with GA's hosts added to the directives it needs.
 * Existing values keep their order and nothing is added twice. A directive the policy
 * does not have is left out of it: the caller's `default-src` governs that case.
 */
export function extendCsp(csp) {
  return csp
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((directive) => {
      const [name, ...values] = directive.split(/\s+/);
      const wanted = GA_CSP[name];
      if (!wanted) return directive;
      return [name, ...values, ...wanted.filter((host) => !values.includes(host))].join(' ');
    })
    .join('; ');
}

/** A Cloudflare Pages `_headers` file with its CSP line extended; every other line is untouched. */
export function extendHeaders(headers) {
  return headers.replace(/^(\s*Content-Security-Policy:\s*)(.+)$/im, (_, label, csp) => label + extendCsp(csp.trim()));
}

/**
 * The Vite plugin.
 *
 * @param {string | undefined} rawId  defaults to process.env.GA_MEASUREMENT_ID
 */
export function ga4(rawId = process.env[GA_ENV]) {
  const given = (rawId ?? '').trim();
  const id = isGaId(given) ? given : null;

  return {
    name: 'ci-spellbook-ga4',
    apply: 'build',

    buildStart() {
      // Set but wrong is almost certainly a typo in a dashboard; say so rather than
      // quietly shipping a site that was meant to be measured and is not.
      if (given && !id) this.warn(`${GA_ENV} is set but is not a GA4 measurement ID (G-XXXXXXXX): analytics left off.`);
    },

    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (!id || html.includes('googletagmanager.com/gtag/js')) return;
        // data-cfasync: Cloudflare's Rocket Loader would otherwise hold both tags back
        // until after first paint.
        return [
          { tag: 'script', attrs: { async: true, 'data-cfasync': 'false', src: `${GA_LOADER}?id=${id}` }, injectTo: 'head' },
          { tag: 'script', attrs: { 'data-cfasync': 'false', src: `/${GA_INIT_FILE}` }, injectTo: 'head' }
        ];
      }
    },

    generateBundle() {
      if (id) this.emitFile({ type: 'asset', fileName: GA_INIT_FILE, source: gaInitSource(id) });
    },

    // Vite has copied public/ into the output directory before this runs.
    writeBundle(options) {
      if (!id || !options.dir) return;
      const file = join(options.dir, '_headers');
      if (!existsSync(file)) {
        this.error('dist/_headers is missing, so the CSP cannot be extended for Google Analytics (it belongs in public/).');
      }
      const before = readFileSync(file, 'utf8');
      const after = extendHeaders(before);
      if (after !== before) writeFileSync(file, after);
    }
  };
}
