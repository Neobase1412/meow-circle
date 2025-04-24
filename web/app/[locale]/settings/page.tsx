import { type Locale, dictionary } from "@/i18n-config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileSettingsForm from "@/components/settings/profile-settings-form"
import AccountSettingsForm from "@/components/settings/account-settings-form"
import NotificationSettingsForm from "@/components/settings/notification-settings-form"
import PrivacySettingsForm from "@/components/settings/privacy-settings-form"

export default async function SettingsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = dictionary[locale]

  return (
    <div className="container-custom py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{t["settings"]}</h1>
        <p className="text-primary/70">管理您的帳號設定</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Tabs defaultValue="profile" orientation="vertical" className="w-full">
            <TabsList className="w-full bg-background border border-border flex flex-col h-auto">
              <TabsTrigger value="profile" className="justify-start w-full">
                個人資料
              </TabsTrigger>
              <TabsTrigger value="account" className="justify-start w-full">
                帳號設定
              </TabsTrigger>
              <TabsTrigger value="notifications" className="justify-start w-full">
                通知設定
              </TabsTrigger>
              <TabsTrigger value="privacy" className="justify-start w-full">
                隱私設定
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="profile">
            <TabsContent value="profile">
              <ProfileSettingsForm locale={locale} />
            </TabsContent>

            <TabsContent value="account">
              <AccountSettingsForm locale={locale} />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSettingsForm locale={locale} />
            </TabsContent>

            <TabsContent value="privacy">
              <PrivacySettingsForm locale={locale} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
