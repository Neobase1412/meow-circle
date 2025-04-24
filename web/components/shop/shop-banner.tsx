import Link from "next/link"
import Image from "next/image"
import { type Locale, dictionary } from "@/i18n-config"
import { Button } from "@/components/ui/button"

interface ShopBannerProps {
  locale: Locale
}

export default function ShopBanner({ locale }: ShopBannerProps) {
  const t = dictionary[locale]

  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/shop/banner.jpg" alt="Shop Banner" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
      </div>
      <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">喵宇宙精選商城</h1>
        <p className="text-white/90 text-lg mb-6">為您的貓提供最優質的食品、用品和玩具，讓您的毛孩享受最好的呵護。</p>
        <div className="flex flex-wrap gap-4">
          <Button size="lg" asChild>
            <Link href={`/${locale}/shop/new`}>探索新品</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white/20 text-white border-white/40 hover:bg-white/30"
            asChild
          >
            <Link href={`/${locale}/shop/sale`}>查看優惠</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
