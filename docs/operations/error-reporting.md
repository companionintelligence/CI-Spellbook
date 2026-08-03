# Error reporting (Sentry)

CI-Spellbook reports browser crashes to [Sentry](https://sentry.io). It is
**opt-out**: on any build configured with a DSN, reporting is **on by default**,
and the user turns it off with the **Share crash reports** toggle in the app
store (or `CI_TELEMETRY=off` on the container directly).

Two statements are both true here and easy to conflate:

- **Configured with a DSN → reporting is on** unless the user turns it off. That
  is the shipped appliance: release images carry a DSN.
- **No DSN → nothing initialises**, and no Sentry code is even present in the
  bundle you are served, so the app cannot make an outbound connection. That is
  a source checkout, `npm run dev`, or any build made without `VITE_SENTRY_DSN`.
  It is the absence of configuration, not a privacy setting.

So "opt-out" describes what a user of the appliance experiences. It does not
mean a DSN-less build quietly reports — it cannot.

One caveat is specific to this repo and is not cosmetic: Spellbook is a static
bundle with **no server of its own**, so on a host that serves nothing but files
there is no process to answer the consent check, and reporting stays **off**
there even with a DSN baked in. The opt-out default therefore holds for the
container image and for `npm run dev`, and does *not* hold on a bare static
host. See
[The browser consent check](#the-browser-consent-check-and-what-static-costs-us)
for the full picture.

This follows the env contract established by CI-Server (the reference
implementation) and shared with CI-Planning and CI-Import-Tools.

## Turning it off

Three controls, in precedence order — the first that applies wins:

| # | Control | Effect |
|---|---|---|
| 1 | `CI_LOCAL_ONLY=true` on the container | Local-only mode means zero phone-home. Beats everything, including a baked-in DSN. |
| 2 | **Share crash reports** toggle in the app store, or `CI_TELEMETRY=off` | The marketplace toggle sets exactly `CI_TELEMETRY` on this container. Also `false`, `0`, `no`, `disabled`. |
| 3 | Build without `VITE_SENTRY_DSN` | Not a user-facing setting — with no DSN there is no SDK in the bundle to disable. |

```bash
docker run -d -p 5500:5500 -e CI_TELEMETRY=off \
  ghcr.io/companionintelligence/ci-spellbook:latest
```

Neither 1 nor 2 needs a rebuild: the bundle asks `GET /api/config/telemetry` on
every page load, so an operator can revoke reporting on an image whose DSN was
fixed at build time.

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

| How it's served | Endpoint | Is the opt-out default honoured? |
|---|---|---|
| GHCR image (nginx) — how the Hub/marketplace runs it | `nginx/40-telemetry-config.sh` resolves the environment at container start and writes `/api/config/telemetry`; `nginx/default.conf` serves it `no-store` | **Yes** — on by default with a DSN, and both kill switches reach the browser |
| `npm run dev` / `npm run preview` | Vite middleware in `vite.config.js`, from `process.env` | **Yes** — same rule, resolved from `process.env` |
| Cloudflare Pages (the `main` deploy) | none | **No** — the check 404s, so reporting stays **off** even with a DSN |
| `npm run serve`, or any bare static host | none | **No** — same 404, same result |

The last two rows are where this repo genuinely departs from the fleet's
opt-out posture, and the gap is stated plainly rather than glossed: on a bare
static host there is no process to read `CI_TELEMETRY`, so the switch cannot be
honoured there at all. Given that, the design keeps failing **closed** — a 404
is treated exactly like a "no", so those deployments report nothing. Reporting
"because we could not ask" would mean sending crashes an operator has no way to
switch off, which is worse than the default being wrong in one direction.

In practice the Cloudflare Pages deploy is also built without a DSN, so today it
has no Sentry code in it either way and the distinction is theoretical. If that
ever changes, the Pages build needs a Function at `/api/config/telemetry` before
it may carry a DSN — otherwise it would ship an unswitchable reporter.

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

Once a DSN is baked in, reporting is on for that image without any further
step — see [Turning it off](#turning-it-off) for how a user or operator switches
it back off, no rebuild required.

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
  all — so the opt-out default has nothing to act on yet. This is unconfigured,
  not a privacy choice; wiring the DSN into `docker-publish.yml` is what turns
  the documented posture into the shipped one.
- **Source map upload.** `docker-publish.yml` does not run
  `sentry sourcemaps upload`, so browser stack traces would be minified.
  CI-Hub's `desktop-release.yml` has the pattern to copy.
- **Cloudflare Pages consent.** See the table above: the Pages deploy has no
  endpoint, so it must stay DSN-less until it grows a Function. This is the one
  place the opt-out default does not reach, and it is the reason it must stay
  DSN-less rather than merely being expected to.
- **`contexts.culture`.** Sentry's default `CultureContext` integration attaches
  the browser locale, calendar and **timezone** to every event. It is not
  user-identifying on its own and CI-Server ships it too, so this repo does not
  unilaterally diverge — but it is a fleet-wide decision worth revisiting for a
  local-first product.
