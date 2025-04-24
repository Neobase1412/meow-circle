import Link from "next/link"
import Image from "next/image"
import { type Locale, dictionary } from "@/i18n-config"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { services } from "@/data/services"
import ServiceCard from "@/components/pet-life/service-card"
import PetLifeBanner from "@/components/pet-life/pet-life-banner"
import HealthTipCard from "@/components/pet-life/health-tip-card"

export default async function PetLifePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = dictionary[locale]

  // Get recommended services
  const recommendedServices = services.filter((service) => service.isRecommended)

  // Mock health tips
  const healthTips = [
    {
      id: 1,
      title: "貓咪夏季防中暑指南",
      content: "炎炎夏日，如何幫助貓咪預防中暑？室內溫度控制、充足飲水、避免陽光直射是關鍵。",
      imageUrl: "/images/tips/tip1.jpg",
    },
    {
      id: 2,
      title: "貓咪牙齒保健全攻略",
      content: "定期刷牙、提供潔牙零食、定期獸醫檢查，讓貓咪擁有健康牙齒。",
      imageUrl: "/images/tips/tip2.jpg",
    },
    {
      id: 3,
      title: "室內貓咪運動指南",
      content: "即使是室內貓，也需要足夠的運動來保持健康。互動玩具、貓爬架、定時遊戲是好方法。",
      imageUrl: "/images/tips/tip3.jpg",
    },
  ]

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
