import Link from "next/link"
import Image from "next/image"
import { type Locale, dictionary } from "@/i18n-config"
import type { Topic } from "@/types/post"
import { Badge } from "@/components/ui/badge"

interface TopicCardProps {
  topic: Topic
  locale: Locale
}

export default function TopicCard({ topic, locale }: TopicCardProps) {
  const t = dictionary[locale]

  return (
    <Link
      href={`/${locale}/community/topics/${topic.id}`}
      className="flex gap-3 hover:bg-secondary/20 p-2 rounded-md transition-colors"
    >
      <Image
        src={topic.iconUrl || "/placeholder.svg"}
        alt={topic.title}
        width={40}
        height={40}
        className="rounded-md object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{topic.title}</h4>
          {topic.isOfficial && (
            <Badge variant="outline" className="text-xs bg-secondary/50">
              官方
            </Badge>
          )}
        </div>
        <p className="text-sm text-primary/70 line-clamp-1">{topic.description}</p>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-xs text-primary/70">{topic.followerCount} 追蹤</span>
          <span className="text-xs text-primary/70">{topic.postCount} 貼文</span>
        </div>
      </div>
    </Link>
  )
}
