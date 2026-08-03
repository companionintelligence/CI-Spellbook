import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), telemetryConsent()],
  server: {
    port: 5500,
    host: true
  },
  publicDir: 'public'
})
