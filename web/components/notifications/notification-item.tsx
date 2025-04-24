import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { zhTW, enUS } from "date-fns/locale"
import { Heart, MessageSquare, UserPlus, Bell, AtSign } from "lucide-react"
import { type Locale, dictionary } from "@/i18n-config"
import { Card, CardContent } from "@/components/ui/card"

interface NotificationItemProps {
  notification: {
    id: number
    type: string
    actor?: {
      id: string
      name: string
      avatarUrl: string
    }
    content: string
    target?: {
      type: string
      id: string
    }
    isRead: boolean
    createdAt: Date
  }
  locale: Locale
}

export default function NotificationItem({ notification, locale }: NotificationItemProps) {
  const t = dictionary[locale]

  // Format date based on locale
  const dateLocale = locale === "zh-TW" ? zhTW : enUS
  const formattedDate = formatDistanceToNow(notification.createdAt, {
    addSuffix: true,
    locale: dateLocale,
  })

  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />
      case "mention":
        return <AtSign className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-primary/70" />
    }
  }

  // Get target URL
  const getTargetUrl = () => {
    if (!notification.target) return `/${locale}`

    switch (notification.target.type) {
      case "post":
        return `/${locale}/posts/${notification.target.id}`
      case "discussion":
        return `/${locale}/discussion/${notification.target.id}`
      case "user":
        return `/${locale}/profile/${notification.target.id}`
      default:
        return `/${locale}`
    }
  }

  return (
    <Card className={notification.isRead ? "bg-background" : "bg-secondary/20"}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          {notification.actor ? (
            <Link href={`/${locale}/profile/${notification.actor.id}`}>
              <Image
                src={notification.actor.avatarUrl || "/images/avatars/default.jpg"}
                alt={notification.actor.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
          ) : (
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">{getIcon()}</div>
          )}

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                {notification.actor && (
                  <Link href={`/${locale}/profile/${notification.actor.id}`} className="font-medium hover:underline">
                    {notification.actor.name}
                  </Link>
                )}
                <span className="ml-1">{notification.content}</span>
              </div>
              <span className="text-xs text-primary/70">{formattedDate}</span>
            </div>

            {notification.target && (
              <Link href={getTargetUrl()} className="mt-1 text-sm text-primary/70 hover:text-primary hover:underline">
                查看詳情
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
