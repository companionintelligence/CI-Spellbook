# magic.ci.computer: the Cloudflare Pages deploy

<https://magic.ci.computer> is a **Cloudflare Pages** project named `spellbook`,
connected to this repository through Cloudflare's own Git integration (the
Cloudflare GitHub App). It is not deployed by a GitHub Actions workflow:
`.github/workflows/ci.yml` tests and smoke-builds, and both workflows here are
`workflow_dispatch`-only (see [`../CI.md`](../CI.md)). Pushing to `main` makes
Cloudflare build and publish it; every other branch gets a preview deployment.
The check you see on a commit named "Cloudflare Pages" is that build.

The container image the Hub App Store installs
(`ghcr.io/companionintelligence/ci-spellbook`) is a separate channel, built by the
`Dockerfile` and published by hand with `docker-publish.yml`. The two share the
source and nothing else: the site is not served from the image and the image is
not built by Pages.

## What is configured where

The build settings live in the Cloudflare dashboard (Workers & Pages >
`spellbook` > Settings), not in this repository, and the repo has no `wrangler.toml`
on purpose. The production branch and the custom domains were read from Wrangler
(`wrangler pages project list`) on 2026-10-04; the build command, output directory and
environment variables are **not visible from the repo or the CLI**, so the rest of this
table is what the repo needs them to be, to be checked in the dashboard:

| Setting | Should be | Where it comes from |
|---|---|---|
| Production branch | `main` | dashboard (observed) |
| Custom domain | `magic.ci.computer` (also `spellbook-cvk.pages.dev`) | dashboard (observed) |
| Build command | `npm run build` | dashboard |
| Build output directory | `dist` | dashboard |
| Node.js | 22 | [`.node-version`](../../.node-version), which Pages reads; the Dockerfile and `ci.yml` also use 22 |
| `NODE_AUTH_TOKEN` | a GitHub token that can read GitHub Packages | dashboard, **Variables and Secrets**, for production **and** preview |
| `GA_MEASUREMENT_ID` | optional: a GA4 measurement ID (`G-XXXXXXXX`), as a plain variable. Unset means no analytics | dashboard, **Variables**; see [Google Analytics](#google-analytics-opt-in) |

### `NODE_AUTH_TOKEN` is required, and its absence breaks every deploy

`package.json` depends on three **private** packages, `@companionintelligence/tokens`,
`config` and `assets` (the canon design layer from CI-Common). `.npmrc` points that
scope at `npm.pkg.github.com` and reads the credential from `${NODE_AUTH_TOKEN}`.
Without it, `npm ci` fails with `E401` on `@companionintelligence/tokens`
(reproduced from a clean clone with no token; with a token, install, build, lint and
tests all pass). The Pages build log itself is behind the dashboard login, so that
is the inferred cause, not a log line.

That is what happened after #68 (2026-09-11) added those packages: every
production deploy from then until 2026-10-30 failed, and the live site stayed on the last
build that succeeded (commit `3609c19`, 2026-08-13).

**Status (2026-10-30): fixed for production.** `NODE_AUTH_TOKEN` is set as a secret on the
Pages project's **Production** environment and the failed build of `7cb8c0b` was retried:
`npm ci` installed 414 packages, the build passed and `magic.ci.computer` now serves the
current `main` (the canon rebrand, the header, the new headline). The token is a *classic*
GitHub token named `cloudflare-pages-spellbook` (scope `read:packages` only, no expiry),
created by `mrhegemon`. The **Preview** environment has no secret yet, so preview
deployments of other branches still fail at `npm ci` until one is added.

To check or change it without the dashboard (secret values are never shown, only names):

```bash
wrangler pages secret list --project-name spellbook --env production
wrangler pages secret put NODE_AUTH_TOKEN --project-name spellbook --env preview   # value on stdin
```

Rotating the token: **do not use GitHub's "Regenerate token"** unless the Pages secret is
updated straight afterwards, because regenerating revokes the old value and the next build
fails with `E401` again. Create a new token first, update the secret, retry the latest
deployment, then delete the old token. A classic token is required: GitHub Packages (npm)
does not accept fine-grained tokens.

To set it up from scratch: in the Pages project, add `NODE_AUTH_TOKEN` as a **secret**
(production and preview) holding a classic GitHub token with `read:packages` for the
`companionintelligence` org, then retry the latest deployment. (Making the three
packages public, or consuming CI-Common's `ci-brand-<v>.tar.gz` release bundle
instead, would remove the need for a token; that is a CI-Common decision.)

Do not set `VITE_SENTRY_DSN` on Pages. Crash reporting asks `/api/config/telemetry`
before it starts, a static host has no such endpoint, and so the bundle stays silent
there either way; see [`error-reporting.md`](error-reporting.md).

## What the repo ships for Pages

| File | Does |
|---|---|
| `public/_headers` | The CSP, frame/referrer/permissions policy, HSTS, and cache lifetimes. The CSP allows no inline script or style and no third-party host, until a build is given `GA_MEASUREMENT_ID` (below). |
| `404.html` | Built as a second Vite entry. Its presence in `dist/` turns off Pages' single-page-app fallback, so an unknown path is a real `404` instead of the home page. The app has no client-side routes, so nothing needs the fallback. |
| `public/robots.txt`, `public/sitemap.xml` | Crawler files. The sitemap lists the one page. |
| `public/site.webmanifest`, `public/og-image.png`, icons | Web manifest (`display: standalone`, which is what lets browsers offer to install the site) and the 1200x630 share image. |
| `public/sw.js`, `public/offline/` | The service worker, and the page it shows when a page load has no network: `/offline/` with its stylesheet and its own copy of the mark. `_headers` serves `/sw.js` with `Cache-Control: no-cache`. The page is a folder, not `offline.html`, because Pages redirects `*.html` to the clean URL and a worker cannot answer a page load with a redirected response. The worker caches nothing but those three files and answers nothing the app requests, and the build fails if its `CACHE` name does not match a fingerprint of them (a browser fetches them again only when `sw.js` changes); see [the README](../../README.md#install-as-an-app-pwa), which also says how to roll it back (reverting the commit is not enough). |
| `index.html` | Canonical, Open Graph and Twitter tags, JSON-LD, and a `<noscript>` fallback with the heading, intro and the four links, for readers and crawlers that do not run JavaScript. |

`npm run build` checks all of these against [`src/lib/site.js`](../../src/lib/site.js)
(`scripts/assert-site.mjs`, run by the Vite build), so a deploy cannot go out with a
broken link, a canonical that points elsewhere, or a CSP that has been loosened.

Two things in the Cloudflare zone, not in this repo, interact with the page:

- **Rocket Loader** rewrites `<script type="module">` and delays the app. The entry
  script carries `data-cfasync="false"`, which opts it out; `vite.config.js` re-adds the
  attribute after Vite drops it, and the build checks it is there.
- **JavaScript Detections** injected an inline script into the live HTML (seen
  2026-10-04). The CSP does not allow inline script, so a browser will refuse it and log
  a violation. That costs Cloudflare bot scoring and nothing the page needs.

## Google Analytics (opt-in)

Analytics is a **build-time** option, driven by one variable. In the Pages project,
add `GA_MEASUREMENT_ID` (Variables, not Secrets: the ID is public in the page anyway)
holding the GA4 measurement ID, `G-XXXXXXXX`, then retry the deployment. That is all:
[`scripts/ga4.mjs`](../../scripts/ga4.mjs), a Vite plugin, then

- adds the gtag loader and `<script src="/ga-init.js">` to `index.html` and `404.html`,
  both with `data-cfasync="false"` so Rocket Loader leaves them alone;
- emits `dist/ga-init.js`, because the CSP forbids inline script (the init cannot be a
  `<script>` body);
- rewrites the CSP line of the built `dist/_headers`: `https://www.googletagmanager.com`
  in `script-src`, and `https://*.google-analytics.com`, `https://*.analytics.google.com`
  and `https://*.googletagmanager.com` in `connect-src` and `img-src`. No `unsafe-inline`,
  no other directive touched.

With the variable unset, or not shaped like `G-` plus capitals and digits (a typo prints a
warning in the build log and leaves analytics off), the output is byte for byte what the
repository holds: no tags, no `ga-init.js`, no Google host in the CSP. The build fails if
the output is half-way (tags without the CSP allowance, a tag twice, an ID that differs
between pages), and `npm run check:ga-build` proves the on, off and rebuild cases with real
builds. The ID is never committed; `npm run build` fails if a tag or ID is found in
`index.html` or `404.html`.

Why a variable on Pages rather than a GitHub Actions variable: this site is built by
Cloudflare's Git integration, not by a workflow (see the top of this page), so the
dashboard is the only place its build environment exists. The container image is built by
the Dockerfile, which does not forward `GA_MEASUREMENT_ID`, so it stays analytics-free and
`nginx/default.conf` (which sets no CSP) never has to allow a Google host. Only the
process environment is read, not `.env` files, because the Docker build context contains
them.

To confirm it on the live site, after setting the variable and redeploying:

```bash
curl -s https://magic.ci.computer/ | grep -c 'googletagmanager.com/gtag/js'          # 1
curl -s https://magic.ci.computer/ga-init.js                                          # gtag('config','G-...')
curl -sI https://magic.ci.computer/ | grep -i content-security-policy | grep -c googletagmanager   # 1
```

## Checking a deploy

After a deploy (or after fixing `NODE_AUTH_TOKEN`), these should all hold:

```bash
# The new build is live: the favicon is an image, not the old SPA fallback page.
curl -sI https://magic.ci.computer/logo/favicon-32.png | grep -i '^content-type'   # image/png
# Metadata is in the served HTML, not just in the app.
curl -s https://magic.ci.computer/ | grep -c 'rel="canonical"'                       # 1
curl -s https://magic.ci.computer/ | grep -o 'https://ci.computer/core'              # appears
# Real 404s and real crawler files.
curl -s -o /dev/null -w '%{http_code}\n' https://magic.ci.computer/does-not-exist     # 404
curl -s https://magic.ci.computer/robots.txt | head -3                               # User-agent: *
# Headers.
curl -sI https://magic.ci.computer/ | grep -i -E '^(content-security-policy|x-frame-options|strict-transport)'
# Hashed assets are cached for a year.
curl -sI "https://magic.ci.computer$(curl -s https://magic.ci.computer/ | grep -o '/assets/main-[^"]*\.js' | head -1)" | grep -i cache-control
```

If the favicon check returns `text/html`, the live site is still the stale build.

The service worker and the offline page, which make the site installable:

```bash
curl -sI https://magic.ci.computer/sw.js | grep -i -E '^(HTTP|content-type|cache-control)'   # 200, a JavaScript type, no-cache
curl -s -o /dev/null -w '%{http_code}\n' https://magic.ci.computer/offline/                   # 200
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://magic.ci.computer/offline    # 308 https://magic.ci.computer/offline/
```

`/sw.js` is the file no cache may hold on to: if the first command shows a `max-age` instead of `no-cache`, something in the zone is overriding `_headers`, and a changed worker will reach browsers late. Then the browser-level checks, which install the worker in Chrome, ask Chrome whether the site is installable, go offline and come back (they need a Playwright browser, `npx playwright install chromium`):

```bash
PWA_URL=https://magic.ci.computer npx playwright test --project=pwa
```

The kill-switch test in that file skips itself against a deployed site.

## Previewing the Pages behaviour locally

Wrangler's Pages emulator applies `_headers` and the 404 rules to a build:

```bash
npm run build
npx wrangler pages dev dist --port 8788
```

Note that it writes `.wrangler/` into the working directory (git-ignored).

`node tests/support/serve-dist.mjs` is the lighter option the PWA tests use: it serves `dist/` with the rules of `dist/_headers`, Pages' redirect of `*.html` to the clean URL, and the 404 page, and nothing else.

## The container image

`docker-publish.yml` builds the image with `deno install --frozen`, which fails when
`deno.lock` does not match `package.json`. `npm run check:lockfiles` (part of
`npm run test:unit`) catches that before it reaches the image build. After changing
dependencies, regenerate both lockfiles:

```bash
npm install                                          # package-lock.json
NODE_AUTH_TOKEN=... deno install --frozen=false      # deno.lock
```

and commit them together. Deno seeds its resolution from `package-lock.json`, so the two
land on the same versions; `npm run check:lockfiles` fails if a direct dependency or any
`@companionintelligence/*` package resolves differently in the two (before it did, the
Pages bundle and the container shipped different design tokens from the same commit). The image takes the same `NODE_AUTH_TOKEN`, as a BuildKit
secret (see the Dockerfile).
