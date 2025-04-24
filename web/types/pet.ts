export enum PetGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNKNOWN = "UNKNOWN",
}

export enum LifeRecordType {
  DIET = "DIET",
  WEIGHT = "WEIGHT",
  ACTIVITY = "ACTIVITY",
  GROOMING = "GROOMING",
  BEHAVIOR = "BEHAVIOR",
  MILESTONE = "MILESTONE",
  OTHER = "OTHER",
}

export interface Pet {
  id: string
  name: string
  ownerId: string
  breed?: string
  gender?: PetGender
  birthDate?: Date
  adoptionDate?: Date
  chipNumber?: string
  weight?: number
  description?: string
  primaryImageUrl?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface HealthRecord {
  id: string
  petId: string
  recordType: string
  title: string
  description: string
  date: Date
  veterinarian?: string
  hospital?: string
  attachments: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Vaccination {
  id: string
  petId: string
  vaccineName: string
  date: Date
  expiryDate?: Date
  hospital?: string
  veterinarian?: string
  batchNumber?: string
  notes?: string
  reminderEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface LifeRecord {
  id: string
  petId: string
  recordType: LifeRecordType
  title: string
  content: string
  mood?: string
  photos: string[]
  recordDate: Date
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Album {
  id: string
  title: string
  description?: string
  coverUrl?: string
  petId: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AlbumPhoto {
  id: string
  albumId: string
  imageUrl: string
  caption?: string
  takenAt?: Date
  taggedPetIds: string[]
  createdAt: Date
  updatedAt: Date
}
