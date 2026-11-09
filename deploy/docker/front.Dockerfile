# syntax=docker/dockerfile:1.7
#
# Imagen del frontend de PruebasOpenCode1.
# Contexto de build: raíz del repositorio.
#   docker build -f deploy/docker/front.Dockerfile \
#     --build-arg VITE_AUTH_USERNAME=demo \
#     --build-arg VITE_AUTH_PASSWORD=demo1234 \
#     -t pruebasopencode1-front:pre .
#
# `npm run build` ejecuta también `npm run docs`, por eso el contexto incluye
# AGENTS.md, docs/, scripts/ y los tests de Java.

FROM node:24-alpine AS build
WORKDIR /workspace

# Capa de dependencias: solo cambia cuando cambian package.json o el lock.
COPY front/package.json front/package-lock.json ./front/
WORKDIR /workspace/front
RUN npm ci

WORKDIR /workspace
COPY README.md AGENTS.md ./
COPY docs ./docs
COPY scripts ./scripts
COPY back/src/test ./back/src/test
COPY front ./front

ARG VITE_API_BASE_URL=/api/v1
ARG VITE_AUTH_USERNAME=demo
ARG VITE_AUTH_PASSWORD=demo1234
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_AUTH_USERNAME=$VITE_AUTH_USERNAME \
    VITE_AUTH_PASSWORD=$VITE_AUTH_PASSWORD

RUN cd front && npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine

# Nginx sin privilegios escucha en 8080 y sirve la SPA con fallback a index.html.
COPY deploy/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=nginx:nginx /workspace/front/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
