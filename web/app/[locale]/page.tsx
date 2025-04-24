import Link from "next/link"
import { type Locale, dictionary } from "@/i18n-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { posts } from "@/data/posts"
import { tags } from "@/data/posts"
import { products } from "@/data/products"
import PostCard from "@/components/post-card"
import CreatePostCard from "@/components/create-post-card"
import UserProfileCard from "@/components/user-profile-card"
import DailyTaskCard from "@/components/daily-task-card"
import RecentActivityCard from "@/components/recent-activity-card"
import FeaturedProductCard from "@/components/featured-product-card"
import OfficialAnnouncementCard from "@/components/official-announcement-card"

export default function Home({ params: { locale } }: { params: { locale: Locale } }) {
  const t = dictionary[locale]

  // Get the latest 5 posts
  const latestPosts = posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5)

  // Get the top 5 tags
  const topTags = tags.sort((a, b) => b.count - a.count).slice(0, 5)

  // Get the recommended products
  const recommendedProducts = products.filter((product) => product.isRecommended || product.isPopular).slice(0, 3)

  return (
    <div className="container-custom py-6">
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
            <TabsContent value="latest" className="space-y-6 mt-6">
              {latestPosts.map((post) => (
                <PostCard key={post.id} post={post} locale={locale} />
              ))}
            </TabsContent>
            <TabsContent value="popular" className="space-y-6 mt-6">
              {/* Placeholder for popular posts */}
              <div className="text-center py-12">
                <p className="text-primary/70">熱門貼文功能即將推出，敬請期待！</p>
              </div>
            </TabsContent>
            <TabsContent value="following" className="space-y-6 mt-6">
              {/* Placeholder for following posts */}
              <div className="text-center py-12">
                <p className="text-primary/70">追蹤貼文功能即將推出，敬請期待！</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <UserProfileCard locale={locale} />

          <DailyTaskCard locale={locale} />

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">熱門話題</h3>
              <div className="flex flex-wrap gap-2">
                {topTags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/${locale}/community/tags/${tag.name}`}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-primary text-sm"
                  >
                    #{tag.name}
                    <span className="ml-1 text-xs text-primary/70">{tag.count}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <RecentActivityCard locale={locale} />

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">推薦商品</h3>
              <div className="space-y-4">
                {recommendedProducts.map((product) => (
                  <FeaturedProductCard key={product.id} product={product} locale={locale} />
                ))}
              </div>
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
  )
}
