# CI-Spellbook

## Confidentiality
Private and confidential. Copyright Companion Intelligence - Lifescope Inc.

## Summary
Spellbook is a searchable catalog of local-AI and self-hosting tools, from model managers and MCP connectors to home servers, networking and edge hardware. It is sixteen shelves, each a markdown table, organized by the job you are doing rather than by vendor. Search runs in the browser across every shelf.

It is published at <https://magic.ci.computer> and ships as a container image for the Companion Hub App Store. Every page links back to Companion Intelligence (<https://ci.computer>), to the app's page in the docs, and to the two calls to action every Companion site carries (**Buy Companion Core** at <https://ci.computer/core>, **Download Companion** at <https://ci.computer/download>). Those URLs and the page's public copy are written once, in [`src/lib/site.js`](src/lib/site.js); see [Checks](#checks).

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

## Where it runs

| Channel | What | How it is built |
|---|---|---|
| <https://magic.ci.computer> | The public site: a Cloudflare Pages project connected to this repository. Cloudflare builds and deploys it itself; no workflow in this repo does. | `npm run build` to `dist/`, with `NODE_AUTH_TOKEN` set in the Pages project (the canon packages are private). See [`docs/operations/cloudflare-pages.md`](docs/operations/cloudflare-pages.md). |
| `ghcr.io/companionintelligence/ci-spellbook` | The container the Hub App Store installs (nginx on port 5500). | The `Dockerfile` (Deno), published by `docker-publish.yml`, which is started by hand. |

`.github/workflows/ci.yml` tests and smoke-builds; it does not deploy. Both workflows are `workflow_dispatch`-only (see [`docs/CI.md`](docs/CI.md)).

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
npm run test:unit                    # vitest: the app rendered in jsdom, markdown safety, shelf loading,
                                     #   the debug-panel regression, the site and lockfile checks, telemetry
npx playwright test                  # smoke tests in a real browser (starts the dev server itself)
APP_URL=http://localhost:5500 \
  npx playwright test --config=tests/container/playwright.config.ts   # against a running container
```

## Checks

| Command | What it fails on |
|---|---|
| `npm run build` | A page whose static copy of the links or copy has drifted from [`src/lib/site.js`](src/lib/site.js): the metadata, the `<noscript>` fallback, `404.html`, `robots.txt`, `sitemap.xml`, the web manifest, the CSP in `public/_headers` (it must not allow inline script or style), and the four cross-links. It runs inside the Vite build ([`scripts/assert-site.mjs`](scripts/assert-site.mjs)), so the Pages build and the Docker build run it too. |
| `npm run check:lockfiles` | `package.json`, `package-lock.json` and `deno.lock` listing different dependencies. The Docker build runs `deno install --frozen`, which refuses a stale `deno.lock`. After changing dependencies: `NODE_AUTH_TOKEN=... deno install --frozen=false`, and commit `deno.lock` with `package-lock.json`. |
| `npm run lint:content` | A shelf with the wrong table shape, raw HTML, or a link that is not `https`. |
| `npm run check:links` | A catalog link that is gone. Networked, so run on purpose rather than on every push; with `GITHUB_TOKEN` set it also reports archived and renamed GitHub repos. |
| `npm run lint:canon` | A brand colour off the canon, or a brand file under `public/` that differs from `@companionintelligence/assets`. |

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

Each shelf is one markdown file in `public/markdown/`, named after its title (`ai-agents.md`, `mcp-servers.md`, ...), and one entry in `CARD_CONFIGS` in `src/App.jsx`. A shelf is a title, a one-line `>` blurb, and tables of `Tool | Description | Platforms | Notes`; `npm run lint:content` holds it to that. To add a shelf, add the file and the entry.

The `id` and `containerId` in `CARD_CONFIGS` are stable keys, not descriptions: the video storyboard and the `#shelf-...` anchors address cards by them, so they keep their historical names where a shelf has since been retitled (`xr-spatial` is the Desktop Systems shelf).

The markdown directory is copied into the build by Vite (`publicDir`), so edits ship with the next deploy or image build. The shelf art lives in `src/assets/background/` (WebP, imported so Vite fingerprints it). `archive/` holds retired content that is intentionally **not** shipped; `dev-tools/` holds the catalog checks and some manual browser debug helpers.

A tool listed on two shelves is two rows and one tool; the "N tools" the page prints counts distinct links.

## Design

Colour and type come from the canon token package, [`@companionintelligence/tokens`](https://github.com/companionintelligence/CI-Common) (CI-Common): `src/styles.css` imports its `tokens.css`, and this is a dark-only surface (`<html class="dark">`). The page font is the canon stack (Manrope, then the system UI font); no webfont files are shipped, so it renders in the system font unless Manrope is installed. The one palette that is not canon is each shelf's accent, in `CARD_CONFIGS`.

The logo, icons and favicons under `public/` are verified copies of `@companionintelligence/assets`, not originals: change them in CI-Common, then `npm run brand:sync`. `npm run lint:canon` fails if one has drifted. The 1200x630 share image, `public/og-image.png`, is Spellbook's own (CI-Common's `assets/og/` has no Spellbook image yet).

The page uses no analytics. If Google Analytics is ever added, the CSP in `public/_headers` must be extended to the hosts it loads from; it deliberately allows none today.
