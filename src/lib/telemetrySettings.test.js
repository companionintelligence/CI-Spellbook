import { describe, expect, it } from 'vitest';

import {
  TELEMETRY_CONFIG_PATH,
  isLocalOnly,
  isTelemetryOptedOut,
  resolveTelemetryConsent,
  resolveTelemetryState,
  telemetryConsentPayload,
} from './telemetrySettings.js';

describe('isTelemetryOptedOut', () => {
  it.each(['off', 'false', '0', 'no', 'disabled', 'OFF', ' Off ', 'DISABLED'])(
    'treats %s as an opt-out',
    (value) => {
      expect(isTelemetryOptedOut({ CI_TELEMETRY: value })).toBe(true);
    },
  );

  it.each(['on', 'true', '1', 'yes', 'enabled', '', '   ', 'maybe'])(
    'leaves the DSN in charge for %s',
    (value) => {
      expect(isTelemetryOptedOut({ CI_TELEMETRY: value })).toBe(false);
    },
  );

  it('is false when unset', () => {
    expect(isTelemetryOptedOut({})).toBe(false);
  });

  it('tolerates a missing env object', () => {
    expect(isTelemetryOptedOut(undefined)).toBe(false);
  });
});

describe('isLocalOnly', () => {
  it.each(['on', 'true', '1', 'yes', 'enabled', 'TRUE', ' Yes '])('treats %s as local-only', (value) => {
    expect(isLocalOnly({ CI_LOCAL_ONLY: value })).toBe(true);
  });

  it.each(['off', 'false', '0', 'no', '', 'sometimes'])('does not treat %s as local-only', (value) => {
    expect(isLocalOnly({ CI_LOCAL_ONLY: value })).toBe(false);
  });
});

describe('resolveTelemetryConsent', () => {
  it('permits reporting when nothing is set', () => {
    expect(resolveTelemetryConsent({})).toEqual({ enabled: true, disabledReason: null });
  });

  it('reports opt-out', () => {
    expect(resolveTelemetryConsent({ CI_TELEMETRY: 'off' })).toEqual({
      enabled: false,
      disabledReason: 'opt-out',
    });
  });

  it('reports local-only', () => {
    expect(resolveTelemetryConsent({ CI_LOCAL_ONLY: 'true' })).toEqual({
      enabled: false,
      disabledReason: 'local-only',
    });
  });

  it('ranks local-only above opt-out', () => {
    expect(resolveTelemetryConsent({ CI_LOCAL_ONLY: 'true', CI_TELEMETRY: 'off' }).disabledReason).toBe(
      'local-only',
    );
  });

  it('local-only wins even when the toggle says share', () => {
    expect(resolveTelemetryConsent({ CI_LOCAL_ONLY: '1', CI_TELEMETRY: 'true' })).toEqual({
      enabled: false,
      disabledReason: 'local-only',
    });
  });
});

describe('telemetryConsentPayload', () => {
  it('never contains a DSN, even when one is in the environment', () => {
    const payload = telemetryConsentPayload({
      SENTRY_DSN: 'https://abc123@o1.ingest.us.sentry.io/9999999',
      VITE_SENTRY_DSN: 'https://abc123@o1.ingest.us.sentry.io/9999999',
    });

    expect(JSON.stringify(payload)).not.toContain('sentry.io');
    expect(payload).toEqual({ enabled: true });
  });

  it('carries the reason when disabled', () => {
    expect(telemetryConsentPayload({ CI_TELEMETRY: 'no' })).toEqual({
      enabled: false,
      reason: 'opt-out',
    });
  });

  it('is served from a same-origin path', () => {
    expect(TELEMETRY_CONFIG_PATH).toBe('/api/config/telemetry');
  });
});

describe('resolveTelemetryState — the full gate', () => {
  const dsn = 'https://abc123@o1.ingest.us.sentry.io/9999999';
  const permitted = { enabled: true, disabledReason: null };

  it('enables only with a DSN and permission', () => {
    expect(resolveTelemetryState({ dsn, consent: permitted })).toEqual({
      enabled: true,
      disabledReason: null,
    });
  });

  it.each([undefined, null, '', '   '])('reports no-dsn for %p', (value) => {
    expect(resolveTelemetryState({ dsn: value, consent: permitted })).toEqual({
      enabled: false,
      disabledReason: 'no-dsn',
    });
  });

  it('fails closed when consent could not be read', () => {
    expect(resolveTelemetryState({ dsn, consent: null })).toEqual({
      enabled: false,
      disabledReason: 'consent-unavailable',
    });
  });

  it('fails closed on a malformed answer that omits `enabled`', () => {
    expect(resolveTelemetryState({ dsn, consent: { enabled: 'yes', disabledReason: null } })).toEqual({
      enabled: false,
      disabledReason: 'consent-unavailable',
    });
  });

  it('honours opt-out over a baked-in DSN', () => {
    expect(resolveTelemetryState({ dsn, consent: { enabled: false, disabledReason: 'opt-out' } })).toEqual(
      { enabled: false, disabledReason: 'opt-out' },
    );
  });

  it('honours local-only over a baked-in DSN', () => {
    expect(
      resolveTelemetryState({ dsn, consent: { enabled: false, disabledReason: 'local-only' } }),
    ).toEqual({ enabled: false, disabledReason: 'local-only' });
  });

  it('ranks local-only above no-dsn', () => {
    expect(
      resolveTelemetryState({ dsn: '', consent: { enabled: false, disabledReason: 'local-only' } })
        .disabledReason,
    ).toBe('local-only');
  });

  it('ranks opt-out above no-dsn', () => {
    expect(
      resolveTelemetryState({ dsn: undefined, consent: { enabled: false, disabledReason: 'opt-out' } })
        .disabledReason,
    ).toBe('opt-out');
  });
});
