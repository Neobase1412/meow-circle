import Image from "next/image"
import Link from "next/link"
import { type Locale, dictionary } from "@/i18n-config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Edit, Settings, MessageSquare } from "lucide-react"
import { currentUser } from "@/data/users"
import { pets } from "@/data/pets"
import { posts } from "@/data/posts"
import PostCard from "@/components/post-card"
import PetProfileCard from "@/components/profile/pet-profile-card"
import AchievementCard from "@/components/profile/achievement-card"

export default async function ProfilePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = dictionary[locale]

  // Get user's pets
  const userPets = pets.filter((pet) => pet.ownerId === currentUser.id)

  // Get user's posts
  const userPosts = posts.filter((post) => post.authorId === currentUser.id)

  // Mock achievements
  const achievements = [
    {
      id: 1,
      name: "貓咪達人",
      description: "分享超過 50 篇貓咪相關文章",
      iconUrl: "/images/achievements/expert.png",
      progress: 65,
      maxProgress: 100,
    },
    {
      id: 2,
      name: "社群之星",
      description: "獲得超過 1,000 個讚",
      iconUrl: "/images/achievements/star.png",
      progress: 750,
      maxProgress: 1000,
    },
    {
      id: 3,
      name: "熱心助人",
      description: "回答超過 30 個問題",
      iconUrl: "/images/achievements/helper.png",
      progress: 22,
      maxProgress: 30,
    },
  ]

  return (
    <div className="container-custom py-6">
      {/* Profile Header */}
      <div className="relative mb-6">
        <div className="h-48 bg-gradient-to-r from-primary/20 to-secondary/30 rounded-lg"></div>
        <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-6">
          <Image
            src={currentUser.avatarUrl || "/images/avatars/default.jpg"}
            alt={currentUser.name}
            width={120}
            height={120}
            className="rounded-full border-4 border-background"
          />
        </div>
        <div className="flex justify-end p-4">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Edit className="h-4 w-4" />
            <span>編輯個人資料</span>
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-16 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <p className="text-primary/70 mt-1">@{currentUser.username}</p>

              <div className="flex items-center gap-2 mt-3 text-sm text-primary/70">
                <MapPin className="h-4 w-4" />
                <span>{currentUser.location || "台北市"}</span>
              </div>

              <div className="flex items-center gap-2 mt-1 text-sm text-primary/70">
                <Calendar className="h-4 w-4" />
                <span>加入於 2022 年 6 月</span>
              </div>

              <p className="mt-4">{currentUser.bio || "喜歡貓咪的愛貓人士，分享貓咪日常生活和照顧心得。"}</p>

              <div className="flex gap-4 mt-4">
                <div>
                  <div className="font-semibold">120</div>
                  <div className="text-sm text-primary/70">貼文</div>
                </div>
                <div>
                  <div className="font-semibold">1.5K</div>
                  <div className="text-sm text-primary/70">粉絲</div>
                </div>
                <div>
                  <div className="font-semibold">350</div>
                  <div className="text-sm text-primary/70">追蹤中</div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button className="flex-1">追蹤</Button>
                <Button variant="outline" size="icon">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">我的寵物</h2>
              <div className="space-y-4">
                {userPets.map((pet) => (
                  <PetProfileCard key={pet.id} pet={pet} locale={locale} />
                ))}

                <Button variant="outline" className="w-full">
                  <Link href={`/${locale}/pets/add`}>新增寵物</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">成就</h2>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}

                <Button variant="outline" className="w-full">
                  <Link href={`/${locale}/profile/achievements`}>查看全部成就</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="posts">
            <TabsList className="w-full bg-background border border-border">
              <TabsTrigger value="posts" className="flex-1">
                貼文
              </TabsTrigger>
              <TabsTrigger value="media" className="flex-1">
                相片與影片
              </TabsTrigger>
              <TabsTrigger value="likes" className="flex-1">
                收藏
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex-1">
                留言
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-6">
              <div className="space-y-6">
                {userPosts.length > 0 ? (
                  userPosts.map((post) => <PostCard key={post.id} post={post} locale={locale} />)
                ) : (
                  <div className="text-center py-12">
                    <p className="text-primary/70">尚未發布任何貼文</p>
                    <Button className="mt-4">
                      <Link href={`/${locale}/create-post`}>發布第一篇貼文</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="media" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {userPosts
                  .filter((post) => post.mediaUrls && post.mediaUrls.length > 0)
                  .flatMap((post) => post.mediaUrls || [])
                  .slice(0, 9)
                  .map((mediaUrl, index) => (
                    <div key={index} className="aspect-square relative rounded-md overflow-hidden">
                      <Image src={mediaUrl || "/placeholder.svg"} alt="Media" fill className="object-cover" />
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="likes" className="mt-6">
              <div className="text-center py-12">
                <p className="text-primary/70">收藏功能即將推出，敬請期待！</p>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="mt-6">
              <div className="text-center py-12">
                <p className="text-primary/70">留言功能即將推出，敬請期待！</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
