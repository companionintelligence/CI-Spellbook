# Spellbook (ci-spellbook) — CI marketplace container.
# Builds the Vite static site and serves it with nginx on the Hub internalPort.
# Published as ghcr.io/companionintelligence/ci-spellbook.

# ---- build stage ----
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- runtime stage ----
FROM nginx:1.27-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 5500
# nginx:alpine's default entrypoint runs `nginx -g 'daemon off;'`.
