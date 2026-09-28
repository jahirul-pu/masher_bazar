FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm --filter @masik/shared-types build
RUN pnpm --filter @masik/database db:generate
RUN pnpm --filter @masik/business-rules build
RUN pnpm --filter @masik/mock-adapters build
RUN pnpm --filter @masik/api build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
