// check-lockfiles.mjs: package.json, package-lock.json and deno.lock must agree.
//
// This app is built two ways from one package.json: with npm (Cloudflare Pages,
// ci.yml, local dev) against package-lock.json, and with Deno (the container
// image: Dockerfile runs `deno install --frozen`) against deno.lock. `npm ci`
// already refuses a package.json that package-lock.json does not match. Nothing
// did the same for deno.lock, and it drifted: #68 added three dependencies and
// regenerated only the npm lockfile, so every container build after it would have
// died at `deno install --frozen` with "The lockfile is out of date", whatever the
// registry credentials. That failure only shows up in the publish workflow, which
// is run by hand, so it sat there unnoticed.
//
// This checks the part of what `deno install --frozen` checks that actually
// drifts, which is the SET of direct dependencies (a package added to or dropped
// from package.json but not from the lockfile), with no network, no token and no
// Deno needed. It compares by package name, not by version range: Deno writes
// ranges back in its own normal form (`^1.0.0` becomes `1`), and reproducing that
// here would be a second, wrong copy of semver. A range edited alone is still
// caught where it is cheap to: `npm ci` and `deno install --frozen` both refuse it.
//
//   node scripts/check-lockfiles.mjs
//
// It runs in the unit suite (src/lib/lockfiles.test.js).
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** @returns {string[]} what is wrong; empty when the lockfiles agree */
export function checkLockfiles(root = ROOT) {
  const problems = [];
  const read = (file) => JSON.parse(readFileSync(join(root, file), 'utf8'));

  const pkg = read('package.json');
  const direct = { ...pkg.dependencies, ...pkg.devDependencies };

  // deno.lock: the workspace's package.json dependencies, as `npm:<name>@<range>`.
  if (!existsSync(join(root, 'deno.lock'))) return ['deno.lock is missing'];
  const lockedNames = new Set(
    (read('deno.lock').workspace?.packageJson?.dependencies ?? []).map((spec) => /^npm:(@?[^@]+)@/.exec(spec)?.[1] ?? spec)
  );

  for (const name of Object.keys(direct).sort()) {
    if (!lockedNames.has(name)) problems.push(`deno.lock does not record ${name}, which package.json lists (run \`deno install --frozen=false\` with NODE_AUTH_TOKEN set, and commit deno.lock)`);
  }
  for (const name of [...lockedNames].sort()) {
    if (!(name in direct)) problems.push(`deno.lock records ${name}, which package.json no longer lists (run \`deno install --frozen=false\`)`);
  }

  // package-lock.json: its root entry is package.json as npm last saw it.
  if (existsSync(join(root, 'package-lock.json'))) {
    const rootEntry = read('package-lock.json').packages?.[''] ?? {};
    const npmDirect = { ...rootEntry.dependencies, ...rootEntry.devDependencies };
    for (const [name, range] of Object.entries(direct)) {
      if (npmDirect[name] !== range) problems.push(`package-lock.json has ${name}@${npmDirect[name] ?? '(nothing)'}, package.json wants ${range} (run \`npm install\`)`);
    }
    for (const name of Object.keys(npmDirect)) {
      if (!(name in direct)) problems.push(`package-lock.json still lists ${name}, which package.json no longer does (run \`npm install\`)`);
    }
  }

  return problems;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const problems = checkLockfiles();
  if (problems.length) {
    console.error(`Lockfile check failed:\n  - ${problems.join('\n  - ')}`);
    process.exit(1);
  }
  console.log('OK: package.json, package-lock.json and deno.lock list the same direct dependencies.');
}
