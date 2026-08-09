# CI-Spellbook

## Confidentiality
Private and confidential. Copyright Companion Intelligence - Lifescope Inc.

## Summary
CI-Spellbook is the front-end experience for the Companion Intelligence product line, focused on card-driven content exploration and rich markdown presentation.

## Quick Start
```bash
npm install
npm run dev   # Vite dev server on http://localhost:5500
```

### Deno

The same app also runs under [Deno](https://deno.com) via its npm compat layer
— no source rewrite, `deno.json` mirrors the npm scripts as `deno task`s:

```bash
deno install   # populates node_modules from package.json, same deps npm would
deno task dev  # Vite dev server on http://localhost:5500
deno task build
deno task test:unit   # vitest
deno task test        # playwright (see note below)
deno task check       # deno's built-in TypeScript checker over the JSX/JS source
```

`deno task check` is new — this repo had no type checking of any kind before.
It runs against the plain `.js`/`.jsx` sources directly via `checkJs` +
`allowJs` (see `deno.json`'s `compilerOptions` and the sibling
`tsconfig.json`, kept for editors/other TS tooling that reads `tsconfig.json`
specifically rather than `deno.json`).

Known gap: `deno task test` (Playwright) currently fails to load
`playwright.config.js` under Deno — Playwright's ESM config loader depends on
Node's `node:module.register()` custom-loader hook, which Deno 2.9's Node
compat does not implement yet. `npm test` / `npx playwright test` still work
normally under real Node. See the deno-migration PR for details.

## Run with Docker

A public multi-arch (amd64/arm64) image is published to GHCR. nginx serves the
built site on port **5500** inside the container:

```bash
docker run -d --name ci-spellbook -p 5500:5500 \
  ghcr.io/companionintelligence/ci-spellbook:latest
# open http://localhost:5500
```

To build the image locally:

```bash
docker build -t ci-spellbook .
docker run -d -p 5500:5500 ci-spellbook
```

## Tests

```bash
npm run test:unit                    # vitest unit tests (telemetry gate + scrubber)
npx playwright test                  # smoke tests (starts the dev server itself)
APP_URL=http://localhost:5500 \
  npx playwright test --config=tests/container/playwright.config.ts   # against a running container
```

## Error reporting

Crash reporting is **opt-out**: on a build configured with a DSN it is **on by
default**, and `CI_TELEMETRY=off` or `CI_LOCAL_ONLY=true` on the container turn
it off without a rebuild (the app-store **Share crash reports** toggle sets the
former). With no `VITE_SENTRY_DSN` set at build time — a source checkout, `npm
run dev`, or any unconfigured build — the Sentry SDK is tree-shaken out of the
bundle entirely, so there is nothing to switch off and the app cannot phone
home.

Spellbook serves no API of its own, so on a bare static host (Cloudflare Pages,
`npm run serve`) the consent check 404s and reporting stays off regardless.

See [`docs/operations/error-reporting.md`](docs/operations/error-reporting.md).

## Content

Spell content lives in `public/markdown/*.md`; each card in `src/App.jsx`
(`CARD_CONFIGS`) points at one markdown file. The markdown directory is copied
into the image at build time by Vite (`publicDir`), so new spells ship with the
next image build. `archive/` holds retired content that is intentionally **not**
shipped; `dev-tools/` holds manual browser debug helpers.

## Design Tokens

### Colors
Usage guidance: define primary/secondary accents and set background/text colors via CSS variables in `src/styles.css`.

```
  #3784ff
  #4290e3
  #071533
  #bea9ff
  #34344e
  #433c59
  #624b6d
  #593c52
  #6d456b
  #3351ab
  #495a8b
  #3a3f6c
  #09436d
  #117ba0
  #60d9ff
  #82ffff
  #079d99
  #0f717a
  #1d5f6e
  #244859
  #2c676d
  #409b9b
  #58ebbf
  #85c3b4
  #abd4d8
  #d2f6ff
```

### Fonts
Brand guidance (not currently wired into the UI, which uses the system font stack):
- Miriam Mono CLM: headings and data labels
- Lekton: body copy and long-form markdown
