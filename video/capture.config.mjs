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
 *    (Card.jsx:30) — a real timer that no CSS override touches. The
 *    `card-ai-agents-open` shot therefore settles for 1200ms so the scroll has
 *    landed before the shutter.
 *
 * 4. HOVER-STATE BLEED — `.group:not(.expanded):hover` lifts a card 4px and
 *    swaps in a coloured overlay (Card.jsx:134). Playwright leaves the mouse
 *    wherever the last `click` put it, so a shot that clicks a card and then
 *    photographs the grid would capture a hover state. The only shot that
 *    clicks is `card-ai-agents-open`, where the clicked card ends up
 *    `.expanded` (hover rules excluded) and its front face is
 *    `visibility: hidden`. `fill` does not move the mouse. Keep it that way.
 *
 * 5. THE DEBUG PANEL is the only surface in the app carrying wall-clock
 *    timestamps, live FPS and JS heap size (`useDebugPanel.js` — FPS on a rAF
 *    loop, memory on a 1s interval, `toLocaleTimeString()` stamps). It is
 *    hidden by default and toggled with the ` / ~ key, so it should never be in
 *    frame — but every shot masks `aside[aria-label='Debug panel']` anyway. A
 *    zero-match mask costs nothing and stops a future default-on change from
 *    silently poisoning all six PNGs.
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
