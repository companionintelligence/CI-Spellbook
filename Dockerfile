# Spellbook (ci-spellbook) — CI marketplace container.
# Builds the Vite static site and serves it with nginx on the Hub internalPort.
# Published as ghcr.io/companionintelligence/ci-spellbook.

# ---- build stage ----
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Error reporting is opt-in and BUILD-TIME: Vite bakes VITE_* into the bundle,
# so an unset VITE_SENTRY_DSN means the Sentry SDK is tree-shaken out entirely
# and the image can make no outbound call to Sentry at all. Leave these empty
# for the public image; pass --build-arg VITE_SENTRY_DSN=... to build a
# reporting image. Runtime consent (CI_TELEMETRY / CI_LOCAL_ONLY) is handled
# separately by 40-telemetry-config.sh below.
ARG VITE_SENTRY_DSN=""
ARG VITE_SENTRY_RELEASE=""
ARG VITE_CI_ENVIRONMENT=""
ENV VITE_SENTRY_DSN=${VITE_SENTRY_DSN} \
    VITE_SENTRY_RELEASE=${VITE_SENTRY_RELEASE} \
    VITE_CI_ENVIRONMENT=${VITE_CI_ENVIRONMENT}

RUN npm run build

# ---- runtime stage ----
FROM nginx:1.27-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# Resolves CI_TELEMETRY / CI_LOCAL_ONLY into /api/config/telemetry at start, so
# the kill switches reach a bundle whose DSN was fixed at build time.
COPY nginx/40-telemetry-config.sh /docker-entrypoint.d/40-telemetry-config.sh
RUN chmod +x /docker-entrypoint.d/40-telemetry-config.sh
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 5500
# nginx:alpine's default entrypoint runs /docker-entrypoint.d/*.sh, then
# `nginx -g 'daemon off;'`.
