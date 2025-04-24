import { type Locale, dictionary } from "@/i18n-config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import NotificationItem from "@/components/notifications/notification-item"

export default async function NotificationsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = dictionary[locale]

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: "like",
      actor: {
        id: "2",
        name: "喵星人愛好者",
        avatarUrl: "/images/avatars/user1.jpg",
      },
      content: "喜歡了你的貼文",
      target: {
        type: "post",
        id: "1",
      },
      isRead: false,
      createdAt: new Date("2023-06-20T10:30:00"),
    },
    {
      id: 2,
      type: "comment",
      actor: {
        id: "3",
        name: "貓咪媽媽",
        avatarUrl: "/images/avatars/user2.jpg",
      },
      content: "在你的貼文上留言",
      target: {
        type: "post",
        id: "1",
      },
      isRead: false,
      createdAt: new Date("2023-06-19T15:45:00"),
    },
    {
      id: 3,
      type: "follow",
      actor: {
        id: "4",
        name: "貓咪攝影師",
        avatarUrl: "/images/avatars/user3.jpg",
      },
      content: "開始追蹤你",
      target: {
        type: "user",
        id: "1",
      },
      isRead: true,
      createdAt: new Date("2023-06-18T09:15:00"),
    },
    {
      id: 4,
      type: "system",
      content: "歡迎加入喵圈！完成個人資料以獲得更好的體驗。",
      isRead: true,
      createdAt: new Date("2023-06-15T08:00:00"),
    },
    {
      id: 5,
      type: "mention",
      actor: {
        id: "5",
        name: "新手貓奴",
        avatarUrl: "/images/avatars/user4.jpg",
      },
      content: "在討論中提及你",
      target: {
        type: "discussion",
        id: "2",
      },
      isRead: false,
      createdAt: new Date("2023-06-17T14:20:00"),
    },
  ]

  return (
    <div className="container-custom py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{t["notifications"]}</h1>
        <p className="text-primary/70">查看您的所有通知</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full bg-background border border-border">
              <TabsTrigger value="all" className="flex-1">
                全部
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                未讀
              </TabsTrigger>
              <TabsTrigger value="mentions" className="flex-1">
                提及
              </TabsTrigger>
            </TabsList>

            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm">
                全部標為已讀
              </Button>
            </div>

            <TabsContent value="all" className="mt-4">
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} locale={locale} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="unread" className="mt-4">
              <div className="space-y-2">
                {notifications
                  .filter((notification) => !notification.isRead)
                  .map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} locale={locale} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="mentions" className="mt-4">
              <div className="space-y-2">
                {notifications
                  .filter((notification) => notification.type === "mention")
                  .map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} locale={locale} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
