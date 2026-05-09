# Betcore Monorepo Microservices

Production-like NestJS microservices pet project for learning backend engineering patterns used in sportsbook and iGaming systems.

The project is built as a pnpm monorepo with separate applications, shared packages, RabbitMQ messaging, PostgreSQL, Redis, Docker Compose, health checks, and production-style Docker images.

## Project Goals

This project is designed to practice backend topics commonly used in high-load systems:

- NestJS microservices
- Event-driven architecture
- RabbitMQ message broker
- Request/reply messaging
- Event-based messaging
- Docker and Docker Compose
- Production-like container builds
- Health checks
- pnpm workspaces
- Shared contracts package
- Shared domain package
- Idempotency-ready architecture
- Retry/DLQ-ready architecture
- Outbox-ready architecture
- Race condition handling
- Integer-based status codes instead of database enums

## Tech Stack

- Node.js 25
- TypeScript
- NestJS
- pnpm workspaces
- RabbitMQ
- PostgreSQL
- Redis
- Docker
- Docker Compose
- ESLint
- Prettier

## Project Structure

```text
betcore-monorepo-microservices/
  apps/
    api/
      src/
      package.json
      tsconfig.json
      tsconfig.build.json
	  nest-cli.json

    line-worker/
      src/
      package.json
      tsconfig.json
      tsconfig.build.json
	  nest-cli.json

  packages/
    contracts/
      src/
      package.json
      tsconfig.json
      tsconfig.build.json

    domain/
      src/
      package.json
      tsconfig.json
      tsconfig.build.json

  docker/
    node.Dockerfile

  scripts/
    health-check.mjs

  docker-compose.yml
  pnpm-workspace.yaml
  package.json
  tsconfig.json
  tsconfig.base.json
  eslint.config.mjs
  .prettierrc
  .prettierignore
  .editorconfig
  .dockerignore
  .gitignore
  .gitattributes
  .env.example
```

## Applications

### API Service

Path:

```text
apps/api
```

The API service is the public HTTP entry point.

Current responsibilities:

- exposes HTTP endpoints;
- exposes health endpoints;
- sends RabbitMQ request/reply messages;
- publishes RabbitMQ events;
- communicates with worker services through shared contracts.

Base URL:

```text
http://localhost:3000/api
```

Health endpoints:

```text
GET /api/health/live
GET /api/health/ready
```

### Line Worker Service

Path:

```text
apps/line-worker
```

The line-worker service processes RabbitMQ messages and events.

Current responsibilities:

- listens to RabbitMQ messages;
- handles `@MessagePattern`;
- handles `@EventPattern`;
- manually acknowledges messages with `ack`;
- rejects failed messages with `nack`;
- exposes a lightweight HTTP health endpoint.

Health endpoint:

```text
GET /health/live
```

Service port:

```text
3001
```

## Shared Packages

### Contracts Package

Path:

```text
packages/contracts
```

Contains shared contracts used by services:

- message patterns;
- event patterns;
- DTOs;
- event payload types.

Example usage:

```ts
SPORTS_PATTERNS.LIST_REQUEST;
SPORTS_PATTERNS.SYNC_REQUESTED;
```

### Domain Package

Path:

```text
packages/domain
```

Contains shared domain-level logic.

This package is intended for:

- domain constants;
- status codes;
- business rules;
- domain models;
- mapping helpers.

Important project rule:

> Database enums are not used. Statuses should be stored as integer codes in the database and mapped in application/domain code.

## Infrastructure

Docker Compose starts:

- PostgreSQL
- Redis
- RabbitMQ with Management UI
- API service
- Line worker service

### Default Ports

| Service                   |    Port |
| ------------------------- | ------: |
| API                       |  `3000` |
| Line worker health server |  `3001` |
| PostgreSQL                |  `5432` |
| Redis                     |  `6379` |
| RabbitMQ AMQP             |  `5672` |
| RabbitMQ Management UI    | `15672` |

RabbitMQ Management UI:

```text
http://localhost:15672
```

Default credentials:

```text
login: betcore
password: betcore
```

## Requirements

Install:

- Node.js 25+
- pnpm 10+
- Docker
- Docker Compose

Check installed versions:

```bash
node -v
pnpm -v
docker -v
docker compose version
```

## Environment Variables

Local `.env` files are not committed.

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Example:

```env
POSTGRES_USER=betcore
POSTGRES_PASSWORD=betcore
POSTGRES_DB=betcore

RABBITMQ_DEFAULT_USER=betcore
RABBITMQ_DEFAULT_PASS=betcore

SPORTS_QUEUE=sports.queue

PORT=3000
LINE_WORKER_HEALTH_PORT=3001
```

Inside Docker Compose, services communicate through service names:

```text
postgres
redis
rabbitmq
```

For example, RabbitMQ URL inside Docker should use:

```text
amqp://betcore:betcore@rabbitmq:5672
```

Do not use `localhost` for service-to-service communication inside Docker containers.

Inside a container, `localhost` means the container itself, not the host machine.

## Install Dependencies

From the project root:

```bash
pnpm install
```

## Development Commands

Check formatting:

```bash
pnpm format:check
```

Format files:

```bash
pnpm format
```

Run ESLint:

```bash
pnpm lint
```

Auto-fix ESLint issues:

```bash
pnpm lint:fix
```

Build all packages and apps:

```bash
pnpm build
```

Run all local checks:

```bash
pnpm check
```

`pnpm check` runs:

```bash
pnpm format:check
pnpm lint
pnpm build
```

## Build Individual Workspaces

Build contracts:

```bash
pnpm --filter @betcore/contracts build
```

Build domain:

```bash
pnpm --filter @betcore/domain build
```

Build API:

```bash
pnpm --filter @betcore/api build
```

Build line worker:

```bash
pnpm --filter @betcore/line-worker build
```

## Docker Compose

Start all services:

```bash
docker compose up --build
```

Start all services in detached mode:

```bash
docker compose up -d --build
```

Stop services:

```bash
docker compose down
```

Stop services and remove volumes:

```bash
docker compose down -v
```

Rebuild images without cache:

```bash
docker compose build --no-cache
```

Start after rebuild:

```bash
docker compose up
```

## Health Checks

Check API health:

```bash
curl http://localhost:3000/api/health/live
```

Expected response:

```json
{
	"status": "ok",
	"service": "api",
	"check": "live",
	"timestamp": "..."
}
```

Check line worker health:

```bash
curl http://localhost:3001/health/live
```

Expected response:

```json
{
	"status": "ok",
	"service": "line-worker",
	"check": "live",
	"timestamp": "..."
}
```

Run automated health check script:

```bash
pnpm health:check
```

## RabbitMQ Flow Test

The API service has development endpoints for testing RabbitMQ communication with the worker.

### Request/reply flow

```bash
curl http://localhost:3000/api/dev/sports/request
```

This sends a request message to RabbitMQ and waits for a response from the worker.

The worker handles it through:

```ts
@MessagePattern(SPORTS_PATTERNS.LIST_REQUEST)
```

### Event flow

```bash
curl -X POST http://localhost:3000/api/dev/sports/sync
```

This publishes an event to RabbitMQ.

The worker handles it through:

```ts
@EventPattern(SPORTS_PATTERNS.SYNC_REQUESTED)
```

## Production-like Docker Build

Docker does not run:

```bash
nest start --watch
```

The project uses a production-like Docker flow:

1. install dependencies in the build stage;
2. build TypeScript with `tsc`;
3. build shared packages;
4. build applications;
5. use `pnpm deploy --prod` to create isolated production bundles;
6. run compiled JavaScript in the runtime images.

Runtime command:

```bash
node dist/main.js
```

This means runtime containers do not depend on:

- Nest CLI;
- TypeScript compiler;
- dev dependencies;
- local bind mounts.

## Docker Health Checks

Docker Compose includes health checks for:

- PostgreSQL
- Redis
- RabbitMQ
- API
- Line worker

RabbitMQ health check verifies that the AMQP listener on port `5672` is ready before dependent services are started.

This prevents workers from trying to connect while RabbitMQ is still booting.

## Useful Docker Commands

Show running containers:

```bash
docker compose ps
```

Show logs for all services:

```bash
docker compose logs -f
```

Show API logs:

```bash
docker compose logs -f api
```

Show line worker logs:

```bash
docker compose logs -f line-worker
```

Show RabbitMQ logs:

```bash
docker compose logs -f rabbitmq
```

Open a shell inside the API container:

```bash
docker compose exec api sh
```

Open a shell inside the line worker container:

```bash
docker compose exec line-worker sh
```

Print environment variables inside the line worker container:

```bash
docker compose exec line-worker env
```

## Git Policy

Commit:

```text
source files
package.json files
pnpm-lock.yaml
pnpm-workspace.yaml
docker-compose.yml
docker/node.Dockerfile
.dockerignore
.gitignore
.prettierrc
.prettierignore
.editorconfig
eslint.config.mjs
tsconfig files
.env.example
README.md
```

Do not commit:

```text
.env
node_modules
dist
build
coverage
logs
temporary files
```

## Recommended Check Before Commit

Run:

```bash
pnpm check
docker compose up -d --build
pnpm health:check
docker compose down
git status --short
```

Then commit:

```bash
git add -A
git status --short
git commit -m "Setup production-like NestJS microservices"
```

## Current Status

Implemented:

- pnpm workspace monorepo;
- NestJS API service;
- NestJS line-worker service;
- shared contracts package;
- shared domain package;
- RabbitMQ integration;
- Redis service;
- PostgreSQL service;
- Docker Compose infrastructure;
- production-like multi-stage Dockerfile;
- service health checks;
- RabbitMQ readiness health check;
- TypeScript builds with `tsc`;
- ESLint flat config;
- Prettier config;
- `.dockerignore`;
- `.gitignore`;
- `.env.example`;
- health-check script.

## Next Steps

Planned improvements:

1. add PostgreSQL schema;
2. add database migrations;
3. add sportsbook domain model;
4. add integer status codes;
5. add idempotency keys;
6. add retry policy;
7. add delayed retries;
8. add DLQ;
9. add outbox pattern;
10. add structured logging;
11. add OpenTelemetry;
12. add integration tests;
13. add CI pipeline;
14. add production deployment strategy.
