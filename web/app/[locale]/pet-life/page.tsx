import Link from "next/link"
import Image from "next/image"
import { type Locale, dictionary } from "@/i18n-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import ServiceCard from "@/components/pet-life/service-card"
import PetLifeBanner from "@/components/pet-life/pet-life-banner"
import HealthTipCard from "@/components/pet-life/health-tip-card"
import { getPetLifePageData } from "@/lib/petLifeData"

export default async function PetLifePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = dictionary[locale]

  const {
    recommendedServices,
    healthTips // Still using mock data for tips
  } = await getPetLifePageData();

  return (
    <div className="container-custom py-6">
      <PetLifeBanner locale={locale} />

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">推薦服務</h2>
          <Button variant="outline" asChild>
            <Link href={`/${locale}/pet-life/services`}>{t["view-more"]}</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedServices.map((service) => (
            <ServiceCard key={service.id} service={service} locale={locale} />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">健康小知識</h2>
          <Button variant="outline" asChild>
            <Link href={`/${locale}/pet-life/health-tips`}>{t["view-more"]}</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {healthTips.map((tip) => (
            <HealthTipCard key={tip.id} tip={tip} locale={locale} />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <Card className="bg-secondary/30">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">寵物生活紀錄</h2>
                <p className="text-primary/80 mb-6">
                  記錄您的寵物生活點滴，包括健康狀況、飲食習慣、活動記錄等，讓您更了解您的毛孩。
                </p>
                <Button size="lg" asChild>
                  <Link href={`/${locale}/pet-life/record`}>開始記錄</Link>
                </Button>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/images/pet-life/record.jpg"
                  alt="Pet Life Record"
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
