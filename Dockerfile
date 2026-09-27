# Spellbook (ci-spellbook) — CI marketplace container.
# Builds the Vite static site and serves it with nginx on the Hub internalPort.
# Published as ghcr.io/companionintelligence/ci-spellbook.

# ---- build stage ----
# Deno (not Node) runs the build: deno.json's nodeModulesDir populates
# node_modules from package.json/package-lock.json via Deno's npm compat, so
# `deno task build` runs the same Vite/Rollup toolchain npm run build did.
# `deno.json`'s `allowScripts` already lists the one npm postinstall script
# this dependency tree needs (@tailwindcss/oxide's native binary fetch), so
# `deno install` below runs it non-interactively instead of prompting.
#
# --platform=$BUILDPLATFORM PINS THIS STAGE TO THE BUILDER'S OWN ARCHITECTURE —
# do not remove it. We publish linux/amd64 + linux/arm64 from one amd64 runner,
# so without this pin buildx runs the whole arm64 leg (deno + the toolchain)
# under QEMU user-mode emulation, and this dependency tree is full of Rust N-API
# binaries that QEMU cannot execute: @tailwindcss/oxide's postinstall dies with
# `signal 4 (Illegal instruction)` / exit 132, and lightningcss (pulled in by
# @tailwindcss/node) would die the same way at `deno task build` even if the
# postinstall were skipped. Pinning is safe because this stage's only output is
# /app/dist — an HTML/CSS/JS Vite bundle with nothing architecture-specific in
# it — so both published images get the identical bundle, built natively and
# built once. The runtime stage below stays unpinned and is what actually
# differs per architecture.
FROM --platform=$BUILDPLATFORM denoland/deno:2.9.5 AS build
WORKDIR /app
COPY package.json package-lock.json deno.json deno.lock ./
RUN deno install --frozen
COPY . .

# Error reporting is opt-OUT, and its DSN is BUILD-TIME: Vite bakes VITE_* into
# the bundle, so an image built WITH --build-arg VITE_SENTRY_DSN=... reports by
# default, and an unset VITE_SENTRY_DSN means the Sentry SDK is tree-shaken out
# entirely and the image can make no outbound call to Sentry at all. The empty
# defaults below are "not configured", not "opted out" — a release image is
# expected to pass the build arg. Runtime consent (CI_TELEMETRY /
# CI_LOCAL_ONLY), which is how a user turns reporting off, is handled separately
# by 40-telemetry-config.sh below.
ARG VITE_SENTRY_DSN=""
ARG VITE_SENTRY_RELEASE=""
ARG VITE_CI_ENVIRONMENT=""
ENV VITE_SENTRY_DSN=${VITE_SENTRY_DSN} \
    VITE_SENTRY_RELEASE=${VITE_SENTRY_RELEASE} \
    VITE_CI_ENVIRONMENT=${VITE_CI_ENVIRONMENT}

RUN deno task build

# ---- runtime stage ----
# Deliberately NOT pinned: this is the per-architecture half, and nginx:1.27-alpine
# publishes real amd64 and arm64 manifests. It also contains no RUN, so the arm64
# leg is pulled base + file copies with nothing executed — no emulation needed.
FROM nginx:1.27-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# Resolves CI_TELEMETRY / CI_LOCAL_ONLY into /api/config/telemetry at start, so
# the kill switches reach a bundle whose DSN was fixed at build time.
# --chmod replaces a `RUN chmod +x`, which was the last thing this stage had to
# execute on the target architecture.
COPY --chmod=0755 nginx/40-telemetry-config.sh /docker-entrypoint.d/40-telemetry-config.sh
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 5500
# nginx:alpine's default entrypoint runs /docker-entrypoint.d/*.sh, then
# `nginx -g 'daemon off;'`.
