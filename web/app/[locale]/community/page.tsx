import Link from "next/link"
import { type Locale, dictionary } from "@/i18n-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { posts } from "@/data/posts"
import { topics, tags } from "@/data/posts"
import PostCard from "@/components/post-card"
import TopicCard from "@/components/topic-card"
import CreatePostCard from "@/components/create-post-card"

export default function CommunityPage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = dictionary[locale]

  // Get the latest posts
  const latestPosts = posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  // Get the top tags
  const topTags = tags.sort((a, b) => b.count - a.count).slice(0, 10)

  // Get official topics
  const officialTopics = topics.filter((topic) => topic.isOfficial)

  // Get community topics
  const communityTopics = topics.filter((topic) => !topic.isOfficial)

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

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">官方話題</h3>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/${locale}/community/topics`}>{t["view-more"]}</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {officialTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} locale={locale} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">社群話題</h3>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/${locale}/community/topics`}>{t["view-more"]}</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {communityTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} locale={locale} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
