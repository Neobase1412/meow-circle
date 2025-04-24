import Link from "next/link"
import Image from "next/image"
import { type Locale, dictionary } from "@/i18n-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { topics } from "@/data/posts"
import TopicCard from "@/components/topic-card"
import DiscussionCard from "@/components/discussion/discussion-card"

export default function DiscussionPage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = dictionary[locale]

  // Mock discussions
  const discussions = [
    {
      id: 1,
      title: "新手養貓需要準備哪些物品？",
      content: "即將領養一隻小貓，想請教各位有經驗的貓奴，需要準備哪些必備物品？",
      author: {
        id: "5",
        name: "新手貓奴",
        avatarUrl: "/images/avatars/user4.jpg",
      },
      category: "新手養貓",
      commentCount: 15,
      viewCount: 120,
      createdAt: new Date("2023-06-18T10:30:00"),
    },
    {
      id: 2,
      title: "貓咪不愛喝水怎麼辦？",
      content: "我家貓咪很少喝水，擔心會有泌尿系統問題，有什麼方法可以增加貓咪的飲水量？",
      author: {
        id: "2",
        name: "喵星人愛好者",
        avatarUrl: "/images/avatars/user1.jpg",
      },
      category: "健康照護",
      commentCount: 23,
      viewCount: 210,
      createdAt: new Date("2023-06-17T15:45:00"),
    },
    {
      id: 3,
      title: "推薦好用的貓砂品牌",
      content: "想換一款除臭效果好、不會有太多粉塵的貓砂，有推薦的品牌嗎？",
      author: {
        id: "3",
        name: "貓咪媽媽",
        avatarUrl: "/images/avatars/user2.jpg",
      },
      category: "用品推薦",
      commentCount: 32,
      viewCount: 280,
      createdAt: new Date("2023-06-16T09:15:00"),
    },
    {
      id: 4,
      title: "貓咪行為問題：半夜狂奔怎麼辦？",
      content: "我家貓咪每天半夜都會突然狂奔，吵得睡不著覺，有什麼方法可以改善嗎？",
      author: {
        id: "2",
        name: "喵星人愛好者",
        avatarUrl: "/images/avatars/user1.jpg",
      },
      category: "行為訓練",
      commentCount: 18,
      viewCount: 150,
      createdAt: new Date("2023-06-15T20:30:00"),
    },
    {
      id: 5,
      title: "貓咪挑食怎麼辦？",
      content: "我家貓咪最近變得很挑食，買了很多種飼料都不愛吃，該怎麼辦？",
      author: {
        id: "3",
        name: "貓咪媽媽",
        avatarUrl: "/images/avatars/user2.jpg",
      },
      category: "飲食營養",
      commentCount: 27,
      viewCount: 230,
      createdAt: new Date("2023-06-14T14:20:00"),
    },
  ]

  // Get popular topics
  const popularTopics = topics.sort((a, b) => b.followerCount - a.followerCount).slice(0, 5)

  // Mock categories
  const categories = [
    { id: 1, name: "新手養貓", count: 120 },
    { id: 2, name: "健康照護", count: 95 },
    { id: 3, name: "飲食營養", count: 87 },
    { id: 4, name: "行為訓練", count: 76 },
    { id: 5, name: "用品推薦", count: 68 },
    { id: 6, name: "貓咪故事", count: 54 },
    { id: 7, name: "醫療諮詢", count: 43 },
    { id: 8, name: "貓咪攝影", count: 38 },
  ]

  return (
    <div className="container-custom py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{t["discussion"]}</h1>
        <p className="text-primary/70">分享您的疑問，獲得專業建議和經驗分享</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Input placeholder="搜尋討論..." className="flex-1" />
                <Button>搜尋</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.id}
                    href={`/${locale}/discussion/categories/${category.id}`}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-primary text-sm"
                  >
                    {category.name}
                    <span className="ml-1 text-xs text-primary/70">{category.count}</span>
                  </Link>
                ))}
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/${locale}/discussion/categories`}>更多</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">討論列表</h2>
            <Button asChild>
              <Link href={`/${locale}/discussion/new`}>發起討論</Link>
            </Button>
          </div>

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
            <TabsContent value="latest" className="space-y-4 mt-6">
              {discussions.map((discussion) => (
                <DiscussionCard key={discussion.id} discussion={discussion} locale={locale} />
              ))}
            </TabsContent>
            <TabsContent value="hot" className="space-y-4 mt-6">
              {/* Placeholder for hot discussions */}
              <div className="text-center py-12">
                <p className="text-primary/70">熱門討論功能即將推出，敬請期待！</p>
              </div>
            </TabsContent>
            <TabsContent value="unanswered" className="space-y-4 mt-6">
              {/* Placeholder for unanswered discussions */}
              <div className="text-center py-12">
                <p className="text-primary/70">待回答功能即將推出，敬請期待！</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center">
            <Button variant="outline">載入更多</Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">熱門話題</h3>
              <div className="space-y-4">
                {popularTopics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} locale={locale} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">討論指南</h3>
              <ul className="space-y-2 text-primary/80">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>清楚描述您的問題</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>提供相關背景資訊</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>使用適當的標籤分類</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>尊重他人的意見和建議</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>標記有幫助的回答</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-3">專家在線</h3>
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
  )
}
