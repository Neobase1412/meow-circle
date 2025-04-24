import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { type Locale, dictionary } from "@/i18n-config"
import type { Product } from "@/types/product"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: Product
  locale: Locale
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const t = dictionary[locale]

  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-md">
      <div className="relative">
        <Link href={`/${locale}/shop/products/${product.id}`}>
          <Image
            src={product.thumbnailUrl || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-64 object-cover transition-transform hover:scale-105"
          />
        </Link>
        {product.isNew && <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">新品</Badge>}
        {product.isOnSale && (
          <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">{product.discount}% OFF</Badge>
        )}
      </div>
      <CardContent className="p-4">
        <Link href={`/${locale}/shop/products/${product.id}`} className="hover:underline">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
        </Link>
        <p className="text-primary/70 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm">{product.rating.toFixed(1)}</span>
          </div>
          <span className="mx-2 text-primary/30">|</span>
          <span className="text-sm text-primary/70">{product.reviewCount} 評價</span>
        </div>
        <div className="mt-3 flex items-center">
          <span className="text-xl font-bold">${product.price}</span>
          {product.originalPrice && (
            <span className="ml-2 text-sm text-primary/70 line-through">${product.originalPrice}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
