// app/[locale]/community/page.tsx
import Link from "next/link";
import { type Locale, dictionary } from "@/i18n-config";
// Remove direct prisma import if no longer needed here
// import prisma from "@/lib/prisma";
import { getCommunityPageData } from "@/lib/communityData"; // Import the new function
// Import types if needed for casting, or rely on types from the function
import type { PostForCommunityFeed, TopicForCommunitySidebar, TagForCommunitySidebar } from "@/lib/communityData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/post-card";
import TopicCard from "@/components/topic-card";
import CreatePostCard from "@/components/create-post-card";
// Remove Prisma enum import if not needed directly
// import { Visibility } from '@prisma/client';

// The Page Component (async)
export default async function CommunityPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = dictionary[locale] || dictionary['zh-TW'];

  // Fetch data using the helper function
  const {
    latestPosts,
    topTags,
    officialTopics,
    communityTopics
  } = await getCommunityPageData(); // Call the function from lib

  return (
    <div className="container-custom py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{t["community"]}</h1>
        <p className="text-primary/70">分享您的寵物生活，與其他貓奴交流心得</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <CreatePostCard locale={locale} />

          <Tabs defaultValue="latest">
            <TabsList className="w-full bg-background border border-border">
              <TabsTrigger value="latest" className="flex-1">
                {t["latest-updates"]}
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex-1">
                熱門貼文
              </TabsTrigger>
              <TabsTrigger value="following" className="flex-1">
                追蹤中
              </TabsTrigger>
            </TabsList>

            {/* Latest Posts Tab */}
            <TabsContent value="latest" className="space-y-6 mt-6">
               {latestPosts.length > 0 ? (
                   latestPosts.map((post) => (
                     // Use the imported type for casting if needed, or fix PostCard props
                     <PostCard key={post.id} post={post as PostForCommunityFeed} locale={locale} />
                   ))
               ) : (
                   <div className="text-center py-12">
                      <p className="text-primary/70">目前沒有公開貼文。</p>
                   </div>
               )}
               {/* TODO: Add pagination / load more button */}
            </TabsContent>

            {/* Popular Posts Tab (Placeholder) */}
            {/* ... */}

            {/* Following Posts Tab (Placeholder) */}
            {/* ... */}
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Tags Card */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">熱門話題標籤</h3>
              {topTags.length > 0 ? (
                 <div className="flex flex-wrap gap-2">
                    {topTags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/${locale}/community/tags/${encodeURIComponent(tag.name)}`}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-primary text-sm hover:bg-secondary/80"
                      >
                        #{tag.name}
                        <span className="ml-1.5 text-xs text-primary/70">{tag.count}</span>
                      </Link>
                    ))}
                 </div>
              ) : (
                 <p className="text-sm text-primary/70">暫無熱門標籤。</p>
              )}
            </CardContent>
          </Card>

          {/* Official Topics Card */}
          {officialTopics.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">官方話題</h3>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/${locale}/community/topics?filter=official`}>{t["view-more"]}</Link>
                  </Button>
                </div>
                <div className="space-y-4">
                   {/* Use imported type for casting if needed, or fix TopicCard props */}
                  {officialTopics.map((topic) => (
                    <TopicCard key={topic.id} topic={topic as TopicForCommunitySidebar} locale={locale} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Community Topics Card */}
           {communityTopics.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">社群話題</h3>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/${locale}/community/topics?filter=community`}>{t["view-more"]}</Link>
                  </Button>
                </div>
                <div className="space-y-4">
                   {/* Use imported type for casting if needed, or fix TopicCard props */}
                  {communityTopics.map((topic) => (
                    <TopicCard key={topic.id} topic={topic as TopicForCommunitySidebar} locale={locale} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}