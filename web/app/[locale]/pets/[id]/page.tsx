// web/app/[locale]/pets/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { type Locale, dictionary } from "@/i18n-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, Heart, Award, PlusCircle } from "lucide-react"; // Added PlusCircle
import { getPetProfileData } from "@/lib/petData"; // Import the data fetcher
import { getUserData } from "@/lib/userData"; // Import viewer data fetcher
import PetHealthCard from "@/components/pets/pet-health-card"; // Assuming this exists
import PetActivityCard from "@/components/pets/pet-activity-card"; // Assuming this exists
import { PetGender } from '@prisma/client'; // Import enum from Prisma Client
import { format } from 'date-fns';
import { zhTW, enUS } from 'date-fns/locale';
// Import specific types if needed for casting or props
import type { PetProfileData } from "@/lib/petData";
import type { HealthRecord, LifeRecord } from '@prisma/client'; // Import specific types for cards

interface PetProfilePageProps {
  params: Promise<{
    locale: Locale;
    id: string; // Pet ID from URL
  }>;
}

export default async function PetProfilePage({ params }: PetProfilePageProps) {
  const { locale, id: petId } = await params;
  const t = dictionary[locale] || dictionary['zh-TW'];

  // Fetch the specific pet's data
  const pet = await getPetProfileData(petId); // Handles notFound internally

  // Fetch the currently logged-in user's data
  const { authUser: viewerAuthUser } = await getUserData();

  // Determine if the viewer is the owner
  const isOwner = viewerAuthUser?.id === pet.ownerId;

  // Format dates
  const dateLocale = locale === "zh-TW" ? zhTW : enUS;
  const formattedBirthDate = pet.birthDate ? format(new Date(pet.birthDate), 'yyyy年 M月 d日', { locale: dateLocale }) : '未知';
  const formattedAdoptionDate = pet.adoptionDate ? format(new Date(pet.adoptionDate), 'yyyy年 M月 d日', { locale: dateLocale }) : null; // Optional

  // Placeholder for posts and gallery - implement fetching later
  const petPosts: any[] = [];
  const galleryImages: string[] = []; // Fetch from pet.albums.photos later

  // Use fetched health records and life records (activities)
  const healthRecords = pet.healthRecords;
  const activities = pet.lifeRecords; // Map LifeRecord to activities

  return (
    <div className="container-custom py-6">
      {/* Pet Profile Header */}
      <div className="relative mb-6">
         {/* TODO: Add Pet Cover Image? */}
        <div className="h-48 bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 rounded-lg"></div> {/* Example gradient */}
        <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-6">
          <Image
            src={pet.primaryImageUrl || "/placeholder.svg"} // Use placeholder SVG
            alt={pet.name || "Pet"}
            width={120}
            height={120}
            className="rounded-full border-4 border-background object-cover bg-muted" // Added styles
          />
        </div>
        {/* Show Edit Button only to Owner */}
        {isOwner && (
            <div className="absolute top-4 right-4">
              <Button variant="outline" size="sm" className="flex items-center gap-1 bg-background/80 hover:bg-background" asChild>
                 {/* TODO: Link to actual pet edit page */}
                <Link href={`/${locale}/pets/${pet.id}/edit`}>
                    <Edit className="h-4 w-4" />
                    <span>編輯寵物資料</span>
                </Link>
              </Button>
            </div>
        )}
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
                  <p className="text-primary/70 mt-1">{pet.breed || "米克斯"}</p>
                </div>
                {/* Optional: Like/Favorite button? */}
              </div>

              <div className="flex items-center gap-2 mt-3 text-sm text-primary/70">
                <Calendar className="h-4 w-4" />
                <span>出生於 {formattedBirthDate}</span>
              </div>
               {formattedAdoptionDate && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-primary/70">
                    <Calendar className="h-4 w-4" />
                    <span>領養於 {formattedAdoptionDate}</span>
                  </div>
               )}


              <div className="mt-4">
                <div className="grid grid-cols-2 gap-2 text-center sm:text-left"> {/* Adjusted text align */}
                  <div className="bg-secondary/20 p-2 rounded-md">
                    <div className="text-xs text-primary/70">性別</div>
                    <div className="font-medium">
                      {pet.gender === PetGender.MALE ? "公" : pet.gender === PetGender.FEMALE ? "母" : "未知"}
                    </div>
                  </div>
                  <div className="bg-secondary/20 p-2 rounded-md">
                    <div className="text-xs text-primary/70">體重</div>
                    <div className="font-medium">{pet.weight ? `${pet.weight} kg` : "未知"}</div>
                  </div>
                   <div className="bg-secondary/20 p-2 rounded-md col-span-2 sm:col-span-1"> {/* Span 2 on small screens */}
                    <div className="text-xs text-primary/70">晶片號碼</div>
                    <div className="font-medium truncate">{pet.chipNumber || "未登記"}</div> {/* Added truncate */}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-1">關於 {pet.name}</h3>
                <p className="text-sm text-primary/80">
                  {pet.description || "主人還沒有填寫介紹喔。"}
                </p>
              </div>

              {/* TODO: Add Diet/Preferences Section if data exists */}
              {/* <div className="mt-4">...</div> */}

              {/* Owner Info */}
              {pet.owner && (
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                    <Link href={`/${locale}/profile/${pet.owner.id}`} className="flex-shrink-0">
                      <Image
                        src={pet.owner.avatarUrl || "/placeholder-user.jpg"}
                        alt={pet.owner.username || "Owner"}
                        width={36}
                        height={36}
                        className="rounded-full object-cover bg-muted"
                      />
                    </Link>
                    <div>
                    <div className="text-xs text-primary/70">飼主</div>
                    <Link href={`/${locale}/profile/${pet.owner.id}`} className="font-medium hover:underline">
                        {pet.owner.fullName || pet.owner.username}
                    </Link>
                    </div>
                </div>
              )}
            </CardContent>
          </Card>

           {/* TODO: Implement Pet Badges/Achievements */}
          {/* <Card> ... </Card> */}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="health"> {/* Default to health or activities */}
            <TabsList className="w-full bg-background border border-border">
              <TabsTrigger value="health" className="flex-1">
                健康記錄
              </TabsTrigger>
              <TabsTrigger value="activities" className="flex-1">
                生活記錄
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex-1">
                相簿
              </TabsTrigger>
               {/* Defer Posts tab until linking logic is clear */}
              {/* <TabsTrigger value="posts" className="flex-1">貼文</TabsTrigger> */}
            </TabsList>

            {/* Health Records Tab */}
            <TabsContent value="health" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">健康記錄</h2>
                  {isOwner && (
                    <Button size="sm" variant="outline" asChild>
                        {/* TODO: Link to add health record page */}
                       <Link href={`/${locale}/pets/${pet.id}/health/new`}>
                         <PlusCircle className="h-4 w-4 mr-1.5"/> 新增記錄
                       </Link>
                    </Button>
                  )}
                </div>
                 {healthRecords.length > 0 ? (
                    healthRecords.map((record) => (
                        // Ensure PetHealthCard accepts Prisma HealthRecord type
                      <PetHealthCard key={record.id} record={record as HealthRecord} />
                    ))
                 ) : (
                     <div className="text-center py-12 text-primary/70">
                        還沒有任何健康記錄。
                     </div>
                 )}
              </div>
            </TabsContent>

            {/* Activities (Life Records) Tab */}
            <TabsContent value="activities" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">生活記錄</h2>
                   {isOwner && (
                      <Button size="sm" variant="outline" asChild>
                          {/* TODO: Link to add life record page */}
                         <Link href={`/${locale}/pets/${pet.id}/life/new`}>
                           <PlusCircle className="h-4 w-4 mr-1.5"/> 新增記錄
                         </Link>
                      </Button>
                   )}
                </div>
                 {activities.length > 0 ? (
                     activities.map((activity) => (
                         // Ensure PetActivityCard accepts Prisma LifeRecord type
                       <PetActivityCard key={activity.id} activity={activity as LifeRecord} />
                     ))
                 ) : (
                      <div className="text-center py-12 text-primary/70">
                        還沒有任何生活記錄。
                      </div>
                 )}
              </div>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="mt-6">
               <div className="flex justify-between items-center mb-2">
                 <h2 className="text-xl font-semibold">相簿</h2>
                 {isOwner && (
                    <Button size="sm" variant="outline" asChild>
                        {/* TODO: Link to manage gallery/albums page */}
                       <Link href={`/${locale}/pets/${pet.id}/gallery/manage`}>
                         <PlusCircle className="h-4 w-4 mr-1.5"/> 管理相簿
                       </Link>
                    </Button>
                 )}
               </div>
               {/* TODO: Fetch and display photos from Albums */}
               {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {galleryImages.map((mediaUrl, index) => (
                      <div key={index} className="aspect-square relative rounded-md overflow-hidden bg-muted">
                        <Image src={mediaUrl || "/placeholder.svg"} alt="Gallery media" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
               ) : (
                  <div className="text-center py-12 text-primary/70">
                    這個寵物還沒有相簿。
                  </div>
               )}
            </TabsContent>

            {/* Posts Tab (Deferred) */}
             {/* <TabsContent value="posts" className="mt-6"> ... </TabsContent> */}

          </Tabs>
        </div>
      </div>
    </div>
  );
}