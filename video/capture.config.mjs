/**
 * Capture stage for Spellbook (CI-Spellbook).
 *
 * `ci-video capture` drives the REAL app through this config, so whatever it
 * takes to get a brand-new user to a filmable screen belongs here: the base
 * URL, any pre-authenticated session, route mocks, and seeding.
 *
 * ── What this app actually is ────────────────────────────────────────────────
 * A static Vite + React SPA (`src/App.jsx`). There is no backend, no login and
 * nothing to seed: the 16 categories are hard-coded in `CARD_CONFIGS` and their
 * bodies are markdown files served straight out of `public/markdown/`.
 * So there is no `storageState`, no `route()` stubbing and no fixture step —
 * the whole stage is `npm run dev` on port 5500 (`vite.config.js`).
 *
 * ── There is NO client router ────────────────────────────────────────────────
 * No react-router dependency, no history.pushState anywhere in src/. Every
 * screen worth filming is a STATE of the single URL "/", so every shot in
 * storyboard.json uses `path: "/"` and drives the UI through `capture.before`
 * (click / fill), never through navigation.
 *
 * ── Determinism hazards found in this repo ───────────────────────────────────
 *
 * 1. SEARCH-INDEX RACE — the real one.
 *    `App.jsx` builds a MiniSearch index in a useEffect: it fetches all 16
 *    markdown files, then calls `addAll`. While `isIndexing` is true the header
 *    renders "Indexing spellbook for search…" (App.jsx:401), and the "No
 *    results" panel is suppressed entirely (App.jsx:411 — it requires
 *    `!isIndexing && !indexError`). `waitUntil: "networkidle"` covers the
 *    fetches but not the synchronous `addAll` that follows, so every shot polls
 *    that banner away in a `before: [{ eval: ... }]` step before the shutter.
 *    Without it the first-run shot randomly ships a status banner and the
 *    no-results shot randomly captures an empty grid.
 *
 * 2. REACT STRICTMODE DOUBLE EFFECT — `src/main.jsx` wraps <App/> in
 *    <React.StrictMode>, so in dev the index effect runs twice and every
 *    markdown file is fetched twice. The `cancelled` guard keeps the result
 *    correct, but it roughly doubles the time to a stable first paint. That is
 *    why the settles here are generous rather than the kit's 350ms default.
 *
 * 3. THE CARD FLIP IS 0.7s — `.card-inner { transition: transform 0.7s }`
 *    (src/styles.css:41) plus `fadeInContent 0.5s ease-out 0.3s` on the
 *    expanded body (src/styles.css:367). The kit's FREEZE_CSS zeroes both and
 *    `page.screenshot({ animations: "disabled" })` finishes them, but Card.jsx
 *    also calls `scrollIntoView({ behavior: "smooth" })` on a 100ms setTimeout
 *    (Card.jsx:30-35) — a real timer that no CSS override touches. An explicit
 *    `behavior: "smooth"` argument beats FREEZE_CSS's `scroll-behavior: auto`,
 *    and Playwright's `reducedMotion: "reduce"` does not veto it either.
 *
 *    Measured, it does NOT mis-frame the deep shot: a later instant
 *    `scrollIntoView` aborts the in-flight smooth scroll (CSSOM-View: a scroll
 *    on a scrolling box cancels any ongoing smooth scroll of that box), so
 *    `card-ai-agents-deep` lands on the RAG heading either way. What it DOES
 *    cost is byte-determinism: over six runs at 1280x720 the smooth scroll was
 *    still unwinding when the instant one fired and nudged the final position
 *    by 2-3px, which is a dirty PNG diff on a UI nobody touched.
 *
 *    So the three clicking shots monkey-patch `Element.prototype.scrollIntoView`
 *    to force `behavior: "instant"` BEFORE the click that triggers it. Same
 *    resting frame, reached in one paint: measured drift is then exactly 0px at
 *    both viewports. The generous settles (1200ms) stay as belt-and-braces.
 *
 * 4. HOVER-STATE BLEED — `.group:not(.expanded):hover` lifts a card 4px
 *    (styles.css:386) and Card.jsx:134 fades in a bright `hoverColor` overlay
 *    via Tailwind's `group-hover:opacity-100`. capture.mjs creates ONE Playwright
 *    `page` per viewport and loops every shot on it, so the mouse stays wherever
 *    the previous shot's `click` left it — `page.goto` resets the DOM but NOT the
 *    cursor. Shot order is therefore load-bearing, and adding a clicking shot
 *    silently repaints grid PNGs that nobody edited.
 *
 *    Parking the cursor with `{ hover: <logo> }` does NOT fix this, and the
 *    obvious version of that fix is actively wrong: `page.hover` scrolls its
 *    target into view, so any shot that scrolls AFTERWARDS drags a fresh card
 *    under the stationary cursor. Measured on the real stage, the logo-park
 *    version of `shelf-self-hosting` came back with the leftmost card lit in its
 *    hover colour, at both viewports.
 *
 *    The rule that actually holds — stated precisely, because the earlier
 *    wording here ("every shot ENDS its `before` list with it") was never what
 *    the storyboard implemented and a contributor following it literally would
 *    reorder almost every shot in the file. Every shot contains
 *      { eval: "() => { ...<style>#cards-container{pointer-events:none!important}</style>... }" }
 *    and it must sit BEFORE the first step that changes what is under the mouse
 *    — i.e. before any `scroll` / `scrollIntoView` / `fill` — and AFTER any
 *    `click` (a card with pointer-events:none cannot be clicked). Steps that
 *    only reframe or type may follow it; it is a precedence rule, not a
 *    last-line rule. An element with `pointer-events: none` is not a hit-test
 *    target, so `:hover` cannot match it no matter where the mouse is. That
 *    makes every shot order-independent, and it photographs the resting state a
 *    user sees when they are not pointing at a card — not a synthetic one.
 *
 *    Verified rather than assumed: driving the whole shot list through the real
 *    0.1.2 capture loop at both viewports, `document.querySelectorAll('.group')`
 *    matching `:hover` was 0 in all 18 frames of that run (the storyboard had
 *    nine shots then; it has 11 now).
 *
 * 4b. EVERY `eval` MUST BE AN ARROW FUNCTION, never a bare statement.
 *    video-kit 0.1.2 stopped passing the source to `page.evaluate` verbatim and
 *    now wraps it (capture.mjs `evalSource`):
 *      (async () => { const __r = (<src>); if (typeof __r === "function") await __r(); })()
 *    Two consequences bit every shot in this file:
 *      - a statement — `foo();` or `var n = ...; if (...) throw ...` — is not a
 *        valid parenthesised expression, so the whole shot dies with
 *        "SyntaxError: Unexpected token ';'" / "Unexpected token 'var'";
 *      - a bare `new Promise(...)` parses, but a Promise is not a function, so
 *        the wrapper never awaits it and the step becomes a silent no-op.
 *    `() => { ... }` and `() => new Promise(...)` are correct under the wrapper
 *    in both cases: the value IS a function, so it is called and awaited.
 *
 * 5. THE DEBUG PANEL is the only surface in the app carrying wall-clock
 *    timestamps, live FPS and JS heap size (`useDebugPanel.js` — FPS on a rAF
 *    loop, memory on a 1s interval, `toLocaleTimeString()` stamps). It is
 *    hidden by default and toggled with the ` / ~ key, so it should never be in
 *    frame — but every shot masks `aside[aria-label='Debug panel']` anyway. A
 *    zero-match mask costs nothing and stops a future default-on change from
 *    silently poisoning every PNG.
 *
 * 6. SYSTEM FONTS — this app ships NO webfont. index.html uses Tailwind's
 *    `font-sans` (the system UI stack) and `src/styles.css:249` asks for
 *    'JetBrains Mono' / 'Fira Code' in code blocks, neither of which is
 *    installed anywhere. Glyphs therefore resolve differently on macOS and on
 *    the ubuntu-latest runner. Captures are byte-stable per platform, NOT
 *    across platforms: let the workflow produce the committed shots, and expect
 *    a one-time diff if you ever refresh them from a laptop.
 *
 * 7. NOT A HAZARD ANY MORE — the older scouting note for this repo is stale.
 *    Tailwind is no longer loaded from cdn.tailwindcss.com: `src/styles.css`
 *    now starts with `@import "tailwindcss"`, `vite.config.js` runs
 *    `@tailwindcss/vite`, highlight.js CSS is bundled via `src/main.jsx`, and
 *    index.html links no external stylesheet or font. Grepping index.html and
 *    src/ for `https?://` turns up only SVG xmlns URLs and Sentry DSNs inside
 *    unit-test fixtures. Capture works on a fully blocked network — the
 *    requestfailed warning below is a tripwire, not a dependency.
 *
 * 8. TELEMETRY — `src/lib/telemetry.js` initialises Sentry only when a
 *    VITE_SENTRY_DSN was baked in at build time. `npm run dev` with no DSN
 *    tree-shakes the SDK out entirely, so capture makes no outbound calls. If
 *    you ever film a DSN-carrying build, set CI_TELEMETRY=off on the stage.
 *
 * 9. THE STALE-STAGE TRIPWIRE, and why it is there. Back when the PNGs were
 *    committed they were once of the wrong build: `library-first-run.png` showed
 *    row 1 as Developer Tooling / AI Agents / **Local AI Apps & Model Managers**,
 *    which is the 13-card layout from before the catalog rebuild (`git show
 *    3c82950^:src/App.jsx`). Those captures had come from a stale `dist/` or a
 *    published container via APP_URL, not from `npm run dev` on current source.
 *
 *    The shots are no longer committed at all (#37): every render re-shoots from
 *    `npm run dev` on current source, so a stale `dist/` cannot reach the cut.
 *    Row 1 of a correct capture reads Developer Tooling & Code Assistants /
 *    AI Agents, Research & Models / MCP Servers & Connectors.
 *
 *    The tripwire is permanent, because the failure was silent: `library-first-run`
 *    asserts `#cards-container .group` count === 16 in a `before` eval. capture.mjs
 *    runs `before` steps through `page.evaluate` and records a throw as a per-shot
 *    failure, so a stale stage aborts that shot with a visible ✗ instead of
 *    quietly writing a wrong PNG. Re-capture ONLY against `npm run dev` at the
 *    repo root on current main — never `dist/`, never a container APP_URL.
 *
 *    Per hazard 6, re-shooting on a different OS than the last capture changes
 *    every PNG on font rendering alone. That is a baseline shift, not drift.
 *
 * 10. NOTHING CAPTURES IN CI, BY DESIGN — and a missing PNG never fails a build.
 *    video-kit renders a branded "capture pending" slate for any shot whose PNG
 *    is missing (scenes.mjs `slateUri`), so `build` and `check` pass with no
 *    captures at all. Since #37 stopped committing the shots, that is not an
 *    edge case here: a clean clone has ZERO PNGs, so a render without a capture
 *    pass silently produces a cut made entirely of slates that passes the gate.
 *    Never render this product without `--capture` (or via `./video/make.sh`,
 *    which always captures first).
 *
 *    There is no video workflow in this repo any more — `.github/workflows/`
 *    holds only ci.yml and docker-publish.yml. The old one could never have
 *    worked anyway: it died at `Install video project` with
 *      403 Forbidden - GET .../@companionintelligence%2fvideo-kit
 *      permission_denied: read_package
 *    because the package is private and linked to repo CI-Common, so this
 *    repo's GITHUB_TOKEN was denied regardless of scope. The video is now built
 *    on a laptop instead, and no token is needed at all: make.sh runs the kit's
 *    bin straight out of the CI-Common checkout on disk. See video/README.md.
 */
export default {
  baseURL: process.env.APP_URL ?? "http://localhost:5500",

  // CI apps are dark-first. Pinned locale/timezone/clock keep captures stable.
  // Spellbook renders nothing date-derived, so the frozen clock is belt-and-
  // braces here rather than load-bearing.
  colorScheme: "dark",
  locale: "en-US",
  timezoneId: "UTC",
  fixedTime: "2026-06-15T15:04:00Z",

  // No login wall — nothing to pre-authenticate.
  // storageState: "./.auth/state.json",

  async onContext(context, { viewport }) {
    // Nothing to seed or stub: the catalog is static files under public/.
    // Warn loudly if an external asset fails — an unstyled capture looks like a
    // UI regression but is really a network failure. Per hazard 7 this should
    // stay silent; if it ever fires, something re-introduced a CDN dependency.
    context.on("requestfailed", (req) => {
      if (/fonts\.(googleapis|gstatic)|cdn\.|jsdelivr/.test(req.url())) {
        console.warn(`  ! external asset failed: ${req.url()}`);
      }
    });

    // The markdown bodies ARE the product. A 404 here renders "Error loading
    // content" inside the card, which is easy to miss in a 7-second beat.
    context.on("response", (res) => {
      if (res.url().includes("/markdown/") && !res.ok()) {
        console.warn(`  ! ${viewport}: markdown ${res.status()} ${res.url()}`);
      }
    });
  },
};
