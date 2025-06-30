// web/lib/supabase/server.ts (用於 Server Components, Route Handlers, Server Actions)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL!, // 使用內部 URL (kong:8000) 避免容器網路問題
    process.env.SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: 'meow-circle-auth', // 固定的 cookie 名稱，避免前綴問題
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}