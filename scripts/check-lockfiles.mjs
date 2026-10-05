// check-lockfiles.mjs: package.json, package-lock.json and deno.lock must agree.
//
// This app is built two ways from one package.json: with npm (Cloudflare Pages,
// ci.yml, local dev) against package-lock.json, and with Deno (the container
// image: Dockerfile runs `deno install --frozen`) against deno.lock. `npm ci`
// already refuses a package.json that package-lock.json does not match. Nothing
// did the same for deno.lock, and it drifted twice.
//
// First, #68 added three dependencies and regenerated only the npm lockfile, so
// every container build after it would have died at `deno install --frozen` with
// "The lockfile is out of date", whatever the registry credentials. That failure
// only shows up in the publish workflow, which is run by hand, so it sat there
// unnoticed.
//
// Second, once deno.lock was regenerated it resolved the private canon packages
// (tokens, assets, config) to newer releases than package-lock.json did, so the
// Pages bundle and the container shipped different design-token CSS (41,095 vs
// 44,915 bytes, different :root and .dark blocks) from one commit. Both lockfiles
// were internally valid, and `deno install --frozen` accepts that, because it
// checks that the lock matches package.json, not that it matches the npm lock.
//
// So this checks three things, with no network, no token and no Deno needed:
//
//   1. the SET of direct dependencies is the same in package.json, package-lock.json
//      and deno.lock (a package added to or dropped from one but not the others);
//   2. package-lock.json records each direct dependency's range as package.json
//      writes it;
//   3. the two lockfiles RESOLVE to the same version for every direct dependency
//      and for every @companionintelligence/* package, direct or transitive. Those
//      are the packages whose files ship (the brand tokens and assets), and the
//      runtime dependencies are all direct ones, so this is the set where a
//      silent difference changes what a reader gets. Transitive dev tooling
//      (eslint's tree, esbuild's per-platform binaries) is allowed to differ: it
//      never reaches the bundle, and Deno and npm do not always pick the same
//      optional packages.
//
// Names are compared as names, ranges are not compared across files: Deno writes
// ranges back in its own normal form, and reproducing that here would be a second,
// wrong copy of semver. A range edited alone is caught where it is cheap to:
// `npm ci` and `deno install --frozen` both refuse it.
//
// To move the canon packages: edit package.json, run `npm install`, then
// `deno install --frozen=false` (Deno seeds its resolution from package-lock.json,
// so the two end up on the same versions), and commit both lockfiles.
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

  // Resolved versions. npm: node_modules/<name>.version. Deno: `specifiers` maps
  // `npm:<name>@<range>` to `<version>[_<peer suffix>]`; `npm` keys every package it
  // locked as `<name>@<version>[_<peer suffix>]`.
  if (existsSync(join(root, 'package-lock.json'))) {
    const npmPackages = read('package-lock.json').packages ?? {};
    const denoLock = read('deno.lock');

    const npmVersions = (name) =>
      new Set(
        Object.entries(npmPackages)
          .filter(([path]) => path === `node_modules/${name}` || path.endsWith(`/node_modules/${name}`))
          .map(([, entry]) => entry.version)
      );
    const denoVersions = (name) =>
      new Set(
        Object.keys(denoLock.npm ?? {})
          .map((key) => /^(@?[^@]+)@([^_]+)/.exec(key))
          .filter((m) => m?.[1] === name)
          .map((m) => m[2])
      );
    const show = (versions) => (versions.size ? [...versions].sort().join(', ') : '(nothing)');
    const same = (a, b) => a.size === b.size && [...a].every((v) => b.has(v));

    // Every direct dependency: the one version npm hoisted to the top against the
    // one version Deno's specifier resolved to.
    const reported = new Set();
    for (const name of Object.keys(direct).sort()) {
      const npmVersion = npmPackages[`node_modules/${name}`]?.version;
      const specifier = Object.entries(denoLock.specifiers ?? {}).find(([spec]) => spec.startsWith(`npm:${name}@`));
      const denoVersion = specifier?.[1].split('_')[0];
      if (npmVersion && denoVersion && npmVersion !== denoVersion) {
        reported.add(name);
        problems.push(`${name} resolves to ${npmVersion} in package-lock.json but ${denoVersion} in deno.lock, so the Pages bundle and the container would not ship the same code (run \`npm install\`, then \`deno install --frozen=false\`)`);
      }
    }

    // The brand canon, whole: tokens and assets are what ship, and config and content
    // come with them.
    const canon = new Set(
      [...Object.keys(npmPackages), ...Object.keys(denoLock.npm ?? {})]
        .map((key) => /(@companionintelligence\/[^@/_]+)/.exec(key)?.[1])
        .filter(Boolean)
    );
    for (const name of [...canon].sort()) {
      if (reported.has(name)) continue;
      const a = npmVersions(name);
      const b = denoVersions(name);
      if (!same(a, b)) {
        problems.push(`${name} is ${show(a)} in package-lock.json but ${show(b)} in deno.lock: the Pages bundle and the container would ship different brand files (run \`npm install\`, then \`deno install --frozen=false\`)`);
      }
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
  console.log('OK: package.json, package-lock.json and deno.lock list the same direct dependencies and resolve them, and the canon packages, to the same versions.');
}
