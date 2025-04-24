import type React from "react"
import type { Locale } from "@/i18n-config"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: Promise<{ locale: Locale }> }
}) {
  const { locale } = await params
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
    </div>
  )
}
