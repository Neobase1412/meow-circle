export enum UserRole {
  USER = "USER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
  SYSTEM = "SYSTEM",
}

export enum MembershipLevel {
  REGULAR = "REGULAR",
  SILVER = "SILVER",
  GOLD = "GOLD",
  DIAMOND = "DIAMOND",
}

export interface User {
  id: string
  email: string
  phone?: string
  username: string
  passwordHash?: string
  fullName?: string
  bio?: string
  avatarUrl?: string
  coverImageUrl?: string
  isVerified: boolean
  lastLoginAt?: Date
  joinedAt: Date
  isActive: boolean
  role: UserRole
  notificationPrefs?: any
  settings?: any
  membershipLevel: MembershipLevel
  membershipPoints: number
  membershipExpiry?: Date
  preferences?: any
  createdAt: Date
  updatedAt: Date
}
