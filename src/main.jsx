import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initTelemetry } from './lib/telemetry.js'
import { registerServiceWorker } from './lib/serviceWorker.js'
import './styles.css'
import 'highlight.js/styles/github.min.css'

// Opt-out crash reporting: on by default when VITE_SENTRY_DSN was baked in at
// build time AND /api/config/telemetry has not been switched off; with no DSN
// the whole SDK is tree-shaken out of this bundle. Deliberately not
// awaited — reporting must never delay or block the app's first render.
// See docs/operations/error-reporting.md.
void initTelemetry()

// Installable as an app, with an offline page. Production builds only; see
// src/lib/serviceWorker.js and public/sw.js.
registerServiceWorker()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
