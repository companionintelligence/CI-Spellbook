#!/bin/sh
# Runtime crash-report consent for the Spellbook browser bundle.
#
# Spellbook is a static bundle: the Sentry DSN is baked in at build time and
# cannot be revoked afterwards, and nginx serves files rather than running any
# of the app's own code. Without this script the CI_TELEMETRY / CI_LOCAL_ONLY
# kill switches — including the marketplace "Share crash reports" toggle, which
# sets CI_TELEMETRY on this container — would never reach the browser.
#
# So at container start we resolve consent from the environment once and write
# the answer to a static JSON file. `nginx/default.conf` serves it at
# /api/config/telemetry, and `src/lib/telemetry.js` reads it before calling
# Sentry.init, failing closed if it is missing.
#
# The nginx image runs every executable /docker-entrypoint.d/*.sh in name
# order, before nginx starts. 40- puts this after the stock 10/15/20/30 steps.
#
# This is a shell mirror of `resolveTelemetryConsent` in
# src/lib/telemetrySettings.js. src/lib/telemetryConsentEndpoint.test.js runs
# both over the same env matrix and asserts they agree — keep them in step.
#
# Precedence: local-only > opt-out > (otherwise permitted).

set -eu

WEB_ROOT="${TELEMETRY_WEB_ROOT:-/usr/share/nginx/html}"
OUT_FILE="${WEB_ROOT}/api/config/telemetry.json"

# Trim surrounding whitespace and lowercase, so `CI_TELEMETRY=" OFF "` works.
normalize() {
    printf '%s' "${1:-}" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//' | tr '[:upper:]' '[:lower:]'
}

enabled=true
reason=

case "$(normalize "${CI_LOCAL_ONLY:-}")" in
    on | true | 1 | yes | enabled)
        enabled=false
        reason=local-only
        ;;
esac

if [ "$enabled" = true ]; then
    case "$(normalize "${CI_TELEMETRY:-}")" in
        off | false | 0 | no | disabled)
            enabled=false
            reason=opt-out
            ;;
    esac
fi

mkdir -p "$(dirname "$OUT_FILE")"

if [ "$enabled" = true ]; then
    printf '{"enabled":true}\n' >"$OUT_FILE"
    echo "$0: crash reporting permitted (a DSN must also be baked into the bundle)"
else
    printf '{"enabled":false,"reason":"%s"}\n' "$reason" >"$OUT_FILE"
    echo "$0: crash reporting disabled ($reason)"
fi
