import { test, expect } from '@playwright/test';

// The shelves are public/markdown/<slug>.md. The slugs follow the shelf titles
// (see CARD_CONFIGS in src/App.jsx); these three were the ones added after the
// original thirteen.
const SHELF_FILES = ['mcp-servers.md', 'evals-observability.md', 'embeddings-vector.md'];

test('app loads and shows at least one card', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Spellbook/i);
  const cards = page.locator('[id^="card-"]');
  await expect(cards.first()).toBeVisible({ timeout: 15000 });
});

test('markdown is served', async ({ page }) => {
  const res = await page.request.get('/markdown/developer-tooling.md');
  expect(res.ok()).toBeTruthy();
  const body = await res.text();
  expect(body).toContain('Claude Code');
});

test('new category markdown is served', async ({ page }) => {
  for (const file of SHELF_FILES) {
    const res = await page.request.get(`/markdown/${file}`);
    expect(res.ok(), `${file} should be served`).toBeTruthy();
    const body = await res.text();
    expect(body.startsWith('# '), `${file} should start with an H1 title`).toBeTruthy();
  }
});

test.describe('links to the main site', () => {
  const LINKS = [
    ['Companion Intelligence', 'https://ci.computer'],
    ['Docs', 'https://docs.ci.computer/docs/apps-available/first-party-apps/spellbook'],
    ['Download Companion', 'https://ci.computer/download'],
    ['Buy Companion Core', 'https://ci.computer/core']
  ];

  for (const [label, href] of LINKS) {
    test(`"${label}" goes to ${href} from the header and the footer, in the same tab`, async ({ page }) => {
      await page.goto('/');
      for (const region of ['header', 'footer']) {
        const link = page.locator(region).getByRole('link', { name: label, exact: true }).first();
        await expect(link, `${region} link`).toBeVisible();
        await expect(link).toHaveAttribute('href', href);
        await expect(link).not.toHaveAttribute('target', /.+/);
      }
    });
  }

  test('the calls to action are reachable at phone width without sideways scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Buy Companion Core' }).first()).toBeInViewport();
    await expect(page.getByRole('link', { name: 'Download Companion' }).first()).toBeInViewport();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe('accessibility basics', () => {
  test('one h1, a main landmark, and a skip link that works', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to the shelves' });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main#shelves')).toBeFocused();
  });

  test('a shelf opens from the keyboard, moves focus in, and gives it back on Escape', async ({ page }) => {
    await page.goto('/');
    const open = page.locator('button.card-open-btn').first();
    await open.focus();
    await expect(open).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Enter');
    await expect(open).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.fullscreen-close-btn')).toBeFocused();
    await expect(page.locator('.group.expanded .markdown-body table').first()).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(open).toHaveAttribute('aria-expanded', 'false');
    await expect(open).toBeFocused();
  });

  test('closed shelves keep their links out of the tab order', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('button.card-open-btn')).toHaveCount(16);
    // Nothing is rendered behind a closed face; what is there is inert.
    await expect(page.locator('.card-back a[href]')).toHaveCount(0);
    await expect(page.locator('.card-back:not([inert])')).toHaveCount(0);
  });
});

test.describe('search', () => {
  test('a backtick or a tilde can be typed into the search field', async ({ page }) => {
    await page.goto('/');
    const search = page.getByRole('textbox', { name: 'Search the Spellbook' });
    await search.click();
    await page.keyboard.type('~/.config `x`');
    await expect(search).toHaveValue('~/.config `x`');
  });

  test('finds a tool and shows the shelves that hold it', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Search the Spellbook' }).fill('ollama');
    await expect(page.locator('.search-snippet-subtitle').first()).toContainText('hit');
    expect(await page.locator('#cards-container .group').count()).toBeLessThan(16);
  });
});

test.describe('first load', () => {
  test('does not fetch the shelf art for every card up front', async ({ page }) => {
    const art = [];
    page.on('response', (r) => {
      if (/\/background\d+[-.].*\.(webp|png|jpe?g)/.test(r.url())) art.push(r.url());
    });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', { waitUntil: 'networkidle' });
    // Thirteen images back sixteen shelves; native lazy loading fetches only those
    // near the viewport, where the old inline backgrounds fetched all of them.
    expect(art.length).toBeLessThan(13);
  });
});
