// web/lib/userData.ts
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import type { User as AuthUser } from '@supabase/supabase-js';
import type { User as PrismaUser, Prisma } from '@prisma/client'; // Import Prisma namespace

// Define the shape of the profile data we want in the context
export type UserProfileContextType = Prisma.UserGetPayload<{
  select: {
    id: true;
    username: true;
    avatarUrl: true;
    fullName: true; // <-- Add fullName
    bio: true;
    membershipLevel: true; // <-- Add membershipLevel
    membershipPoints: true; // <-- Add membershipPoints
    joinedAt: true; // <-- Add joinedAt
    _count: { // <-- Add counts
      select: {
        pets: { where: { isActive: true } }; // Count active pets
        posts: { where: { isArchived: false } }; // Count non-archived posts
        collections: true; // Count collections
        // Add other counts if needed later (e.g., followers, following)
      };
    };
    // Select other fields if needed by other components using the context
  };
}> | null; // Profile can be null if not logged in or not found

// Helper function to fetch user data (Auth + Enhanced Profile)
export async function getUserData(): Promise<{
  authUser: AuthUser | null;
  profile: UserProfileContextType; // Use the new type
}> {
  const supabase = await createClient();
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return { authUser: null, profile: null };
  }

  try {
    const profile = await prisma.user.findUnique({
      where: { id: authUser.id },
      // Select the fields needed for UserProfileCard and potentially others
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        fullName: true,
        bio: true,
        membershipLevel: true,
        membershipPoints: true,
        joinedAt: true,
        _count: {
          select: {
            pets: { where: { isActive: true } },
            posts: { where: { isArchived: false } },
            collections: true,
          },
        },
      },
    });
    
    // Ensure profile is returned as null if not found, matching the defined type
    return { authUser, profile: profile ?? null };
  } catch (prismaError) {
    console.error("❌ Error fetching user profile from Prisma:", prismaError);
    // Return auth user but null profile on error
    return { authUser, profile: null };
  }
}