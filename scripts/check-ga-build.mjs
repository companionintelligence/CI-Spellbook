// check-ga-build.mjs: build the site with Google Analytics on and off, for real.
//
//   npm run check:ga-build
//
// scripts/ga4.mjs is opt-in at build time, and the container image shares the bundle,
// so what has to hold is not only "analytics works when asked for" but "nothing of it
// leaks when it is not". The unit tests (src/lib/ga4.test.js) cover the pieces; this
// runs `vite build` four ways into scratch directories and checks what comes out:
//
//   1. no GA_MEASUREMENT_ID      no tags, no ga-init.js, dist/_headers byte for byte
//                                public/_headers (so no Google host in the CSP)
//   2. a malformed one           the same, plus Vite's warning
//   3. a valid one               both pages carry the loader and init tag once, ga-init.js
//                                is there, and the CSP allows exactly Google's hosts
//   4. the same valid one, built again into the same directory: identical output, so
//                                a rebuild cannot stack tags or hosts
//
// Every build also runs scripts/assert-site.mjs (vite.config.js), which is what checks
// the details; this adds the on/off/idempotent comparison. Nothing is written to dist/.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GA_ENV } from './ga4.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const VITE = join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
const ID = 'G-CITEST0000';

const read = (...parts) => readFileSync(join(...parts), 'utf8');
const failures = [];
const check = (ok, message) => ok || failures.push(message);

function build(outDir, id) {
  // The parent's GA_MEASUREMENT_ID must not leak into the "off" builds.
  const env = { ...process.env, [GA_ENV]: id };
  if (id === undefined) delete env[GA_ENV];
  const out = execFileSync(process.execPath, [VITE, 'build', '--outDir', outDir, '--emptyOutDir', '--logLevel', 'warn'], {
    cwd: ROOT,
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
  return out;
}

const scratch = mkdtempSync(join(tmpdir(), 'spellbook-ga-build-'));
try {
  if (!existsSync(VITE)) throw new Error('vite is not installed: run `npm ci` first');
  const sourceHeaders = read(ROOT, 'public', '_headers');

  for (const [label, id] of [['unset', undefined], ['malformed', 'G-oops!']]) {
    const dir = join(scratch, `off-${label}`);
    build(dir, id);
    for (const page of ['index.html', '404.html']) {
      check(!/googletagmanager|google-analytics|ga-init/.test(read(dir, page)), `${label}: dist/${page} has an analytics tag`);
    }
    check(!existsSync(join(dir, 'ga-init.js')), `${label}: ga-init.js was emitted`);
    check(read(dir, '_headers') === sourceHeaders, `${label}: dist/_headers differs from public/_headers`);
  }

  const on = join(scratch, 'on');
  build(on, ID);
  const once = Object.fromEntries(['index.html', '404.html', '_headers', 'ga-init.js'].map((f) => [f, read(on, f)]));
  for (const page of ['index.html', '404.html']) {
    check(once[page].split('googletagmanager.com/gtag/js').length === 2, `on: dist/${page} does not have exactly one loader`);
    check(once[page].includes(`gtag/js?id=${ID}`), `on: dist/${page} does not load ${ID}`);
  }
  check(once['ga-init.js'].includes(`gtag('config','${ID}')`), 'on: ga-init.js does not configure the ID');
  check(once['_headers'] !== sourceHeaders, 'on: dist/_headers was not extended');

  // Idempotent: the same build again, into the same directory.
  build(on, ID);
  for (const f of Object.keys(once)) check(read(on, f) === once[f], `rebuild: dist/${f} changed on the second build`);
} catch (e) {
  failures.push(`a build failed: ${(e.stderr || e.message).toString().trim().split('\n').slice(0, 12).join('\n    ')}`);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}

if (failures.length) {
  console.error(`GA build check failed:\n  - ${failures.join('\n  - ')}`);
  process.exit(1);
}
console.log('OK: analytics is absent without a valid GA_MEASUREMENT_ID (no tags, no init file, CSP untouched), complete with one, and a rebuild changes nothing.');
