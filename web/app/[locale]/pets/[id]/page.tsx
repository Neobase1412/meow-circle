import Image from "next/link"
import Link from "next/link"
import { type Locale, dictionary } from "@/i18n-config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Edit, Heart, Award } from "lucide-react"
import { pets } from "@/data/pets"
import { posts } from "@/data/posts"
import { users } from "@/data/users"
import PostCard from "@/components/post-card"
import PetHealthCard from "@/components/pets/pet-health-card"
import PetActivityCard from "@/components/pets/pet-activity-card"

interface PetProfilePageProps {
  params: {
    locale: Locale
    id: string
  }
}

export default function PetProfilePage({ params: { locale, id } }: PetProfilePageProps) {
  const t = dictionary[locale]

  // Find the pet
  const pet = pets.find((p) => p.id === id)

  // If pet not found
  if (!pet) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">寵物不存在</h1>
        <p className="text-primary/70 mb-6">找不到此寵物資料</p>
        <Button asChild>
          <Link href={`/${locale}`}>返回首頁</Link>
        </Button>
      </div>
    )
  }

  // Find the owner
  const owner = users.find((u) => u.id === pet.ownerId)

  // Get pet's posts
  const petPosts = posts.filter((post) => post.petIds?.includes(pet.id))

  // Mock health records
  const healthRecords = [
    {
      id: 1,
      type: "疫苗接種",
      name: "三合一疫苗",
      date: "2023-05-15",
      provider: "喵喵動物醫院",
      notes: "下次預約: 2024-05-15",
    },
    {
      id: 2,
      type: "體檢",
      name: "年度健康檢查",
      date: "2023-03-10",
      provider: "喵喵動物醫院",
      notes: "一切正常，體重略增",
    },
    {
      id: 3,
      type: "驅蟲",
      name: "體內外驅蟲",
      date: "2023-02-01",
      provider: "喵喵動物醫院",
      notes: "三個月後再次驅蟲",
    },
  ]

  // Mock activities
  const activities = [
    {
      id: 1,
      type: "遊戲",
      duration: 30,
      date: "2023-06-20",
      notes: "玩逗貓棒，活動量高",
    },
    {
      id: 2,
      type: "散步",
      duration: 15,
      date: "2023-06-18",
      notes: "在陽台曬太陽",
    },
    {
      id: 3,
      type: "訓練",
      duration: 20,
      date: "2023-06-15",
      notes: "學習坐下指令",
    },
  ]

  return (
    <div className="container-custom py-6">
      {/* Pet Profile Header */}
      <div className="relative mb-6">
        <div className="h-48 bg-gradient-to-r from-primary/20 to-secondary/30 rounded-lg"></div>
        <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-6">
          <Image
            src={pet.avatarUrl || "/placeholder.svg?height=120&width=120&query=cat"}
            alt={pet.name}
            width={120}
            height={120}
            className="rounded-full border-4 border-background"
          />
        </div>
        <div className="flex justify-end p-4">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Edit className="h-4 w-4" />
            <span>編輯寵物資料</span>
          </Button>
        </div>
      </div>

      {/* Pet Profile Info */}
      <div className="mt-16 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{pet.name}</h1>
                  <p className="text-primary/70 mt-1">{pet.breed}</p>
                </div>
                {pet.isVerified && <Badge className="bg-primary">認證寵物</Badge>}
              </div>

              <div className="flex items-center gap-2 mt-3 text-sm text-primary/70">
                <Calendar className="h-4 w-4" />
                <span>出生日期: {pet.birthDate}</span>
              </div>

              <div className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-secondary/20 p-2 rounded-md">
                    <div className="text-xs text-primary/70">性別</div>
                    <div className="font-medium">{pet.gender === "male" ? "公" : "母"}</div>
                  </div>
                  <div className="bg-secondary/20 p-2 rounded-md">
                    <div className="text-xs text-primary/70">體重</div>
                    <div className="font-medium">{pet.weight} kg</div>
                  </div>
                  <div className="bg-secondary/20 p-2 rounded-md">
                    <div className="text-xs text-primary/70">毛色</div>
                    <div className="font-medium">{pet.color}</div>
                  </div>
                  <div className="bg-secondary/20 p-2 rounded-md">
                    <div className="text-xs text-primary/70">晶片號碼</div>
                    <div className="font-medium">{pet.microchipNumber || "無"}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-1">關於</h3>
                <p className="text-sm text-primary/80">{pet.bio || "這是一隻可愛的貓咪，喜歡玩逗貓棒和曬太陽。"}</p>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-1">飲食偏好</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {pet.dietaryPreferences?.map((pref, index) => (
                    <Badge key={index} variant="outline" className="bg-secondary/30">
                      {pref}
                    </Badge>
                  )) || (
                    <Badge variant="outline" className="bg-secondary/30">
                      乾糧
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                <Image
                  src={owner?.avatarUrl || "/placeholder.svg?height=36&width=36&query=person"}
                  alt={owner?.name || "Owner"}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <div>
                  <div className="text-sm">飼主</div>
                  <Link href={`/${locale}/profile/${owner?.id}`} className="font-medium hover:underline">
                    {owner?.name || "Unknown"}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">獎章</h2>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center">
                  <div className="bg-secondary/30 p-2 rounded-full">
                    <Award className="h-6 w-6 text-primary/70" />
                  </div>
                  <span className="text-xs mt-1">社交之星</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-secondary/30 p-2 rounded-full">
                    <Heart className="h-6 w-6 text-primary/70" />
                  </div>
                  <span className="text-xs mt-1">人氣王</span>
                </div>
                <div className="flex flex-col items-center opacity-40">
                  <div className="bg-secondary/30 p-2 rounded-full">
                    <Award className="h-6 w-6 text-primary/70" />
                  </div>
                  <span className="text-xs mt-1">未解鎖</span>
                </div>
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
              <TabsTrigger value="health" className="flex-1">
                健康記錄
              </TabsTrigger>
              <TabsTrigger value="activities" className="flex-1">
                活動記錄
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex-1">
                相簿
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-6">
              <div className="space-y-6">
                {petPosts.length > 0 ? (
                  petPosts.map((post) => <PostCard key={post.id} post={post} locale={locale} />)
                ) : (
                  <div className="text-center py-12">
                    <p className="text-primary/70">尚未有與此寵物相關的貼文</p>
                    <Button className="mt-4">
                      <Link href={`/${locale}/create-post`}>發布貼文</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="health" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">健康記錄</h2>
                  <Button>新增記錄</Button>
                </div>

                {healthRecords.map((record) => (
                  <PetHealthCard key={record.id} record={record} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activities" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">活動記錄</h2>
                  <Button>新增活動</Button>
                </div>

                {activities.map((activity) => (
                  <PetActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {petPosts
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
          </Tabs>
        </div>
      </div>
    </div>
  )
}
