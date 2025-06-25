// web/lib/supabase/client.ts (用於 Client Components)
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    // 移除 cookieOptions.domain - IP 地址不適用於 cookie domain 設置
  );
}