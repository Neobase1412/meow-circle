import {
  type Post,
  type Comment,
  type Like,
  type Collection,
  type Tag,
  type Topic,
  Visibility,
  MediaType,
  TopicCategory,
} from "@/types/post"

export const posts: Post[] = [
  {
    id: "1",
    authorId: "2", // meowlover
    content: "今天帶奶茶去做健康檢查，醫生說他需要減肥了！😅 看來要控制零食量了...",
    mood: "無奈",
    location: "喵喵動物醫院",
    visibility: Visibility.PUBLIC,
    mediaUrls: ["/images/posts/post1-1.jpg", "/images/posts/post1-2.jpg"],
    mediaType: MediaType.IMAGE,
    viewCount: 120,
    isPinned: false,
    isArchived: false,
    createdAt: new Date("2023-06-15T10:30:00"),
    updatedAt: new Date("2023-06-15T10:30:00"),
  },
  {
    id: "2",
    authorId: "3", // catmom
    content: "分享一個超實用的貓咪梳毛小技巧！每天梳10分鐘，不僅減少掉毛，還能增進感情～ #貓咪美容 #實用技巧",
    visibility: Visibility.PUBLIC,
    mediaUrls: ["/images/posts/post2-1.jpg", "/images/posts/post2-2.jpg", "/images/posts/post2-3.jpg"],
    mediaType: MediaType.IMAGE,
    viewCount: 350,
    isPinned: false,
    isArchived: false,
    createdAt: new Date("2023-06-14T15:45:00"),
    updatedAt: new Date("2023-06-14T15:45:00"),
  },
  {
    id: "3",
    authorId: "4", // petvet
    content:
      "【獸醫小知識】炎炎夏日即將來臨，提醒各位貓家長注意預防中暑！室內溫度不宜超過28度，確保有足夠的飲水，並避免陽光直射。 #夏季照護 #寵物健康",
    visibility: Visibility.PUBLIC,
    mediaUrls: ["/images/posts/post3-1.jpg"],
    mediaType: MediaType.IMAGE,
    viewCount: 520,
    isPinned: true,
    isArchived: false,
    createdAt: new Date("2023-06-13T09:15:00"),
    updatedAt: new Date("2023-06-13T09:15:00"),
  },
  {
    id: "4",
    authorId: "5", // newbie
    content: "剛領養了一隻小貓咪，取名叫餅乾！好可愛啊！😍 請問新手養貓有什麼需要注意的事項嗎？ #新手貓奴 #求助",
    mood: "開心",
    visibility: Visibility.PUBLIC,
    mediaUrls: ["/images/posts/post4-1.jpg", "/images/posts/post4-2.jpg"],
    mediaType: MediaType.IMAGE,
    viewCount: 180,
    isPinned: false,
    isArchived: false,
    createdAt: new Date("2023-06-12T20:30:00"),
    updatedAt: new Date("2023-06-12T20:30:00"),
  },
  {
    id: "5",
    authorId: "2", // meowlover
    content: "牛奶今天學會了新技能：自己打開抽屜！這下家裡沒有秘密了😱 #聰明貓咪 #貓咪日常",
    mood: "驚訝",
    visibility: Visibility.PUBLIC,
    mediaUrls: ["/images/posts/post5-1.mp4"],
    mediaType: MediaType.VIDEO,
    viewCount: 430,
    isPinned: false,
    isArchived: false,
    createdAt: new Date("2023-06-11T12:20:00"),
    updatedAt: new Date("2023-06-11T12:20:00"),
  },
]

export const comments: Comment[] = [
  {
    id: "1",
    postId: "1",
    authorId: "3", // catmom
    content: "我家的貓也是，一直想吃零食！控制飲食真的很重要。",
    createdAt: new Date("2023-06-15T10:45:00"),
    updatedAt: new Date("2023-06-15T10:45:00"),
  },
  {
    id: "2",
    postId: "1",
    authorId: "4", // petvet
    content: "建議可以使用計量杯精確控制主食量，零食可以換成低卡路里的凍乾。定期運動也很重要喔！",
    createdAt: new Date("2023-06-15T11:30:00"),
    updatedAt: new Date("2023-06-15T11:30:00"),
  },
  {
    id: "3",
    postId: "2",
    authorId: "2", // meowlover
    content: "謝謝分享！我家奶茶超級怕梳毛，有什麼方法可以讓他比較配合嗎？",
    createdAt: new Date("2023-06-14T16:20:00"),
    updatedAt: new Date("2023-06-14T16:20:00"),
  },
  {
    id: "4",
    postId: "2",
    authorId: "3", // catmom
    content: "可以先從短時間開始，梳毛前給點零食當獎勵，慢慢培養習慣。也可以試試看按摩梳，很多貓咪比較能接受。",
    parentId: "3",
    createdAt: new Date("2023-06-14T16:35:00"),
    updatedAt: new Date("2023-06-14T16:35:00"),
  },
  {
    id: "5",
    postId: "4",
    authorId: "4", // petvet
    content:
      "恭喜領養！新手養貓建議：1. 準備好基本用品（貓砂盆、飼料、水碗、貓抓板等）2. 找個可靠的獸醫診所 3. 注意家中環境安全，收好小物品和危險品 4. 給貓咪一個安靜的適應空間 5. 耐心等待建立信任關係。有任何健康問題歡迎諮詢喔！",
    createdAt: new Date("2023-06-12T21:15:00"),
    updatedAt: new Date("2023-06-12T21:15:00"),
  },
]

export const likes: Like[] = [
  {
    id: "1",
    userId: "3", // catmom
    postId: "1",
    createdAt: new Date("2023-06-15T10:40:00"),
  },
  {
    id: "2",
    userId: "4", // petvet
    postId: "1",
    createdAt: new Date("2023-06-15T11:25:00"),
  },
  {
    id: "3",
    userId: "2", // meowlover
    postId: "2",
    createdAt: new Date("2023-06-14T16:00:00"),
  },
  {
    id: "4",
    userId: "5", // newbie
    postId: "2",
    createdAt: new Date("2023-06-14T17:30:00"),
  },
  {
    id: "5",
    userId: "2", // meowlover
    postId: "3",
    createdAt: new Date("2023-06-13T10:00:00"),
  },
  {
    id: "6",
    userId: "3", // catmom
    postId: "3",
    createdAt: new Date("2023-06-13T10:30:00"),
  },
  {
    id: "7",
    userId: "5", // newbie
    postId: "3",
    createdAt: new Date("2023-06-13T14:00:00"),
  },
  {
    id: "8",
    userId: "2", // meowlover
    postId: "4",
    createdAt: new Date("2023-06-12T20:45:00"),
  },
  {
    id: "9",
    userId: "3", // catmom
    postId: "4",
    createdAt: new Date("2023-06-12T21:00:00"),
  },
  {
    id: "10",
    userId: "4", // petvet
    postId: "4",
    createdAt: new Date("2023-06-12T21:10:00"),
  },
  {
    id: "11",
    userId: "3", // catmom
    postId: "5",
    createdAt: new Date("2023-06-11T12:45:00"),
  },
  {
    id: "12",
    userId: "5", // newbie
    postId: "5",
    createdAt: new Date("2023-06-11T13:30:00"),
  },
  {
    id: "13",
    userId: "2", // meowlover
    commentId: "5",
    createdAt: new Date("2023-06-12T22:00:00"),
  },
]

export const collections: Collection[] = [
  {
    id: "1",
    userId: "2", // meowlover
    postId: "3",
    createdAt: new Date("2023-06-13T10:05:00"),
  },
  {
    id: "2",
    userId: "5", // newbie
    postId: "3",
    createdAt: new Date("2023-06-13T14:10:00"),
  },
  {
    id: "3",
    userId: "5", // newbie
    postId: "2",
    createdAt: new Date("2023-06-14T18:00:00"),
  },
]

export const tags: Tag[] = [
  {
    id: "1",
    name: "貓咪美容",
    count: 15,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-06-14"),
  },
  {
    id: "2",
    name: "實用技巧",
    count: 28,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-06-14"),
  },
  {
    id: "3",
    name: "夏季照護",
    count: 12,
    createdAt: new Date("2023-05-01"),
    updatedAt: new Date("2023-06-13"),
  },
  {
    id: "4",
    name: "寵物健康",
    count: 45,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-06-13"),
  },
  {
    id: "5",
    name: "新手貓奴",
    count: 32,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-06-12"),
  },
  {
    id: "6",
    name: "求助",
    count: 27,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-06-12"),
  },
  {
    id: "7",
    name: "聰明貓咪",
    count: 18,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-06-11"),
  },
  {
    id: "8",
    name: "貓咪日常",
    count: 56,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-06-11"),
  },
]

export const topics: Topic[] = [
  {
    id: "1",
    title: "新手養貓指南",
    description: "專為新手貓奴提供的養貓知識和經驗分享",
    iconUrl: "/images/topics/topic1-icon.png",
    coverUrl: "/images/topics/topic1-cover.jpg",
    category: TopicCategory.BEGINNERS,
    followerCount: 1250,
    postCount: 78,
    isOfficial: true,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-06-15"),
  },
  {
    id: "2",
    title: "貓咪健康知識庫",
    description: "由專業獸醫和資深飼主分享的貓咪健康知識",
    iconUrl: "/images/topics/topic2-icon.png",
    coverUrl: "/images/topics/topic2-cover.jpg",
    category: TopicCategory.HEALTH,
    followerCount: 980,
    postCount: 65,
    isOfficial: true,
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-06-13"),
  },
  {
    id: "3",
    title: "貓咪美容與護理",
    description: "分享貓咪美容、梳毛、洗澡等護理經驗和技巧",
    iconUrl: "/images/topics/topic3-icon.png",
    coverUrl: "/images/topics/topic3-cover.jpg",
    category: TopicCategory.EXPERIENCE,
    followerCount: 820,
    postCount: 52,
    isOfficial: false,
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-06-14"),
  },
  {
    id: "4",
    title: "貓咪行為解析",
    description: "了解貓咪的各種行為含義和溝通方式",
    iconUrl: "/images/topics/topic4-icon.png",
    coverUrl: "/images/topics/topic4-cover.jpg",
    category: TopicCategory.BEHAVIOR,
    followerCount: 750,
    postCount: 48,
    isOfficial: false,
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2023-06-10"),
  },
  {
    id: "5",
    title: "貓咪飲食與營養",
    description: "討論貓咪的飲食需求、營養知識和食品推薦",
    iconUrl: "/images/topics/topic5-icon.png",
    coverUrl: "/images/topics/topic5-cover.jpg",
    category: TopicCategory.NUTRITION,
    followerCount: 890,
    postCount: 60,
    isOfficial: true,
    createdAt: new Date("2023-02-25"),
    updatedAt: new Date("2023-06-12"),
  },
]
