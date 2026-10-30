import { execFileSync } from 'node:child_process';

import { test } from '@playwright/test';

// The first step of the `pwa` project (playwright.config.js): tests/pwa.spec.js runs against
// a production build, which is the only build that registers the service worker. It is
// built here, once per run, rather than assumed to be in dist/, so the checks are never
// run against a stale one. The build also runs scripts/assert-site.mjs.
test('build the production bundle that tests/pwa.spec.js runs against', () => {
  test.setTimeout(240_000);
  execFileSync('npm', ['run', 'build'], { stdio: 'inherit', env: { ...process.env, GA_MEASUREMENT_ID: '' } });
});
