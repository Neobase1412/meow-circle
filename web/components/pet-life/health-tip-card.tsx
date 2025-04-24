import Link from "next/link"
import Image from "next/image"
import { type Locale, dictionary } from "@/i18n-config"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface HealthTipCardProps {
  tip: {
    id: number
    title: string
    content: string
    imageUrl: string
  }
  locale: Locale
}

export default function HealthTipCard({ tip, locale }: HealthTipCardProps) {
  const t = dictionary[locale]

  return (
    <Card className="overflow-hidden h-full">
      <div className="relative h-48">
        <Image src={tip.imageUrl || "/placeholder.svg"} alt={tip.title} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
        <p className="text-sm text-primary/70 mb-4 line-clamp-3">{tip.content}</p>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/${locale}/pet-life/health-tips/${tip.id}`}>{t["learn-more"]}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
