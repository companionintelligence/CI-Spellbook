import { defineConfig } from 'vitest/config'

// Unit tests only. The e2e/smoke suites are Playwright (`npm test`) and the
// container suite lives under tests/container with its own config; neither
// belongs to vitest, hence the narrow `include`.
//
// No plugins: the telemetry modules under test are plain ESM with no JSX, and
// leaving react/tailwind out keeps the unit run fast and independent of the
// build pipeline.
export default defineConfig({
  test: {
    // jsdom, because initTelemetry is a no-op without `window` and the Sentry
    // browser SDK installs global handlers on it.
    environment: 'jsdom',
    include: ['src/**/*.test.js', 'dev-tools/**/*.test.js'],
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true
  }
})
