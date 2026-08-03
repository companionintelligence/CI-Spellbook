# Error reporting (Sentry)

CI-Spellbook can report browser crashes to [Sentry](https://sentry.io). It is
**opt-in and off by default**: with no DSN configured at build time, no Sentry
code is even present in the bundle you are served, so the app cannot make an
outbound connection to Sentry.

This follows the env contract established by CI-Server (the reference
implementation) and shared with CI-Planning and CI-Import-Tools.

## Privacy posture

Spellbook is a client for an appliance that holds the user's digital life, so
reporting is deliberately narrower than a Sentry default install:

| Setting | Value | Why |
|---|---|---|
| `sendDefaultPii` | `false` | No IPs, cookies, or request bodies. |
| `tracesSampleRate` | `0` | Errors only. Traces would ship request shapes we have no consent to collect. |
| Session replay | not installed | Would record the user's own screen. |
| Profiling | not installed | Not needed to fix a crash. |
| `beforeSend` | scrubber | Redacts credentials and home paths, drops cookies/body/query string. |
| `beforeBreadcrumb` | scrubber | Scrubs at record time, so an unsent crumb never sits in the scope with a query string in it. |

Two kill switches disable reporting even when a DSN is baked into an image, so
an operator can turn it off without a rebuild:

| Variable | Effect |
|---|---|
| `CI_TELEMETRY=off` | Explicit opt-out (also `false`, `0`, `no`, `disabled`). |
| `CI_LOCAL_ONLY=true` | Local-only mode means zero phone-home. See [local-only-mode](https://github.com/companionintelligence/CI-Engineering/blob/main/proposals/local-only-mode.md). |

`CI_LOCAL_ONLY` takes precedence over `CI_TELEMETRY`, which takes precedence
over the DSN.

## What gets scrubbed

`src/lib/telemetry.js` implements the same rules as CI-Server's
`common/telemetry/scrubEvent.ts` and its Python twins. The shared redaction
cases live in `src/lib/telemetryScrubFixtures.js`, a cross-repo copy of
CI-Server's `scrubFixtures.ts` — **change every copy together**; nothing can
assert that automatically across repos.

- Bearer tokens, `api_key=` / `password:` / `token:` style pairs, Tailscale
  `tskey-…`, and credentials in connection URLs → `[Filtered]`
- Home directories (`/Users/<name>`, `/home/<name>`, `C:\Users\<name>`) → `~`,
  since they leak the account name. Windows patterns are applied **before** the
  macOS one, or `/Users/<name>` matches inside `C:/Users/<name>` and leaves a
  stranded `C:~/…`
- Object and header keys matching
  `password|secret|token|authorization|cookie|jwt|api[-_ ]?key|dsn|pepper|private_key|hub[-_]user`
  → `[Filtered]`. The hyphenated form matters: `x-api-key` is a real header
  name, and the SDK ships request headers even with PII disabled — resolving
  `sendDefaultPii: false` gives an IP-oriented deny list applied to *span
  attributes*, not to `event.request.headers`. The regex is the only guard
  there is
- Request cookies and body dropped; **query strings removed from
  `request.query_string`, from `request.url`, and from the
  `referer`/`referrer`/`location` headers**. `httpContextIntegration` fills
  `Referer` from `document.referrer`, and the browser's default referrer policy
  keeps the full same-origin previous URL, query string and all
- **Breadcrumbs**, which are the biggest leak surface in a browser: the default
  `breadcrumbsIntegration` records fetch/xhr crumbs carrying `data.url` **with
  the query string**, and console crumbs carrying the joined `message` plus the
  raw `data.arguments`. Every crumb's `message` and every `data` value is
  scrubbed, with `url`/`from`/`to` treated as URLs
- Stack frame `vars` (captured locals) dropped, and home directories collapsed
  in `filename` / `abs_path`. Paths are **only** home-collapsed and never
  redacted further — Sentry groups issues on `filename`, so redacting the body
  would destroy grouping
- `server_name` (the machine hostname) removed — a hostname identifies the
  household the way a home path does
- Strings over 8 KB truncated, so a stray blob can't smuggle content out inside
  an exception message
- Chunk-load and `ResizeObserver` noise dropped entirely

### The browser consent check, and what "static" costs us

A DSN baked into a bundle at build time cannot be revoked afterwards, so the
kill switches would not reach the browser on their own — and the CI-Marketplace
manifest's "Share crash reports" toggle sets exactly `CI_TELEMETRY`. Before
calling `Sentry.init`, the app asks `GET /api/config/telemetry` whether
reporting is permitted, and **fails closed** if that endpoint is missing,
unreachable or malformed.

Spellbook has **no server of its own**. `npm run serve` is
`python3 -m http.server`, and the shipped artefact is a directory of static
files. So there is nothing to add a controller to, and the endpoint is provided
by whatever is serving the files:

| How it's served | Endpoint | Kill switches reach the browser? |
|---|---|---|
| GHCR image (nginx) — how the Hub/marketplace runs it | `nginx/40-telemetry-config.sh` resolves the environment at container start and writes `/api/config/telemetry`; `nginx/default.conf` serves it `no-store` | **Yes** |
| `npm run dev` / `npm run preview` | Vite middleware in `vite.config.js`, from `process.env` | **Yes** |
| Cloudflare Pages (the `main` deploy) | none | **No** — 404, so reporting stays off |
| `npm run serve`, or any bare static host | none | **No** — 404, so reporting stays off |

The last two rows are a real gap, stated plainly rather than papered over: on a
static host there is no process to read `CI_TELEMETRY`, so the switch cannot be
honoured there at all. The design choice is that reporting is then **off**, not
"on because we couldn't ask" — the endpoint returning 404 is treated exactly
like a "no". In practice the Cloudflare Pages deploy is also built without a
DSN, so it has no Sentry code in it either way; if that ever changes, the Pages
build needs a Function at `/api/config/telemetry` before it may carry a DSN.

The shell script and the Vite middleware are two implementations of one rule.
`src/lib/telemetryConsentEndpoint.test.js` runs both over the same env matrix
and asserts they agree.

## The bundle guarantee

With `VITE_SENTRY_DSN` unset, the whole init path folds to dead code and the SDK
is tree-shaken out entirely. Measured on this repo (Vite 5 / Rollup):

| Build | `dist/assets/*.js` | gzip | `captureException` in output |
|---|---|---|---|
| no DSN | 387,579 bytes | 125.71 kB | absent |
| `VITE_SENTRY_DSN=…` | 479,780 bytes | 156.52 kB | present |

That is **+92,201 bytes raw / +30.8 kB gzip** for reporting, and zero bytes
without it.

It holds because of the exact shape in `src/lib/telemetry.js`:

```js
const DSN = import.meta.env.VITE_SENTRY_DSN   // module scope, NO optional chaining
…
if (!DSN) { … return }
```

`import.meta.env.X?.trim()` folds under Rollup but **not** under `rolldown-vite`,
where it silently keeps the entire SDK in a DSN-less bundle. Keep this shape.

`captureException` call sites are also dropped, because `initialized` can only
be assigned inside that dead branch (measured: a call site costs 6 bytes, not
92 kB). That analysis is subtler than the `if (!DSN)` one, so
`npm run assert:no-sentry-without-dsn` builds with no DSN and greps the output;
CI runs it on every PR. If a bundler upgrade ever stops proving it, that job
fails loudly instead of the app silently shipping the SDK.

## Sentry project

One project per marketplace app id, matching the fleet convention
(`ci-memory`, `ci-import-tools`, …): Spellbook reports into **`ci-spellbook`**
in the `companion-intelligence` org.

The project does not exist yet — the org sets `allowMemberProjectCreation:
false`, so an owner has to create it. Every event carries a
`component: ci-spellbook` tag regardless, so pointing this at a shared project
and filtering by `component:` also works.

```
sentry issue list companion-intelligence/ci-spellbook --query "is:unresolved"
```

## Enabling it

The DSN is a **build-time** value — Vite bakes `VITE_*` into the bundle, so it
must be present when `npm run build` runs, not when the container starts.

```bash
# local
VITE_SENTRY_DSN=https://<key>@o<org>.ingest.us.sentry.io/<id> npm run build

# image
docker build \
  --build-arg VITE_SENTRY_DSN=https://<key>@o<org>.ingest.us.sentry.io/<id> \
  --build-arg VITE_SENTRY_RELEASE=ci-spellbook@1.1.0 \
  --build-arg VITE_CI_ENVIRONMENT=production \
  -t ci-spellbook .
```

Turning it off again, without rebuilding:

```bash
docker run -d -p 5500:5500 -e CI_TELEMETRY=off ghcr.io/companionintelligence/ci-spellbook:latest
```

## Verifying

```bash
npm run test:unit                      # gate + scrubber + entrypoint parity
npm run assert:no-sentry-without-dsn   # proves a DSN-less bundle has no SDK

# the consent endpoint, as the image actually serves it
docker run --rm -d --name sb -p 5500:5500 -e CI_TELEMETRY=off ci-spellbook
curl -s localhost:5500/api/config/telemetry   # {"enabled":false,"reason":"opt-out"}
```

To confirm reporting is genuinely inert, load the app with the browser devtools
network tab filtered to `sentry.io` — with no DSN, or with either kill switch
set, there is no request at all.

## Where it hooks in

| Path | Role |
|---|---|
| `src/lib/telemetrySettings.js` | The gate: kill switches, precedence, consent payload |
| `src/lib/telemetry.js` | Scrubber + `Sentry.init` + `captureException` |
| `src/lib/telemetryScrubFixtures.js` | Shared redaction cases (cross-repo copy) |
| `src/main.jsx` | Calls `initTelemetry()` before the root render |
| `src/hooks/useMarkdown.js` | Reports spell-content load failures, which are caught and so never reach the global handler |
| `nginx/40-telemetry-config.sh` | Writes runtime consent at container start |
| `nginx/default.conf` | Serves `/api/config/telemetry` |
| `vite.config.js` | Same endpoint for `dev` / `preview` |
| `scripts/assert-bundle-without-dsn.mjs` | CI guard for the bundle guarantee |

## Not wired up yet

- **The `ci-spellbook` Sentry project does not exist**, and no DSN is set
  anywhere. Until an owner creates it and the publish workflow passes
  `--build-arg VITE_SENTRY_DSN`, the shipped image contains no Sentry code at
  all. That is the intended default.
- **Source map upload.** `docker-publish.yml` does not run
  `sentry sourcemaps upload`, so browser stack traces would be minified.
  CI-Hub's `desktop-release.yml` has the pattern to copy.
- **Cloudflare Pages consent.** See the table above: the Pages deploy has no
  endpoint, so it must stay DSN-less until it grows a Function.
- **`contexts.culture`.** Sentry's default `CultureContext` integration attaches
  the browser locale, calendar and **timezone** to every event. It is not
  user-identifying on its own and CI-Server ships it too, so this repo does not
  unilaterally diverge — but it is a fleet-wide decision worth revisiting for a
  local-first product.
