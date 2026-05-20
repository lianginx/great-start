FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@10 --activate

FROM base AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm generate

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
