# -----------------------------------------------------------------------------
# Stage 1: Base Alpine Environment
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# -----------------------------------------------------------------------------
# Stage 2: Dependency Installation
# -----------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# -----------------------------------------------------------------------------
# Stage 3: Production Builder
# -----------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# -----------------------------------------------------------------------------
# Stage 4: Minimal Production Runtime (< 150MB)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Non-root user for container security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and compiled standalone server
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
