import { appendFileSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { CROSS_LINKS, checkSource, checkWorkerBuild, isKillSwitch, precacheFingerprint } from '../../scripts/assert-site.mjs';
import * as site from './site.js';

// The static copies of the site's links and copy (index.html, 404.html, public/*)
// against src/lib/site.js, and proof that the check fails when they drift. The
// same check runs against dist/ inside the Vite build (vite.config.js).

const ROOT = resolve(process.cwd());

describe('the cross-links every Companion site carries', () => {
  it('are exactly the shared product URLs and labels', () => {
    expect(CROSS_LINKS).toEqual([
      ['https://ci.computer', 'Companion Intelligence'],
      ['https://docs.ci.computer/docs/apps-available/first-party-apps/spellbook', 'Docs'],
      ['https://ci.computer/download', 'Download Companion'],
      ['https://ci.computer/core', 'Buy Companion Core']
    ]);
    expect(site.BUY_URL).toBe('https://ci.computer/core');
    expect(site.DOWNLOAD_URL).toBe('https://ci.computer/download');
  });
});

describe('checkSource on this repository', () => {
  it('finds nothing wrong', () => {
    expect(checkSource(ROOT)).toEqual([]);
  });
});

describe('checkSource notices drift', () => {
  let tmp;

  /** A copy of what the check reads, with one file rewritten. */
  const withEdit = (file, edit) => {
    tmp = mkdtempSync(join(tmpdir(), 'spellbook-site-'));
    cpSync(join(ROOT, 'index.html'), join(tmp, 'index.html'));
    cpSync(join(ROOT, '404.html'), join(tmp, '404.html'));
    cpSync(join(ROOT, 'public'), join(tmp, 'public'), {
      recursive: true,
      filter: (src) => !src.includes('/public/markdown')
    });
    const path = join(tmp, file);
    writeFileSync(path, edit(readFileSync(path, 'utf8')));
    return checkSource(tmp);
  };

  afterEach(() => {
    if (tmp) rmSync(tmp, { recursive: true, force: true });
    tmp = undefined;
  });

  it('a Google Analytics tag committed into index.html (it belongs to the build, not the source)', () => {
    const problems = withEdit('index.html', (h) =>
      h.replace('</head>', '<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123456"></script></head>')
    );
    expect(problems.join('\n')).toContain('index.html: carries a Google Analytics tag or measurement ID');
    expect(problems.join('\n')).toContain('GA_MEASUREMENT_ID');
  });

  it('a changed Buy link', () => {
    const problems = withEdit('index.html', (h) => h.replace(/<a href="https:\/\/ci\.computer\/core">/, '<a href="https://ci.computer/store">'));
    expect(problems.join('\n')).toContain('no link to https://ci.computer/core');
  });

  it('a renamed Download button', () => {
    const problems = withEdit('404.html', (h) => h.replaceAll('Download Companion', 'Get the app'));
    expect(problems.join('\n')).toMatch(/404\.html: https:\/\/ci\.computer\/download is labelled "Get the app"/);
  });

  it('a ci.computer link that opens a new tab', () => {
    const problems = withEdit('index.html', (h) => h.replace('<a href="https://ci.computer/download">', '<a target="_blank" href="https://ci.computer/download">'));
    expect(problems.join('\n')).toContain('opens a new tab');
  });

  it('a heading that no longer matches the page', () => {
    const problems = withEdit('index.html', (h) => h.replace(/(<noscript>[\s\S]*?<h1>)[^<]*/, '$1Something else'));
    expect(problems.join('\n')).toContain('<noscript> heading differs');
  });

  it('a canonical that points somewhere else', () => {
    const problems = withEdit('index.html', (h) => h.replace('<link rel="canonical" href="https://magic.ci.computer/">', '<link rel="canonical" href="https://magic.ci.computer/index.html">'));
    expect(problems.join('\n')).toContain('canonical is https://magic.ci.computer/index.html');
  });

  it('a share description that has diverged from the meta description', () => {
    const problems = withEdit('index.html', (h) => h.replace(/(property="og:description" content=")[^"]*/, '$1Old words'));
    expect(problems.join('\n')).toContain('og:description differs from the meta description');
  });

  it('JSON-LD that does not parse', () => {
    const problems = withEdit('index.html', (h) => h.replace('"@context": "https://schema.org",', '"@context": "https://schema.org"'));
    expect(problems.join('\n')).toContain('JSON-LD does not parse');
  });

  it('an inline script (the CSP forbids it)', () => {
    const problems = withEdit('index.html', (h) => h.replace('</body>', '<script>window.x = 1</script></body>'));
    expect(problems.join('\n')).toContain('inline <script>');
  });

  it('an inline style (the CSP forbids it)', () => {
    const problems = withEdit('index.html', (h) => h.replace('<body class=', '<body style="color:red" class='));
    expect(problems.join('\n')).toContain('inline style=""');
  });

  it('an entry script Rocket Loader would rewrite', () => {
    const problems = withEdit('index.html', (h) => h.replace('src="/src/main.jsx" data-cfasync="false">', 'src="/src/main.jsx">'));
    expect(problems.join('\n')).toContain('data-cfasync="false"');
  });

  it("a CSP that has been loosened with 'unsafe-inline'", () => {
    const problems = withEdit('public/_headers', (h) => h.replace("script-src 'self'", "script-src 'self' 'unsafe-inline'"));
    expect(problems.join('\n')).toContain("allows 'unsafe-inline'");
  });

  it('a sitemap that lists the wrong page', () => {
    const problems = withEdit('public/sitemap.xml', (h) => h.replace('https://magic.ci.computer/', 'https://magic.ci.computer/old'));
    expect(problems.join('\n')).toContain('does not list https://magic.ci.computer/');
  });

  it('a robots.txt that has lost its sitemap line', () => {
    const problems = withEdit('public/robots.txt', (h) => h.replace(/Sitemap:.*\n?/, ''));
    expect(problems.join('\n')).toContain('no "Sitemap: https://magic.ci.computer/sitemap.xml" line');
  });

  it('a web manifest that names an icon that is not there', () => {
    const problems = withEdit('public/site.webmanifest', (h) => h.replace('/logo/icon-512.png', '/logo/missing.png'));
    expect(problems.join('\n')).toContain('/logo/missing.png is not in public/');
  });

  it('a 404 page that is indexable', () => {
    const problems = withEdit('404.html', (h) => h.replace('<meta name="robots" content="noindex">', ''));
    expect(problems.join('\n')).toContain('404.html: not marked noindex');
  });
});

const KILL_SWITCH = readFileSync(join(ROOT, 'docs/operations/service-worker-kill-switch.js'), 'utf8');
/** With the kill switch as public/sw.js the worker is retired on purpose (README: Rolling back), and the checks of the real worker do not apply. */
const RETIRED = isKillSwitch(readFileSync(join(ROOT, 'public/sw.js'), 'utf8'));

describe('checkSource notices an app that can no longer be installed', () => {
  let tmp;

  // Same shape as the drift tests above: a copy of what the check reads, with files rewritten.
  const withEdits = (edits) => {
    tmp = mkdtempSync(join(tmpdir(), 'spellbook-pwa-'));
    cpSync(join(ROOT, 'index.html'), join(tmp, 'index.html'));
    cpSync(join(ROOT, '404.html'), join(tmp, '404.html'));
    cpSync(join(ROOT, 'public'), join(tmp, 'public'), {
      recursive: true,
      filter: (src) => !src.includes('/public/markdown')
    });
    for (const [file, edit] of edits) {
      const path = join(tmp, file);
      writeFileSync(path, edit(readFileSync(path, 'utf8')));
    }
    return checkSource(tmp).join('\n');
  };
  const withEdit = (file, edit) => withEdits([[file, edit]]);

  afterEach(() => {
    if (tmp) rmSync(tmp, { recursive: true, force: true });
    tmp = undefined;
  });

  it('a manifest that has gone back to opening in a browser tab', () => {
    expect(withEdit('public/site.webmanifest', (h) => h.replace('"display": "standalone"', '"display": "browser"'))).toContain(
      'display is "browser", expected "standalone"'
    );
  });

  it('a manifest with no id', () => {
    expect(withEdit('public/site.webmanifest', (h) => h.replace('"id": "/",', ''))).toContain('id is undefined, expected "/"');
  });

  it('a manifest with no maskable icon', () => {
    expect(withEdit('public/site.webmanifest', (h) => h.replace('"purpose": "maskable"', '"purpose": "any"'))).toContain('no 512x512 icon for purpose "maskable"');
  });

  it('an icon whose file is not the size the manifest declares', () => {
    expect(withEdit('public/site.webmanifest', (h) => h.replace('"sizes": "192x192"', '"sizes": "256x256"'))).toContain('is 192x192, declared 256x256');
  });

  it('a manifest theme colour that the page does not share', () => {
    expect(withEdit('public/site.webmanifest', (h) => h.replace('"theme_color": "#071533"', '"theme_color": "#000000"'))).toContain(
      'theme_color #000000 differs from the page'
    );
  });

  it('a page that no longer links the manifest', () => {
    expect(withEdit('index.html', (h) => h.replace('<link rel="manifest" href="/site.webmanifest">', ''))).toContain('no <link rel="manifest"');
  });

  it('a page with no home-screen label', () => {
    expect(withEdit('index.html', (h) => h.replace(/<meta name="apple-mobile-web-app-title"[^>]*>/, ''))).toContain('no apple-mobile-web-app-title');
  });

  it.skipIf(RETIRED)('a service worker that precaches a file that is not there', () => {
    expect(withEdit('public/sw.js', (h) => h.replace("'/offline/mark.svg']", "'/offline/gone.svg']"))).toContain('precaches /offline/gone.svg, which is not in public/');
  });

  // The header brand mark is /logo/mark.svg. The worker answered for it from the cache, which is
  // never revalidated, so a rebrand did not reach installed browsers. The offline page has its
  // own copy under /offline/ for that reason.
  it.skipIf(RETIRED)('a service worker that answers for a file the app itself requests', () => {
    expect(withEdit('public/sw.js', (h) => h.replace("'/offline/mark.svg']", "'/logo/mark.svg']"))).toContain(
      'precaches /logo/mark.svg; the worker may answer only for files under /offline/'
    );
  });

  it.skipIf(RETIRED)('a service worker whose offline page is not in its precache list', () => {
    expect(withEdit('public/sw.js', (h) => h.replace('[OFFLINE_URL, ', '['))).toContain('PRECACHE does not include /offline/');
  });

  it.skipIf(RETIRED)('an offline page with an inline script (the CSP forbids it)', () => {
    expect(withEdit('public/offline/index.html', (h) => h.replace('</body>', '<script>retry()</script></body>'))).toContain('inline <script>');
  });

  it.skipIf(RETIRED)('an offline page that is indexable', () => {
    expect(withEdit('public/offline/index.html', (h) => h.replace('<meta name="robots" content="noindex">', ''))).toContain('not marked noindex');
  });

  it('a worker script that a shared cache may hold on to', () => {
    expect(withEdit('public/_headers', (h) => h.replace('/sw.js\n  Cache-Control: no-cache', ''))).toContain('no "Cache-Control: no-cache" rule for /sw.js');
  });

  // A browser fetches the precached files again only when sw.js changes, so the cache name
  // carries a fingerprint of them (scripts/assert-site.mjs: precacheFingerprint). The build is
  // what has to notice an edited file, not whoever happens to run the unit tests.
  it.skipIf(RETIRED)('a precached file edited without the cache name following it', () => {
    expect(withEdit('public/offline/offline.css', (h) => `${h}\n/* edited */\n`)).toMatch(
      /public\/sw\.js: CACHE is ci-spellbook-offline-[0-9a-f]{12}, but the precached files hash to ci-spellbook-offline-[0-9a-f]{12}: set CACHE to 'ci-spellbook-offline-[0-9a-f]{12}'/
    );
  });

  it.skipIf(RETIRED)('a precached file saved with CRLF line endings, which still names the same cache', () => {
    expect(withEdit('public/offline/offline.css', (h) => h.replace(/\n/g, '\r\n'))).toBe('');
  });

  it.skipIf(RETIRED)('a worker with no cache name', () => {
    expect(withEdit('public/sw.js', (h) => h.replace(/const CACHE = '[^']+';/, ''))).toContain('public/sw.js: no CACHE name');
  });

  // The README's rollback is: the kill switch replaces public/sw.js, and the registration goes.
  // The build must accept that, or the fix for a bad worker could not be deployed.
  it('the kill switch as public/sw.js, which has no offline page, precache list or cache name', () => {
    expect(withEdit('public/sw.js', () => KILL_SWITCH)).toBe('');
  });

  it('the kill switch is still checked for the no-cache rule, because it is served like the worker', () => {
    const problems = withEdits([
      ['public/sw.js', () => KILL_SWITCH],
      ['public/_headers', (h) => h.replace('/sw.js\n  Cache-Control: no-cache', '')]
    ]);
    expect(problems).toContain('no "Cache-Control: no-cache" rule for /sw.js');
  });
});

describe('checkWorkerBuild: the worker in dist/', () => {
  /** @type {string | undefined} */
  let dist;

  /** A build output holding the worker (the real one by default) and the offline files it precaches. */
  const fakeDist = (sw = readFileSync(join(ROOT, 'public/sw.js'), 'utf8')) => {
    dist = mkdtempSync(join(tmpdir(), 'spellbook-dist-'));
    mkdirSync(join(dist, 'offline'));
    for (const file of ['index.html', 'offline.css', 'mark.svg']) cpSync(join(ROOT, 'public/offline', file), join(dist, 'offline', file));
    writeFileSync(join(dist, 'sw.js'), sw);
    return dist;
  };
  /** The text of a bundle that registers the worker, and of one that does not. */
  const REGISTERS = 'navigator.serviceWorker.register("/sw.js",{scope:"/"})';
  const DOES_NOT = 'console.log("no worker")';

  afterEach(() => {
    if (dist) rmSync(dist, { recursive: true, force: true });
    dist = undefined;
  });

  it.skipIf(RETIRED)('passes a worker that was built with its files, under the name they call for, and that the bundle registers', () => {
    expect(checkWorkerBuild(fakeDist(), REGISTERS)).toEqual([]);
  });

  it.skipIf(RETIRED)('a bundle that no longer registers the worker', () => {
    expect(checkWorkerBuild(fakeDist(), DOES_NOT).join('\n')).toContain('the JS bundle does not register /sw.js');
  });

  it('a build with no worker at all', () => {
    const built = fakeDist();
    rmSync(join(built, 'sw.js'));
    expect(checkWorkerBuild(built, REGISTERS)).toEqual(['dist/sw.js is missing (it belongs in public/)']);
  });

  it.skipIf(RETIRED)('a precached file that was not built', () => {
    const built = fakeDist();
    rmSync(join(built, 'offline/offline.css'));
    expect(checkWorkerBuild(built, REGISTERS).join('\n')).toContain('dist/sw.js precaches /offline/offline.css, which was not built');
  });

  it.skipIf(RETIRED)('a built file that is not the one the cache name was made for', () => {
    const built = fakeDist();
    appendFileSync(join(built, 'offline/offline.css'), '\n/* edited */\n');
    expect(checkWorkerBuild(built, REGISTERS).join('\n')).toMatch(/dist\/sw\.js: CACHE is ci-spellbook-offline-[0-9a-f]{12}, but the built files hash to /);
  });

  it('the kill switch, which has no offline page, precache list or registration to look for', () => {
    dist = mkdtempSync(join(tmpdir(), 'spellbook-dist-'));
    writeFileSync(join(dist, 'sw.js'), KILL_SWITCH);
    expect(checkWorkerBuild(dist, DOES_NOT)).toEqual([]);
  });
});

// The marker is the whole first line of the kill switch. A looser test (a word boundary after
// "switch") also accepted `...kill-switch-not`, so a file that merely began with the same words
// would have switched off every check of the real worker.
describe('isKillSwitch: the first line of public/sw.js decides', () => {
  const MARKER = '// spellbook:service-worker-kill-switch';

  it('recognises the kill switch itself', () => {
    expect(isKillSwitch(KILL_SWITCH)).toBe(true);
    expect(isKillSwitch(`${MARKER}\nself.addEventListener('install', () => {});\n`)).toBe(true);
  });

  it('allows trailing spaces and a CRLF line ending after the marker, and a file that is only the marker', () => {
    expect(isKillSwitch(`${MARKER}   \n// x\n`)).toBe(true);
    expect(isKillSwitch(`${MARKER}\r\n// x\r\n`)).toBe(true);
    expect(isKillSwitch(MARKER)).toBe(true);
  });

  it('does not take anything else for it', () => {
    expect(isKillSwitch(`${MARKER}-not\n// x\n`)).toBe(false);
    expect(isKillSwitch(`${MARKER}: x\n// x\n`)).toBe(false);
    expect(isKillSwitch(`${MARKER}.js\n`)).toBe(false);
    expect(isKillSwitch(`\n${MARKER}\n`)).toBe(false); // not the first line
    expect(isKillSwitch(`// Spellbook's service worker.\n${MARKER}\n`)).toBe(false);
    expect(isKillSwitch(`/* ${MARKER} */\n`)).toBe(false);
    expect(isKillSwitch('')).toBe(false);
  });
});

describe('precacheFingerprint, the end of the worker\'s cache name', () => {
  /** @type {string | undefined} */
  let dir;
  const URLS = ['/offline/', '/offline/a.css'];

  /** Two small files at the paths URLS resolves to. */
  const files = (index, css) => {
    dir = mkdtempSync(join(tmpdir(), 'spellbook-fingerprint-'));
    mkdirSync(join(dir, 'offline'));
    writeFileSync(join(dir, 'offline/index.html'), index);
    writeFileSync(join(dir, 'offline/a.css'), css);
    return dir;
  };

  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
    dir = undefined;
  });

  // The README gives the same thing as a shell recipe, so a known answer from `shasum` pins it:
  //   { printf '/offline/\0'; printf '<h1>offline</h1>\n'; printf '\0'
  //     printf '/offline/a.css\0'; printf 'body{}\n'; printf '\0'; } | shasum -a 256 | cut -c1-12
  it('is the first 12 hex of a sha256 over each URL and its file, each followed by a NUL', () => {
    expect(precacheFingerprint(files('<h1>offline</h1>\n', 'body{}\n'), URLS)).toBe('13f6a746b44b');
  });

  it('ignores carriage returns, so a CRLF checkout of the files names the same cache', () => {
    expect(precacheFingerprint(files('<h1>offline</h1>\r\n', 'body{}\r\n'), URLS)).toBe('13f6a746b44b');
  });

  it('moves with a file, with the order of the list and with a URL', () => {
    expect(precacheFingerprint(files('<h1>offline!</h1>\n', 'body{}\n'), URLS)).not.toBe('13f6a746b44b');
    expect(precacheFingerprint(files('<h1>offline</h1>\n', 'body{}\n'), [...URLS].reverse())).not.toBe('13f6a746b44b');
    expect(precacheFingerprint(files('<h1>offline</h1>\n', 'body{}\n'), URLS.slice(0, 1))).not.toBe('13f6a746b44b');
  });
});
