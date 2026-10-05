import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { CROSS_LINKS, checkSource } from '../../scripts/assert-site.mjs';
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
