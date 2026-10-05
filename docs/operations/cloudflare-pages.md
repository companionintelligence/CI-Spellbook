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

### `NODE_AUTH_TOKEN` is required, and its absence breaks every deploy

`package.json` depends on three **private** packages, `@companionintelligence/tokens`,
`config` and `assets` (the canon design layer from CI-Common). `.npmrc` points that
scope at `npm.pkg.github.com` and reads the credential from `${NODE_AUTH_TOKEN}`.
Without it, `npm ci` fails with `E401` on `@companionintelligence/tokens@1.0.0`
(reproduced from a clean clone with no token; with a token, install, build, lint and
tests all pass). The Pages build log itself is behind the dashboard login, so that
is the inferred cause, not a log line.

That is what happened after #68 (2026-09-11) added those packages: every
production deploy since has failed, and the live site stayed on the last build that
succeeded (commit `3609c19`, 2026-08-13). Anything merged since, including the canon
rebrand, the licence change and the fixes in the PR that wrote this page, is not
live until the variable is set and the build is retried.

To fix it: in the Pages project, add `NODE_AUTH_TOKEN` as a **secret** (production
and preview) holding a GitHub token with `read:packages` for the
`companionintelligence` org, then retry the latest deployment. (Making the three
packages public, or consuming CI-Common's `ci-brand-<v>.tar.gz` release bundle
instead, would remove the need for a token; that is a CI-Common decision.)

Do not set `VITE_SENTRY_DSN` on Pages. Crash reporting asks `/api/config/telemetry`
before it starts, a static host has no such endpoint, and so the bundle stays silent
there either way; see [`error-reporting.md`](error-reporting.md).

## What the repo ships for Pages

| File | Does |
|---|---|
| `public/_headers` | The CSP, frame/referrer/permissions policy, HSTS, and cache lifetimes. The CSP allows no inline script or style and no third-party host. |
| `404.html` | Built as a second Vite entry. Its presence in `dist/` turns off Pages' single-page-app fallback, so an unknown path is a real `404` instead of the home page. The app has no client-side routes, so nothing needs the fallback. |
| `public/robots.txt`, `public/sitemap.xml` | Crawler files. The sitemap lists the one page. |
| `public/site.webmanifest`, `public/og-image.png`, icons | Web manifest and the 1200x630 share image. |
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

If Google Analytics is ever added, extend the CSP in `public/_headers` to the hosts it
loads from. It allows none now because the page has none.

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

## Previewing the Pages behaviour locally

Wrangler's Pages emulator applies `_headers` and the 404 rules to a build:

```bash
npm run build
npx wrangler pages dev dist --port 8788
```

Note that it writes `.wrangler/` into the working directory (git-ignored).

## The container image

`docker-publish.yml` builds the image with `deno install --frozen`, which fails when
`deno.lock` does not match `package.json`. `npm run check:lockfiles` (part of
`npm run test:unit`) catches that before it reaches the image build. After changing
dependencies, regenerate both lockfiles:

```bash
npm install                                          # package-lock.json
NODE_AUTH_TOKEN=... deno install --frozen=false      # deno.lock
```

and commit them together. The image takes the same `NODE_AUTH_TOKEN`, as a BuildKit
secret (see the Dockerfile).
