// assert-site.mjs: the site's public surface, checked against src/lib/site.js.
//
// src/lib/site.js is where the outbound links and the public copy are written
// down once. The React app renders them; index.html, 404.html and the files under
// public/ carry static copies, for crawlers, link previews and readers without
// JavaScript. Static copies drift, and the failure is silent (a page that still
// looks fine to a person while a crawler reads last quarter's description), so
// this fails the build when they disagree, and when the four cross-links to
// ci.computer and the docs are missing from what is served.
//
// Two layers, so each runs where it is cheapest:
//
//   checkSource(root)  index.html, 404.html, public/*. No build needed; the unit
//                      suite runs it (src/lib/site.test.js).
//   checkDist(dist)    the built output: those same links are in the shipped
//                      bundle and the 404 page, every file the head points at
//                      exists, and the CSP's promises hold of the built HTML. The
//                      Vite build runs it (vite.config.js), so `npm run build`, the
//                      Docker image build and the Pages build all fail together.
//
//   node scripts/assert-site.mjs            # check the source, then ./dist if built
//
// The build output is also where Google Analytics is checked (checkAnalytics): off
// unless the build was given a GA4 measurement ID, and when it was, tags, init file
// and CSP all present, once. The ID itself is never allowed into the source files.
//
// Dependency-free on purpose (no jsdom): it runs inside the Deno-based image build.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  BUY_LABEL,
  BUY_URL,
  DOCS_URL,
  DOWNLOAD_LABEL,
  DOWNLOAD_URL,
  HEADLINE,
  HOME_URL,
  HUB_STORE_URL,
  LEDE,
  PRODUCT_NAME,
  SITE_URL
} from '../src/lib/site.js';
import { GA_CSP, GA_ENV, GA_INIT_FILE, GA_LOADER, isGaId } from './ga4.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** The four links every Companion site carries, as [href, visible label]. */
export const CROSS_LINKS = [
  [HOME_URL, 'Companion Intelligence'],
  [DOCS_URL, 'Docs'],
  [DOWNLOAD_URL, DOWNLOAD_LABEL],
  [BUY_URL, BUY_LABEL]
];

const OG_IMAGE = `${SITE_URL}og-image.png`;
const OG_MAX_BYTES = 300 * 1024;

// ---- tiny HTML helpers --------------------------------------------------------

const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const text = (html) => decode(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

const tagsOf = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((m) => m[0]);

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'));
  return m ? decode(m[1] ?? m[2]) : null;
};

const metaContent = (html, key, value) => {
  const tag = tagsOf(html, 'meta').find((t) => attr(t, key) === value);
  return tag ? attr(tag, 'content') : null;
};

const linkHref = (html, rel) => {
  const tag = tagsOf(html, 'link').find((t) => attr(t, 'rel') === rel);
  return tag ? attr(tag, 'href') : null;
};

const read = (path) => readFileSync(path, 'utf8');

/** Width and height from a PNG's IHDR chunk. */
function pngSize(path) {
  const b = readFileSync(path);
  if (b.length < 24 || b.toString('latin1', 1, 4) !== 'PNG') return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

/** `<a href>label</a>` pairs inside a chunk of HTML. */
function anchors(html) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((m) => ({
    href: attr(`<a${m[1]}>`, 'href'),
    target: attr(`<a${m[1]}>`, 'target'),
    label: text(m[2])
  }));
}

function checkCrossLinks(label, html, problems) {
  const found = anchors(html);
  for (const [href, name] of CROSS_LINKS) {
    const hit = found.find((a) => a.href === href);
    if (!hit) {
      problems.push(`${label}: no link to ${href}`);
      continue;
    }
    if (hit.label !== name) problems.push(`${label}: ${href} is labelled "${hit.label}", expected "${name}"`);
    if (hit.target === '_blank') problems.push(`${label}: ${href} opens a new tab; links to ci.computer open in the same tab`);
  }
}

/** The page must carry no inline script or style: public/_headers does not allow either. */
function checkNoInline(label, html, problems) {
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const open = `<script${m[1]}>`;
    if (attr(open, 'src')) continue;
    if (/^application\/ld\+json$/i.test(attr(open, 'type') ?? '')) continue;
    problems.push(`${label}: inline <script> (the CSP forbids it): ${m[0].slice(0, 60).replace(/\s+/g, ' ')}`);
  }
  if (/<style\b/i.test(html)) problems.push(`${label}: inline <style> (the CSP forbids it)`);
  if (/\sstyle\s*=/i.test(html)) problems.push(`${label}: inline style="" attribute (the CSP forbids it)`);
}

/**
 * The measurement ID is a build-time value (scripts/ga4.mjs adds the tags to the built
 * pages), so neither source page may carry a GA tag or an ID: a copy committed here
 * would load analytics in the container and in dev, where it must never run.
 */
function checkNoAnalyticsInSource(label, html, problems) {
  if (/googletagmanager\.com|google-analytics\.com|\bgtag\s*\(|\bG-[A-Z0-9]{6,}\b/.test(html)) {
    problems.push(`${label}: carries a Google Analytics tag or measurement ID; it is injected at build time from ${GA_ENV} (scripts/ga4.mjs)`);
  }
}

/** The prefix of every cache name public/sw.js uses: it deletes the older caches that start with it. */
const CACHE_PREFIX = 'ci-spellbook-offline-';

/**
 * public/sw.js can be the kill switch (docs/operations/service-worker-kill-switch.js), which is how
 * the worker is retired, and then it starts with this line. The kill switch has no offline page, no
 * precache list and no registration in the bundle, on purpose, so none of those is required of it.
 */
const KILL_SWITCH_MARKER = /^\/\/ spellbook:service-worker-kill-switch\b/;

/** Whether this is the text of the kill switch rather than of the real worker. */
export const isKillSwitch = (source) => KILL_SWITCH_MARKER.test(source);

/** What the service worker (public/sw.js) names: its cache, the offline page and the files it precaches. */
function serviceWorkerFiles(source) {
  const cache = /const CACHE = '([^']+)'/.exec(source)?.[1] ?? null;
  const offline = /const OFFLINE_URL = '([^']+)'/.exec(source)?.[1] ?? null;
  const listed = /const PRECACHE = \[([^\]]*)\]/.exec(source)?.[1];
  // Each entry is a quoted path, or OFFLINE_URL by name.
  const precache = (listed ?? '')
    .split(',')
    .map((item) => item.trim())
    .map((item) => (item === 'OFFLINE_URL' ? offline : /^'([^']+)'$/.exec(item)?.[1]))
    .filter(Boolean);
  return { cache, offline, precache };
}

/** Where a URL the worker precaches lives in public/: a path that ends in / is that folder's index.html. */
const publicFileFor = (url) => (url.endsWith('/') ? `${url.slice(1)}index.html` : url.slice(1));

/**
 * The 12 hex that end the worker's cache name: a sha256 over each precached URL and the bytes of its
 * file, in PRECACHE order, with carriage returns removed so that a CRLF checkout hashes like an LF one.
 * A browser fetches the precached files again only when sw.js itself changes, so the name has to
 * change with them. `dir` is the folder the URLs resolve in: public/, or the build output.
 */
export function precacheFingerprint(dir, urls) {
  const hash = createHash('sha256');
  for (const url of urls) {
    const bytes = readFileSync(join(dir, publicFileFor(url))).filter((byte) => byte !== 0x0d);
    hash.update(url).update('\0').update(bytes).update('\0');
  }
  return hash.digest('hex').slice(0, 12);
}

/** The cache name those precached files call for, or null when there is nothing (or not everything) to hash. */
function expectedCache(dir, precache) {
  if (precache.length === 0 || !precache.every((url) => existsSync(join(dir, publicFileFor(url))))) return null;
  return `${CACHE_PREFIX}${precacheFingerprint(dir, precache)}`;
}

/** A string literal as the bundle writes it: in single, double or backtick quotes. */
const quoted = (s) => new RegExp(`["'\`]${s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}["'\`]`);

/**
 * Installable as an app: the manifest says so, the head points at it, and the service
 * worker the page registers has what it serves. Chrome offers to install a site only
 * when all of that holds, and it says nothing when it does not, so a manifest edited
 * back to `display: browser` or an icon dropped would otherwise go unnoticed.
 */
function checkInstallable(root, html, problems) {
  const p = (...parts) => join(root, ...parts);
  const at = 'public/site.webmanifest';

  let manifest;
  try {
    manifest = JSON.parse(read(p(at)));
  } catch {
    return; // missing or unparseable: reported with the manifest checks above
  }

  if (manifest.display !== 'standalone') {
    problems.push(`${at}: display is "${manifest.display}", expected "standalone" (a browser-tab app is not installable as an app)`);
  }
  if (!manifest.short_name) problems.push(`${at}: no short_name (the label under the home-screen icon)`);
  if (manifest.id !== '/') problems.push(`${at}: id is ${JSON.stringify(manifest.id)}, expected "/" (without one the install is keyed on start_url)`);
  if (!manifest.start_url?.startsWith(manifest.scope ?? '/')) problems.push(`${at}: start_url is outside scope`);

  const metaTheme = metaContent(html, 'name', 'theme-color');
  for (const key of ['theme_color', 'background_color']) {
    if (!/^#[0-9a-f]{6}$/i.test(manifest[key] ?? '')) problems.push(`${at}: ${key} is not a #rrggbb colour`);
  }
  if (manifest.theme_color !== metaTheme) {
    problems.push(`${at}: theme_color ${manifest.theme_color} differs from the page's <meta name="theme-color"> ${metaTheme}`);
  }

  const purposes = (icon) => (icon.purpose ?? 'any').split(/\s+/);
  const icons = manifest.icons ?? [];
  for (const size of [192, 512]) {
    if (!icons.some((i) => i.sizes === `${size}x${size}` && purposes(i).includes('any'))) problems.push(`${at}: no ${size}x${size} icon for purpose "any"`);
  }
  if (!icons.some((i) => purposes(i).includes('maskable') && i.sizes === '512x512')) problems.push(`${at}: no 512x512 icon for purpose "maskable"`);
  for (const icon of icons) {
    const file = p('public', icon.src.replace(/^\//, ''));
    const size = existsSync(file) ? pngSize(file) : null;
    if (size && `${size.width}x${size.height}` !== icon.sizes) problems.push(`${at}: icon ${icon.src} is ${size.width}x${size.height}, declared ${icon.sizes}`);
  }

  if (linkHref(html, 'manifest') !== '/site.webmanifest') problems.push('index.html: no <link rel="manifest" href="/site.webmanifest">');
  const touch = linkHref(html, 'apple-touch-icon');
  const touchSize = touch && existsSync(p('public', touch.replace(/^\//, ''))) ? pngSize(p('public', touch.replace(/^\//, ''))) : null;
  if (!touchSize || touchSize.width !== 180 || touchSize.height !== 180) problems.push('index.html: <link rel="apple-touch-icon"> is not a 180x180 PNG in public/');
  if (!metaContent(html, 'name', 'apple-mobile-web-app-title')) problems.push('index.html: no apple-mobile-web-app-title (iOS would label the icon with the long <title>)');

  // The service worker: present, and everything it precaches is a real file.
  const swPath = p('public', 'sw.js');
  if (!existsSync(swPath)) {
    problems.push('public/sw.js is missing (the page registers it from src/lib/serviceWorker.js)');
    return;
  }
  const swSource = read(swPath);
  // The kill switch has no offline page, precache list or cache name, on purpose: it is how the
  // worker is retired. It is still served, so the header rule below applies to it too.
  if (!isKillSwitch(swSource)) {
    const { cache, offline, precache } = serviceWorkerFiles(swSource);
    if (!offline) problems.push('public/sw.js: no OFFLINE_URL');
    else if (!precache.includes(offline)) problems.push(`public/sw.js: PRECACHE does not include ${offline}, so the offline page would not be there offline`);
    for (const url of precache) {
      if (!existsSync(p('public', publicFileFor(url)))) problems.push(`public/sw.js: precaches ${url}, which is not in public/`);
      // A cached answer is never revalidated, so the worker may hold only files the app itself
      // never requests. A shared one (the header brand mark was once in the list) goes stale.
      if (!url.startsWith('/offline/')) problems.push(`public/sw.js: precaches ${url}; the worker may answer only for files under /offline/, which the app never requests`);
    }
    if (offline && existsSync(p('public', publicFileFor(offline)))) {
      const page = read(p('public', publicFileFor(offline)));
      checkNoInline(`public/${publicFileFor(offline)}`, page, problems);
      if (metaContent(page, 'name', 'robots') !== 'noindex') problems.push(`public/${publicFileFor(offline)}: not marked noindex`);
    }

    // A browser fetches the precached files again only when sw.js changes, so the cache name
    // carries a fingerprint of them; a file edited without it would never reach returning visitors.
    const expected = expectedCache(p('public'), precache);
    if (!cache) problems.push('public/sw.js: no CACHE name');
    else if (expected && cache !== expected) {
      problems.push(`public/sw.js: CACHE is ${cache}, but the precached files hash to ${expected}: set CACHE to '${expected}' (a browser fetches them again only when sw.js changes)`);
    }
  }

  const headers = existsSync(p('public', '_headers')) ? read(p('public', '_headers')) : '';
  if (!/^\/sw\.js\s*\n\s+Cache-Control:\s*no-cache\b/m.test(headers)) problems.push('public/_headers: no "Cache-Control: no-cache" rule for /sw.js');
}

// ---- layer 1: the source ------------------------------------------------------

export function checkSource(root = ROOT) {
  const problems = [];
  const p = (...parts) => join(root, ...parts);

  const indexPath = p('index.html');
  if (!existsSync(indexPath)) return [`index.html is missing from ${root}`];
  const html = read(indexPath);

  // -- head --
  const title = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1].trim();
  if (!title) problems.push('index.html: no <title>');
  else if (!title.includes(PRODUCT_NAME)) problems.push(`index.html: <title> does not name ${PRODUCT_NAME}`);

  const description = metaContent(html, 'name', 'description');
  if (!description) problems.push('index.html: no meta description');

  if (linkHref(html, 'canonical') !== SITE_URL) {
    problems.push(`index.html: canonical is ${linkHref(html, 'canonical')}, expected ${SITE_URL}`);
  }

  if (metaContent(html, 'property', 'og:url') !== SITE_URL) problems.push(`index.html: og:url is not ${SITE_URL}`);
  if (metaContent(html, 'property', 'og:type') !== 'website') problems.push('index.html: og:type is not "website"');
  if (metaContent(html, 'property', 'og:site_name') !== 'Companion Intelligence') {
    problems.push('index.html: og:site_name is not "Companion Intelligence"');
  }
  if (metaContent(html, 'name', 'twitter:card') !== 'summary_large_image') {
    problems.push('index.html: twitter:card is not summary_large_image');
  }

  // One title and one description, said the same way everywhere they appear.
  const ogTitle = metaContent(html, 'property', 'og:title');
  if (!ogTitle || ogTitle !== title) problems.push('index.html: og:title differs from <title>');
  if (metaContent(html, 'name', 'twitter:title') !== title) problems.push('index.html: twitter:title differs from <title>');
  for (const key of [['property', 'og:description'], ['name', 'twitter:description']]) {
    if (metaContent(html, key[0], key[1]) !== description) problems.push(`index.html: ${key[1]} differs from the meta description`);
  }

  // The share image: absolute URL, on this site, and a file that is really there.
  for (const key of [['property', 'og:image'], ['name', 'twitter:image']]) {
    if (metaContent(html, key[0], key[1]) !== OG_IMAGE) problems.push(`index.html: ${key[1]} is not ${OG_IMAGE}`);
  }
  if (metaContent(html, 'property', 'og:image:width') !== '1200' || metaContent(html, 'property', 'og:image:height') !== '630') {
    problems.push('index.html: og:image:width/height are not 1200/630');
  }
  if (!metaContent(html, 'property', 'og:image:alt')) problems.push('index.html: og:image has no alt text');
  const og = p('public', 'og-image.png');
  if (!existsSync(og)) problems.push('public/og-image.png is missing');
  else {
    const size = pngSize(og);
    if (!size || size.width !== 1200 || size.height !== 630) {
      problems.push(`public/og-image.png is ${size ? `${size.width}x${size.height}` : 'not a PNG'}, expected 1200x630`);
    }
    if (statSync(og).size > OG_MAX_BYTES) problems.push(`public/og-image.png is over ${OG_MAX_BYTES / 1024} KB`);
  }

  // -- structured data --
  const ld = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i.exec(html)?.[1];
  if (!ld) problems.push('index.html: no JSON-LD block');
  else {
    try {
      const graph = JSON.parse(ld)['@graph'] ?? [];
      const org = graph.find((n) => n['@type'] === 'Organization');
      const site = graph.find((n) => n['@type'] === 'WebSite');
      const page = graph.find((n) => n['@type'] === 'CollectionPage');
      if (!org || org.name !== 'Companion Intelligence' || org.url !== HOME_URL) {
        problems.push(`index.html: JSON-LD has no Companion Intelligence Organization at ${HOME_URL}`);
      }
      if (!site || site.url !== SITE_URL) problems.push(`index.html: JSON-LD WebSite is not at ${SITE_URL}`);
      if (!page || page.url !== SITE_URL) problems.push(`index.html: JSON-LD CollectionPage is not at ${SITE_URL}`);
      if (page && page.name !== HEADLINE) problems.push('index.html: JSON-LD CollectionPage name differs from the page heading');
      if (site && site.description !== description) problems.push('index.html: JSON-LD WebSite description differs from the meta description');
      for (const node of [site, page]) {
        if (node && node.publisher?.['@id'] !== org?.['@id']) problems.push('index.html: JSON-LD does not name Companion Intelligence as publisher');
      }
    } catch (e) {
      problems.push(`index.html: JSON-LD does not parse (${e.message})`);
    }
  }

  // -- no-JS fallback --
  const noscript = /<noscript>([\s\S]*?)<\/noscript>/i.exec(html)?.[1];
  if (!noscript) problems.push('index.html: no <noscript> fallback');
  else {
    const h1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(noscript)?.[1];
    if (!h1 || text(h1) !== HEADLINE) problems.push('index.html: <noscript> heading differs from HEADLINE in src/lib/site.js');
    if (!text(noscript).includes(LEDE)) problems.push('index.html: <noscript> intro differs from LEDE in src/lib/site.js');
    checkCrossLinks('index.html <noscript>', noscript, problems);
  }

  // -- the app's entry script: Rocket Loader must leave it alone --
  const entry = tagsOf(html, 'script').find((t) => attr(t, 'type') === 'module');
  if (!entry) problems.push('index.html: no module entry script');
  else if (attr(entry, 'data-cfasync') !== 'false') {
    problems.push('index.html: the entry script lacks data-cfasync="false" (Cloudflare Rocket Loader rewrites it otherwise)');
  }
  checkNoInline('index.html', html, problems);
  checkNoAnalyticsInSource('index.html', html, problems);

  // -- 404 page --
  const nfPath = p('404.html');
  if (!existsSync(nfPath)) problems.push('404.html is missing (without it Cloudflare Pages answers every path with the home page)');
  else {
    const nf = read(nfPath);
    checkCrossLinks('404.html', nf, problems);
    checkNoInline('404.html', nf, problems);
    checkNoAnalyticsInSource('404.html', nf, problems);
    if (!/<h1\b/i.test(nf)) problems.push('404.html: no <h1>');
    if (metaContent(nf, 'name', 'robots') !== 'noindex') problems.push('404.html: not marked noindex');
    if (!anchors(nf).some((a) => a.href === '/')) problems.push('404.html: no link back to /');
  }

  // -- crawler files --
  const robots = existsSync(p('public', 'robots.txt')) ? read(p('public', 'robots.txt')) : null;
  if (!robots) problems.push('public/robots.txt is missing');
  else if (!robots.split(/\r?\n/).includes(`Sitemap: ${SITE_URL}sitemap.xml`)) {
    problems.push(`public/robots.txt: no "Sitemap: ${SITE_URL}sitemap.xml" line`);
  }

  const sitemap = existsSync(p('public', 'sitemap.xml')) ? read(p('public', 'sitemap.xml')) : null;
  if (!sitemap) problems.push('public/sitemap.xml is missing');
  else if (![...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].some((m) => m[1].trim() === SITE_URL)) {
    problems.push(`public/sitemap.xml: does not list ${SITE_URL}`);
  }

  // -- web manifest: every icon it declares is a file in public/ --
  const manifestPath = p('public', 'site.webmanifest');
  if (!existsSync(manifestPath)) problems.push('public/site.webmanifest is missing');
  else {
    try {
      const manifest = JSON.parse(read(manifestPath));
      if (!manifest.name) problems.push('public/site.webmanifest: no name');
      for (const icon of manifest.icons ?? []) {
        if (!existsSync(p('public', icon.src.replace(/^\//, '')))) problems.push(`public/site.webmanifest: icon ${icon.src} is not in public/`);
      }
    } catch (e) {
      problems.push(`public/site.webmanifest does not parse (${e.message})`);
    }
  }

  // -- everything in the head that points at a file in public/ --
  for (const rel of ['icon', 'apple-touch-icon', 'manifest']) {
    for (const tag of tagsOf(html, 'link').filter((t) => attr(t, 'rel') === rel)) {
      const href = attr(tag, 'href');
      if (href?.startsWith('/') && !existsSync(p('public', href.slice(1)))) problems.push(`index.html: <link rel="${rel}"> points at ${href}, which is not in public/`);
    }
  }

  // -- installable as an app --
  checkInstallable(root, html, problems);

  // -- response headers --
  const headersPath = p('public', '_headers');
  if (!existsSync(headersPath)) problems.push('public/_headers is missing');
  else {
    const csp = /^\s*Content-Security-Policy:\s*(.+)$/im.exec(read(headersPath))?.[1];
    if (!csp) problems.push('public/_headers: no Content-Security-Policy');
    else {
      const directives = Object.fromEntries(
        csp.split(';').map((d) => d.trim()).filter(Boolean).map((d) => {
          const [name, ...values] = d.split(/\s+/);
          return [name, values];
        })
      );
      for (const name of ['script-src', 'style-src']) {
        const values = directives[name];
        if (!values) problems.push(`public/_headers: CSP has no ${name}`);
        else if (values.some((v) => /^'unsafe-(inline|eval)'$/.test(v))) {
          problems.push(`public/_headers: CSP ${name} allows ${values.find((v) => v.startsWith("'unsafe"))}; the page needs neither, so keep it out`);
        }
      }
      if (directives['object-src']?.join(' ') !== "'none'") problems.push("public/_headers: CSP object-src is not 'none'");
      if (directives['frame-ancestors']?.join(' ') !== "'none'") problems.push("public/_headers: CSP frame-ancestors is not 'none'");
      if (!directives['default-src']) problems.push('public/_headers: CSP has no default-src');
    }
  }

  return problems;
}

// ---- layer 2: the build output ------------------------------------------------

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

/** The CSP value from a built `_headers` file, as a Map of directive -> values. */
function cspDirectives(headers) {
  const csp = /^\s*Content-Security-Policy:\s*(.+)$/im.exec(headers)?.[1];
  if (!csp) return null;
  return new Map(
    csp.split(';').map((d) => d.trim()).filter(Boolean).map((d) => {
      const [name, ...values] = d.split(/\s+/);
      return [name, values];
    })
  );
}

/**
 * Google Analytics in the built output.
 *
 * Expected state comes from the environment of the build, the same place scripts/ga4.mjs
 * reads it: a valid GA_MEASUREMENT_ID means analytics must be fully built in; a set but
 * malformed one means it must be fully absent. With the variable unset the output is
 * judged on what it is (a CLI run after a build made elsewhere), and must be consistent,
 * either entirely off or entirely on.
 *
 * "Fully on" is: the loader and the init tag, each exactly once on every page, both
 * opted out of Rocket Loader; /ga-init.js present with exactly one config call for that
 * ID; and the CSP allowing exactly the hosts that needs. "Fully off" is: no Google host
 * on any page, none in the CSP, and no init file.
 */
export function checkAnalytics(dist, env = process.env) {
  const problems = [];
  const d = (...parts) => join(dist, ...parts);
  const pages = ['index.html', '404.html'].filter((f) => existsSync(d(f))).map((f) => [`dist/${f}`, read(d(f))]);
  const headers = existsSync(d('_headers')) ? read(d('_headers')) : '';
  const directives = cspDirectives(headers);
  const initPath = d(GA_INIT_FILE);

  const loaderRe = new RegExp(`<script\\b[^>]*\\bsrc="${GA_LOADER.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}\\?id=([^"&]*)"[^>]*>`, 'g');
  const loaders = (html) => [...html.matchAll(loaderRe)];
  const initTags = (html) => tagsOf(html, 'script').filter((t) => attr(t, 'src') === `/${GA_INIT_FILE}`);
  const googleOnPage = (html) => /googletagmanager\.com|google-analytics\.com|analytics\.google\.com/.test(html);
  const googleInCsp = /googletagmanager\.com|google-analytics\.com|analytics\.google\.com/.test(
    [...(directives?.values() ?? [])].flat().join(' ')
  );

  const builtId = pages.flatMap(([, html]) => loaders(html).map((m) => m[1]))[0] ?? '';
  const built = builtId !== '' || existsSync(initPath) || pages.some(([, html]) => initTags(html).length > 0);

  const wanted = (env[GA_ENV] ?? '').trim();
  const expectOn = wanted !== '' ? isGaId(wanted) : built;

  if (!expectOn) {
    for (const [name, html] of pages) {
      if (googleOnPage(html)) problems.push(`${name}: a Google Analytics tag is in the page${wanted ? `, but ${GA_ENV} is not a valid G-… ID` : ''}`);
    }
    if (existsSync(initPath)) problems.push(`dist/${GA_INIT_FILE} was emitted without a valid ${GA_ENV}`);
    if (googleInCsp) problems.push(`dist/_headers: the CSP allows a Google host, but analytics is off (no valid ${GA_ENV}); the container image shares this bundle and must stay analytics-free`);
    return problems;
  }

  if (!isGaId(builtId)) problems.push(`dist/index.html: ${built ? `analytics tags are present but the measurement ID "${builtId}" is not a G-… ID` : `${GA_ENV} is set, but the page has no analytics tags`}`);
  else if (wanted !== '' && builtId !== wanted) problems.push(`dist/index.html: ${GA_ENV} is ${wanted} but the page loads ${builtId}`);

  for (const [name, html] of pages) {
    const found = loaders(html);
    if (found.length !== 1) problems.push(`${name}: expected exactly one gtag.js loader, found ${found.length}`);
    for (const m of found) {
      if (attr(m[0], 'data-cfasync') !== 'false') problems.push(`${name}: the gtag.js loader lacks data-cfasync="false" (Rocket Loader would defer it)`);
      if (m[1] !== builtId) problems.push(`${name}: loads ${m[1]}, the other page loads ${builtId}`);
    }
    const inits = initTags(html);
    if (inits.length !== 1) problems.push(`${name}: expected exactly one /${GA_INIT_FILE} tag, found ${inits.length}`);
    for (const t of inits) {
      if (attr(t, 'data-cfasync') !== 'false') problems.push(`${name}: the /${GA_INIT_FILE} tag lacks data-cfasync="false"`);
    }
  }

  if (!existsSync(initPath)) problems.push(`dist/${GA_INIT_FILE} was not emitted, so the page loads gtag.js and never configures it`);
  else {
    const init = read(initPath);
    const configs = [...init.matchAll(/gtag\('config','([^']*)'\)/g)].map((m) => m[1]);
    if (configs.length !== 1 || configs[0] !== builtId) {
      problems.push(`dist/${GA_INIT_FILE}: expected exactly one gtag('config','${builtId}'), found ${configs.length ? configs.join(', ') : 'none'}`);
    }
  }

  if (!directives) problems.push('dist/_headers: no Content-Security-Policy to check the analytics allowance against');
  else {
    for (const [name, hosts] of Object.entries(GA_CSP)) {
      const values = directives.get(name) ?? [];
      for (const host of hosts) {
        if (!values.includes(host)) problems.push(`dist/_headers: CSP ${name} does not allow ${host}, which Google Analytics needs (the browser would block it)`);
      }
    }
    for (const name of ['script-src', 'style-src']) {
      if ((directives.get(name) ?? []).some((v) => /^'unsafe-(inline|eval)'$/.test(v))) problems.push(`dist/_headers: CSP ${name} allows unsafe-inline/eval; analytics does not need it`);
    }
  }

  return problems;
}

/**
 * The worker in the build output: it is there, everything it precaches was built, its cache name
 * matches the built files, and the bundle registers it (the page cannot: the CSP allows no inline
 * script). `js` is the bundle's text without sw.js, or the worker's own comments could satisfy the
 * registration check. The kill switch needs none of this.
 */
export function checkWorkerBuild(dist, js) {
  const d = (...parts) => join(dist, ...parts);
  if (!existsSync(d('sw.js'))) return ['dist/sw.js is missing (it belongs in public/)'];
  const source = read(d('sw.js'));
  if (isKillSwitch(source)) return [];

  const problems = [];
  const { cache, precache } = serviceWorkerFiles(source);
  for (const url of precache) {
    if (!existsSync(d(publicFileFor(url)))) problems.push(`dist/sw.js precaches ${url}, which was not built`);
  }
  const expected = expectedCache(dist, precache);
  if (cache && expected && cache !== expected) problems.push(`dist/sw.js: CACHE is ${cache}, but the built files hash to ${expected}`);
  if (!quoted('/sw.js').test(js)) problems.push('the JS bundle does not register /sw.js (src/lib/serviceWorker.js, called from src/main.jsx)');
  return problems;
}

export function checkDist(dist, { env = process.env } = {}) {
  const problems = [];
  const d = (...parts) => join(dist, ...parts);

  if (!existsSync(d('index.html'))) return [`${dist}/index.html is missing: nothing was built`];
  const html = read(d('index.html'));

  // The links are in the bundle React renders from, exactly as written. (sw.js is not part of
  // the bundle: it is checked on its own below.)
  const js = walk(dist)
    .filter((f) => f.endsWith('.js') && f !== d('sw.js'))
    .map(read)
    .join('\n');
  for (const [href, name] of CROSS_LINKS) {
    if (!quoted(href).test(js)) problems.push(`the JS bundle does not contain the link ${href}`);
    if (!js.includes(name)) problems.push(`the JS bundle does not contain the label "${name}"`);
  }

  // The footer's link to this app's Companion Hub App Store listing.
  if (!quoted(HUB_STORE_URL).test(js)) problems.push(`the JS bundle does not contain the link ${HUB_STORE_URL}`);

  // The debug overlay is a development tool. It once shipped to production and ran a
  // requestAnimationFrame loop that multiplied itself (millions of callbacks a
  // minute on an idle tab). App.jsx now loads it only behind import.meta.env.DEV;
  // this is what notices if that guard is ever removed. The string is the panel's
  // own help text.
  if (js.includes('toggle the panel')) {
    problems.push('the dev-only debug panel is in the production bundle (App.jsx must load DebugHost only when import.meta.env.DEV)');
  }

  // The built pages kept what the CSP depends on.
  checkNoInline('dist/index.html', html, problems);
  const entry = tagsOf(html, 'script').find((t) => attr(t, 'type') === 'module');
  if (!entry || attr(entry, 'data-cfasync') !== 'false') problems.push('dist/index.html: the entry script lost data-cfasync="false"');
  if (!entry || !/^\/assets\//.test(attr(entry, 'src') ?? '')) problems.push('dist/index.html: the entry script is not a built /assets/ file');
  if (!/<noscript>/i.test(html)) problems.push('dist/index.html: the <noscript> fallback was dropped');

  if (!existsSync(d('404.html'))) problems.push('dist/404.html was not built (it must be a Vite entry: see vite.config.js)');
  else {
    const nf = read(d('404.html'));
    checkNoInline('dist/404.html', nf, problems);
    checkCrossLinks('dist/404.html', nf, problems);
    const css = linkHref(nf, 'stylesheet');
    if (!css || !existsSync(d(css.replace(/^\//, '')))) problems.push(`dist/404.html: stylesheet ${css} was not built`);
  }

  // Every file the built head points at is in the output.
  for (const rel of ['icon', 'apple-touch-icon', 'manifest', 'stylesheet']) {
    for (const tag of tagsOf(html, 'link').filter((t) => attr(t, 'rel') === rel)) {
      const href = attr(tag, 'href');
      if (href?.startsWith('/') && !existsSync(d(href.slice(1)))) problems.push(`dist/index.html: <link rel="${rel}"> points at ${href}, which was not built`);
    }
  }

  for (const file of ['robots.txt', 'sitemap.xml', 'site.webmanifest', '_headers', 'og-image.png', 'favicon.ico']) {
    if (!existsSync(d(file))) problems.push(`dist/${file} is missing (it belongs in public/)`);
  }

  // Installable as an app: the worker and everything it precaches were built, and the
  // bundle registers it.
  problems.push(...checkWorkerBuild(dist, js));

  problems.push(...checkAnalytics(dist, env));

  return problems;
}

// ---- entry point ---------------------------------------------------------------

/** Throws one Error listing every problem; used by the Vite build. */
export function assertSite({ root = ROOT, dist = null, env = process.env } = {}) {
  const problems = [...checkSource(root), ...(dist ? checkDist(dist, { env }) : [])];
  if (problems.length) {
    throw new Error(`Site check failed (scripts/assert-site.mjs):\n  - ${problems.join('\n  - ')}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const dist = join(ROOT, 'dist');
  const built = existsSync(join(dist, 'index.html'));
  try {
    assertSite({ dist: built ? dist : null });
    console.log(`OK: site metadata, cross-links and crawler files agree with src/lib/site.js${built ? ' (source and dist)' : ' (source only; run `npm run build` to check dist)'}.`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
