import Link from "next/link"
import Image from "next/image"
import { type Locale, dictionary } from "@/i18n-config"
import type { Service } from "@/types/service"
import { serviceProviders } from "@/data/services"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ServiceCardProps {
  service: Service
  locale: Locale
}

export default function ServiceCard({ service, locale }: ServiceCardProps) {
  const t = dictionary[locale]

  // Find the provider
  const provider = serviceProviders.find((p) => p.id === service.providerId)

  return (
    <Link href={`/${locale}/pet-life/services/${service.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="relative h-48">
          <Image src={service.coverImageUrl || "/placeholder.svg"} alt={service.name} fill className="object-cover" />
          {service.isRecommended && <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary">推薦</Badge>}
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src={service.iconUrl || "/placeholder.svg"}
              alt={service.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <h3 className="font-semibold">{service.name}</h3>
          </div>
          <p className="text-sm text-primary/70 mb-3 line-clamp-2">{service.description}</p>
          <div className="flex items-center gap-2">
            <Image
              src={provider?.logoUrl || "/placeholder.svg"}
              alt={provider?.name || ""}
              width={16}
              height={16}
              className="rounded-full"
            />
            <span className="text-xs text-primary/70">{provider?.name}</span>
            {provider?.isVerified && (
              <Badge variant="outline" className="text-xs h-5 bg-secondary/50">
                認證
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
