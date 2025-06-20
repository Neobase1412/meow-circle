#!/bin/sh

# 當任何指令失敗時立即退出
set -e

# --- 映射環境變數 ---
# 從基礎設施變數 (如 SUPABASE_URL) 映射到 Next.js 需要的變數 (NEXT_PUBLIC_SUPABASE_URL)。
# 這種模式確保了我們可以在運行時動態配置應用，而無需重新建構鏡像。

# 使用 docker-compose 傳入的 SUPABASE_URL，如果不存在，則使用 Dockerfile 中設定的預設值。
export NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
export NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# 伺服器端專用變數
export DATABASE_URL=${DATABASE_URL}
export SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}

# --- 檢查關鍵變數是否存在 ---
# 增加一個保護機制，如果必要的變數沒有被設定，就報錯退出。
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set."
  exit 1
fi

echo "Starting Next.js server..."
echo "Supabase URL: $NEXT_PUBLIC_SUPABASE_URL"

# 啟動 Next.js standalone 伺服器
# 你的 Dockerfile 中安裝了 pm2，但這裡是用 node 直接啟動。
# 如果你想用 pm2，請將下面這行改成 `pm2-runtime server.js`
node server.js