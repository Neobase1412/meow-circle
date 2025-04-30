// app/[locale]/discussion/page.tsx
import Link from "next/link";
import Image from "next/image";
import { type Locale, dictionary } from "@/i18n-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import TopicCard from "@/components/topic-card";
import DiscussionCard from "@/components/discussion/discussion-card"; // Assuming this component exists and is updated
import CreateDiscussionCard from "@/components/create-discussion-card"; // Import the new component
import { getDiscussionPageData } from "@/lib/discussionData"; // Import updated data fetcher

export default async function DiscussionPage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const t = dictionary[locale];

  // Fetch real discussion data
  const {
    latestDiscussions,
    popularTopics,
    filterCategories
  } = await getDiscussionPageData();

  return (
    <div className="container-custom py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{t["discussion"]}</h1>
        <p className="text-primary/70">分享您的疑問，獲得專業建議和經驗分享</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search and Categories Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Input placeholder="搜尋討論..." className="flex-1" />
                <Button>搜尋</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {filterCategories.map((category) => (
                  <Link
                    // Link using tag name
                    key={category.id}
                    href={`/${locale}/community/tags/${encodeURIComponent(category.name)}`} // Link to tag page
                    className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-primary text-sm hover:bg-secondary/80"
                  >
                    {category.name}
                    {/* Display tag count */}
                    <span className="ml-1.5 text-xs text-primary/70">{category.count}</span>
                  </Link>
                ))}
                {/* Consider a link to a page showing all tags/categories */}
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/${locale}/community/tags`}>更多標籤</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Discussion List Header */}
          <CreateDiscussionCard locale={locale} />

          {/* Discussion Tabs */}
          <Tabs defaultValue="latest">
            <TabsList className="w-full bg-background border border-border">
              <TabsTrigger value="latest" className="flex-1">
                最新討論
              </TabsTrigger>
              <TabsTrigger value="hot" className="flex-1">
                熱門討論
              </TabsTrigger>
              <TabsTrigger value="unanswered" className="flex-1">
                待回答
              </TabsTrigger>
            </TabsList>

            {/* Latest Discussions Tab */}
            <TabsContent value="latest" className="space-y-4 mt-6">
              {latestDiscussions.length > 0 ? (
                 latestDiscussions.map((discussion) => (
                   // Assuming DiscussionCard accepts a Post-like structure
                   // Ensure DiscussionCard props match PostForCommunityFeed
                   <DiscussionCard key={discussion.id} discussion={discussion as any} locale={locale} />
                 ))
              ) : (
                 <div className="text-center py-12">
                    <p className="text-primary/70">目前沒有討論，快來發起一個吧！</p>
                 </div>
              )}
               {/* TODO: Add pagination */}
            </TabsContent>

             {/* Hot Discussions Tab (Placeholder) */}
            <TabsContent value="hot" className="space-y-4 mt-6">
              <div className="text-center py-12">
                <p className="text-primary/70">熱門討論功能即將推出，敬請期待！</p>
              </div>
            </TabsContent>

            {/* Unanswered Discussions Tab (Placeholder) */}
            <TabsContent value="unanswered" className="space-y-4 mt-6">
              <div className="text-center py-12">
                <p className="text-primary/70">待回答功能即將推出，敬請期待！</p>
              </div>
            </TabsContent>
          </Tabs>

           {/* TODO: Replace with actual pagination controls */}
          {/* <div className="flex justify-center">
            <Button variant="outline">載入更多</Button>
          </div> */}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Topics Card */}
          {popularTopics.length > 0 && (
            <Card>
                <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-3">熱門話題</h3>
                <div className="space-y-4">
                    {/* Ensure TopicCard props match TopicForCommunitySidebar */}
                    {popularTopics.map((topic) => (
                    <TopicCard key={topic.id} topic={topic as any} locale={locale} />
                    ))}
                </div>
                </CardContent>
            </Card>
          )}

          {/* Discussion Guide Card (Static) */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">討論指南</h3>
               {/* Keep static content */}
              <ul className="space-y-2 text-sm text-primary/80">
                 <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div><span>清楚描述您的問題</span></li>
                 <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div><span>提供相關背景資訊</span></li>
                 <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div><span>使用適當的標籤分類</span></li>
                 <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div><span>尊重他人的意見和建議</span></li>
                 <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div><span>標記有幫助的回答</span></li>
              </ul>
            </CardContent>
          </Card>

          {/* Experts Online Card (Static/Placeholder) */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">專家在線</h3>
              {/* Keep static content or fetch featured experts later */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/avatars/user3.jpg"
                    alt="寵物獸醫"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">寵物獸醫</p>
                    <p className="text-xs text-primary/70">專業獸醫，提供寵物健康諮詢</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/avatars/expert1.jpg"
                    alt="貓行為專家"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">貓行為專家</p>
                    <p className="text-xs text-primary/70">專精貓咪行為問題與訓練</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/avatars/expert2.jpg"
                    alt="寵物營養師"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">寵物營養師</p>
                    <p className="text-xs text-primary/70">專業寵物營養與飲食規劃</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}