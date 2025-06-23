// web/actions/authActions.ts
'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server'; 

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
// Note: We don't strictly need server-side Supabase client here if we trust
// the authUserId passed immediately after signUp, but it could be added for extra validation.

// Zod schema for input validation
const CreateProfileSchema = z.object({
  authUserId: z.string().uuid("Invalid User ID format"),
  email: z.string().email("Invalid email format"),
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username too long"),
});

export async function createProfileServerAction(input: {
  authUserId: string;
  email: string;
  username: string;
}) {
  console.log("Server Action: createProfileServerAction called with:", input); // Add logging

  // Validate input
  const validationResult = CreateProfileSchema.safeParse(input);
  if (!validationResult.success) {
    console.error("Server Action Validation Error:", validationResult.error.flatten());
    return { success: false, error: '輸入資料無效', details: validationResult.error.flatten() };
  }

  const { authUserId, email, username } = validationResult.data;

  try {
    // Check if user already exists in Prisma (by Supabase Auth ID)
    const existingUser = await prisma.user.findUnique({
      where: { id: authUserId }, // Assuming your Prisma User.id stores the Supabase Auth User ID
    });

    if (existingUser) {
      console.log(`Server Action: User ${authUserId} already exists in Prisma.`);
      // Not necessarily an error, maybe just return success
      return { success: true, message: '用戶資料已存在' };
    }

    // Check if email or username is already taken by another user (optional but recommended)
     const conflictCheck = await prisma.user.findFirst({
        where: {
            OR: [
                { email: email },
                { username: username }
            ],
            // Ensure we are not comparing against the user we are about to create
            // This check is more relevant for updates, less critical here if ID is unique
            // BUT still useful if somehow the email/username exists without the auth ID linked
            // id: { not: authUserId } // Reconsider if needed right after signup
        }
    });

     if (conflictCheck) {
        let conflictField = conflictCheck.email === email ? 'Email' : 'Username';
        console.warn(`Server Action: Conflict found for ${conflictField}: ${input.email}/${input.username}`);
        return { success: false, error: `${conflictField === 'Email' ? '電子郵件' : '用戶名稱'}已被使用` };
    }


    // Create the user profile in Prisma
    console.log(`Server Action: Creating user in Prisma for ${authUserId}...`);
    await prisma.user.create({
      data: {
        id: authUserId, // Store Supabase Auth ID as the primary key in Prisma User table
        email: email,
        username: username,
        // Add other default fields from your Prisma schema if necessary
        // e.g., role: 'USER', membershipLevel: 'REGULAR', etc.
        role: 'USER',
        membershipLevel: 'REGULAR',
        joinedAt: new Date(),
        isActive: true, // Assuming user is active immediately unless email verification is pending externally
      },
    });
    console.log(`Server Action: User ${authUserId} created successfully in Prisma.`);

    return { success: true };

  } catch (error) {
    console.error("Server Action Prisma Error:", error);
    // Log the detailed error on the server, return a generic message to the client
    return { success: false, error: '無法建立用戶資料，請稍後再試' };
  }
}

// --- Action to Update User Email ---
const UpdateEmailSchema = z.object({
  newEmail: z.string().email("請輸入有效的電子郵件地址"),
});

export async function updateUserEmailAction(
  formData: unknown
): Promise<{ success: boolean; error?: string; message?: string }> {
  const supabase = await createClient(); // Use server client helper

  // 1. Get current user session (to ensure user is logged in)
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.user) {
    return { success: false, error: '使用者未登入或驗證失敗' };
  }

  // 2. Validate input
  const validationResult = UpdateEmailSchema.safeParse(formData);
  if (!validationResult.success) {
      return { success: false, error: validationResult.error.errors[0]?.message || '無效的電子郵件格式' };
  }
  const { newEmail } = validationResult.data;

   // 3. Check if email is actually different
   if (newEmail === session.user.email) {
        return { success: false, error: '新電子郵件與目前的相同' };
   }

  // 4. Call Supabase Auth to update email
  // This will typically send confirmation emails to both old and new addresses
  // if "Secure email change" is enabled in Supabase project settings.
  const { data, error: updateError } = await supabase.auth.updateUser({
    email: newEmail
  });

  if (updateError) {
    console.error("Supabase email update error:", updateError);
    // Handle specific Supabase errors if needed (e.g., email rate limit)
    return { success: false, error: updateError.message || '無法更新電子郵件，請稍後再試' };
  }

  // Revalidation might not be strictly necessary immediately if email change requires confirmation,
  // but doesn't hurt. The UI should show a pending state.
  revalidatePath('/settings');

  // Provide feedback based on Supabase settings (confirmation needed?)
  // The actual confirmation status isn't directly available here easily,
  // so provide a general message.
  return { success: true, message: '電子郵件更新請求已送出。請檢查您的新舊信箱以確認變更。' };
}


// --- Action to Update User Password ---
const UpdatePasswordSchema = z.object({
    newPassword: z.string().min(6, "新密碼至少需要 6 個字元"), // Adjust min length as needed
    // currentPassword: z.string().optional(), // Not needed for default Supabase update
});

export async function updateUserPasswordAction(
    formData: unknown
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    // 1. Get current user (ensure logged in)
     const { data: { user }, error: authError } = await supabase.auth.getUser();
     if (authError || !user) {
        return { success: false, error: '使用者未登入或驗證失敗' };
     }

    // 2. Validate input
    const validationResult = UpdatePasswordSchema.safeParse(formData);
    if (!validationResult.success) {
        return { success: false, error: validationResult.error.errors[0]?.message || '無效的密碼格式' };
    }
    const { newPassword } = validationResult.data;

    // 3. Call Supabase Auth to update password
    const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (updateError) {
        console.error("Supabase password update error:", updateError);
        return { success: false, error: updateError.message || '無法更新密碼，請稍後再試' };
    }

    // No path revalidation needed as data didn't change, but could clear session potentially?
    // For security, Supabase might invalidate other sessions after password change.

    return { success: true };
}