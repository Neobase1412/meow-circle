"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, Search, ShoppingCart, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { type Locale, dictionary } from "@/i18n-config"

export default function MainNav({ locale }: { locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const t = dictionary[locale]

  const isActive = (path: string) => {
    return pathname === `/${locale}${path}`
  }

  const navItems = [
    { href: "", label: t["home"] },
    { href: "/pet-life", label: t["pet-life"] },
    { href: "/community", label: t["community"] },
    { href: "/shop", label: t["shop"] },
    { href: "/discussion", label: t["discussion"] },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href={`/${locale}`} className="flex items-center gap-2 mb-8">
                <Image src="/images/logo.png" alt="喵圈 Meow Circle" width={28} height={28} className="h-7 w-7" />
                <span className="text-xl font-bold">喵圈</span>
              </Link>
              <div className="grid gap-2 py-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    className={`flex w-full items-center py-2 text-lg font-semibold ${
                      isActive(item.href) ? "text-primary" : "text-primary/70"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Link href={`/${locale}`} className="hidden lg:flex items-center gap-2 mr-6">
            <Image src="/images/logo.png" alt="喵圈 Meow Circle" width={28} height={28} className="h-7 w-7" />
            <span className="text-xl font-bold">喵圈</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-primary/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">{t["search"]}</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
          <div className="hidden md:flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/${locale}/login`}>{t["login"]}</Link>
            </Button>
            <Button asChild>
              <Link href={`/${locale}/register`}>{t["register"]}</Link>
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <User className="h-5 w-5" />
            <span className="sr-only">User</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
