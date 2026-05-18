import { test, expect } from '@playwright/test';

test('app loads and shows at least one card', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Spellbook|CI/i);
  const cards = page.locator('[id^="card-"]');
  await expect(cards.first()).toBeVisible({ timeout: 15000 });
});

test('markdown is served', async ({ page }) => {
  const res = await page.request.get('/markdown/AI-Assisted%20Code%20Development.md');
  expect(res.ok()).toBeTruthy();
  const body = await res.text();
  expect(body).toContain('Claude Code');
});
