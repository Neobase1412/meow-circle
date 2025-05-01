// web/lib/petLifeData.ts
import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

// Define type for ServiceCard data
export type RecommendedServiceData = Prisma.ServiceGetPayload<{
    include: {
        provider: { // Include provider name
            select: { name: true, ratingAvg: true, reviewCount: true }; // Select needed provider fields
        };
        // Optional: Include average rating directly on service if calculated
        // Optional: Include price range from items if needed
    };
}>;

// TODO: Define type for HealthTipCard data when model exists

export async function getPetLifePageData() {
    // Fetch recommended services
    const recommendedServices: RecommendedServiceData[] = await prisma.service.findMany({
        where: {
            isRecommended: true,
            isActive: true,
        },
        include: {
            provider: { // Include provider details needed for the card
                select: { name: true, ratingAvg: true, reviewCount: true }
            },
        },
        take: 6, // Number of recommended services to show
    });

    // TODO: Fetch Health Tips when model exists
    const healthTips: any[] = [ // Keep mock data for now
         { id: 1, title: "貓咪夏季防中暑指南", content: "...", imageUrl: "/images/tips/tip1.jpg", },
         { id: 2, title: "貓咪牙齒保健全攻略", content: "...", imageUrl: "/images/tips/tip2.jpg", },
         { id: 3, title: "室內貓咪運動指南", content: "...", imageUrl: "/images/tips/tip3.jpg", },
    ];

    return {
        recommendedServices,
        healthTips,
    };
}