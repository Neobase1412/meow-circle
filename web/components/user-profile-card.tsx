import Link from "next/link"
import Image from "next/image"
import { type Locale, dictionary } from "@/i18n-config"
import { currentUser } from "@/data/users"
import { pets } from "@/data/pets"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface UserProfileCardProps {
  locale: Locale
}

export default function UserProfileCard({ locale }: UserProfileCardProps) {
  const t = dictionary[locale]

  // Get user's pets
  const userPets = pets.filter((pet) => pet.ownerId === currentUser.id)

  // Calculate membership progress
  const membershipProgress = (currentUser.membershipPoints / 5000) * 100

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Link href={`/${locale}/profile`}>
            <Image
              src={currentUser.avatarUrl || "/images/avatars/default.jpg"}
              alt={currentUser.username}
              width={60}
              height={60}
              className="rounded-full"
            />
          </Link>
          <div>
            <Link href={`/${locale}/profile`} className="font-semibold hover:underline">
              {currentUser.fullName || currentUser.username}
            </Link>
            <p className="text-sm text-primary/70">@{currentUser.username}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs bg-secondary/50">
                {currentUser.membershipLevel === "REGULAR" && "一般會員"}
                {currentUser.membershipLevel === "SILVER" && "銀牌會員"}
                {currentUser.membershipLevel === "GOLD" && "金牌會員"}
                {currentUser.membershipLevel === "DIAMOND" && "鑽石會員"}
              </Badge>
              <span className="text-xs text-primary/70">加入於 {currentUser.joinedAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">會員等級進度</span>
            <span className="text-xs text-primary/70">{currentUser.membershipPoints}/5000 點</span>
          </div>
          <Progress value={membershipProgress} className="h-2 mt-2" />
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              每日簽到
            </Badge>
            <Badge variant="outline" className="text-xs">
              生日禮遇
            </Badge>
            <Badge variant="outline" className="text-xs">
              專屬優惠
            </Badge>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          <Link href={`/${locale}/profile/pets`} className="p-2 rounded-md hover:bg-secondary/50">
            <div className="flex justify-center">
              <Image src="/images/icons/pet.png" alt="My Pets" width={24} height={24} />
            </div>
            <div className="mt-1">
              <p className="text-xs font-medium">我的寵物</p>
              <p className="text-xs text-primary/70">{userPets.length}</p>
            </div>
          </Link>
          <Link href={`/${locale}/profile/posts`} className="p-2 rounded-md hover:bg-secondary/50">
            <div className="flex justify-center">
              <Image src="/images/icons/post.png" alt="My Posts" width={24} height={24} />
            </div>
            <div className="mt-1">
              <p className="text-xs font-medium">我的貼文</p>
              <p className="text-xs text-primary/70">12</p>
            </div>
          </Link>
          <Link href={`/${locale}/profile/collections`} className="p-2 rounded-md hover:bg-secondary/50">
            <div className="flex justify-center">
              <Image src="/images/icons/collection.png" alt="Collections" width={24} height={24} />
            </div>
            <div className="mt-1">
              <p className="text-xs font-medium">收藏</p>
              <p className="text-xs text-primary/70">8</p>
            </div>
          </Link>
          <Link href={`/${locale}/profile/points`} className="p-2 rounded-md hover:bg-secondary/50">
            <div className="flex justify-center">
              <Image src="/images/icons/point.png" alt="Points" width={24} height={24} />
            </div>
            <div className="mt-1">
              <p className="text-xs font-medium">喵幣</p>
              <p className="text-xs text-primary/70">{currentUser.membershipPoints}</p>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
