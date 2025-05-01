// components/pet-life/service-card.tsx
import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n-config"; // Removed dictionary import
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react"; // Import Star icon for rating
import type { RecommendedServiceData } from "@/lib/petLifeData"; // Import the correct type

interface ServiceCardProps {
  service: RecommendedServiceData; // Use the Prisma-derived type
  locale: Locale;
}

export default function ServiceCard({ service, locale }: ServiceCardProps) {
  // const t = dictionary[locale]; // 't' not used

  // Provider data is now directly included in the service prop
  const provider = service.provider;

  // Format rating and review count for display
  const displayRating = provider?.ratingAvg?.toFixed(1) || "N/A";
  const displayReviewCount = provider?.reviewCount ?? 0;

  return (
    // Link to the specific service detail page
    <Link href={`/${locale}/pet-life/services/${service.id}`} className="block h-full">
      <Card className="overflow-hidden h-full transition-all hover:shadow-lg flex flex-col"> {/* Ensure flex column */}
        <div className="relative h-40 md:h-48 w-full flex-shrink-0"> {/* Fixed height */}
          <Image
            src={service.coverImageUrl || "/placeholder.svg"}
            alt={service.name || "Service"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Add sizes
          />
           {/* Use isRecommended field from fetched data */}
          {service.isRecommended && <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary/90 text-primary-foreground">推薦</Badge>}
        </div>
        <CardContent className="p-4 flex flex-col flex-grow"> {/* Added flex-grow */}
           {/* Service Name and Icon */}
          <div className="flex items-center gap-2 mb-2">
            <Image
              src={service.iconUrl || "/placeholder.svg"} // Use service icon
              alt="" // Decorative icon
              width={20}
              height={20}
              className="rounded-md object-contain" // Use contain for icons
            />
            <h3 className="font-semibold line-clamp-1">{service.name || "Untitled Service"}</h3>
          </div>
          {/* Description */}
          <p className="text-sm text-primary/70 mb-3 line-clamp-2 flex-grow"> {/* Added flex-grow to push provider down */}
              {service.description || "No description available."}
          </p>
          {/* Provider Info & Rating */}
          <div className="mt-auto border-t pt-3"> {/* Pushes to bottom */}
            {provider ? (
              <div className="flex items-center justify-between gap-2 text-xs text-primary/70">
                 {/* Provider Name */}
                <div className="flex items-center gap-1.5 truncate">
                   {/* Add provider logo if available in schema/select */}
                  {/* <Image src={provider.logoUrl || "/placeholder.svg"} alt="" width={16} height={16} className="rounded-full" /> */}
                  <span className="truncate">{provider.name}</span>
                   {/* TODO: Add provider verification badge if needed/fetched */}
                   {/* {provider.isVerified && <Badge variant="outline" className="text-xs h-5 bg-secondary/50 flex-shrink-0">認證</Badge>} */}
                </div>
                 {/* Rating */}
                 {provider.ratingAvg !== null && provider.ratingAvg > 0 && (
                   <div className="flex items-center gap-1 flex-shrink-0">
                     <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
                     <span className="font-medium">{displayRating}</span>
                     <span className="text-primary/60">({displayReviewCount})</span>
                   </div>
                 )}
              </div>
            ) : (
               <p className="text-xs text-primary/70 italic">Provider information missing.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}