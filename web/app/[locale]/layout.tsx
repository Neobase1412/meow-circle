// app/[locale]/layout.tsx
import type React from "react";
// Remove cookies import if only used in getUserData
import type { Locale } from "@/i18n-config";
import MainNav from "@/components/main-nav";
import Footer from "@/components/footer";
// Remove direct Supabase/Prisma imports if only used in getUserData
import { AuthProvider } from "@/providers/AuthProvider";
import { getUserData } from "@/lib/userData"; // Import from the new location

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  // Fetch user data using the imported helper function
  const { authUser, profile } = await getUserData();

  // console.log(`Rendering LocaleLayout for locale: ${locale}, Auth User: ${authUser?.id}, Profile: ${profile?.id}`);

  return (
    <AuthProvider authUser={authUser} profile={profile}>
      <div className="flex min-h-screen flex-col">
        <MainNav locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
      </div>
    </AuthProvider>
  );
}