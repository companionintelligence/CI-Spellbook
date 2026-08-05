#!/usr/bin/env bash
#
# Spellbook's stage, for local video capture. Sourced by video/make.sh, which
# owns the generic capture/build/check/render steps; this file only has to get
# the app running and stop it again.
#
# Ported from .github/workflows/video.yml so a local capture films exactly what
# CI used to.
#
# Spellbook's stage is its own Vite dev server — no backend, no login, nothing
# to seed. playwright.config.js declares the same command as its `webServer`
# with reuseExistingServer: true, so the e2e suite attaches to a running server
# rather than starting a rival on :5500.

STAGE_PORT=5500
STAGE_URL="http://localhost:$STAGE_PORT"
STAGE_PID=""

stage_up() {
  # Refuse rather than film the wrong thing. A capture against somebody else's
  # server on :5500 succeeds, produces plausible screenshots and is completely
  # wrong — the failure mode this whole pipeline exists to avoid.
  if curl -sfo /dev/null "$STAGE_URL"; then
    echo "something is already serving $STAGE_URL — stop it first" >&2
    return 1
  fi

  ( cd "$REPO_ROOT" && npm ci --silent )

  ( cd "$REPO_ROOT" && npm run dev ) > "$STAGE_LOG" 2>&1 &
  STAGE_PID=$!

  for _ in $(seq 1 60); do
    curl -sfo /dev/null "$STAGE_URL" && break
    kill -0 "$STAGE_PID" 2>/dev/null || { echo "dev server exited during startup" >&2; return 1; }
    sleep 1
  done
  curl -sfo /dev/null "$STAGE_URL" || { echo "dev server never answered on :$STAGE_PORT" >&2; return 1; }
  echo "stage up at $STAGE_URL"
}

stage_down() {
  [ -n "$STAGE_PID" ] || return 0
  kill -0 "$STAGE_PID" 2>/dev/null || return 0

  # Kill npm's CHILDREN first, then npm. `npm run dev` spawns vite as a child,
  # and killing only npm leaves vite holding the port.
  #
  # Deliberately NOT `kill -- -<pgid>`: a background job in a non-interactive
  # shell shares the script's own process group, so signalling the group kills
  # make.sh too — which showed up as the whole run dying with status 144 the
  # moment the stage was torn down.
  pkill -P "$STAGE_PID" 2>/dev/null || true
  kill "$STAGE_PID" 2>/dev/null || true
  wait "$STAGE_PID" 2>/dev/null || true

  # Vite can outlive its parent if it re-parented; make sure the port is free,
  # or the next run refuses to start on a port it thinks somebody else owns.
  for _ in $(seq 1 10); do
    curl -sfo /dev/null "$STAGE_URL" || return 0
    sleep 1
  done
  echo "warning: something is still answering $STAGE_URL" >&2
}
