export enum ServiceCategory {
  HEALTH_CHECK = "HEALTH_CHECK",
  GROOMING = "GROOMING",
  BOARDING = "BOARDING",
  PET_CAFE = "PET_CAFE",
  VETERINARY = "VETERINARY",
  MEMORIAL = "MEMORIAL",
  TRAINING = "TRAINING",
  PET_SITTING = "PET_SITTING",
  OTHER = "OTHER",
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
  FAILED = "FAILED",
}

export interface Service {
  id: string
  name: string
  description: string
  category: ServiceCategory
  coverImageUrl?: string
  iconUrl?: string
  providerId: string
  isActive: boolean
  isRecommended: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ServiceProvider {
  id: string
  name: string
  description: string
  logoUrl?: string
  coverImageUrl?: string
  address?: string
  city?: string
  district?: string
  zipCode?: string
  phone?: string
  email?: string
  website?: string
  businessHours?: any
  isVerified: boolean
  certifications: string[]
  ratingAvg: number
  reviewCount: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ServiceItem {
  id: string
  serviceId: string
  name: string
  description?: string
  price: number
  duration?: number
  imageUrl?: string
  isPopular: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ServiceBooking {
  id: string
  userId: string
  serviceId: string
  serviceItemId: string
  bookingDate: Date
  startTime: Date
  endTime: Date
  status: BookingStatus
  petIds: string[]
  paymentAmount?: number
  paymentStatus?: PaymentStatus
  paymentMethod?: string
  note?: string
  cancelReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface ServiceReview {
  id: string
  userId: string
  serviceId: string
  rating: number
  comment?: string
  mediaUrls: string[]
  bookingId?: string
  providerReply?: string
  repliedAt?: Date
  helpfulCount: number
  reportCount: number
  createdAt: Date
  updatedAt: Date
}
