// web/actions/discussionActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { DiscussionStatus } from '@prisma/client'; // Import enum

// Schema for creating a discussion
const CreateDiscussionSchema = z.object({
  title: z.string().min(5, "標題至少需要 5 個字").max(150, "標題過長"),
  content: z.string().max(10000, "內容過長").optional(), // Content is optional
  // Optional: Add topicId or tagIds later
  // topicId: z.string().cuid().optional(),
  // tagIds: z.array(z.string().cuid()).optional(),
});

// Input type for the action function
interface CreateDiscussionInput {
    title: string;
    content?: string;
    // topicId?: string;
    // tagIds?: string[];
}

export async function createDiscussionAction(
  input: CreateDiscussionInput
): Promise<{ success: boolean; error?: string; discussionId?: string }> {
  const supabase = await createClient();

  // 1. Get current user
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser) {
    return { success: false, error: '使用者未登入或驗證失敗' };
  }

  // 2. Validate input data
  const validationResult = CreateDiscussionSchema.safeParse(input);
  if (!validationResult.success) {
    console.error("Create Discussion Validation Error:", validationResult.error.flatten());
    // Example: Return first field error
    const firstError = validationResult.error.errors[0]?.message;
    return { success: false, error: firstError || '輸入資料無效' };
  }

  const { title, content /*, topicId, tagIds */ } = validationResult.data;

  try {
    // 3. Create discussion in Prisma
    const newDiscussion = await prisma.discussion.create({
      data: {
        authorId: authUser.id,
        title: title,
        content: content || null, // Store null if content is empty/undefined
        status: DiscussionStatus.OPEN,
        // Optional: Connect topic/tags if IDs are provided
        // topicId: topicId,
        // tags: tagIds ? { connect: tagIds.map(id => ({ id })) } : undefined,
      },
      select: { id: true } // Select the ID of the newly created discussion
    });

    // 4. Revalidate relevant paths
    revalidatePath('/discussion'); // Revalidate the main discussion page

    console.log(`Discussion created successfully: ${newDiscussion.id} by user ${authUser.id}`);
    return { success: true, discussionId: newDiscussion.id };

  } catch (error) {
    console.error("Error creating discussion:", error);
    return { success: false, error: '無法建立討論，請稍後再試' };
  }
}