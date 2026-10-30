import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // tests/container has its own config and needs a running container (APP_URL)
  testIgnore: '**/container/**',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5500',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      // A project's own testIgnore replaces the one above, so the container folder is repeated.
      // tests/pwa.spec.js has its own projects below: it needs a production build.
      testIgnore: ['**/container/**', '**/pwa.spec.js'],
      use: { ...devices['Desktop Chrome'] },
    },
    // tests/pwa.spec.js: the installable build in a real browser. The dev server below never
    // registers the service worker, so pwa-build makes a production build first and the spec
    // serves it with the production headers (tests/support/serve-dist.mjs). PWA_URL runs the
    // same checks against a deployed site instead:
    //   PWA_URL=https://magic.ci.computer npx playwright test --project=pwa
    { name: 'pwa-build', testMatch: '**/pwa.build.js' },
    { name: 'pwa', testMatch: '**/pwa.spec.js', dependencies: process.env.PWA_URL ? [] : ['pwa-build'] },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5500',
    reuseExistingServer: true,
  },
});
