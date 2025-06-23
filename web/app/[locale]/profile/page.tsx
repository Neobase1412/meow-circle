// web/app/[locale]/profile/page.tsx
import { redirect } from 'next/navigation'; // Import redirect
import Image from "next/image";
import Link from "next/link";
import { type Locale, dictionary } from "@/i18n-config";
import { getCurrentUserProfileData } from '@/lib/profileData'; // Import the new function
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Edit, Settings, MessageSquare } from "lucide-react";
import { format } from 'date-fns';
import { zhTW, enUS } from "date-fns/locale";
import PostCard from "@/components/post-card";
import PetProfileCard from "@/components/profile/pet-profile-card";
import AchievementCard from "@/components/profile/achievement-card";

// Define expected params structure (only locale needed now)
interface ProfilePageParams {
  locale: Locale;
}

export default async function MyProfilePage({ params }: { params: Promise<ProfilePageParams> }) {
  const { locale } = await params;
  const t = dictionary[locale];

  // Fetch data for the currently logged-in user
  const currentUserProfile = await getCurrentUserProfileData();

  // --- Redirect if not logged in ---
  if (!currentUserProfile) {
    redirect(`/${locale}/login?redirectTo=/profile`); // Redirect to login
  }
  // --- End Redirect ---

  // Format join date (only if currentUserProfile is not null)
  const dateLocale = locale === "zh-TW" ? zhTW : enUS;
  const formattedJoinedDate = currentUserProfile.joinedAt
    ? format(currentUserProfile.joinedAt, 'yyyy 年 M 月', { locale: dateLocale })
    : '未知';

  // TODO: Fetch achievements dynamically
  const achievements: any[] = []; // Placeholder

  return (
    <div className="container-custom py-6">
      {/* Profile Header - Use currentUserProfile data */}
      <div className="relative mb-6">
        <div
            className="h-48 bg-gradient-to-r from-primary/20 to-secondary/30 rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${currentUserProfile.coverImageUrl || '/images/covers/default-cover.jpg'})` }}
        ></div>
        <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-6">
          <Image
            src={currentUserProfile.avatarUrl || "/placeholder-user.jpg"}
            alt={currentUserProfile.username}
            width={120}
            height={120}
            className="rounded-full border-4 border-background object-cover bg-muted"
          />
        </div>
        {/* Edit Button (always shown for owner on this page) */}
        <div className="absolute top-4 right-4">
          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-background/80 hover:bg-background" asChild>
            <Link href={`/${locale}/settings`}>
                <Edit className="h-4 w-4" />
                <span>編輯個人資料</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Profile Info - Use currentUserProfile data */}
      <div className="mt-16 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold">{currentUserProfile.fullName || currentUserProfile.username}</h1>
              <p className="text-primary/70 mt-1">@{currentUserProfile.username}</p>

               {/* Location (if available - adapt based on your actual schema if location isn't in 'settings') */}
              {/* Example assuming location is a top-level field */}
              {/* {currentUserProfile.location && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-primary/70">
                    <MapPin className="h-4 w-4" />
                    <span>{currentUserProfile.location}</span>
                  </div>
              )} */}

              <div className="flex items-center gap-2 mt-1 text-sm text-primary/70">
                <Calendar className="h-4 w-4" />
                <span>加入於 {formattedJoinedDate}</span>
              </div>

              <p className="mt-4">{currentUserProfile.bio || "快來編輯你的自我介紹吧！"}</p>

              {/* Stats from _count */}
              <div className="flex gap-4 mt-4 text-center">
                <div>
                  <div className="font-semibold">{currentUserProfile._count.posts}</div>
                  <div className="text-sm text-primary/70">貼文</div>
                </div>
                <div>
                  <div className="font-semibold">{currentUserProfile._count.following}</div>
                  <div className="text-sm text-primary/70">粉絲</div>
                </div>
                <div>
                  <div className="font-semibold">{currentUserProfile._count.followers}</div>
                  <div className="text-sm text-primary/70">追蹤中</div>
                </div>
              </div>

              {/* Action Buttons (Owner's view) */}
               <div className="flex gap-2 mt-6">
                    <Button className="flex-1" variant="outline" asChild>
                        <Link href={`/${locale}/settings`}>帳號設定</Link>
                    </Button>
                    {/* Add other relevant owner actions if needed */}
              </div>
            </CardContent>
          </Card>

          {/* Pets Card - Use currentUserProfile.pets */}
          {(currentUserProfile.pets?.length ?? 0) > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">我的寵物</h2>
                <div className="space-y-4">
                  {currentUserProfile.pets.map((pet) => (
                    <PetProfileCard key={pet.id} pet={pet} locale={locale} />
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/${locale}/pets/add`}>新增寵物</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Button to add pet even if list is empty */}
           {(currentUserProfile.pets?.length ?? 0) === 0 && (
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/${locale}/pets/add`}>新增我的第一隻寵物</Link>
              </Button>
           )}


          {/* Achievements Card - Placeholder */}
          {achievements.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">成就</h2>
                <div className="space-y-4">
                   {achievements.map((achievement) => (
                      <AchievementCard key={achievement.id} achievement={achievement} />
                   ))}
                  {/* <Button variant="outline" className="w-full">
                    <Link href={`/${locale}/profile/achievements`}>查看全部成就</Link>
                  </Button> */}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content - Use currentUserProfile.posts */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="posts">
            <TabsList className="w-full bg-background border border-border">
              <TabsTrigger value="posts" className="flex-1">貼文</TabsTrigger>
              <TabsTrigger value="media" className="flex-1">相片與影片</TabsTrigger>
              <TabsTrigger value="likes" className="flex-1">收藏</TabsTrigger>
              {/* <TabsTrigger value="comments" className="flex-1">留言</TabsTrigger> */}
            </TabsList>

            <TabsContent value="posts" className="mt-6">
              <div className="space-y-6">
                 {/* Adapt PostCard to use Prisma types */}
                {currentUserProfile.posts.length > 0 ? (
                  currentUserProfile.posts.map((post) => <PostCard key={post.id} post={post as any} locale={locale} />) // Use 'as any' for now, fix PostCard props later
                ) : (
                  <div className="text-center py-12">
                    <p className="text-primary/70">您尚未發布任何貼文</p>
                    <Button className="mt-4" asChild>
                        <Link href={`/${locale}/create-post`}>發布第一篇貼文</Link>
                    </Button>
                  </div>
                )}
                {/* TODO: Add pagination / load more */}
              </div>
            </TabsContent>

            <TabsContent value="media" className="mt-6">
               {/* Logic to extract media from posts */}
               {(() => {
                   const mediaItems = currentUserProfile.posts
                      .flatMap(post => post.mediaUrls || [])
                      .filter(url => url); // Filter out potential null/empty urls

                   return mediaItems.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {mediaItems.slice(0, 9).map((mediaUrl, index) => (
                            <div key={index} className="aspect-square relative rounded-md overflow-hidden bg-muted">
                              <Image src={mediaUrl} alt={`Media ${index + 1}`} fill className="object-cover" />
                            </div>
                          ))}
                      </div>
                   ) : (
                       <div className="text-center py-12">
                          <p className="text-primary/70">沒有可顯示的媒體</p>
                       </div>
                   );
               })()}
            </TabsContent>

             <TabsContent value="likes" className="mt-6">
                <div className="text-center py-12">
                   {/* TODO: Fetch and display liked posts */}
                   <p className="text-primary/70">功能開發中</p>
                </div>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
}