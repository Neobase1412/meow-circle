// web/actions/authActions.ts
'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
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