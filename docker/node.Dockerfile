# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true

WORKDIR /repo

RUN corepack enable


FROM base AS build

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/api/package.json apps/api/package.json
COPY apps/line-worker/package.json apps/line-worker/package.json

COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/domain/package.json packages/domain/package.json

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @betcore/contracts build
RUN pnpm --filter @betcore/domain build
RUN pnpm --filter @betcore/api build
RUN pnpm --filter @betcore/line-worker build

RUN pnpm deploy --filter=@betcore/api --prod /prod/api
RUN pnpm deploy --filter=@betcore/line-worker --prod /prod/line-worker


FROM node:22-alpine AS api

ENV NODE_ENV=production

WORKDIR /app

RUN addgroup -S nodejs && adduser -S nestjs -G nodejs

COPY --from=build --chown=nestjs:nodejs /prod/api ./

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main.js"]


FROM node:22-alpine AS line-worker

ENV NODE_ENV=production

WORKDIR /app

RUN addgroup -S nodejs && adduser -S nestjs -G nodejs

COPY --from=build --chown=nestjs:nodejs /prod/line-worker ./

USER nestjs

EXPOSE 3001

CMD ["node", "dist/main.js"]