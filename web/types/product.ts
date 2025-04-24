export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  stock: number
  imageUrls: string[]
  thumbnailUrl: string
  categoryId: string
  brandId: string
  tags: string[]
  rating: number
  reviewCount: number
  isActive: boolean
  isNew: boolean
  isPopular: boolean
  isOnSale: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductCategory {
  id: string
  name: string
  description?: string
  iconUrl?: string
  parentId?: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface Brand {
  id: string
  name: string
  description?: string
  logoUrl?: string
  websiteUrl?: string
  isVerified: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductReview {
  id: string
  productId: string
  userId: string
  rating: number
  comment?: string
  mediaUrls: string[]
  isVerifiedPurchase: boolean
  helpfulCount: number
  reportCount: number
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  userId: string
  productId: string
  quantity: number
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  orderNumber: string
  status: string
  totalAmount: number
  discountAmount: number
  shippingAmount: number
  finalAmount: number
  paymentMethod: string
  paymentStatus: string
  shippingMethod: string
  shippingStatus: string
  recipientName: string
  recipientPhone: string
  shippingAddress: string
  note?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  productImage: string
  quantity: number
  unitPrice: number
  totalPrice: number
  createdAt: Date
  updatedAt: Date
}
