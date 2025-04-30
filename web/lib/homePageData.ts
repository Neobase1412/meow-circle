// web/lib/homePageData.ts
import prisma from '@/lib/prisma';
import { Visibility } from '@prisma/client';
import type { Prisma } from '@prisma/client';

// Import or define types needed by consuming components
import type { PostForCommunityFeed, TagForCommunitySidebar } from '@/lib/communityData'; // Reuse types if suitable

// TODO: Define Product type when schema is available
// import type { Product } from '@prisma/client';
// export type RecommendedProduct = Pick<Product, 'id' | 'name' | 'price' | 'imageUrl' | ...>; // Define fields needed for FeaturedProductCard

export async function getHomePageData() {
    // Fetch latest public posts (similar to community page)
    const latestPosts: PostForCommunityFeed[] = await prisma.post.findMany({
        where: {
            visibility: Visibility.PUBLIC,
            isArchived: false,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 10, // Adjust number of posts for homepage feed
        include: {
            author: {
                select: { id: true, username: true, avatarUrl: true, fullName: true }
            },
            _count: {
                select: { likes: true, comments: true }
            }
        }
    });

    // Fetch top tags (similar to community page)
    const topTags: TagForCommunitySidebar[] = await prisma.tag.findMany({
        orderBy: {
            count: 'desc', // Assumes 'count' is updated accurately
        },
        take: 7, // Adjust number of tags for homepage sidebar
        select: { id: true, name: true, count: true }
    });

    // TODO: Fetch recommended products when Product model/data is ready
    const recommendedProducts: any[] = []; // Placeholder
    /*
    const recommendedProducts = await prisma.product.findMany({
        where: {
            OR: [
                { isRecommended: true },
                { isPopular: true } // Adjust logic as needed
            ],
            // Add other conditions like 'isActive: true'
        },
        orderBy: {
             // Define sorting, e.g., popularity score or creation date
             createdAt: 'desc'
        },
        take: 3,
        select: { // Select fields needed by FeaturedProductCard
            id: true, name: true, price: true, imageUrl: true, slug: true // Add necessary fields
        }
    });
    */

    return {
        latestPosts,
        topTags,
        recommendedProducts, // Will be empty for now
    };
}