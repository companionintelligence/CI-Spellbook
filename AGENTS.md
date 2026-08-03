# AGENTS.md — CI-Spellbook

## Platform context

CI-Spellbook is the **Client** layer component of the Companion Intelligence platform — a private, local-first digital memory system.

Full architecture: `CI-Engineering/architecture/architecture.md`

## Repo summary

Vite + React card-driven markdown explorer — a front-end for browsing and interacting with CI knowledge cards.

## Stack

- Vite + React
- Playwright (e2e)
- npm

## Setup & commands

```bash
npm install   # install
npm run dev   # dev
npm test   # test
npm run build   # build
```

## Testing

Playwright runs against the dev server via webServer config. First run on a new machine: `npx playwright install`.

`npm run test:unit` runs the Vitest unit suite (telemetry gate + scrubber). Error
reporting is opt-out — on by default once a DSN is baked in — and the Sentry SDK
must still stay tree-shaken out of a DSN-less build; `npm run
assert:no-sentry-without-dsn` enforces that. See
`docs/operations/error-reporting.md`.

## Git discipline

- Never `git reset --hard` or `git clean -f` without user confirmation.
- Commit messages: imperative mood, ≤ 72 chars.
- Reference CI-Engineering issues in PRs (e.g. `Closes companionintelligence/CI-Engineering#32`).

## Confidentiality

Private & Confidential — Property of Lifescope Inc. Do not distribute.
