import Link from "next/link"
import { type Locale, dictionary } from "@/i18n-config"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface OfficialAnnouncementCardProps {
  locale: Locale
}

export default function OfficialAnnouncementCard({ locale }: OfficialAnnouncementCardProps) {
  const t = dictionary[locale]

  // Mock announcements
  const announcements = [
    {
      id: 1,
      title: "系統更新通知",
      content: "我們將於7月1日進行系統維護，屆時網站將暫停服務2小時。",
      date: "2023-06-25",
    },
    {
      id: 2,
      title: "新功能預告",
      content: "即將推出全新的寵物健康追蹤功能，敬請期待！",
      date: "2023-06-20",
    },
    {
      id: 3,
      title: "會員福利更新",
      content: "7月起，金牌會員將享有更多專屬優惠，詳情請見會員中心。",
      date: "2023-06-15",
    },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">官方公告</h3>
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border-b border-secondary pb-3 last:border-0 last:pb-0">
              <h4 className="font-medium">{announcement.title}</h4>
              <p className="text-sm text-primary/70 mt-1 line-clamp-2">{announcement.content}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-primary/70">{announcement.date}</span>
                <Button variant="ghost" size="sm" className="text-xs h-6 px-2" asChild>
                  <Link href={`/${locale}/announcements/${announcement.id}`}>查看詳情</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
