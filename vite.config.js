import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { assertSite } from './scripts/assert-site.mjs'
import {
  TELEMETRY_CONFIG_PATH,
  telemetryConsentPayload
} from './src/lib/telemetrySettings.js'

/**
 * Serve the runtime crash-report consent answer in dev and preview.
 *
 * In the published image nginx serves this path from a file that
 * `nginx/40-telemetry-config.sh` writes at container start. The dev and preview
 * servers are the only other place any of our code runs, so they answer it
 * directly from `process.env` — same contract, same precedence, so
 * CI_TELEMETRY / CI_LOCAL_ONLY behave identically while developing.
 *
 * Never returns a DSN: the DSN is baked into the bundle at build time, and this
 * endpoint only ever carries the consent decision.
 */
function telemetryConsent() {
  const handle = (req, res, next) => {
    const path = (req.url || '').split('?')[0]

    if (path !== TELEMETRY_CONFIG_PATH) {
      return next()
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    res.end(JSON.stringify(telemetryConsentPayload(process.env)))
  }

  return {
    name: 'ci-spellbook-telemetry-consent',
    configureServer(server) {
      server.middlewares.use(handle)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle)
    }
  }
}

/**
 * Keep Cloudflare Rocket Loader away from the app's entry script.
 *
 * With Rocket Loader on for the zone, Cloudflare rewrites <script type="module">
 * to type="<hash>-module" and holds the app back until its own loader has run.
 * `data-cfasync="false"` is its documented opt-out, and index.html carries it,
 * but Vite rebuilds the tag from scratch and drops attributes it does not know,
 * so it is put back here, after Vite is done with the HTML.
 */
function cloudflareOptOut() {
  return {
    name: 'ci-spellbook-cfasync',
    transformIndexHtml: {
      order: 'post',
      handler: (html) =>
        html.replace(/<script\b(?![^>]*data-cfasync)([^>]*\btype="module"[^>]*)>/g, '<script data-cfasync="false"$1>')
    }
  }
}

/**
 * Fail the build when the site's public surface disagrees with src/lib/site.js:
 * the metadata, the no-JS fallback, the 404 page, the crawler files, and the
 * four links to ci.computer and the docs (see scripts/assert-site.mjs).
 *
 * It runs here, rather than as a step someone has to remember, because every way
 * this app is built goes through Vite: `npm run build`, the Docker image build
 * (`deno task build`) and the Cloudflare Pages build. A check that lived only in
 * CI would let a deploy through that CI never saw.
 */
function assertSiteSurface() {
  let outDir = null

  return {
    name: 'ci-spellbook-assert-site',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.ssr ? null : resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      if (outDir) assertSite({ dist: outDir })
    }
  }
}

const root = fileURLToPath(new URL('.', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), telemetryConsent(), cloudflareOptOut(), assertSiteSurface()],
  server: {
    port: 5500,
    host: true
  },
  publicDir: 'public',
  build: {
    rollupOptions: {
      // 404.html is a second HTML entry so it is built with the app's own
      // fingerprinted stylesheet instead of a hand-copied one. Its presence in
      // dist/ is also what turns off Cloudflare Pages' single-page-app fallback.
      input: {
        main: resolve(root, 'index.html'),
        notFound: resolve(root, '404.html')
      }
    }
  }
})
