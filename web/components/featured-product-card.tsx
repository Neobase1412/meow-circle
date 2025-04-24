import Link from "next/link"
import Image from "next/image"
import { type Locale, dictionary } from "@/i18n-config"
import type { Product } from "@/types/product"

interface FeaturedProductCardProps {
  product: Product
  locale: Locale
}

export default function FeaturedProductCard({ product, locale }: FeaturedProductCardProps) {
  const t = dictionary[locale]

  return (
    <Link
      href={`/${locale}/shop/products/${product.id}`}
      className="flex gap-3 hover:bg-secondary/20 p-2 rounded-md transition-colors"
    >
      <Image
        src={product.thumbnailUrl || "/placeholder.svg"}
        alt={product.name}
        width={60}
        height={60}
        className="rounded-md object-cover"
      />
      <div className="flex-1">
        <h4 className="font-medium line-clamp-1">{product.name}</h4>
        <p className="text-sm text-primary/70 line-clamp-1">{product.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-medium">${product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-primary/70 line-through">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
