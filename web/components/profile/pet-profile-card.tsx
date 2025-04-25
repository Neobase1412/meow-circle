import Link from "next/link"
import Image from "next/image"
import { type Locale, dictionary } from "@/i18n-config"
import type { Pet } from "@/types/pet"

interface PetProfileCardProps {
  pet: Pet
  locale: Locale
}

export default function PetProfileCard({ pet, locale }: PetProfileCardProps) {
  const t = dictionary[locale]

  return (
    <Link
      href={`/${locale}/pets/${pet.id}`}
      className="flex items-center gap-3 hover:bg-secondary/20 p-2 rounded-md transition-colors"
    >
      <Image
        src={pet.primaryImageUrl || "/placeholder.svg?height=40&width=40&query=cat"}
        alt={pet.name}
        width={40}
        height={40}
        className="rounded-full"
      />
      <div>
        <h3 className="font-medium">{pet.name}</h3>
        <p className="text-xs text-primary/70">{pet.breed}</p>
      </div>
    </Link>
  )
}
