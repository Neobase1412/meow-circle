import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { zhTW, enUS } from "date-fns/locale"
import { MessageSquare, Eye } from "lucide-react"
import { type Locale, dictionary } from "@/i18n-config"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DiscussionCardProps {
  discussion: {
    id: number
    title: string
    content: string
    author: {
      id: string
      name: string
      avatarUrl: string
    }
    category: string
    commentCount: number
    viewCount: number
    createdAt: Date
  }
  locale: Locale
}

export default function DiscussionCard({ discussion, locale }: DiscussionCardProps) {
  const t = dictionary[locale]

  // Format date based on locale
  const dateLocale = locale === "zh-TW" ? zhTW : enUS
  const formattedDate = formatDistanceToNow(discussion.createdAt, {
    addSuffix: true,
    locale: dateLocale,
  })

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Link href={`/${locale}/profile/${discussion.author.id}`}>
            <Image
              src={discussion.author.avatarUrl || "/images/avatars/default.jpg"}
              alt={discussion.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          </Link>
          <div className="flex-1">
            <Link href={`/${locale}/discussion/${discussion.id}`} className="font-semibold text-lg hover:underline">
              {discussion.title}
            </Link>
            <p className="text-primary/70 line-clamp-2 mt-1">{discussion.content}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Badge variant="outline" className="bg-secondary/50">
                {discussion.category}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-primary/70">
                <Link href={`/${locale}/profile/${discussion.author.id}`} className="hover:underline">
                  {discussion.author.name}
                </Link>
                <span>•</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <div className="flex items-center gap-1 text-xs text-primary/70">
                  <MessageSquare className="h-3 w-3" />
                  <span>{discussion.commentCount}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-primary/70">
                  <Eye className="h-3 w-3" />
                  <span>{discussion.viewCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
