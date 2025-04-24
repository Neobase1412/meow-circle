import Link from "next/link"
import Image from "next/image"
import { type Locale, dictionary } from "@/i18n-config"
import type { ProductCategory } from "@/types/product"
import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  category: ProductCategory
  locale: Locale
}

export default function CategoryCard({ category, locale }: CategoryCardProps) {
  const t = dictionary[locale]

  return (
    <Link href={`/${locale}/shop/categories/${category.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="relative h-32 bg-secondary/30 flex items-center justify-center">
          <Image
            src={category.iconUrl || "/placeholder.svg"}
            alt={category.name}
            width={64}
            height={64}
            className="h-16 w-16 object-contain"
          />
        </div>
        <CardContent className="p-4 text-center">
          <h3 className="font-semibold">{category.name}</h3>
          <p className="text-sm text-primary/70 mt-1 line-clamp-2">{category.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
