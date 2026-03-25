# CI-Spellbook Agent Guide

## Summary
CI-Spellbook is a Vite + React front-end for card-driven markdown exploration. Playwright is used for end-to-end testing.

## Local Setup
```bash
npm install
```

## Dev Server
```bash
npm run dev
```
The dev server runs on `http://localhost:5503` (see `vite.config.js`).

## Tests
```bash
npm test
```
Notes:
- Playwright runs against the dev server using the `webServer` config in `playwright.config.js`.
- The first time on a new machine, install browsers:
```bash
npx playwright install
```

## Build
```bash
npm run build
```
Output goes to `dist/` for deployment.

## CI and Deploy
GitHub Actions workflow: `.github/workflows/ci.yml`
- Runs Playwright tests on PRs and on `main`.
- Deploys to Cloudflare Pages on `main` if tests pass.

Required GitHub Secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PAGES_PROJECT` (Pages project name)

## Repo Map
- `src/` app source
- `public/` static assets
- `tests/` Playwright tests
- `playwright.config.js` Playwright configuration
- `vite.config.js` Vite configuration

## Working Conventions
- Prefer existing `npm` scripts over custom commands.
- Keep test fixtures deterministic for Playwright runs.
- Do not change ports without updating `playwright.config.js`.
