import Link from "next/link"
import Image from "next/image"
import { type Locale, dictionary } from "@/i18n-config"
import { Button } from "@/components/ui/button"

interface PetLifeBannerProps {
  locale: Locale
}

export default function PetLifeBanner({ locale }: PetLifeBannerProps) {
  const t = dictionary[locale]

  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/pet-life/banner.jpg" alt="Pet Life Banner" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
      </div>
      <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">寵物生活</h1>
        <p className="text-white/90 text-lg mb-6">
          提供全方位的寵物服務，包括健康管理、美容服務、寵物住宿等，讓您的毛孩享受最好的照顧。
        </p>
        <div className="flex flex-wrap gap-4">
          <Button size="lg" asChild>
            <Link href={`/${locale}/pet-life/services`}>探索服務</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white/20 text-white border-white/40 hover:bg-white/30"
            asChild
          >
            <Link href={`/${locale}/pet-life/health`}>健康管理</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
