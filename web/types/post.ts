export enum Visibility {
  PUBLIC = "PUBLIC",
  FOLLOWERS = "FOLLOWERS",
  PRIVATE = "PRIVATE",
}

export enum MediaType {
  NONE = "NONE",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  DOCUMENT = "DOCUMENT",
  MIXED = "MIXED",
}

export enum TopicCategory {
  GENERAL = "GENERAL",
  EXPERIENCE = "EXPERIENCE",
  HEALTH = "HEALTH",
  NUTRITION = "NUTRITION",
  BEHAVIOR = "BEHAVIOR",
  PRODUCTS = "PRODUCTS",
  ACTIVITIES = "ACTIVITIES",
  BEGINNERS = "BEGINNERS",
  STRAY_CARE = "STRAY_CARE",
  OFFICIAL = "OFFICIAL",
}

export interface Post {
  id: string
  authorId: string
  content: string
  mood?: string
  location?: string
  visibility: Visibility
  mediaUrls: string[]
  mediaType: MediaType
  viewCount: number
  isPinned: boolean
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  content: string
  mediaUrl?: string
  parentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Like {
  id: string
  userId: string
  postId?: string
  commentId?: string
  createdAt: Date
}

export interface Collection {
  id: string
  userId: string
  postId: string
  createdAt: Date
}

export interface Tag {
  id: string
  name: string
  count: number
  createdAt: Date
  updatedAt: Date
}

export interface Topic {
  id: string
  title: string
  description?: string
  iconUrl?: string
  coverUrl?: string
  category: TopicCategory
  followerCount: number
  postCount: number
  isOfficial: boolean
  createdAt: Date
  updatedAt: Date
}
