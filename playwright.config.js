import { defineConfig, devices } from '@playwright/test';

// PWA_URL points tests/pwa.spec.js at a deployed site instead of a local build. Then nothing
// local is needed: no dev server, no build, and no other project (they test the dev server).
const REMOTE = Boolean(process.env.PWA_URL);

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

  // tests/pwa.spec.js: the installable build in a real browser. The dev server below never
  // registers the service worker, so pwa-build makes a production build first and the spec
  // serves it with the production headers (tests/support/serve-dist.mjs). Against a deployed
  // site (PWA_URL=https://magic.ci.computer npx playwright test --project=pwa) there is only
  // the pwa project.
  projects: REMOTE
    ? [{ name: 'pwa', testMatch: '**/pwa.spec.js' }]
    : [
        {
          name: 'chromium',
          // A project's own testIgnore replaces the one above, so the container folder is repeated.
          // tests/pwa.spec.js has its own projects: it needs a production build.
          testIgnore: ['**/container/**', '**/pwa.spec.js'],
          use: { ...devices['Desktop Chrome'] },
        },
        { name: 'pwa-build', testMatch: '**/pwa.build.js' },
        { name: 'pwa', testMatch: '**/pwa.spec.js', dependencies: ['pwa-build'] },
      ],

  webServer: REMOTE
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:5500',
        reuseExistingServer: true,
      },
});
