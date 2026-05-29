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
- Playwright (e2e)
- npm

## Key commands

```bash
# Install dependencies
npm install

# Start development server / service
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

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
