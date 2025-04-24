import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { zhTW, enUS } from "date-fns/locale"
import { type Locale, dictionary } from "@/i18n-config"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RecentActivityCardProps {
  locale: Locale
}

export default function RecentActivityCard({ locale }: RecentActivityCardProps) {
  const t = dictionary[locale]

  // Mock recent activities
  const activities = [
    {
      id: 1,
      title: "週末寵物攝影會",
      date: new Date("2023-07-15T10:00:00"),
      imageUrl: "/images/events/event1.jpg",
    },
    {
      id: 2,
      title: "貓咪美容講座",
      date: new Date("2023-07-20T14:00:00"),
      imageUrl: "/images/events/event2.jpg",
    },
    {
      id: 3,
      title: "寵物友善咖啡廳聚會",
      date: new Date("2023-07-25T18:00:00"),
      imageUrl: "/images/events/event3.jpg",
    },
  ]

  // Format date based on locale
  const dateLocale = locale === "zh-TW" ? zhTW : enUS

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">近期活動</h3>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <Image
                src={activity.imageUrl || "/placeholder.svg"}
                alt={activity.title}
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium">{activity.title}</h4>
                <p className="text-sm text-primary/70">
                  {formatDistanceToNow(activity.date, {
                    addSuffix: false,
                    locale: dateLocale,
                  })}
                  後
                </p>
                <Button variant="outline" size="sm" className="mt-1" asChild>
                  <Link href={`/${locale}/community/events/${activity.id}`}>報名參加</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline" asChild>
            <Link href={`/${locale}/community/events`}>{t["view-more"]}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
