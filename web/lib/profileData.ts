// web/lib/profileData.ts
import prisma from '@/lib/prisma';
import { getUserData } from '@/lib/userData'; // Use our existing helper
import type { Prisma } from '@prisma/client'; // Import Prisma namespace

// Define the type for the detailed profile data we expect
export type CurrentUserProfileData = Prisma.UserGetPayload<{
  include: {
    _count: {
      select: {
        posts: true;
        followers: true;
        following: true;
      };
    };
    pets: {
      where: { isActive: true };
      orderBy: { createdAt: 'asc' };
      take: 5;
      select: { id: true; name: true; primaryImageUrl: true; breed: true };
    };
    posts: {
       where: { isArchived: false }; // Get owner's own posts (including non-public)
       orderBy: { createdAt: 'desc' };
       take: 10; // Limit initial posts
       include: {
          author: { // Still needed for PostCard consistency
              select: { id: true; username: true; avatarUrl: true; fullName: true };
          };
          _count: { // Needed for PostCard interactions
              select: { likes: true; comments: true };
          };
       };
    };
    // Include other relations as needed, e.g., achievements when ready
  };
}>;

export async function getCurrentUserProfileData(): Promise<CurrentUserProfileData | null> {
  // 1. Get the basic auth user and profile info
  const { authUser } = await getUserData();

  // 2. If not logged in, return null
  if (!authUser) {
    return null;
  }

  // 3. Fetch the detailed profile data from Prisma using the authUser's ID
  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: {
        // Include counts
        _count: {
          select: {
            posts: { where: { isArchived: false } }, // Count only active posts
            followers: true,
            following: true,
          },
        },
        // Include some pets for the sidebar
        pets: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
          take: 5, // Limit initial pet display
          select: { id: true, name: true, primaryImageUrl: true, breed: true }
        },
        // Include some posts for the main feed
        posts: {
           where: { isArchived: false }, // Show all owner's posts
           orderBy: { createdAt: 'desc' },
           take: 10, // Limit initial posts
           include: {
              // Include data needed by PostCard
              author: {
                  select: { id: true, username: true, avatarUrl: true, fullName: true }
              },
              _count: {
                  select: { likes: true, comments: true }
              }
           }
        }
        // TODO: Include achievements, liked posts, etc., when implementing those sections
      },
    });

    // If somehow the Prisma profile doesn't exist for a logged-in user (shouldn't happen after signup fix)
    if (!userProfile) {
        console.error(`Profile data not found in Prisma for logged-in user ID: ${authUser.id}`);
        return null; // Or handle differently, maybe redirect to a setup page?
    }

    // Type assertion might be needed if Prisma's inference isn't perfect, but usually works.
    return userProfile as CurrentUserProfileData;

  } catch (error) {
    console.error(`Error fetching detailed profile data for user ID: ${authUser.id}`, error);
    // Decide how to handle DB errors - maybe return null, maybe throw
    return null;
  }
}