import {
  type Service,
  type ServiceProvider,
  type ServiceItem,
  type ServiceBooking,
  type ServiceReview,
  ServiceCategory,
  BookingStatus,
  PaymentStatus,
} from "@/types/service"

export const serviceProviders: ServiceProvider[] = [
  {
    id: "1",
    name: "喵喵動物醫院",
    description: "專業的貓咪醫療團隊，提供全方位的貓咪健康照護服務",
    logoUrl: "/images/providers/provider1-logo.png",
    coverImageUrl: "/images/providers/provider1-cover.jpg",
    address: "台北市中山區喵喵路123號",
    city: "台北市",
    district: "中山區",
    zipCode: "104",
    phone: "02-1234-5678",
    email: "service@meowvet.com",
    website: "https://www.meowvet.com",
    businessHours: {
      monday: { open: "09:00", close: "21:00" },
      tuesday: { open: "09:00", close: "21:00" },
      wednesday: { open: "09:00", close: "21:00" },
      thursday: { open: "09:00", close: "21:00" },
      friday: { open: "09:00", close: "21:00" },
      saturday: { open: "10:00", close: "18:00" },
      sunday: { open: "10:00", close: "18:00" },
    },
    isVerified: true,
    certifications: ["台灣獸醫師公會認證", "國際貓科醫學協會會員"],
    ratingAvg: 4.8,
    reviewCount: 156,
    tags: ["專業醫療", "24小時急診", "貓咪專科"],
    createdAt: new Date("2020-01-15"),
    updatedAt: new Date("2023-06-01"),
  },
  {
    id: "2",
    name: "毛孩美容沙龍",
    description: "專業的寵物美容服務，讓您的毛孩展現最佳風采",
    logoUrl: "/images/providers/provider2-logo.png",
    coverImageUrl: "/images/providers/provider2-cover.jpg",
    address: "台北市信義區寵物路456號",
    city: "台北市",
    district: "信義區",
    zipCode: "110",
    phone: "02-8765-4321",
    email: "service@petgrooming.com",
    website: "https://www.petgrooming.com",
    businessHours: {
      monday: { open: "10:00", close: "20:00" },
      tuesday: { open: "10:00", close: "20:00" },
      wednesday: { open: "10:00", close: "20:00" },
      thursday: { open: "10:00", close: "20:00" },
      friday: { open: "10:00", close: "20:00" },
      saturday: { open: "10:00", close: "20:00" },
      sunday: { open: "12:00", close: "18:00" },
    },
    isVerified: true,
    certifications: ["專業寵物美容師認證", "亞洲寵物美容協會會員"],
    ratingAvg: 4.7,
    reviewCount: 98,
    tags: ["貓咪美容", "專業修剪", "溫和服務"],
    createdAt: new Date("2021-03-10"),
    updatedAt: new Date("2023-05-15"),
  },
  {
    id: "3",
    name: "喵星人旅館",
    description: "五星級貓咪住宿服務，讓您的愛貓享受舒適的假期",
    logoUrl: "/images/providers/provider3-logo.png",
    coverImageUrl: "/images/providers/provider3-cover.jpg",
    address: "台北市大安區貓咪路789號",
    city: "台北市",
    district: "大安區",
    zipCode: "106",
    phone: "02-2345-6789",
    email: "service@cathotel.com",
    website: "https://www.cathotel.com",
    businessHours: {
      monday: { open: "08:00", close: "20:00" },
      tuesday: { open: "08:00", close: "20:00" },
      wednesday: { open: "08:00", close: "20:00" },
      thursday: { open: "08:00", close: "20:00" },
      friday: { open: "08:00", close: "20:00" },
      saturday: { open: "08:00", close: "20:00" },
      sunday: { open: "08:00", close: "20:00" },
    },
    isVerified: true,
    certifications: ["寵物旅館協會認證", "寵物照護專業認證"],
    ratingAvg: 4.9,
    reviewCount: 120,
    tags: ["豪華套房", "24小時監控", "專業照護"],
    createdAt: new Date("2019-07-20"),
    updatedAt: new Date("2023-06-10"),
  },
]

export const services: Service[] = [
  {
    id: "1",
    name: "貓咪健康檢查",
    description: "全面的貓咪健康檢查服務，包含基礎體檢和進階檢查項目",
    category: ServiceCategory.HEALTH_CHECK,
    coverImageUrl: "/images/services/service1-cover.jpg",
    iconUrl: "/images/services/service1-icon.png",
    providerId: "1", // 喵喵動物醫院
    isActive: true,
    isRecommended: true,
    createdAt: new Date("2022-01-15"),
    updatedAt: new Date("2023-06-01"),
  },
  {
    id: "2",
    name: "貓咪美容服務",
    description: "專業的貓咪美容服務，包含洗澡、修剪、梳毛等項目",
    category: ServiceCategory.GROOMING,
    coverImageUrl: "/images/services/service2-cover.jpg",
    iconUrl: "/images/services/service2-icon.png",
    providerId: "2", // 毛孩美容沙龍
    isActive: true,
    isRecommended: true,
    createdAt: new Date("2022-03-10"),
    updatedAt: new Date("2023-05-15"),
  },
  {
    id: "3",
    name: "貓咪豪華住宿",
    description: "舒適安全的貓咪住宿服務，提供各種套房選擇",
    category: ServiceCategory.BOARDING,
    coverImageUrl: "/images/services/service3-cover.jpg",
    iconUrl: "/images/services/service3-icon.png",
    providerId: "3", // 喵星人旅館
    isActive: true,
    isRecommended: true,
    createdAt: new Date("2022-07-20"),
    updatedAt: new Date("2023-06-10"),
  },
  {
    id: "4",
    name: "貓咪疫苗接種",
    description: "專業的貓咪疫苗接種服務，保護您的愛貓健康",
    category: ServiceCategory.HEALTH_CHECK,
    coverImageUrl: "/images/services/service4-cover.jpg",
    iconUrl: "/images/services/service4-icon.png",
    providerId: "1", // 喵喵動物醫院
    isActive: true,
    isRecommended: false,
    createdAt: new Date("2022-01-20"),
    updatedAt: new Date("2023-05-01"),
  },
  {
    id: "5",
    name: "貓咪牙齒護理",
    description: "專業的貓咪牙齒檢查和清潔服務，預防口腔疾病",
    category: ServiceCategory.HEALTH_CHECK,
    coverImageUrl: "/images/services/service5-cover.jpg",
    iconUrl: "/images/services/service5-icon.png",
    providerId: "1", // 喵喵動物醫院
    isActive: true,
    isRecommended: false,
    createdAt: new Date("2022-02-10"),
    updatedAt: new Date("2023-04-15"),
  },
]

export const serviceItems: ServiceItem[] = [
  {
    id: "1",
    serviceId: "1", // 貓咪健康檢查
    name: "基礎健康檢查",
    description: "包含體重測量、體溫測量、心肺聽診、外觀檢查等基礎項目",
    price: 800,
    duration: 30,
    imageUrl: "/images/services/item1.jpg",
    isPopular: true,
    createdAt: new Date("2022-01-15"),
    updatedAt: new Date("2023-06-01"),
  },
  {
    id: "2",
    serviceId: "1", // 貓咪健康檢查
    name: "進階健康檢查",
    description: "包含基礎檢查項目，加上血液檢查、尿液檢查、糞便檢查等進階項目",
    price: 2500,
    duration: 60,
    imageUrl: "/images/services/item2.jpg",
    isPopular: true,
    createdAt: new Date("2022-01-15"),
    updatedAt: new Date("2023-06-01"),
  },
  {
    id: "3",
    serviceId: "1", // 貓咪健康檢查
    name: "全面健康檢查",
    description: "最全面的健康檢查，包含基礎和進階項目，加上X光、超音波等影像檢查",
    price: 5000,
    duration: 90,
    imageUrl: "/images/services/item3.jpg",
    isPopular: false,
    createdAt: new Date("2022-01-15"),
    updatedAt: new Date("2023-06-01"),
  },
  {
    id: "4",
    serviceId: "2", // 貓咪美容服務
    name: "基礎洗澡",
    description: "基礎的貓咪洗澡服務，包含洗澡、吹乾、基礎梳毛",
    price: 1200,
    duration: 60,
    imageUrl: "/images/services/item4.jpg",
    isPopular: true,
    createdAt: new Date("2022-03-10"),
    updatedAt: new Date("2023-05-15"),
  },
  {
    id: "5",
    serviceId: "2", // 貓咪美容服務
    name: "豪華美容",
    description: "全面的貓咪美容服務，包含洗澡、吹乾、專業梳毛、修剪、指甲修剪等",
    price: 2000,
    duration: 90,
    imageUrl: "/images/services/item5.jpg",
    isPopular: true,
    createdAt: new Date("2022-03-10"),
    updatedAt: new Date("2023-05-15"),
  },
  {
    id: "6",
    serviceId: "3", // 貓咪豪華住宿
    name: "標準套房",
    description: "舒適的標準套房，配備基本設施，適合短期住宿",
    price: 800,
    duration: 1440, // 24小時
    imageUrl: "/images/services/item6.jpg",
    isPopular: true,
    createdAt: new Date("2022-07-20"),
    updatedAt: new Date("2023-06-10"),
  },
  {
    id: "7",
    serviceId: "3", // 貓咪豪華住宿
    name: "豪華套房",
    description: "寬敞的豪華套房，配備高級設施，包含專屬遊戲區和休息區",
    price: 1500,
    duration: 1440, // 24小時
    imageUrl: "/images/services/item7.jpg",
    isPopular: true,
    createdAt: new Date("2022-07-20"),
    updatedAt: new Date("2023-06-10"),
  },
  {
    id: "8",
    serviceId: "3", // 貓咪豪華住宿
    name: "總統套房",
    description: "最頂級的住宿體驗，超大空間，配備全套高級設施，包含專屬照護人員",
    price: 3000,
    duration: 1440, // 24小時
    imageUrl: "/images/services/item8.jpg",
    isPopular: false,
    createdAt: new Date("2022-07-20"),
    updatedAt: new Date("2023-06-10"),
  },
]

export const serviceBookings: ServiceBooking[] = [
  {
    id: "1",
    userId: "2", // meowlover
    serviceId: "1", // 貓咪健康檢查
    serviceItemId: "2", // 進階健康檢查
    bookingDate: new Date("2023-06-25"),
    startTime: new Date("2023-06-25T10:00:00"),
    endTime: new Date("2023-06-25T11:00:00"),
    status: BookingStatus.CONFIRMED,
    petIds: ["1"], // 奶茶
    paymentAmount: 2500,
    paymentStatus: PaymentStatus.PAID,
    paymentMethod: "credit_card",
    createdAt: new Date("2023-06-15"),
    updatedAt: new Date("2023-06-15"),
  },
  {
    id: "2",
    userId: "2", // meowlover
    serviceId: "2", // 貓咪美容服務
    serviceItemId: "5", // 豪華美容
    bookingDate: new Date("2023-06-30"),
    startTime: new Date("2023-06-30T14:00:00"),
    endTime: new Date("2023-06-30T15:30:00"),
    status: BookingStatus.PENDING,
    petIds: ["2"], // 牛奶
    createdAt: new Date("2023-06-16"),
    updatedAt: new Date("2023-06-16"),
  },
  {
    id: "3",
    userId: "3", // catmom
    serviceId: "3", // 貓咪豪華住宿
    serviceItemId: "7", // 豪華套房
    bookingDate: new Date("2023-07-10"),
    startTime: new Date("2023-07-10T12:00:00"),
    endTime: new Date("2023-07-15T12:00:00"),
    status: BookingStatus.CONFIRMED,
    petIds: ["3", "4"], // 小橘, 黑糖
    paymentAmount: 15000, // 1500 * 2 cats * 5 days
    paymentStatus: PaymentStatus.PAID,
    paymentMethod: "credit_card",
    createdAt: new Date("2023-06-20"),
    updatedAt: new Date("2023-06-20"),
  },
]

export const serviceReviews: ServiceReview[] = [
  {
    id: "1",
    userId: "2", // meowlover
    serviceId: "1", // 貓咪健康檢查
    rating: 5,
    comment:
      "醫生非常專業，檢查過程中很耐心地解釋每個項目，讓我對貓咪的健康狀況有更清楚的了解。環境也很乾淨舒適，貓咪不太緊張。",
    mediaUrls: ["/images/reviews/review1-1.jpg", "/images/reviews/review1-2.jpg"],
    bookingId: "1",
    helpfulCount: 12,
    reportCount: 0,
    createdAt: new Date("2023-06-25T15:30:00"),
    updatedAt: new Date("2023-06-25T15:30:00"),
  },
  {
    id: "2",
    userId: "3", // catmom
    serviceId: "2", // 貓咪美容服務
    rating: 4,
    comment: "美容師技術很好，貓咪洗完毛髮很柔順，也很香。只是等待時間有點長，希望能改進預約系統。",
    mediaUrls: ["/images/reviews/review2-1.jpg"],
    helpfulCount: 8,
    reportCount: 0,
    createdAt: new Date("2023-06-10T18:45:00"),
    updatedAt: new Date("2023-06-10T18:45:00"),
  },
  {
    id: "3",
    userId: "5", // newbie
    serviceId: "3", // 貓咪豪華住宿
    rating: 5,
    comment:
      "環境非常好，房間乾淨寬敞，工作人員很細心照顧貓咪。每天還會發送照片和影片，讓我放心。下次出差一定會再預約！",
    mediaUrls: ["/images/reviews/review3-1.jpg", "/images/reviews/review3-2.jpg", "/images/reviews/review3-3.jpg"],
    helpfulCount: 15,
    reportCount: 0,
    providerReply: "感謝您的評價！我們一直致力於提供最優質的寵物住宿服務，期待再次為您的愛貓服務。",
    repliedAt: new Date("2023-05-25T10:30:00"),
    createdAt: new Date("2023-05-24T20:15:00"),
    updatedAt: new Date("2023-05-25T10:30:00"),
  },
]
