// web/actions/userActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Define a schema for the profile data to be updated
// Make fields optional as the user might not update everything
const UpdateProfileSchema = z.object({
  fullName: z.string().min(1, "Name cannot be empty").max(100).optional().or(z.literal('')), // Allow empty string to clear
  username: z.string().min(3, "Username must be at least 3 characters").max(50).optional(),
  bio: z.string().max(500, "Bio is too long").optional().or(z.literal('')),
  // Add other fields like location, website if they are top-level fields in your User model
  // If they are inside a JSON 'settings' field, validation/update needs adjustment
  // location: z.string().max(100).optional().or(z.literal('')),
  // website: z.string().url("Invalid URL").max(100).optional().or(z.literal('')),
});

export async function updateUserProfile(
  formData: unknown // Use unknown for initial input, validate with Zod
): Promise<{ success: boolean; error?: string; updatedUser?: { username: string | null } }> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 1. Get current user
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser) {
    return { success: false, error: 'User not authenticated' };
  }

  // 2. Validate form data
  const validationResult = UpdateProfileSchema.safeParse(formData);
  if (!validationResult.success) {
    console.error("Update Profile Validation Error:", validationResult.error.flatten());
    return { success: false, error: 'Invalid data provided.', details: validationResult.error.flatten() };
  }

  const dataToUpdate = validationResult.data;

  // Prevent updating fields that weren't intended if they are empty in the schema result
  // (e.g., if username wasn't in formData, dataToUpdate.username would be undefined)
  // Clean the object from undefined values
   Object.keys(dataToUpdate).forEach(key => dataToUpdate[key] === undefined && delete dataToUpdate[key]);


  try {
    // 3. Check username uniqueness if username is being updated
    if (dataToUpdate.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: dataToUpdate.username,
          id: { not: authUser.id }, // Exclude the current user
        },
        select: { id: true }
      });
      if (existingUser) {
        return { success: false, error: 'Username already taken.' };
      }
    }

    // 4. Update user in Prisma
    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: dataToUpdate, // Pass the validated and potentially cleaned data
      select: { username: true } // Select username to return if needed
    });

    // 5. Revalidate relevant paths
    revalidatePath(`/${authUser.id}`); // Revalidate the user's ID-based profile (if exists)
    revalidatePath('/profile'); // Revalidate the owner's profile page
    revalidatePath('/settings'); // Revalidate the settings page itself
    revalidatePath('/'); // Revalidate home if UserProfileCard is there

    return { success: true, updatedUser };

  } catch (error) {
    console.error("Error updating user profile:", error);
    // Handle potential database errors (e.g., constraint violations if validation missed something)
    return { success: false, error: 'Failed to update profile.' };
  }
}


// Separate action for updating avatar URL
export async function updateUserAvatar(
    avatarUrl: string
): Promise<{ success: boolean; error?: string }> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // 1. Get user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
        return { success: false, error: 'User not authenticated' };
    }

     // 2. Basic validation for URL (can be more robust)
    if (!avatarUrl || typeof avatarUrl !== 'string' || avatarUrl.length < 5) {
         return { success: false, error: 'Invalid Avatar URL provided' };
    }


    // 3. Update avatarUrl in Prisma
    try {
        await prisma.user.update({
            where: { id: authUser.id },
            data: { avatarUrl: avatarUrl },
        });

        // 4. Revalidate paths
        revalidatePath(`/${authUser.id}`);
        revalidatePath('/profile');
        revalidatePath('/settings');
        revalidatePath('/');

        return { success: true };

    } catch (error) {
        console.error("Error updating user avatar:", error);
        return { success: false, error: 'Failed to update avatar.' };
    }
}