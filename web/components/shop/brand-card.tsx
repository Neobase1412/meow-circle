import Link from "next/link"
import Image from "next/image"
import { type Locale, dictionary } from "@/i18n-config"
import type { Brand } from "@/types/product"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BrandCardProps {
  brand: Brand
  locale: Locale
}

export default function BrandCard({ brand, locale }: BrandCardProps) {
  const t = dictionary[locale]

  return (
    <Link href={`/${locale}/shop/brands/${brand.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="relative h-32 bg-white flex items-center justify-center p-4">
          <Image
            src={brand.logoUrl || "/placeholder.svg"}
            alt={brand.name}
            width={120}
            height={60}
            className="max-h-20 w-auto object-contain"
          />
        </div>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <h3 className="font-semibold">{brand.name}</h3>
            {brand.isVerified && (
              <Badge variant="outline" className="text-xs bg-secondary/50">
                認證
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
