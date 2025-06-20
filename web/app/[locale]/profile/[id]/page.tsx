// web/app/[locale]/profile/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { type Locale, dictionary } from "@/i18n-config";
import { getUserData } from '@/lib/userData';
import { getPublicProfileDataById } from '@/lib/profileData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Edit, Settings, MessageSquare } from "lucide-react";
import { format } from 'date-fns';
import { zhTW, enUS } from "date-fns/locale";
import PostCard from "@/components/post-card";
import PetProfileCard from "@/components/profile/pet-profile-card";
import AchievementCard from "@/components/profile/achievement-card";
import FollowButton from '@/components/profile/FollowButton';
import prisma from "@/lib/prisma"; // Make sure prisma is imported
import { redirect } from 'next/navigation'; // Import redirect at the top

// Define expected params structure with 'id'
interface ProfilePageParams {
  locale: Locale;
  id: string; // Changed from username to id
}

// --- The Page Component ---
export default async function UserProfilePage({ params }: { params: Promise<ProfilePageParams> }) {
  const { locale, id: profileOwnerId } = await params;
  const t = dictionary[locale];

  // Fetch data for the profile being viewed using the ID
  // getPublicProfileDataById handles notFound internally if profileOwner is null/error occurs
  const profileOwner = await getPublicProfileDataById(profileOwnerId);

  // Fetch data for the person *viewing* the profile
  const { authUser: viewerAuthUser } = await getUserData();

  // Determine if the viewer owns this profile
  const isOwner = viewerAuthUser?.id === profileOwner.id;

  // --- Redirect check: If owner is viewing via /profile/[id], redirect to /profile ---
  // Moved higher and uses top-level import
  if (isOwner) {
    redirect(`/${locale}/profile`); // Call redirect directly
  }
  // --- End Redirect check ---


  // Determine if the viewer is following the profile owner (only if viewer is logged in)
  // This code now only runs if !isOwner due to the redirect above
  let isFollowing = false;
  if (viewerAuthUser) {
    const followCheck = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: viewerAuthUser.id,
          followingId: profileOwner.id, // Use the fetched profileOwner's ID
        },
      },
      select: { id: true }
    });
    isFollowing = !!followCheck;
  }

  // Format join date
  const dateLocale = locale === "zh-TW" ? zhTW : enUS;
  const formattedJoinedDate = profileOwner.joinedAt ? format(profileOwner.joinedAt, 'yyyy 年 M 月', { locale: dateLocale }) : '未知';

  // TODO: Fetch achievements dynamically later
  const achievements: any[] = []; // Placeholder

  // >>>>> START OF RETURN STATEMENT <<<<<
  return (
    <div className="container-custom py-6">
      {/* Profile Header - Use profileOwner data */}
      <div className="relative mb-6">
        <div
            className="h-48 bg-gradient-to-r from-primary/20 to-secondary/30 rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${profileOwner.coverImageUrl || '/images/covers/default-cover.jpg'})` }}
        ></div>
        <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-6">
          <Image
            src={profileOwner.avatarUrl || "/placeholder-user.jpg"}
            alt={profileOwner.username}
            width={120}
            height={120}
            className="rounded-full border-4 border-background object-cover bg-muted"
          />
        </div>
         {/* No Edit button here, owner is redirected */}
      </div>

      {/* Profile Info - Use profileOwner data */}
      <div className="mt-16 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold">{profileOwner.fullName || profileOwner.username}</h1>
              <p className="text-primary/70 mt-1">@{profileOwner.username}</p>

               {/* Location (if available) */}
              {/* {profileOwner.settings?.location && ( ... )} */}

              <div className="flex items-center gap-2 mt-1 text-sm text-primary/70">
                <Calendar className="h-4 w-4" />
                <span>加入於 {formattedJoinedDate}</span>
              </div>

              <p className="mt-4">{profileOwner.bio || "這位使用者還沒有留下自我介紹。"}</p>

              {/* Stats from _count */}
              <div className="flex gap-4 mt-4 text-center">
                <div>
                  <div className="font-semibold">{profileOwner._count.posts}</div>
                  <div className="text-sm text-primary/70">貼文</div>
                </div>
                <div>
                  <div className="font-semibold">{profileOwner._count.following}</div>
                  <div className="text-sm text-primary/70">粉絲</div>
                </div>
                <div>
                  <div className="font-semibold">{profileOwner._count.followers}</div>
                  <div className="text-sm text-primary/70">追蹤中</div>
                </div>
              </div>

              {/* Action Buttons: Follow/Unfollow for non-owners */}
               <div className="flex gap-2 mt-6">
                  {/* FollowButton is always shown here because owners are redirected */}
                  <FollowButton
                      targetUserId={profileOwner.id}
                      initialIsFollowing={isFollowing}
                      viewerIsLoggedIn={!!viewerAuthUser} // Pass boolean login status
                      className="flex-1"
                  />
                  {/* Message Button */}
                   <Button variant="outline" size="icon" title="傳送訊息">
                     <MessageSquare className="h-4 w-4" />
                   </Button>
                  {/* More Options */}
                  <Button variant="outline" size="icon" title="更多選項">
                    <Settings className="h-4 w-4" />
                  </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pets Card - Use profileOwner.pets */}
          {(profileOwner.pets?.length ?? 0) > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                   {`${profileOwner.username}的寵物`}
                </h2>
                <div className="space-y-4">
                  {profileOwner.pets.map((pet) => (
                    <PetProfileCard key={pet.id} pet={pet} locale={locale} />
                  ))}
                </div>
              </CardContent>
            </Card>
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
                 </div>
               </CardContent>
             </Card>
          )}
        </div>

        {/* Main Content - Use profileOwner.posts */}
        <div className="lg:col-span-2">
           {/* Tabs and Content using profileOwner.posts (ensure PostCard uses correct types) */}
           <Tabs defaultValue="posts">
             <TabsList className="w-full bg-background border border-border">
               <TabsTrigger value="posts" className="flex-1">貼文</TabsTrigger>
               <TabsTrigger value="media" className="flex-1">相片與影片</TabsTrigger>
               <TabsTrigger value="likes" className="flex-1">收藏</TabsTrigger>
               {/* <TabsTrigger value="comments" className="flex-1">留言</TabsTrigger> */}
             </TabsList>

             <TabsContent value="posts" className="mt-6">
               <div className="space-y-6">
                 {profileOwner.posts.length > 0 ? (
                   profileOwner.posts.map((post) => <PostCard key={post.id} post={post as any} locale={locale} />) // Adapt PostCard props
                 ) : (
                   <div className="text-center py-12">
                     <p className="text-primary/70">這位使用者尚未發布任何公開貼文</p>
                   </div>
                 )}
                 {/* TODO: Add pagination / load more */}
               </div>
             </TabsContent>

             <TabsContent value="media" className="mt-6">
                {(() => {
                   const mediaItems = profileOwner.posts
                      .flatMap(post => post.mediaUrls || [])
                      .filter(url => url);

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