// web/components/user-profile-card.tsx
"use client"; // Make it a Client Component

import Link from "next/link";
import Image from "next/image";
import { type Locale, dictionary } from "@/i18n-config";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext"; // Import the useAuth hook
import { format } from 'date-fns'; // For formatting date
import { zhTW, enUS } from 'date-fns/locale';

interface UserProfileCardProps {
  locale: Locale;
}

export default function UserProfileCard({ locale }: UserProfileCardProps) {
  const t = dictionary[locale] || dictionary['zh-TW'];
  const { authUser, profile } = useAuth(); // Get data from context

  // --- Don't render the card if the user is not logged in ---
  if (!authUser || !profile) {
    // Optionally render a login prompt or null
    return (
       <Card>
         <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">登入以查看個人資訊</p>
            <Link href={`/${locale}/login`} className="text-sm text-primary hover:underline">
              前往登入
            </Link>
         </CardContent>
       </Card>
    )
     // return null;
  }
  // --- End Render Check ---


  // Calculate membership progress (use a sensible max value, e.g., next level threshold)
  // TODO: Define membership level thresholds properly
  const nextLevelPoints = 5000; // Example max value for progress bar
  const membershipProgress = profile.membershipPoints
    ? Math.min((profile.membershipPoints / nextLevelPoints) * 100, 100)
    : 0;

  // Format join date
  const dateLocale = locale === "zh-TW" ? zhTW : enUS;
  const formattedJoinedDate = profile.joinedAt
    ? format(profile.joinedAt, 'yyyy/MM/dd') // Use a specific format
    : '未知';

  // Get counts from profile._count
  const petCount = profile._count?.pets ?? 0;
  const postCount = profile._count?.posts ?? 0;
  const collectionCount = profile._count?.collections ?? 0;

  return (
    <Card>
      <CardContent className="p-4">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <Link href={`/${locale}/profile`}> {/* Links to the owner's profile page */}
            <Image
              src={profile.avatarUrl || "/placeholder-user.jpg"} // Use placeholder
              alt={profile.username || "User"}
              width={60}
              height={60}
              className="rounded-full object-cover bg-muted"
            />
          </Link>
          <div>
            <Link href={`/${locale}/profile`} className="font-semibold hover:underline">
              {profile.fullName || profile.username}
            </Link>
            <p className="text-sm text-primary/70">@{profile.username}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs bg-secondary/50">
                {/* Display membership level from profile data */}
                {profile.membershipLevel === "REGULAR" && "一般會員"}
                {profile.membershipLevel === "SILVER" && "銀牌會員"}
                {profile.membershipLevel === "GOLD" && "金牌會員"}
                {profile.membershipLevel === "DIAMOND" && "鑽石會員"}
              </Badge>
              <span className="text-xs text-primary/70">加入於 {formattedJoinedDate}</span>
            </div>
          </div>
        </div>

        {/* Membership Progress */}
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">會員等級進度</span>
            <span className="text-xs text-primary/70">{profile.membershipPoints} / {nextLevelPoints} 點</span>
          </div>
          <Progress value={membershipProgress} className="h-2 mt-2" aria-label="Membership progress" />
           {/* TODO: Fetch/display actual membership perks/badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              每日簽到
            </Badge>
            <Badge variant="outline" className="text-xs">
              生日禮遇
            </Badge>
             {profile.membershipLevel !== 'REGULAR' && (
                <Badge variant="outline" className="text-xs">
                  專屬優惠
                </Badge>
             )}
          </div>
        </div>

        {/* Quick Links/Stats */}
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          {/* Use actual counts from profile._count */}
          <Link href={`/${locale}/profile`} className="p-2 rounded-md hover:bg-secondary/50"> {/* Link to main profile for now */}
            <div className="flex justify-center">
              <Image src="/images/icons/pet.png" alt="My Pets" width={24} height={24} />
            </div>
            <div className="mt-1">
              <p className="text-xs font-medium">我的寵物</p>
              <p className="text-xs text-primary/70">{petCount}</p>
            </div>
          </Link>
          <Link href={`/${locale}/profile`} className="p-2 rounded-md hover:bg-secondary/50"> {/* Link to main profile for now */}
            <div className="flex justify-center">
              <Image src="/images/icons/post.png" alt="My Posts" width={24} height={24} />
            </div>
            <div className="mt-1">
              <p className="text-xs font-medium">我的貼文</p>
              <p className="text-xs text-primary/70">{postCount}</p>
            </div>
          </Link>
          <Link href={`/${locale}/profile`} className="p-2 rounded-md hover:bg-secondary/50"> {/* Link to main profile for now */}
            <div className="flex justify-center">
              <Image src="/images/icons/collection.png" alt="Collections" width={24} height={24} />
            </div>
            <div className="mt-1">
              <p className="text-xs font-medium">收藏</p>
              <p className="text-xs text-primary/70">{collectionCount}</p>
            </div>
          </Link>
          <Link href={`/${locale}/profile`} className="p-2 rounded-md hover:bg-secondary/50"> {/* Link to main profile for now */}
            <div className="flex justify-center">
              <Image src="/images/icons/point.png" alt="Points" width={24} height={24} />
            </div>
            <div className="mt-1">
              <p className="text-xs font-medium">喵幣</p> {/* Assuming membership points are 'Meow Coins' */}
              <p className="text-xs text-primary/70">{profile.membershipPoints}</p>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}