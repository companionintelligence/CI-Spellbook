import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { checkAnalytics } from '../../scripts/assert-site.mjs';
import { GA_CSP, extendCsp, extendHeaders, ga4, gaInitSource, isGaId } from '../../scripts/ga4.mjs';

// Google Analytics is a build-time, opt-in thing here: nothing unless GA_MEASUREMENT_ID
// is a real ID, and then the tags, the init file and the CSP all together. These pin the
// pieces; scripts/check-ga-build.mjs runs real builds both ways.

const ROOT = resolve(process.cwd());
const ID = 'G-TEST123456';
const HEADERS = readFileSync(join(ROOT, 'public/_headers'), 'utf8');

describe('isGaId', () => {
  it('accepts a GA4 measurement ID and nothing else', () => {
    expect(isGaId('G-ABC123XYZ9')).toBe(true);
    for (const bad of ['', 'g-abc123', 'UA-12345-1', 'G-', 'G-abc', 'G-ABC 123', "G-ABC'123", 'GTM-ABC123', undefined, null, 42]) {
      expect(isGaId(bad), String(bad)).toBe(false);
    }
  });
});

describe('gaInitSource', () => {
  it('is a plain external script: no inline-only syntax, the ID exactly once', () => {
    const src = gaInitSource(ID);
    expect(src).toContain(`gtag('config','${ID}')`);
    expect(src.split(ID)).toHaveLength(2);
    expect(src).toContain('window.dataLayer=window.dataLayer||[]');
  });
});

describe('extendCsp', () => {
  const csp = /^\s*Content-Security-Policy:\s*(.+)$/im.exec(HEADERS)[1];
  const directives = (value) => Object.fromEntries(value.split(';').map((d) => d.trim().split(/\s+/)).map(([name, ...values]) => [name, values]));

  it('adds Google\'s hosts to script-src, connect-src and img-src, and to nothing else', () => {
    const before = directives(csp);
    const after = directives(extendCsp(csp));
    for (const [name, hosts] of Object.entries(GA_CSP)) {
      expect(after[name]).toEqual([...before[name], ...hosts]);
    }
    for (const name of Object.keys(before).filter((n) => !(n in GA_CSP))) {
      expect(after[name], name).toEqual(before[name]);
    }
    expect(Object.keys(after)).toEqual(Object.keys(before));
  });

  it('keeps the policy strict: still no unsafe-inline or unsafe-eval anywhere', () => {
    expect(extendCsp(csp)).not.toMatch(/unsafe-(inline|eval)/);
    expect(extendCsp(csp)).not.toMatch(/\*(?!\.)/);
  });

  it('is idempotent', () => {
    expect(extendCsp(extendCsp(csp))).toBe(extendCsp(csp));
  });
});

describe('extendHeaders', () => {
  it('changes the CSP line and no other line', () => {
    const before = HEADERS.split('\n');
    const after = extendHeaders(HEADERS).split('\n');
    expect(after).toHaveLength(before.length);
    const changed = before.map((line, i) => [line, after[i]]).filter(([a, b]) => a !== b);
    expect(changed).toHaveLength(1);
    expect(changed[0][0]).toMatch(/^\s*Content-Security-Policy:/);
  });

  it('is idempotent', () => {
    expect(extendHeaders(extendHeaders(HEADERS))).toBe(extendHeaders(HEADERS));
  });
});

describe('the plugin', () => {
  const html = (plugin) => plugin.transformIndexHtml.handler('<!doctype html><html><head></head><body></body></html>');

  it('does nothing without a valid ID: no tags, no init file', () => {
    for (const raw of [undefined, '', '   ', 'not-an-id', 'UA-1-1']) {
      const plugin = ga4(raw);
      expect(html(plugin), String(raw)).toBeUndefined();
      expect(plugin.generateBundle.call({ emitFile: () => { throw new Error('emitted'); } })).toBeUndefined();
    }
  });

  it('with an ID adds the loader and the init tag to the head, both out of Rocket Loader\'s way', () => {
    const tags = html(ga4(ID));
    expect(tags.map((t) => t.injectTo)).toEqual(['head', 'head']);
    expect(tags[0].attrs).toEqual({ async: true, 'data-cfasync': 'false', src: `https://www.googletagmanager.com/gtag/js?id=${ID}` });
    expect(tags[1].attrs).toEqual({ 'data-cfasync': 'false', src: '/ga-init.js' });
  });

  it('does not add a second loader to a page that has one', () => {
    const plugin = ga4(ID);
    expect(plugin.transformIndexHtml.handler(`<head><script src="https://www.googletagmanager.com/gtag/js?id=${ID}"></script></head>`)).toBeUndefined();
  });

  it('emits ga-init.js when there is an ID', () => {
    const emitted = [];
    ga4(ID).generateBundle.call({ emitFile: (f) => emitted.push(f) });
    expect(emitted).toEqual([{ type: 'asset', fileName: 'ga-init.js', source: gaInitSource(ID) }]);
  });

  it('warns about an ID that is set but wrong, rather than failing or staying quiet', () => {
    const warnings = [];
    ga4('G-oops!').buildStart.call({ warn: (m) => warnings.push(m) });
    ga4('').buildStart.call({ warn: (m) => warnings.push(m) });
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('GA_MEASUREMENT_ID');
  });

  describe('dist/_headers', () => {
    let dir;
    afterEach(() => dir && rmSync(dir, { recursive: true, force: true }));

    const run = (plugin, text) => {
      dir = mkdtempSync(join(tmpdir(), 'spellbook-ga-'));
      writeFileSync(join(dir, '_headers'), text);
      plugin.writeBundle.call({ error: (m) => { throw new Error(m); } }, { dir });
      return readFileSync(join(dir, '_headers'), 'utf8');
    };

    it('is rewritten with an ID, twice over to the same result', () => {
      const once = run(ga4(ID), HEADERS);
      expect(once).toBe(extendHeaders(HEADERS));
      expect(run(ga4(ID), once)).toBe(once);
    });

    it('is left byte for byte alone without one', () => {
      expect(run(ga4(undefined), HEADERS)).toBe(HEADERS);
    });

    it('fails the build if there is no _headers to extend', () => {
      dir = mkdtempSync(join(tmpdir(), 'spellbook-ga-'));
      expect(() => ga4(ID).writeBundle.call({ error: (m) => { throw new Error(m); } }, { dir })).toThrow(/_headers is missing/);
    });
  });
});

describe('checkAnalytics on a built dist', () => {
  let dir;
  afterEach(() => dir && rmSync(dir, { recursive: true, force: true }));

  const page = (extra = '') => `<!doctype html><html><head><title>x</title>${extra}</head><body></body></html>`;
  const loader = (id = ID, attrs = ' data-cfasync="false"') => `<script async${attrs} src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>`;
  const init = '<script data-cfasync="false" src="/ga-init.js"></script>';

  /** A minimal dist: the two pages, _headers, and optionally ga-init.js. */
  const dist = ({ pages = [page(), page()], headers = HEADERS, initFile = null } = {}) => {
    dir = mkdtempSync(join(tmpdir(), 'spellbook-dist-'));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), pages[0]);
    writeFileSync(join(dir, '404.html'), pages[1]);
    writeFileSync(join(dir, '_headers'), headers);
    if (initFile !== null) writeFileSync(join(dir, 'ga-init.js'), initFile);
    return dir;
  };

  const on = () => dist({ pages: [page(loader() + init), page(loader() + init)], headers: extendHeaders(HEADERS), initFile: gaInitSource(ID) });

  it('accepts analytics fully off, and fully on', () => {
    expect(checkAnalytics(dist(), {})).toEqual([]);
    expect(checkAnalytics(on(), { GA_MEASUREMENT_ID: ID })).toEqual([]);
    expect(checkAnalytics(on(), {})).toEqual([]);
  });

  it('with an ID set, wants it built in: tags, init file, CSP', () => {
    const problems = checkAnalytics(dist(), { GA_MEASUREMENT_ID: ID }).join('\n');
    expect(problems).toContain('GA_MEASUREMENT_ID is set, but the page has no analytics tags');
    expect(problems).toContain('expected exactly one gtag.js loader, found 0');
    expect(problems).toContain('ga-init.js was not emitted');
    expect(problems).toContain('CSP script-src does not allow https://www.googletagmanager.com');
  });

  it('wants the CSP to have grown with the tags, or the browser blocks them', () => {
    const d = dist({ pages: [page(loader() + init), page(loader() + init)], initFile: gaInitSource(ID) });
    const problems = checkAnalytics(d, { GA_MEASUREMENT_ID: ID }).join('\n');
    expect(problems).toContain('CSP connect-src does not allow https://*.google-analytics.com');
    expect(problems).toContain('CSP img-src does not allow https://*.analytics.google.com');
  });

  it('wants each tag exactly once on every page, so a rebuild cannot stack them', () => {
    const d = dist({ pages: [page(loader() + loader() + init), page(loader() + init + init)], headers: extendHeaders(HEADERS), initFile: gaInitSource(ID) });
    const problems = checkAnalytics(d, { GA_MEASUREMENT_ID: ID }).join('\n');
    expect(problems).toContain('dist/index.html: expected exactly one gtag.js loader, found 2');
    expect(problems).toContain('dist/404.html: expected exactly one /ga-init.js tag, found 2');
  });

  it('wants Rocket Loader opted out of both tags', () => {
    const d = dist({ pages: [page(loader(ID, '') + '<script src="/ga-init.js"></script>'), page(loader() + init)], headers: extendHeaders(HEADERS), initFile: gaInitSource(ID) });
    const problems = checkAnalytics(d, { GA_MEASUREMENT_ID: ID }).join('\n');
    expect(problems).toContain('dist/index.html: the gtag.js loader lacks data-cfasync="false"');
    expect(problems).toContain('dist/index.html: the /ga-init.js tag lacks data-cfasync="false"');
  });

  it('wants the ID in the page to be the ID the build was given, the same on both pages, and in the init file', () => {
    const d = dist({ pages: [page(loader('G-OTHER99999') + init), page(loader() + init)], headers: extendHeaders(HEADERS), initFile: gaInitSource(ID) });
    const problems = checkAnalytics(d, { GA_MEASUREMENT_ID: ID }).join('\n');
    expect(problems).toContain(`GA_MEASUREMENT_ID is ${ID} but the page loads G-OTHER99999`);
    expect(problems).toContain(`dist/404.html: loads ${ID}, the other page loads G-OTHER99999`);
    expect(problems).toContain(`ga-init.js: expected exactly one gtag('config','G-OTHER99999')`);
  });

  it('with a malformed ID, wants analytics entirely absent', () => {
    const leaked = dist({ pages: [page(loader() + init), page(loader() + init)], headers: extendHeaders(HEADERS), initFile: gaInitSource(ID) });
    const problems = checkAnalytics(leaked, { GA_MEASUREMENT_ID: 'G-oops!' }).join('\n');
    expect(problems).toContain('dist/index.html: a Google Analytics tag is in the page, but GA_MEASUREMENT_ID is not a valid G-… ID');
    expect(problems).toContain('ga-init.js was emitted without a valid GA_MEASUREMENT_ID');
    expect(problems).toContain('the container image shares this bundle and must stay analytics-free');
  });

  it('with no ID at all, judges the output on its own: a half-built one is a problem', () => {
    // Loader on the home page, nothing on the 404 page, no init file, CSP not extended.
    const half = dist({ pages: [page(loader()), page()] });
    const problems = checkAnalytics(half, {}).join('\n');
    expect(problems).toContain('dist/404.html: expected exactly one gtag.js loader, found 0');
    expect(problems).toContain('ga-init.js was not emitted');
    expect(problems).toContain('CSP script-src does not allow https://www.googletagmanager.com');
  });

  it('a Google host in the CSP of a build with no analytics is a problem: the image must stay clean', () => {
    const problems = checkAnalytics(dist({ headers: extendHeaders(HEADERS) }), {}).join('\n');
    expect(problems).toContain('the CSP allows a Google host, but analytics is off');
  });
});
