// app/[locale]/settings/page.tsx
import { type Locale, dictionary } from "@/i18n-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettingsForm from "@/components/settings/profile-settings-form";
import AccountSettingsForm from "@/components/settings/account-settings-form";
import NotificationSettingsForm from "@/components/settings/notification-settings-form";
import PrivacySettingsForm from "@/components/settings/privacy-settings-form";

// Assuming params structure is correctly resolved before this component renders
export default async function SettingsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params; // Directly use locale if resolved
  const t = dictionary[locale] || dictionary['zh-TW'];

  return (
    <div className="container-custom py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{t["settings"]}</h1>
        <p className="text-primary/70">管理您的帳號設定</p>
      </div>

      {/* Single Parent Tabs component wrapping the grid */}
      <Tabs defaultValue="profile" className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start"> {/* Added items-start */}

          {/* Sidebar Column */}
          <div className="lg:col-span-1">
            {/* Vertical TabsList */}
            <TabsList className="w-full bg-background border border-border flex flex-col h-auto items-stretch p-1"> {/* Use items-stretch */}
              <TabsTrigger value="profile" className="justify-start w-full data-[state=active]:bg-muted"> {/* Added active style */}
                個人資料
              </TabsTrigger>
              <TabsTrigger value="account" className="justify-start w-full data-[state=active]:bg-muted">
                帳號設定
              </TabsTrigger>
              <TabsTrigger value="notifications" className="justify-start w-full data-[state=active]:bg-muted">
                通知設定
              </TabsTrigger>
              <TabsTrigger value="privacy" className="justify-start w-full data-[state=active]:bg-muted">
                隱私設定
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-3">
            {/* TabsContent elements are now children of the main Tabs component */}
            <TabsContent value="profile" className="mt-0"> {/* Removed margin-top */}
              <ProfileSettingsForm locale={locale} />
            </TabsContent>

            <TabsContent value="account" className="mt-0">
              <AccountSettingsForm locale={locale} />
            </TabsContent>

            <TabsContent value="notifications" className="mt-0">
              {/* Assuming NotificationSettingsForm exists */}
              {/* <NotificationSettingsForm locale={locale} /> */}
               <p>通知設定表單 (Placeholder)</p>
            </TabsContent>

            <TabsContent value="privacy" className="mt-0">
               {/* Assuming PrivacySettingsForm exists */}
              {/* <PrivacySettingsForm locale={locale} /> */}
               <p>隱私設定表單 (Placeholder)</p>
            </TabsContent>
          </div>

        </div>
      </Tabs> {/* End Single Parent Tabs */}
    </div>
  );
}