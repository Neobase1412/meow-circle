// web/lib/discussionData.ts
import prisma from '@/lib/prisma';
// Removed Visibility as we query Discussion directly now
import { TopicCategory } from '@prisma/client'; // Assuming you might want to filter by TopicCategory later
import type { Prisma } from '@prisma/client';

// Type for DiscussionCard data
export type DiscussionForFeed = Prisma.DiscussionGetPayload<{
    include: {
        author: {
            select: { id: true; username: true; avatarUrl: true; fullName: true };
        };
        topic: { // Include topic title if available
            select: { title: true };
        };
        _count: {
            select: { comments: true }; // Count related comments
        };
        // Note: We are not including comments themselves here for performance.
        // They would be fetched on the individual discussion page.
    };
}>;

// Type for TopicCard data (can reuse from communityData or keep separate)
export type TopicForDiscussionSidebar = Prisma.TopicGetPayload<{
    select: { id: true; title: true; description: true; iconUrl: true; followerCount: true; postCount: true; isOfficial: true };
}>;

// Type for Tag data (can reuse from communityData)
export type TagForDiscussionFilter = Prisma.TagGetPayload<{
     select: { id: true; name: true; count: true };
}>;


// Fetch data needed for the main discussion page
export async function getDiscussionPageData() {
    // Fetch latest discussions
    const latestDiscussions: DiscussionForFeed[] = await prisma.discussion.findMany({
        where: {
            // Add filters if needed, e.g., status: 'OPEN'
            status: 'OPEN',
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 20, // Number of discussions per page/load
        include: {
            author: { // Include author details
                select: { id: true, username: true, avatarUrl: true, fullName: true }
            },
             topic: { // Include topic title if linked
                select: { title: true }
            },
            _count: { // Include counts
                select: { comments: true }
            }
            // NOTE: Discussion schema has viewCount directly, no need for _count.viewCount
            // Select it directly if needed: select: { viewCount: true }
        }
    });

    // Fetch popular topics for the sidebar (same as before)
    const popularTopics: TopicForDiscussionSidebar[] = await prisma.topic.findMany({
        orderBy: {
            followerCount: 'desc',
        },
        take: 5,
        select: { id: true, title: true, description: true, iconUrl: true, followerCount: true, postCount: true, isOfficial: true }
    });

    // Fetch categories/tags for filtering (Using Top Tags example)
    const filterCategories: TagForDiscussionFilter[] = await prisma.tag.findMany({
         orderBy: {
            count: 'desc',
         },
         take: 6,
         select: { id: true, name: true, count: true }
    });

    return {
        latestDiscussions,
        popularTopics,
        filterCategories,
    };
}