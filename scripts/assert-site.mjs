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

export function checkDist(dist, { env = process.env } = {}) {
  const problems = [];
  const d = (...parts) => join(dist, ...parts);

  if (!existsSync(d('index.html'))) return [`${dist}/index.html is missing: nothing was built`];
  const html = read(d('index.html'));

  // The links are in the bundle React renders from, exactly as written.
  const js = walk(dist)
    .filter((f) => f.endsWith('.js'))
    .map(read)
    .join('\n');
  const quoted = (s) => new RegExp(`["'\`]${s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}["'\`]`);
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
