# ANTIGRAVITY.md — CI-Spellbook

## Context

**CI-Spellbook** — **Client** layer of the Companion Intelligence platform (Lifescope Inc).

Architecture: `CI-Engineering/architecture/architecture.md`
Roadmap: `CI-Engineering/architecture/roadmap.md`

## Purpose

Vite + React card-driven markdown explorer — a front-end for browsing and interacting with CI knowledge cards.

## Stack

- Vite + React
- Playwright (e2e)
- npm

## Commands

```bash
npm install
npm run dev
npm test
```

## Rules

- Package manager: do not switch or mix.
- Destructive git operations (`reset --hard`, `clean -f`) require explicit user confirmation.
- Commits reference CI-Engineering issues.
- All content is **private and confidential** — Property of Lifescope Inc.
