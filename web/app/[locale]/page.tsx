// app/[locale]/page.tsx
import Link from "next/link";
import { type Locale, dictionary } from "@/i18n-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import PostCard from "@/components/post-card";
import CreatePostCard from "@/components/create-post-card";
import UserProfileCard from "@/components/user-profile-card";
import DailyTaskCard from "@/components/daily-task-card";
import RecentActivityCard from "@/components/recent-activity-card";
import FeaturedProductCard from "@/components/featured-product-card";
import OfficialAnnouncementCard from "@/components/official-announcement-card";
import { getHomePageData } from "@/lib/homePageData"; // Import data fetching function
// Import types if needed for casting, or rely on types from the function
import type { PostForCommunityFeed, TagForCommunitySidebar } from "@/lib/communityData";


export default async function Home({ params }: { params: { locale: Locale } }) { // Simplified params type
  const locale = params.locale;
  const t = dictionary[locale];

  // Fetch real data
  const {
    latestPosts,
    topTags,
    recommendedProducts // This will be empty [] for now
  } = await getHomePageData();

  return (
    <div className="container-custom py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* CreatePostCard uses context */}
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

            {/* Latest Posts Tab - Use real data */}
            <TabsContent value="latest" className="space-y-6 mt-6">
              {latestPosts.length > 0 ? (
                latestPosts.map((post) => (
                  // Ensure PostCard props match PostForCommunityFeed type
                  <PostCard key={post.id} post={post as PostForCommunityFeed} locale={locale} />
                ))
              ) : (
                <div className="text-center py-12">
                    <p className="text-primary/70">還沒有任何貼文，快來發布第一篇吧！</p>
                </div>
              )}
               {/* TODO: Add pagination / load more button */}
            </TabsContent>

            {/* Popular Posts Tab (Placeholder) */}
            <TabsContent value="popular" className="space-y-6 mt-6">
              <div className="text-center py-12">
                <p className="text-primary/70">熱門貼文功能即將推出，敬請期待！</p>
              </div>
            </TabsContent>

            {/* Following Posts Tab (Placeholder) */}
            <TabsContent value="following" className="space-y-6 mt-6">
              <div className="text-center py-12">
                <p className="text-primary/70">追蹤貼文功能即將推出，敬請期待！</p>
                 {/* TODO: Needs auth check and fetching logic */}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           {/* UserProfileCard uses context */}
          <UserProfileCard locale={locale} />

          <DailyTaskCard locale={locale} />

          {/* Top Tags Card - Use real data */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">熱門話題標籤</h3>
               {topTags.length > 0 ? (
                 <div className="flex flex-wrap gap-2">
                   {topTags.map((tag) => (
                     <Link
                       key={tag.id}
                       // Ensure tag name is URL encoded for safety
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

          <RecentActivityCard locale={locale} />

          {/* Recommended Products Card - Placeholder data */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">推薦商品</h3>
              {recommendedProducts.length > 0 ? (
                <div className="space-y-4">
                   {/* TODO: Update FeaturedProductCard props when product data/type is available */}
                  {recommendedProducts.map((product) => (
                    <FeaturedProductCard key={product.id} product={product as any} locale={locale} />
                  ))}
                </div>
               ) : (
                 <div className="text-center py-6">
                    <p className="text-sm text-primary/70">暫無推薦商品。</p>
                 </div>
               )}
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link href={`/${locale}/shop`}>{t["view-more"]}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <OfficialAnnouncementCard locale={locale} />
        </div>
      </div>
    </div>
  );
}