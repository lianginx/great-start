FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@10 --activate

FROM base AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm build

FROM base AS production

WORKDIR /app

COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./

EXPOSE 3080

CMD ["node", ".output/server/index.mjs"]
