// web/lib/supabase/admin.ts (用於需要 Service Role 的後端操作，例如觸發器或特殊管理任務)
// **警告：** Service Role Key 擁有最高權限，僅在絕對必要且安全的後端環境中使用
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
