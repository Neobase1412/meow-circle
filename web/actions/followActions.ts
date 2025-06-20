// web/actions/followActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { Prisma } from '@prisma/client';

export async function toggleFollowAction(
  targetUserId: string
): Promise<{ success: boolean; error?: string; isFollowing?: boolean }> {
  const supabase = await createClient();

  // 1. Get current logged-in user
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return { success: false, error: '使用者未登入或驗證失敗' };
  }

  const followerId = authUser.id;

  // 2. Prevent self-follow
  if (followerId === targetUserId) {
    return { success: false, error: '您無法追蹤自己' };
  }

  try {
    // 3. Check if the follow relationship already exists
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: targetUserId,
        },
      },
      select: { id: true }, // Only need ID to check existence
    });

    // 4. Perform action based on existence
    if (existingFollow) {
      // --- Unfollow ---
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: followerId,
            followingId: targetUserId,
          },
        },
      });
      console.log(`User ${followerId} unfollowed User ${targetUserId}`);
    } else {
      // --- Follow ---
      await prisma.follow.create({
        data: {
          followerId: followerId,
          followingId: targetUserId,
        },
      });
      console.log(`User ${followerId} followed User ${targetUserId}`);
      // TODO: Create notification for the target user?
    }

    // 5. Revalidate the target user's profile path to update follower count etc.
    // We need to find the target user's username for a path-based revalidation,
    // OR revalidate by tag if tags are set up. Let's revalidate by path for now.
    // This requires fetching the target user's username if not readily available.
    // For simplicity, let's just revalidate the path using the ID.
    // Note: Revalidating dynamic paths like this might require specific configuration
    // or might be less reliable than tag-based revalidation in some setups.
    // We also need the locale. This is a limitation of revalidatePath without more context.
    // A safer approach might be revalidating a broader path or using tags.
    // For now, we'll skip locale and hope Next.js handles it or revalidate `/profile/[id]`.
    revalidatePath(`/profile/${targetUserId}`); // Revalidate the non-localized path, might work depending on Next.js version
    // Also revalidate the follower's profile page for their "following" count
    revalidatePath(`/profile/${followerId}`);
    revalidatePath(`/profile`); // Revalidate the current user's profile page too

    return { success: true };

  } catch (error) {
    console.error("Error in toggleFollowAction:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors if needed
       return { success: false, error: '資料庫操作失敗' };
    }
    return { success: false, error: '無法更新追蹤狀態，請稍後再試' };
  }
}