FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@11 --activate

FROM base AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm generate

FROM nginx:alpine

COPY --from=build /app/.output/public /usr/share/nginx/html

EXPOSE 80
