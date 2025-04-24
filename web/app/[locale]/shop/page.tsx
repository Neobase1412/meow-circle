import Link from "next/link"
import { type Locale, dictionary } from "@/i18n-config"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { products } from "@/data/products"
import { productCategories, brands } from "@/data/products"
import ProductCard from "@/components/product-card"
import ShopBanner from "@/components/shop/shop-banner"
import CategoryCard from "@/components/shop/category-card"
import BrandCard from "@/components/shop/brand-card"

export default async function ShopPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = dictionary[locale]

  // Get featured products
  const featuredProducts = products.filter((product) => product.isPopular).slice(0, 4)

  // Get new products
  const newProducts = products.filter((product) => product.isNew).slice(0, 4)

  // Get sale products
  const saleProducts = products.filter((product) => product.isOnSale).slice(0, 4)

  return (
    <div className="container-custom py-6">
      <ShopBanner locale={locale} />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productCategories.slice(0, 4).map((category) => (
          <CategoryCard key={category.id} category={category} locale={locale} />
        ))}
      </div>

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">精選商品</h2>
          <Button variant="outline" asChild>
            <Link href={`/${locale}/shop/featured`}>{t["view-more"]}</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="new">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="new">新品上市</TabsTrigger>
              <TabsTrigger value="sale">優惠商品</TabsTrigger>
            </TabsList>
            <Button variant="outline" asChild>
              <Link href={`/${locale}/shop/all`}>{t["view-more"]}</Link>
            </Button>
          </div>

          <TabsContent value="new">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sale">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">熱門品牌</h2>
          <Button variant="outline" asChild>
            <Link href={`/${locale}/shop/brands`}>{t["view-more"]}</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} locale={locale} />
          ))}
        </div>
      </div>
    </div>
  )
}
