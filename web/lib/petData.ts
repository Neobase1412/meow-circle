// web/lib/petData.ts
import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';


// Define the type for the detailed Pet Profile data
export type PetProfileData = Prisma.PetGetPayload<{
    include: {
        owner: { // Include owner info
            select: {
                id: true;
                username: true;
                avatarUrl: true;
                fullName: true;
            };
        };
        healthRecords: { // Include health records
            orderBy: {
                date: 'desc'; // Order by date descending
            };
            take: 10; // Limit initial load
        };
        lifeRecords: { // Include life records (for activities)
             orderBy: {
                recordDate: 'desc';
            };
            take: 10; // Limit initial load
        };
        // Optional: Include albums/photos for gallery later
        // albums: {
        //     include: {
        //         photos: {
        //             take: 6,
        //             orderBy: { createdAt: 'desc' }
        //         }
        //     },
        //     take: 3
        // }
        // Optional: Include posts linked via tags if implemented
    };
}>;

// Function to fetch pet profile data by ID
export async function getPetProfileData(petId: string): Promise<PetProfileData> {
    if (!petId) {
        console.warn("getPetProfileData called with empty petId.");
        notFound();
    }

    let petData: PetProfileData | null = null;

    try {
        petData = await prisma.pet.findUnique({
            where: { id: petId },
            include: {
                owner: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                        fullName: true,
                    },
                },
                healthRecords: {
                    orderBy: { date: 'desc' },
                    take: 10,
                },
                lifeRecords: { // Assuming LifeRecord represents activities
                    orderBy: { recordDate: 'desc' },
                    take: 10,
                },
                 // TODO: Include albums/photos later for gallery
                 // albums: { ... }
            },
        });

    } catch (error) {
        console.error(`Error fetching pet profile data for ID: ${petId}`, error);
        // Trigger 404 for other unexpected errors during fetch
        notFound();
    }

    // If findUnique completes without error but returns null
    if (!petData) {
        notFound();
    }

    return petData as PetProfileData; // Assert non-null due to notFound() calls
}