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

test('new category markdown is served', async ({ page }) => {
  const files = [
    'MCP Servers & Connectors.md',
    'Evaluation, Observability & Tracing.md',
    'Embeddings & Vector Pipelines.md'
  ];
  for (const file of files) {
    const res = await page.request.get(`/markdown/${encodeURIComponent(file)}`);
    expect(res.ok(), `${file} should be served`).toBeTruthy();
    const body = await res.text();
    expect(body.startsWith('# '), `${file} should start with an H1 title`).toBeTruthy();
  }
});
