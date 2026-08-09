#!/usr/bin/env node
/**
 * Prove the Sentry SDK is absent from a DSN-less build.
 *
 * The opt-in promise is not just "we don't send anything" — it is "the code
 * that could send something is not in the bundle you were served". That holds
 * only because `src/lib/telemetry.js` reads
 *
 *     const DSN = import.meta.env.VITE_SENTRY_DSN
 *
 * at module scope with no optional chaining, so Vite folds it to `undefined`,
 * `if (!DSN) return` becomes statically dead, and Rollup drops the SDK.
 *
 * It is a one-character refactor away from silently breaking:
 * `import.meta.env.X?.trim()` still folds under Rollup but NOT under rolldown,
 * which put the entire SDK (+88 kB) back into a sibling repo's DSN-less bundle
 * with no other visible symptom. Hence this assertion in CI.
 *
 * Usage:
 *   node scripts/assert-bundle-without-dsn.mjs           # builds, then asserts
 *   node scripts/assert-bundle-without-dsn.mjs --no-build # asserts an existing dist/
 *
 * Runs fine under either `node` or `deno run -A` (both are exercised in CI —
 * see deno.json's `assert:no-sentry-without-dsn` task). Under Deno the build
 * step shells out to `deno task build` instead of `npm run build`, so this
 * script has no hard dependency on an `npm` binary being on PATH.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const distDir = join(repoRoot, 'dist');

/** Markers that only appear if some part of the Sentry SDK survived. */
const FORBIDDEN = ['captureException', 'sentry.io', '@sentry/', 'ingest.us.sentry'];

if (!process.argv.includes('--no-build')) {
  const [buildCmd, buildArgs] = globalThis.Deno
    ? ['deno', ['task', 'build']]
    : ['npm', ['run', 'build']];

  execFileSync(buildCmd, buildArgs, {
    cwd: repoRoot,
    stdio: 'inherit',
    // Explicitly empty, so a developer's exported DSN cannot make this pass.
    env: { ...process.env, VITE_SENTRY_DSN: '' },
  });
}

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);

    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const jsFiles = walk(distDir).filter((file) => file.endsWith('.js'));

if (jsFiles.length === 0) {
  console.error('no JS emitted to dist/ — did the build run?');
  process.exit(1);
}

const failures = [];
let totalBytes = 0;

for (const file of jsFiles) {
  const source = readFileSync(file, 'utf8');

  totalBytes += Buffer.byteLength(source);

  for (const marker of FORBIDDEN) {
    if (source.includes(marker)) {
      failures.push(`${file.slice(repoRoot.length + 1)} contains "${marker}"`);
    }
  }
}

const summary = `${jsFiles.length} JS file(s), ${totalBytes} bytes total`;

if (failures.length > 0) {
  console.error(`Sentry SDK leaked into a DSN-less bundle (${summary}):`);

  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }

  console.error(
    '\nTwo things keep the SDK out, and this failure means one of them stopped holding:\n' +
      '  1. `const DSN = import.meta.env.VITE_SENTRY_DSN` at module scope in\n' +
      '     src/lib/telemetry.js, with NO optional chaining, so `if (!DSN) return`\n' +
      '     folds to dead code. `import.meta.env.X?.trim()` folds under Rollup but\n' +
      '     not under rolldown.\n' +
      '  2. `initialized` being assignable only inside that dead branch, which is\n' +
      '     what lets the bundler drop `captureException` call sites too. If a\n' +
      '     bundler upgrade stopped proving that, drop the call sites rather than\n' +
      '     the guarantee.',
  );
  process.exit(1);
}

console.log(`OK: no Sentry code in the DSN-less bundle (${summary}).`);
