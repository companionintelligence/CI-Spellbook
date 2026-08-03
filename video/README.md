# Spellbook — product video

> **Private & Confidential — Property of Lifescope Inc. Do not distribute.**

Generates a **16:9 desktop cut** and a **9:16 mobile cut** of Spellbook's FTUE and major
screens, from this repo's own UI. Both are produced from [`storyboard.json`](storyboard.json).

## Quick start

```bash
npm install
npx playwright install --with-deps chromium
npm run doctor        # verify node / ffmpeg / playwright / hyperframes / fonts

# with the app's dev server running:
npm run capture       # drive the real UI -> assets/shots/*.png (both viewports)
npm run build         # storyboard.json -> build/{landscape,portrait}/index.html
npm run check         # HyperFrames gate: lint, runtime, layout, motion, contrast
npm run render        # -> out/ci-spellbook-landscape.mp4 and out/ci-spellbook-portrait.mp4
```

## The stage

Spellbook's stage is its own Vite dev server — no backend, no login, nothing to seed.
From the **repo root**, in a second terminal:

```bash
npm ci
npm run dev          # vite, http://localhost:5500 (vite.config.js)
```

`playwright.config.js` declares the same command as its `webServer` with
`reuseExistingServer: true`, so the repo's e2e suite attaches to this server rather than
starting a rival on port 5500. Point capture somewhere else with `APP_URL=…`.

There is **no client router** in this app: every filmable screen is a state of `/`, reached
by clicking or typing. That is why every shot's `capture.path` is `/` and the work happens in
`capture.before`. See the hazard notes at the top of [`capture.config.mjs`](capture.config.mjs).

## Editing the video

Everything editorial lives in [`storyboard.json`](storyboard.json) — scene order, durations,
captions, narration, and which screens appear. The **capture spec for each shot lives in the same
file**, so the script and the screenshots cannot drift apart.

Adding a beat is: add a scene, add its shot's `capture` block, `npm run capture -- --only <id>`,
then `npm run build && npm run render`.

## Media

Drop prepared media into `assets/media/` and point `media.music` at it. Per-scene voiceover is
picked up automatically from `assets/audio/<sceneId>.mp3`; regenerate it from the storyboard's
`narration` fields with `npm run narrate`.

## What is committed

`assets/shots/*.png` and `assets/audio/*.mp3` **are** committed — they are the record of what the
product looked like, and captures are byte-stable, so a diff in them means the UI genuinely
changed. `out/` is not committed.

See [CI-Engineering `projects/product-video-pipeline/`](https://github.com/companionintelligence/CI-Engineering/tree/main/projects/product-video-pipeline)
for the full contract.
