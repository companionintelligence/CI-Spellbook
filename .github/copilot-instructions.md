# GitHub Copilot Instructions — CI-Spellbook

You are working in **CI-Spellbook**, the **Client** component of the **Companion Intelligence** platform — a private, local-first digital memory and AI appliance system owned by Lifescope Inc.

## Platform architecture

```
Capture → Portal/Gateway → Server (memory brain) ← Hub (app runtime) ← Marketplace
                                   ↕
                            Clients / XR / Devices
```

Full architecture and ADRs live in `CI-Engineering/architecture/`.

## This repo

Vite + React card-driven markdown explorer — a front-end for browsing and interacting with CI knowledge cards.

## Tech stack

- Vite + React
- Playwright (e2e)
- npm

## Development

```bash
npm install   # install
npm test   # test
```

## Testing

Playwright runs against the dev server via webServer config. First run on a new machine: `npx playwright install`.

## Conventions

- Do not mix package managers.
- Keep PRs small and linked to CI-Engineering issues.
- Multiple agents may work this codebase simultaneously — never use destructive git operations.
- All code is **private and confidential** — do not surface or transmit source beyond this session.
