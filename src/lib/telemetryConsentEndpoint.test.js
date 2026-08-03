/**
 * The runtime consent endpoint has two implementations, because Spellbook ships
 * as a static bundle with no server of its own:
 *
 *   - `nginx/40-telemetry-config.sh`, which the published image runs at
 *     container start to write /api/config/telemetry
 *   - the Vite dev/preview middleware in `vite.config.js`, which calls
 *     `telemetryConsentPayload` directly
 *
 * They must agree, or the kill switches would behave differently in the image
 * than in development — which is exactly where a telemetry bug hides. This runs
 * both over the same env matrix and diffs the answers.
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterAll, describe, expect, it } from 'vitest';

import { TELEMETRY_CONFIG_FILE, telemetryConsentPayload } from './telemetrySettings.js';

const SCRIPT = resolve(__dirname, '../../nginx/40-telemetry-config.sh');

const workDirs = [];

/** Run the container entrypoint script and return the JSON it wrote. */
function runEntrypoint(env) {
  const webRoot = mkdtempSync(join(tmpdir(), 'spellbook-telemetry-'));

  workDirs.push(webRoot);

  execFileSync('sh', [SCRIPT], {
    // A clean environment: inheriting the test runner's would let a stray
    // CI_TELEMETRY on the developer's machine silently pass the matrix.
    env: { PATH: process.env.PATH, TELEMETRY_WEB_ROOT: webRoot, ...env },
    stdio: 'pipe',
  });

  return JSON.parse(readFileSync(join(webRoot, TELEMETRY_CONFIG_FILE), 'utf8'));
}

afterAll(() => {
  for (const dir of workDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
});

const MATRIX = [
  {},
  { CI_TELEMETRY: 'off' },
  { CI_TELEMETRY: 'false' },
  { CI_TELEMETRY: '0' },
  { CI_TELEMETRY: 'no' },
  { CI_TELEMETRY: 'disabled' },
  { CI_TELEMETRY: 'OFF' },
  { CI_TELEMETRY: ' off ' },
  { CI_TELEMETRY: 'true' },
  { CI_TELEMETRY: '1' },
  { CI_TELEMETRY: '' },
  { CI_TELEMETRY: 'nonsense' },
  { CI_LOCAL_ONLY: 'true' },
  { CI_LOCAL_ONLY: '1' },
  { CI_LOCAL_ONLY: 'yes' },
  { CI_LOCAL_ONLY: 'on' },
  { CI_LOCAL_ONLY: 'enabled' },
  { CI_LOCAL_ONLY: 'TRUE' },
  { CI_LOCAL_ONLY: 'false' },
  { CI_LOCAL_ONLY: '' },
  { CI_LOCAL_ONLY: 'true', CI_TELEMETRY: 'off' },
  { CI_LOCAL_ONLY: 'true', CI_TELEMETRY: 'true' },
  { CI_LOCAL_ONLY: 'false', CI_TELEMETRY: 'off' },
];

describe('nginx entrypoint ↔ consent module parity', () => {
  it.each(MATRIX.map((env) => [JSON.stringify(env), env]))('agrees for %s', (_label, env) => {
    expect(runEntrypoint(env)).toEqual(telemetryConsentPayload(env));
  });
});

describe('nginx entrypoint', () => {
  it('permits reporting when no switch is set', () => {
    expect(runEntrypoint({})).toEqual({ enabled: true });
  });

  it('writes the opt-out reason the marketplace toggle produces', () => {
    // The manifest maps the "Share crash reports" switch to
    // CI_TELEMETRY=${APP_SHARE_CRASH_REPORTS:-…}, i.e. the literal true/false.
    expect(runEntrypoint({ CI_TELEMETRY: 'false' })).toEqual({ enabled: false, reason: 'opt-out' });
    expect(runEntrypoint({ CI_TELEMETRY: 'true' })).toEqual({ enabled: true });
  });

  it('ranks local-only above the toggle', () => {
    expect(runEntrypoint({ CI_LOCAL_ONLY: 'true', CI_TELEMETRY: 'true' })).toEqual({
      enabled: false,
      reason: 'local-only',
    });
  });

  it('never writes a DSN, even when one is in the environment', () => {
    const written = runEntrypoint({
      SENTRY_DSN: 'https://abc123@o1.ingest.us.sentry.io/9999999',
      VITE_SENTRY_DSN: 'https://abc123@o1.ingest.us.sentry.io/9999999',
    });

    expect(JSON.stringify(written)).not.toContain('sentry.io');
  });
});
