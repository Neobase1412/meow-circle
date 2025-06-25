// web/lib/supabase/client.ts (用於 Client Components)
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: '35.229.234.32', // 明確指定 cookie domain 為外部 IP
        path: '/',
        sameSite: 'lax',
      },
    }
  );
}