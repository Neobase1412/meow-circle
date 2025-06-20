// web/actions/petActions.ts
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { PetGender } from '@prisma/client';
import { Prisma } from '@prisma/client';

// Expanded schema for creating a pet
const CreatePetSchema = z.object({
  name: z.string().min(1, "寵物名字不能為空").max(100),
  breed: z.string().max(100).optional().or(z.literal('')), // Allow empty string for optional
  gender: z.nativeEnum(PetGender).optional(),
  birthDate: z.coerce.date().optional().nullable(), // Coerce string/null to Date or null
  adoptionDate: z.coerce.date().optional().nullable(),
  chipNumber: z.string().max(50).optional().or(z.literal('')),
  weight: z.coerce.number().positive("體重必須是正數").optional().nullable(), // Coerce string/null to number or null
  description: z.string().max(1000, "描述過長").optional().or(z.literal('')),
  primaryImageUrl: z.string().url("無效的圖片 URL").optional().or(z.literal('')), // URL comes from storage upload
});

// Input type derived from schema
type CreatePetInput = z.infer<typeof CreatePetSchema>;

export async function createPetAction(
  input: CreatePetInput // Use the inferred type
): Promise<{ success: boolean; error?: string; petId?: string }> {
  const supabase = await createClient();

  // 1. Get user
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser) {
    return { success: false, error: 'User not authenticated' };
  }

  // 2. Validate input
  const validationResult = CreatePetSchema.safeParse(input);
  if (!validationResult.success) {
    console.error("Create Pet Validation Error:", validationResult.error.flatten());
    const firstError = validationResult.error.errors[0]?.message;
    return { success: false, error: firstError || '輸入的寵物資料無效' };
  }

  // Prepare data for Prisma, handling empty strings for optional fields -> null
  const dataToCreate = {
      name: validationResult.data.name,
      ownerId: authUser.id,
      breed: validationResult.data.breed || null,
      gender: validationResult.data.gender, // Optional enum is fine as undefined/value
      birthDate: validationResult.data.birthDate, // Already Date | null
      adoptionDate: validationResult.data.adoptionDate, // Already Date | null
      chipNumber: validationResult.data.chipNumber || null,
      weight: validationResult.data.weight, // Already number | null
      description: validationResult.data.description || null,
      primaryImageUrl: validationResult.data.primaryImageUrl || null,
      isActive: true, // Default to active
  };


  try {
    // 3. Create pet in Prisma
    const newPet = await prisma.pet.create({
      data: dataToCreate, // Use the prepared data object
      select: { id: true }
    });

    // 4. Revalidate relevant paths
    revalidatePath('/profile'); // Revalidate owner's profile (Pets tab)
    revalidatePath('/pets');   // Revalidate general pets page if exists
    revalidatePath(`/pets/${newPet.id}`); // Revalidate the new pet's page

    console.log(`Pet created successfully: ${newPet.id} for user ${authUser.id}`);
    return { success: true, petId: newPet.id };

  } catch (error: any) {
    console.error("Error creating pet:", error);
    // Check for unique constraint violation (e.g., chipNumber)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Check meta field to see which constraint failed
        const failedFields = error.meta?.target as string[];
        if (failedFields?.includes('chipNumber')) {
             return { success: false, error: '此晶片號碼已被登記' };
        }
         return { success: false, error: '寵物資料重複 (Unique constraint failed)' };
    }
    return { success: false, error: '無法新增寵物，資料庫錯誤。' };
  }
}