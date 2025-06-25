# base image
FROM node:20-alpine AS base
LABEL maintainer="roger@ewebs.com.tw"

RUN apk add --no-cache tzdata

# Install pnpm globally
RUN npm install -g pnpm

# --- packages stage ---
# 只安裝依賴，更好地利用快取
FROM base AS packages
WORKDIR /app/web
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
RUN pnpm install --frozen-lockfile

# --- builder stage ---
# 建構應用程式
FROM base AS builder
WORKDIR /app/web

# 從 packages 階段複製依賴
COPY --from=packages /app/web/node_modules ./node_modules
COPY --from=packages /app/web/prisma ./prisma

# 複製專案原始碼 (包含 .env.local)
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# 設置建構時環境變數給 Next.js
ARG NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ2NzIwMDAwLCJleHAiOjE5MDQ0ODY0MDB9.y-EksR5ovQHe-DbciTu5vsdCsVqFyyPttJuBwqnBalo

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Build the Next.js application
RUN pnpm build

# --- production stage ---
# 建立最終的輕量級鏡像
FROM base AS production

ENV NODE_ENV=production
ENV PORT=3000

# 設置基礎環境變數的預設值，將由 entrypoint.sh 使用
# 這些是非 NEXT_PUBLIC_ 的變數，只在伺服器端使用
ENV SUPABASE_URL="http://localhost:8000"
ENV SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ2NzIwMDAwLCJleHAiOjE5MDQ0ODY0MDB9.y-EksR5ovQHe-DbciTu5vsdCsVqFyyPttJuBwqnBalo"
ENV DATABASE_URL="postgresql://postgres:BkgP8eYx4fLz2n7D9vTs5uQmRcK3aHwJ@localhost:5433/postgres?schema=public"

# set timezone
ENV TZ=UTC
RUN ln -s /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone

# Install PM2 globally (如果你在 entrypoint 中使用它)
# 注意：你的 entrypoint.sh 是直接用 node 啟動，所以這行可能不是必需的
# 如果你打算用 pm2 start server.js，那麼這行就是需要的
RUN npm install -g pm2

WORKDIR /app/web

# 從 builder 階段複製必要的產出物
COPY --from=builder /app/web/public ./public
COPY --from=builder /app/web/.next/standalone ./
COPY --from=builder /app/web/.next/static ./.next/static

# 複製 Prisma 相關文件用於 migration 和 seeding
COPY --from=packages /app/web/node_modules ./node_modules
COPY --from=builder /app/web/prisma ./prisma
COPY --from=builder /app/web/package.json ./package.json

# Capture build info
ARG COMMIT_SHA
ENV COMMIT_SHA=${COMMIT_SHA}

# Copy entrypoint script and make it executable
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "./entrypoint.sh"]