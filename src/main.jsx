import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initTelemetry } from './lib/telemetry.js'
import './styles.css'
import 'highlight.js/styles/github.min.css'

// Opt-in crash reporting. A no-op unless VITE_SENTRY_DSN was baked in at build
// time AND /api/config/telemetry says reporting is permitted right now; with no
// DSN the whole SDK is tree-shaken out of this bundle. Deliberately not
// awaited — reporting must never delay or block the app's first render.
// See docs/operations/error-reporting.md.
void initTelemetry()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
