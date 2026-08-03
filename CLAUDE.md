# CLAUDE.md — CI-Spellbook

> **Private & Confidential — Property of Lifescope Inc. Do not distribute.**

## Platform role

**CI-Spellbook** sits in the **Client** layer of the Companion Intelligence platform.

Architecture: `CI-Engineering/architecture/architecture.md`
Roadmap: `CI-Engineering/architecture/roadmap.md`
Issues: <https://github.com/companionintelligence/CI-Engineering/issues>

## What this repo does

Vite + React card-driven markdown explorer — a front-end for browsing and interacting with CI knowledge cards.

## Stack

- Vite + React
- Playwright (e2e), Vitest (units)
- npm

## Key commands

```bash
# Install dependencies
npm install

# Start development server / service
npm run dev

# Run tests
npm run test:unit   # vitest units
npm test            # Playwright smoke

# Build for production
npm run build
```

## Error reporting

Opt-in Sentry, off by default; the SDK is tree-shaken out of a DSN-less build.
Do not change the module-scope `const DSN = import.meta.env.VITE_SENTRY_DSN` in
`src/lib/telemetry.js` — `npm run assert:no-sentry-without-dsn` (and CI) will
fail if you do. See `docs/operations/error-reporting.md`.

## Package manager

**npm** — use exclusively; do not mix with npm/yarn/pnpm/bun unless the repo explicitly requires it.

## Cross-repo connections

- Reads data from CI-Server
- Dev server at http://localhost:5500 (see vite.config.js)
- Deployed to Cloudflare Pages on main (GitHub Actions)

## Testing

Playwright runs against the dev server via webServer config. First run on a new machine: `npx playwright install`.

## Multi-agent safety

Multiple AI agents work these repos in parallel. Never use `git reset --hard`, `git clean -f`, or any destructive git command without explicit confirmation from the user.

## Confidentiality

Private & Confidential — Property of Lifescope Inc. Do not distribute.
