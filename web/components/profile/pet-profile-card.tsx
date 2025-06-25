// components/profile/pet-profile-card.tsx
import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n-config"; // Removed dictionary import as 't' wasn't used

// Define a specific type for the props based on the Prisma query
// This makes it clear exactly which fields are expected.
interface PetProfileCardProps {
  pet: {
    id: string;
    name: string;
    primaryImageUrl: string | null;
    breed: string | null;
  };
  locale: Locale;
}

export default function PetProfileCard({ pet, locale }: PetProfileCardProps) {
  // const t = dictionary[locale] || dictionary['zh-TW']; // 't' was not used, can be removed

  return (
    <Link
      href={`/${locale}/pets/${pet.id}`}
      className="flex items-center gap-3 hover:bg-secondary/20 p-2 rounded-md transition-colors"
    >
      <Image
        // Updated placeholder handling slightly for clarity
        src={pet.primaryImageUrl || "/placeholder.svg"}
        alt={pet.name || "Pet"} // Add fallback alt text
        width={40}
        height={40}
        className="rounded-full object-cover bg-muted" // Added object-cover and bg-muted
      />
      <div>
        <h3 className="font-medium">{pet.name || "Unnamed Pet"}</h3>
        <p className="text-xs text-primary/70">{pet.breed || "Unknown Breed"}</p>
      </div>
    </Link>
  );
}