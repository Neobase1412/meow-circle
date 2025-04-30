// web/actions/postActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { Visibility, MediaType } from '@prisma/client'; // Import enums

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
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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

// --- Keep other actions like toggleFollowAction if they exist ---