FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm --filter @masik/shared-types build
RUN pnpm --filter @masik/business-rules build
RUN pnpm --filter @masik/admin build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
EXPOSE 3001
CMD ["pnpm", "--filter", "@masik/admin", "start"]
