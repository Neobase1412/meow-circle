// web/lib/communityData.ts
import prisma from '@/lib/prisma';
import { Visibility } from '@prisma/client';
import type { Prisma } from '@prisma/client';

// Type definition for PostCard data (can be shared or defined where needed)
export type PostForCommunityFeed = Prisma.PostGetPayload<{
    include: {
        author: {
            select: { id: true; username: true; avatarUrl: true; fullName: true };
        };
        _count: {
            select: { likes: true; comments: true };
        };
    };
}>;

// Type definition for TopicCard data
export type TopicForCommunitySidebar = Prisma.TopicGetPayload<{
    select: {
        id: true;
        title: true;
        description: true;
        iconUrl: true;
        followerCount: true;
        postCount: true;
        isOfficial: true; // <-- Add this field
    };
}>;

// Type definition for Tag data
export type TagForCommunitySidebar = Prisma.TagGetPayload<{
     select: { id: true; name: true; count: true };
}>;


// Fetch data needed for the main community page
export async function getCommunityPageData() {
    // Fetch latest public posts
    const latestPosts: PostForCommunityFeed[] = await prisma.post.findMany({
        where: {
            visibility: Visibility.PUBLIC,
            isArchived: false,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 15, // Fetch a reasonable number
        include: {
            author: {
                select: { id: true, username: true, avatarUrl: true, fullName: true }
            },
            _count: {
                select: { likes: true, comments: true }
            }
        }
    });

    // Fetch top tags
    const topTags: TagForCommunitySidebar[] = await prisma.tag.findMany({
        orderBy: {
            count: 'desc', // Assumes 'count' is updated accurately
        },
        take: 10,
        select: { id: true, name: true, count: true }
    });

     // Fetch official topics
     const officialTopics: TopicForCommunitySidebar[] = await prisma.topic.findMany({
        where: { isOfficial: true },
        orderBy: { followerCount: 'desc' },
        take: 5,
        select: { id: true, title: true, description: true, iconUrl: true, followerCount: true, postCount: true, isOfficial: true } // <-- Select isOfficial
    });

    // Fetch community topics
    const communityTopics: TopicForCommunitySidebar[] = await prisma.topic.findMany({
        where: { isOfficial: false },
         orderBy: { followerCount: 'desc' },
        take: 5,
        select: { id: true, title: true, description: true, iconUrl: true, followerCount: true, postCount: true, isOfficial: true } // <-- Select isOfficial
    });

    return {
        latestPosts,
        topTags,
        officialTopics,
        communityTopics,
    };
}