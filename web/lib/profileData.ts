// web/lib/profileData.ts
import prisma from '@/lib/prisma';
import { getUserData } from '@/lib/userData'; // Use our existing helper
import { Prisma } from '@prisma/client'; // Ensure Prisma namespace is imported as a value
import type { User as AuthUser } from '@supabase/supabase-js'; // Type import is fine here
import { notFound } from 'next/navigation'; // Import notFound

// --- TYPE for Logged-In User's Profile ---
// Includes potentially non-public posts and other details
export type CurrentUserProfileData = Prisma.UserGetPayload<{
  include: {
    _count: {
      select: {
        posts: { where: { isArchived: false } }; // Count owner's active posts
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
          author: { // Needed for PostCard consistency
              select: { id: true; username: true; avatarUrl: true; fullName: true };
          };
          _count: { // Needed for PostCard interactions
              select: { likes: true; comments: true };
          };
       };
    };
    // TODO: Include other relations like settings, private lists, etc.
  };
}>;

// --- FUNCTION for Logged-In User's Profile (`/profile`) ---
export async function getCurrentUserProfileData(): Promise<CurrentUserProfileData | null> {
  // 1. Get the basic auth user info
  const { authUser } = await getUserData();

  // 2. If not logged in, return null (page component should handle redirect)
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
            posts: { where: { isArchived: false } }, // Count owner's active posts
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
           where: { isArchived: false }, // Show owner's own posts
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
        // TODO: Include other owner-specific data
      },
    });

    // If somehow the Prisma profile doesn't exist for a logged-in user
    if (!userProfile) {
        console.error(`Profile data not found in Prisma for logged-in user ID: ${authUser.id}`);
        return null; // The page component calling this should handle this null case (e.g., redirect)
    }

    return userProfile as CurrentUserProfileData; // Type assertion

  } catch (error) {
    console.error(`Error fetching detailed profile data for user ID: ${authUser.id}`, error);
    // Depending on policy, might return null or throw an error
    return null;
  }
}


// --- TYPE for Other User's Public Profile ---
// Includes only public data
export type PublicProfileData = Prisma.UserGetPayload<{
    include: {
        _count: {
            select: {
                // Count only public posts for other users' profiles
                posts: { where: { visibility: 'PUBLIC', isArchived: false } };
                followers: true;
                following: true;
            };
        };
        // Fetch only public/active pets
        pets: {
            where: { isActive: true }; // Add other public filters if needed
            orderBy: { createdAt: 'asc' };
            take: 5;
            select: { id: true; name: true; primaryImageUrl: true; breed: true };
        };
        // Fetch only public posts
        posts: {
            where: { visibility: 'PUBLIC', isArchived: false };
            orderBy: { createdAt: 'desc' };
            take: 10;
            include: {
                author: { // Needed for PostCard
                    select: { id: true; username: true; avatarUrl: true; fullName: true };
                };
                _count: { // Needed for PostCard
                    select: { likes: true; comments: true };
                };
            };
        };
        // TODO: Add public achievements if applicable
    };
}>;

// --- FUNCTION for Other User's Profile (`/profile/[id]`) ---
// Returns non-nullable or calls notFound()
export async function getPublicProfileDataById(userId: string): Promise<PublicProfileData> {
    if (!userId) {
        console.warn("getPublicProfileDataById called with empty userId.");
        notFound();
    }

    let profileOwner: PublicProfileData | null = null;

    try {
        // Use findUnique to fetch the user by their ID
        profileOwner = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                 // Include counts (public perspective)
                _count: {
                    select: {
                        posts: { where: { visibility: 'PUBLIC', isArchived: false } },
                        followers: true,
                        following: true,
                    },
                },
                // Include public pets
                pets: {
                    where: { isActive: true }, // Add isPublic if you implement pet privacy
                    orderBy: { createdAt: 'asc' },
                    take: 5,
                    select: { id: true, name: true, primaryImageUrl: true, breed: true }
                },
                // Include public posts
                posts: {
                    where: { visibility: 'PUBLIC', isArchived: false },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    include: {
                        author: { select: { id: true, username: true, avatarUrl: true, fullName: true } },
                        _count: { select: { likes: true, comments: true } }
                    }
                }
                // TODO: Add public achievements
            },
        });

    } catch (error) {
        // Handle potential Prisma errors like invalid ID format
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
             if (error.code === 'P2023' || error.code === 'P2025') { // P2023: Invalid ID format, P2025: Record not found potentially
                 console.error(`Error fetching profile: Invalid ID or record not found for ${userId}`, error.message);
                 notFound();
             }
        }
        // Log other unexpected errors
        console.error(`Unexpected error fetching public profile data for user ID: ${userId}`, error);
        // Trigger 404 for unexpected errors during fetch as well
        notFound();
    }

    // If findUnique completes without error but returns null (user not found)
    if (!profileOwner) {
        notFound();
    }

    // If we reach here, profileOwner is guaranteed to be non-null due to notFound() calls
    return profileOwner as PublicProfileData; // Use assertion because notFound exits the function
}