// web/lib/userData.ts
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server'; // Ensure this path is correct
import prisma from '@/lib/prisma'; // Ensure this path is correct
import type { User as AuthUser } from '@supabase/supabase-js';
import type { User as ProfileUser } from '@prisma/client';

// Helper function to fetch user data
export async function getUserData(): Promise<{
  authUser: AuthUser | null;
  profile: Pick<ProfileUser, 'id' | 'username' | 'avatarUrl'> | null;
}> { // Added explicit return type
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    // console.log("No authenticated user found or error fetching auth user.");
    return { authUser: null, profile: null };
  }
  // console.log("Authenticated user found:", authUser.id);

  try {
    // console.log(`Fetching Prisma profile for user ID: ${authUser.id}`);
    const profile = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
      },
    });
    // console.log("Prisma profile data:", profile);
    return { authUser, profile };
  } catch (prismaError) {
    console.error("Error fetching user profile from Prisma:", prismaError);
    return { authUser, profile: null };
  }
}