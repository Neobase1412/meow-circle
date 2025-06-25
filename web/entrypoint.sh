#!/bin/sh

# 當任何指令失敗時立即退出
set -e

# --- 映射環境變數 ---
# 從基礎設施變數 (如 SUPABASE_URL) 映射到 Next.js 需要的變數 (NEXT_PUBLIC_SUPABASE_URL)。
# 這種模式確保了我們可以在運行時動態配置應用，而無需重新建構鏡像。

# 使用 docker-compose 傳入的環境變數
export NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-$SUPABASE_URL}
export NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-$SUPABASE_ANON_KEY}

# 伺服器端專用變數
export DATABASE_URL=${DATABASE_URL}
export SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}

# --- 檢查關鍵變數是否存在 ---
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set."
  echo "NEXT_PUBLIC_SUPABASE_URL: $NEXT_PUBLIC_SUPABASE_URL"
  echo "NEXT_PUBLIC_SUPABASE_ANON_KEY: $NEXT_PUBLIC_SUPABASE_ANON_KEY"
  exit 1
fi

echo "Starting Next.js server..."
echo "Supabase URL: $NEXT_PUBLIC_SUPABASE_URL"
echo "Database URL: ${DATABASE_URL}"

# 設置本地代理 - 將 localhost:8000 重定向到 kong:8000
echo "Setting up localhost:8000 -> kong:8000 proxy..."
# 安裝 socat 如果不存在
if ! command -v socat >/dev/null 2>&1; then
    echo "Installing socat..."
    apk add --no-cache socat > /dev/null 2>&1
fi
# 啟動代理在背景運行
socat TCP-LISTEN:8000,bind=127.0.0.1,reuseaddr,fork TCP:kong:8000 &
PROXY_PID=$!
echo "Proxy started (PID: $PROXY_PID)"

# 等待 Kong 服務就緒 (可選)
if [ "$SKIP_HEALTH_CHECK" != "true" ]; then
  echo "Waiting for Kong service..."
  # Kong 的 health 端點會返回 401，但這表示服務已經運行
  until wget -q -O - ${NEXT_PUBLIC_SUPABASE_URL}/health 2>&1 | grep -q "401\|Unauthorized" || wget -q -O - ${NEXT_PUBLIC_SUPABASE_URL}/health > /dev/null 2>&1; do
    echo "Kong not ready, waiting..."
    sleep 2
  done
  echo "Kong is ready!"
else
  echo "Skipping health check, starting directly..."
  sleep 5  # 短暫等待讓 Kong 啟動
fi

# 設置信號處理以清理代理
cleanup() {
    echo "Cleaning up..."
    if [ ! -z "$PROXY_PID" ]; then
        kill $PROXY_PID 2>/dev/null || true
    fi
    exit 0
}
trap cleanup INT TERM

# 啟動應用（包含 migration 和 seed）
npm run start:migrate:prod