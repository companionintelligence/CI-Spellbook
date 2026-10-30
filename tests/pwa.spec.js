import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { test as base, chromium, expect } from '@playwright/test';

import { isKillSwitch } from '../scripts/assert-site.mjs';
import { serveDist } from './support/serve-dist.mjs';

// The installable build in a real browser. The dev server never registers the service worker
// (src/lib/serviceWorker.js), so this is the only place a regression in what a browser does with
// it can show: a CSP that blocks the worker, a manifest Chrome stops accepting, a worker that
// starts answering for the app, an offline page that needs something it did not cache.
//
//   npx playwright test --project=pwa                                         # builds dist/ and serves it
//   PWA_URL=https://magic.ci.computer npx playwright test --project=pwa       # a deployed site instead
//
// Local runs are served with the production headers (tests/support/serve-dist.mjs).

const REMOTE = process.env.PWA_URL ? new URL(process.env.PWA_URL).origin : null;

// With the kill switch as the /sw.js under test the worker has been retired on purpose (README:
// Rolling back), so there is nothing to install and these checks do not apply. A local run is
// retired when public/sw.js is the kill switch. Against PWA_URL it is the /sw.js the site serves
// that decides, not this checkout: a checkout of a retired repo must not turn a run against a
// site that still ships the worker into a green run that tested nothing.
const RETIRED_LOCALLY = isKillSwitch(readFileSync(join(process.cwd(), 'public/sw.js'), 'utf8'));

const test = base.extend({
  /** The origin under test, shared by the tests of a worker. */
  origin: [
    async ({}, use) => {
      if (REMOTE) return use(REMOTE);
      const site = await serveDist();
      await use(site.origin);
      await site.close();
    },
    { scope: 'worker' }
  ],

  /** Whether the worker under test is the kill switch. */
  retired: [
    async ({ origin }, use) => {
      if (!REMOTE) return use(RETIRED_LOCALLY);
      const response = await fetch(`${origin}/sw.js`).catch(() => null);
      await use(response?.ok ? isKillSwitch(await response.text()) : false);
    },
    { scope: 'worker' }
  ],

  // Every test is skipped, with the reason, when it is.
  _skipWhenRetired: [
    async ({ retired }, use, testInfo) => {
      testInfo.skip(retired, 'the /sw.js under test is the kill switch: the service worker is retired');
      await use();
    },
    { auto: true }
  ],

  // A persistent profile, not Playwright's default context: in a default (incognito-style)
  // context Chrome reports "in-incognito" as the only installability error and says nothing
  // about the real ones.
  context: async ({ origin }, use) => {
    const profile = mkdtempSync(join(tmpdir(), 'spellbook-pwa-'));
    const context = await chromium.launchPersistentContext(profile, { baseURL: origin, viewport: { width: 412, height: 915 } });
    await use(context);
    await context.close();
    rmSync(profile, { recursive: true, force: true });
  }
});

/** Load the site and wait until a worker has installed, activated and is the one answering the page. */
async function install(page, url = '/') {
  await page.goto(url);
  await page.waitForFunction(async () => (await navigator.serviceWorker.getRegistration())?.active?.state === 'activated', null, {
    polling: 250,
    timeout: 20_000
  });
  // A load is controlled only if the worker was in charge when it started, so a reload that
  // raced the activation is tried again rather than waited on.
  await expect(async () => {
    await page.reload();
    expect(await page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  }).toPass({ timeout: 20_000 });
}

/** Cache Storage as { cache name: sorted paths }. */
const cacheContents = (page) =>
  page.evaluate(async () => {
    const out = {};
    for (const name of await caches.keys()) {
      out[name] = (await (await caches.open(name)).keys()).map((request) => new URL(request.url).pathname).sort();
    }
    return out;
  });

const firstCard = (page) => page.locator('[id^="card-"]').first();

test('registers /sw.js with the whole origin as its scope, under the production CSP', async ({ page, origin }) => {
  const response = await page.goto('/');
  // The CSP is the point of testing a served build: the worker has to load under it.
  expect(response?.headers()['content-security-policy']).toContain("script-src 'self'");

  await install(page);
  const worker = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    return { scope: registration?.scope, script: registration?.active?.scriptURL, state: registration?.active?.state };
  });
  expect(worker).toEqual({ scope: `${origin}/`, script: `${origin}/sw.js`, state: 'activated' });
});

test('Chrome finds nothing that stops the app being installed', async ({ page, context }) => {
  await install(page);

  const client = await context.newCDPSession(page);
  await client.send('Page.enable');
  const { installabilityErrors } = await client.send('Page.getInstallabilityErrors');
  expect(installabilityErrors).toEqual([]);
});

test('caches the offline page, its stylesheet and its own mark, and nothing else', async ({ page }) => {
  await install(page);
  await expect(firstCard(page)).toBeVisible({ timeout: 15_000 }); // the app has loaded everything it loads

  const contents = await cacheContents(page);
  expect(Object.keys(contents)).toHaveLength(1);
  expect(Object.keys(contents)[0]).toMatch(/^ci-spellbook-offline-[0-9a-f]{12}$/);
  expect(Object.values(contents)[0]).toEqual(['/offline/', '/offline/mark.svg', '/offline/offline.css']);
});

test('answers the page load and nothing the app loads, the header brand mark included', async ({ page }) => {
  await install(page);

  const answered = [];
  const requested = [];
  page.on('response', (response) => {
    const path = new URL(response.url()).pathname;
    requested.push(path);
    if (response.fromServiceWorker()) answered.push(path);
  });
  await page.reload();
  await expect(firstCard(page)).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('header img.brand-mark')).toBeVisible();

  // The mark in the header is /logo/mark.svg. The worker once cached it, and a cached answer is
  // never revalidated, so after a rebrand an installed browser kept painting the old logo.
  expect(requested).toContain('/logo/mark.svg');
  expect(requested.some((path) => path.startsWith('/markdown/'))).toBe(true);
  expect(answered).toEqual(['/']); // the page load itself, network first
});

test('a page load with no network shows the offline page, styled and with its mark; back online it loads the app', async ({ page, context }) => {
  await install(page);

  await context.setOffline(true);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Spellbook is offline' })).toBeVisible();
  // Its stylesheet and mark came out of the cache: with no network nothing else could supply them.
  expect(await page.evaluate(() => getComputedStyle(document.body).display)).toBe('grid');
  const mark = page.locator('main img');
  await expect(mark).toHaveAttribute('src', '/offline/mark.svg');
  expect(await mark.evaluate((img) => /** @type {HTMLImageElement} */ (img).complete && /** @type {HTMLImageElement} */ (img).naturalWidth > 0)).toBe(true);
  // The catalog is not cached: it fails instead of being answered with something old. (no-store
  // skips the browser's own HTTP cache, which the app has just filled; the worker is not that.)
  expect(await page.evaluate(() => fetch('/markdown/ai-agents.md', { cache: 'no-store' }).then(() => 'answered', () => 'failed'))).toBe('failed');

  await context.setOffline(false);
  await page.getByRole('link', { name: 'Try again' }).click();
  await expect(firstCard(page)).toBeVisible({ timeout: 15_000 });
});

test('docs/operations/service-worker-kill-switch.js retires an installed worker and its cache', async ({ page }) => {
  test.skip(Boolean(REMOTE), 'needs a local copy of dist/ to redeploy /sw.js into');

  // A throwaway copy of the build, so the test can "deploy" a different /sw.js.
  const copy = mkdtempSync(join(tmpdir(), 'spellbook-dist-'));
  cpSync(join(process.cwd(), 'dist'), copy, { recursive: true });
  const site = await serveDist({ dist: copy });
  try {
    await install(page, `${site.origin}/`);
    expect(Object.keys(await cacheContents(page))).toHaveLength(1);

    writeFileSync(join(copy, 'sw.js'), readFileSync(join(process.cwd(), 'docs/operations/service-worker-kill-switch.js')));
    await page.evaluate(() => navigator.serviceWorker.getRegistration().then((registration) => registration?.update()));

    await expect
      .poll(() => page.evaluate(async () => (await navigator.serviceWorker.getRegistration()) === undefined), { timeout: 20_000 })
      .toBe(true);
    expect(await cacheContents(page)).toEqual({});
  } finally {
    await site.close();
    rmSync(copy, { recursive: true, force: true });
  }
});
