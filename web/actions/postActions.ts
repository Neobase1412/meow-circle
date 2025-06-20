// web/actions/postActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { Visibility, MediaType } from '@prisma/client'; // Import enums
import { Prisma } from '@prisma/client';

// Schema for creating a post
const CreatePostSchema = z.object({
  content: z.string().min(1, "內容不能為空").max(10000, "內容過長"), // Adjust max length as needed
  visibility: z.nativeEnum(Visibility).default(Visibility.PUBLIC),
  mediaUrls: z.array(z.string().url("無效的媒體 URL")).optional().default([]),
  // Add mood, location etc. later if needed
  // mood: z.string().max(50).optional(),
  // location: z.string().max(100).optional(),
});

// Input type for the action function
interface CreatePostInput {
    content: string;
    visibility: Visibility;
    mediaUrls?: string[];
    // mood?: string;
    // location?: string;
}


export async function createPostAction(
  input: CreatePostInput
): Promise<{ success: boolean; error?: string; postId?: string }> {
  const supabase = await createClient();

  // 1. Get current user
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser) {
    return { success: false, error: '使用者未登入或驗證失敗' };
  }

  // 2. Validate input data
  const validationResult = CreatePostSchema.safeParse(input);
  if (!validationResult.success) {
    console.error("Create Post Validation Error:", validationResult.error.flatten());
    // Consider returning specific field errors if needed by the form
    return { success: false, error: '輸入資料無效' };
  }

  const { content, visibility, mediaUrls } = validationResult.data;

  // Determine media type based on URLs provided
  const mediaType = mediaUrls.length > 0 ? MediaType.IMAGE : MediaType.NONE; // Default to IMAGE if URLs exist, adjust if video etc. added

  try {
    // 3. Create post in Prisma
    const newPost = await prisma.post.create({
      data: {
        authorId: authUser.id,
        content: content,
        visibility: visibility,
        mediaUrls: mediaUrls,
        mediaType: mediaType,
        // Add mood, location here if included in input
      },
      select: { id: true } // Select the ID of the newly created post
    });

    // 4. Revalidate relevant paths
    // Revalidate pages where posts are displayed
    revalidatePath('/community');
    revalidatePath('/'); // Homepage if it shows latest posts
    revalidatePath('/profile'); // Owner's profile page
    // Consider revalidating the specific user's profile page if using ID-based routing
    // revalidatePath(`/profile/${authUser.id}`);

    console.log(`Post created successfully: ${newPost.id} by user ${authUser.id}`);
    return { success: true, postId: newPost.id };

  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, error: '無法建立貼文，請稍後再試' };
  }
}

// --- Action to Toggle Like on a Post ---
export async function toggleLikeAction(
    postId: string
): Promise<{ success: boolean; error?: string; newState: boolean }> {
    if (!postId) return { success: false, error: 'Post ID is required.', newState: false };

    const supabase = await createClient();

    // 1. Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'User not authenticated', newState: false };
    }
    const userId = user.id;

    try {
        // 2. Check if like exists
        const existingLike = await prisma.like.findFirst({
            where: {
                userId: userId,
                postId: postId,
                commentId: null, // Ensure we are liking the post, not a comment
            },
            select: { id: true }
        });

        let isLiked: boolean;

        // 3. Perform action
        if (existingLike) {
            // --- Unlike ---
            await prisma.like.delete({
                where: { id: existingLike.id }
            });
            console.log(`User ${userId} unliked Post ${postId}`);
            isLiked = false;
        } else {
            // --- Like ---
            await prisma.like.create({
                data: {
                    userId: userId,
                    postId: postId,
                    commentId: null, // Explicitly set commentId to null for post likes
                }
            });
            console.log(`User ${userId} liked Post ${postId}`);
            isLiked = true;
             // TODO: Create notification for post author?
        }

        // 4. Revalidate paths where like counts might appear
        revalidatePath('/');
        revalidatePath('/community');
        revalidatePath('/profile');
        // Revalidate specific post page if exists: revalidatePath(`/post/${postId}`);
        // Revalidate author's profile page: (need author id)
        // Revalidate liker's liked posts list?

        return { success: true, newState: isLiked };

    } catch (error) {
        console.error("Error toggling like:", error);
        return { success: false, error: 'Failed to update like status.', newState: false };
    }
}


// --- Action to Toggle Save/Bookmark (Collection) on a Post ---
export async function toggleSaveAction(
    postId: string
): Promise<{ success: boolean; error?: string; newState: boolean }> {
    if (!postId) return { success: false, error: 'Post ID required.', newState: false };

    const supabase = await createClient();

    // 1. Get user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'User not authenticated', newState: false };
    }
    const userId = user.id;

    try {
        // 2. Check if collection item exists
        const existingCollection = await prisma.collection.findUnique({
            where: {
                userId_postId: { // Use the @@unique constraint fields
                    userId: userId,
                    postId: postId,
                }
            },
            select: { id: true }
        });

        let isSaved: boolean;

        // 3. Perform action
        if (existingCollection) {
            // --- Unsave ---
            await prisma.collection.delete({
                where: { id: existingCollection.id }
            });
            console.log(`User ${userId} unsaved Post ${postId}`);
            isSaved = false;
        } else {
            // --- Save ---
            await prisma.collection.create({
                data: {
                    userId: userId,
                    postId: postId,
                }
            });
            console.log(`User ${userId} saved Post ${postId}`);
            isSaved = true;
        }

        // 4. Revalidate paths where collections might appear
        revalidatePath('/profile'); // User's own profile (e.g., Collections tab)
        revalidatePath('/'); // If saved status shown on feed cards visually
        revalidatePath('/community');

        return { success: true, newState: isSaved };

    } catch (error) {
        console.error("Error toggling save:", error);
        return { success: false, error: 'Failed to update save status.', newState: false };
    }
}