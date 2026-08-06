# Spellbook — product video

> **Private & Confidential — Property of Lifescope Inc. Do not distribute.**

Generates a **16:9 desktop cut** and a **9:16 mobile cut** of Spellbook's FTUE and major
screens, from this repo's own UI. Both are produced from [`storyboard.json`](storyboard.json).

The video is **built locally, on demand, and never stored** — no GitHub Actions run, no
artifact, no committed `.mp4`, no release asset. It is a build output: make one when you need
it, then delete it.

## Making one

From a [CI-Engineering](https://github.com/companionintelligence/CI-Engineering) checkout:

The video is built **on your own machine**. One command does the lot — starts the
app, captures the UI, checks the composition, renders both cuts, and stops the
app again:

```bash
./video/make.sh
```

Needs `node`, `ffmpeg` (`brew install ffmpeg`) and `gh` logged in (the video-kit
package is private, so the install needs a token; `make.sh` takes it from
`gh auth token` and never writes it to disk). Chromium is installed on first run
and cached afterwards.

```bash
./video/make.sh --no-render                 # capture + check only, much faster
./video/make.sh --only library-first-run    # re-shoot one shot by id
```

Where things end up:

| path | what | in git? |
|---|---|---|
| `out/*.mp4` | the rendered cuts | no — rebuild with `make.sh` |
| `assets/shots/*.png` | captured screenshots | no — inputs to the render |
| `assets/audio/*.mp3` | narration | **yes** — expensive to regenerate |

Nothing is uploaded and neither the video nor the screenshots are stored: both
are build artifacts. A committed screenshot that nothing refreshes goes on
looking current long after the UI has moved, which is worse than having none.

### Running the steps by hand

`make.sh` is a thin wrapper. With the dev server already up you can drive the kit
directly from `video/`:

```bash
node tools/make-videos.mjs spellbook              # both cuts, from the committed screenshots
node tools/make-videos.mjs spellbook --capture    # boot the app first and re-shoot every screen
node tools/make-videos.mjs --list                 # every product, and how many screens each has
```

The runner lives in CI-Engineering and wraps the per-repo steps below, which
still work if you would rather drive them directly from this repo:

```bash
npm install
npx playwright install chromium
npm run doctor        # verify node / ffmpeg / playwright / hyperframes / fonts
npm run capture       # drive the real UI -> assets/shots/*.png (both viewports)
npm run build         # storyboard.json -> build/{landscape,portrait}/index.html
npm run check         # HyperFrames gate: lint, runtime, layout, motion, contrast
npm run render        # -> out/ci-spellbook-landscape.mp4 and out/ci-spellbook-portrait.mp4
```

The runner resolves `ci-video` straight from the CI-Common checkout on disk, so there is no npm
registry, no token, and no authentication to arrange. Renders land in
`~/Movies/CI-Product-Videos/spellbook/`, outside every repo. `ffmpeg` and `ffprobe` must be on
`PATH` (`brew install ffmpeg`), and Node 22+.

It reads `video/` out of `origin/main` with `git archive` rather than your working tree, so
storyboard or screenshot edits have to be **pushed** before a render picks them up.

Full usage: `tools/README.md` in CI-Engineering.

## The stage

Spellbook's stage is its own Vite dev server — no backend, no login, nothing to seed. The
runner starts it for you on `--capture` (`npm ci && npm run dev`, health-checked at
`http://localhost:5500/`). To drive the capture by hand instead, boot it from the **repo root**
in a second terminal:

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

Adding a beat is: add a scene, add its shot's `capture` block, re-capture that shot, then
re-render. The `ci-video` steps the runner drives are also exposed as npm scripts here
(`capture`, `build`, `check`, `render`, `narrate`) for working on one stage at a time — for
example `npm run capture -- --only <id>`.

## Media

Drop prepared media into `assets/media/` and point `media.music` at it. Per-scene voiceover is
picked up automatically from `assets/audio/<sceneId>.mp3`; regenerate it from the storyboard's
`narration` fields with `npm run narrate`.

## What is committed

`assets/shots/*.png` and `assets/audio/*.mp3` **are** committed — they are inputs, not output.
Keeping them means anyone can render a cut without booting the app, and a moved UI shows up as a
reviewable image diff. Captures are byte-stable, so a diff in them means the UI genuinely
changed. `out/` and `build/` are not committed, and neither is the finished video.

See [CI-Engineering `projects/product-video-pipeline/`](https://github.com/companionintelligence/CI-Engineering/tree/main/projects/product-video-pipeline)
for the full contract.
