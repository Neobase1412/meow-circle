// web/prisma/seed.ts
import { PrismaClient, UserRole, MembershipLevel, Visibility, MediaType, PetGender, ServiceCategory } from '@prisma/client';
// You might need a hashing library if you were seeding passwords for Prisma-only auth
// import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // --- Seed Users (adapt from your users.ts) ---
  // IMPORTANT: Match IDs with Supabase Auth User IDs if possible for consistency
  // For now, we use placeholder IDs. If you manually created users in Supabase Auth,
  // try to find their UUIDs and use those here.
  // Password hash is a placeholder - real auth is handled by Supabase Auth.
  const placeholderPasswordHash = '$2b$10$placeholderhashforseeding'; // Replace if needed

  const user1 = await prisma.user.upsert({
    where: { email: 'meowlover@example.com' },
    update: {},
    create: {
      id: 'auth_user_id_for_meowlover', // REPLACE with actual Supabase Auth User UUID if known
      email: 'meowlover@example.com',
      username: 'meowlover',
      passwordHash: placeholderPasswordHash, // Not used by Supabase Auth login
      fullName: '喵星人愛好者',
      bio: '熱愛貓咪的一切，有兩隻可愛的貓咪：奶茶和牛奶',
      avatarUrl: '/images/avatars/user1.jpg',
      coverImageUrl: '/images/covers/user1-cover.jpg',
      isVerified: true,
      role: UserRole.USER,
      membershipLevel: MembershipLevel.GOLD,
      membershipPoints: 2500,
      joinedAt: new Date('2023-02-15'),
      // Add other necessary fields with defaults or values
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'catmom@example.com' },
    update: {},
    create: {
      id: 'auth_user_id_for_catmom', // REPLACE with actual Supabase Auth User UUID if known
      email: 'catmom@example.com',
      username: 'catmom',
      passwordHash: placeholderPasswordHash,
      fullName: '貓咪媽媽',
      bio: '三隻貓的媽媽，喜歡分享養貓心得和日常',
      avatarUrl: '/images/avatars/user2.jpg',
      coverImageUrl: '/images/covers/user2-cover.jpg',
      isVerified: true,
      role: UserRole.USER,
      membershipLevel: MembershipLevel.SILVER,
      membershipPoints: 1200,
      joinedAt: new Date('2023-03-10'),
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'newbie@example.com' },
    update: {},
    create: {
      id: 'auth_user_id_for_newbie', // REPLACE with actual Supabase Auth User UUID if known
      email: 'newbie@example.com',
      username: 'newbie',
      passwordHash: placeholderPasswordHash,
      fullName: '新手貓奴',
      bio: '剛養了第一隻貓，正在學習如何成為一個好鏟屎官',
      avatarUrl: '/images/avatars/user4.jpg',
      isVerified: false,
      role: UserRole.USER,
      membershipLevel: MembershipLevel.REGULAR,
      membershipPoints: 100,
      joinedAt: new Date('2023-06-01'),
    },
  });

  console.log('Users seeded:', { user1, user2, user3 });

  // --- Seed Pets (associate with seeded users) ---
  const pet1 = await prisma.pet.create({
    data: {
      name: '奶茶',
      ownerId: user1.id, // Link to user1 (meowlover)
      breed: '英國短毛貓',
      gender: PetGender.MALE,
      birthDate: new Date('2021-05-15'),
      primaryImageUrl: '/images/pets/pet1.jpg',
      description: '奶茶是一隻活潑好動的英短...',
      // Add other fields
    },
  });

  const pet2 = await prisma.pet.create({
    data: {
      name: '牛奶',
      ownerId: user1.id, // Link to user1 (meowlover)
      breed: '美國短毛貓',
      gender: PetGender.FEMALE,
      birthDate: new Date('2022-01-20'),
      primaryImageUrl: '/images/pets/pet2.jpg',
      description: '牛奶是一隻安靜乖巧的美短...',
    },
  });

   const pet3 = await prisma.pet.create({
    data: {
      name: '小橘',
      ownerId: user2.id, // Link to user2 (catmom)
      breed: '橘貓',
      gender: PetGender.MALE,
      primaryImageUrl: '/images/pets/pet3.jpg',
    },
  });

   const pet4 = await prisma.pet.create({
    data: {
      name: '餅乾',
      ownerId: user3.id, // Link to user3 (newbie)
      breed: '米克斯',
      gender: PetGender.FEMALE,
       primaryImageUrl: '/images/pets/pet6.jpg',
    },
  });

  console.log('Pets seeded:', { pet1, pet2, pet3, pet4 });

  // --- Seed Posts (associate with seeded users) ---
  const post1 = await prisma.post.create({
    data: {
      authorId: user1.id, // meowlover
      content: '今天帶奶茶去做健康檢查，醫生說他需要減肥了！😅 看來要控制零食量了...',
      mood: '無奈',
      location: '喵喵動物醫院',
      visibility: Visibility.PUBLIC,
      mediaUrls: ['/images/posts/post1-1.jpg', '/images/posts/post1-2.jpg'],
      mediaType: MediaType.IMAGE,
      createdAt: new Date('2023-06-15T10:30:00'),
    },
  });

  const post2 = await prisma.post.create({
    data: {
      authorId: user2.id, // catmom
      content: '分享一個超實用的貓咪梳毛小技巧！#貓咪美容 #實用技巧',
      visibility: Visibility.PUBLIC,
      mediaUrls: ['/images/posts/post2-1.jpg', '/images/posts/post2-2.jpg', '/images/posts/post2-3.jpg'],
      mediaType: MediaType.IMAGE,
      createdAt: new Date('2023-06-14T15:45:00'),
    },
  });

   const post3 = await prisma.post.create({
    data: {
      authorId: user3.id, // newbie
      content: '剛領養了一隻小貓咪，取名叫餅乾！好可愛啊！😍 #新手貓奴 #求助',
       mood: '開心',
      visibility: Visibility.PUBLIC,
      mediaUrls: ["/images/posts/post4-1.jpg", "/images/posts/post4-2.jpg"],
      mediaType: MediaType.IMAGE,
      createdAt: new Date('2023-06-12T20:30:00'),
    },
  });

  console.log('Posts seeded:', { post1, post2, post3 });

  // --- Seed Follows ---
  // Example: catmom follows meowlover
  await prisma.follow.upsert({
      where: { followerId_followingId: { followerId: user2.id, followingId: user1.id } },
      update: {},
      create: {
          followerId: user2.id,
          followingId: user1.id,
      }
  });
  // Example: newbie follows meowlover
   await prisma.follow.upsert({
      where: { followerId_followingId: { followerId: user3.id, followingId: user1.id } },
      update: {},
      create: {
          followerId: user3.id,
          followingId: user1.id,
      }
  });
    // Example: newbie follows catmom
   await prisma.follow.upsert({
      where: { followerId_followingId: { followerId: user3.id, followingId: user2.id } },
      update: {},
      create: {
          followerId: user3.id,
          followingId: user2.id,
      }
  });
    // Example: meowlover follows catmom
   await prisma.follow.upsert({
      where: { followerId_followingId: { followerId: user1.id, followingId: user2.id } },
      update: {},
      create: {
          followerId: user1.id,
          followingId: user2.id,
      }
  });

  const provider1 = await prisma.serviceProvider.upsert({
      where: { id: "1" }, // Use predefined IDs from your fake data
      update: {},
      create: {
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
          businessHours: { // Store as JSON
              monday: { open: "09:00", close: "21:00" }, tuesday: { open: "09:00", close: "21:00" },
              wednesday: { open: "09:00", close: "21:00" }, thursday: { open: "09:00", close: "21:00" },
              friday: { open: "09:00", close: "21:00" }, saturday: { open: "10:00", close: "18:00" },
              sunday: { open: "10:00", close: "18:00" },
          },
          isVerified: true,
          certifications: ["台灣獸醫師公會認證", "國際貓科醫學協會會員"],
          ratingAvg: 4.8, // Set initial rating/count
          reviewCount: 156,
          tags: ["專業醫療", "24小時急診", "貓咪專科"],
      }
  });

  const provider2 = await prisma.serviceProvider.upsert({
      where: { id: "2" },
      update: {},
      create: {
            id: "2",
            name: "毛孩美容沙龍",
            description: "專業的寵物美容服務，讓您的毛孩展現最佳風采",
            logoUrl: "/images/providers/provider2-logo.png",
            coverImageUrl: "/images/providers/provider2-cover.jpg",
            address: "台北市信義區寵物路456號",
            city: "台北市", district: "信義區", zipCode: "110",
            phone: "02-8765-4321", email: "service@petgrooming.com", website: "https://www.petgrooming.com",
            businessHours: { monday: { open: "10:00", close: "20:00" }, tuesday: { open: "10:00", close: "20:00" }, wednesday: { open: "10:00", close: "20:00" }, thursday: { open: "10:00", close: "20:00" }, friday: { open: "10:00", close: "20:00" }, saturday: { open: "10:00", close: "20:00" }, sunday: { open: "12:00", close: "18:00" } },
            isVerified: true, certifications: ["專業寵物美容師認證", "亞洲寵物美容協會會員"],
            ratingAvg: 4.7, reviewCount: 98, tags: ["貓咪美容", "專業修剪", "溫和服務"],
      }
  });

  const provider3 = await prisma.serviceProvider.upsert({
      where: { id: "3" },
      update: {},
      create: {
            id: "3",
            name: "喵星人旅館",
            description: "五星級貓咪住宿服務，讓您的愛貓享受舒適的假期",
            logoUrl: "/images/providers/provider3-logo.png", coverImageUrl: "/images/providers/provider3-cover.jpg",
            address: "台北市大安區貓咪路789號", city: "台北市", district: "大安區", zipCode: "106",
            phone: "02-2345-6789", email: "service@cathotel.com", website: "https://www.cathotel.com",
            businessHours: { monday: { open: "08:00", close: "20:00" }, tuesday: { open: "08:00", close: "20:00" }, wednesday: { open: "08:00", close: "20:00" }, thursday: { open: "08:00", close: "20:00" }, friday: { open: "08:00", close: "20:00" }, saturday: { open: "08:00", close: "20:00" }, sunday: { open: "08:00", close: "20:00" } },
            isVerified: true, certifications: ["寵物旅館協會認證", "寵物照護專業認證"],
            ratingAvg: 4.9, reviewCount: 120, tags: ["豪華套房", "24小時監控", "專業照護"],
      }
  });
  console.log('Providers seeded:', { provider1, provider2, provider3 });


  // --- Seed Services ---
  console.log(`Seeding services ...`);
  const service1 = await prisma.service.upsert({
      where: { id: "1" }, update: {}, create: {
          id: "1", name: "貓咪健康檢查", description: "全面的貓咪健康檢查服務...",
          category: ServiceCategory.HEALTH_CHECK, coverImageUrl: "/images/services/service1-cover.jpg", iconUrl: "/images/services/service1-icon.png",
          providerId: provider1.id, isActive: true, isRecommended: true,
      }
  });
  const service2 = await prisma.service.upsert({
      where: { id: "2" }, update: {}, create: {
          id: "2", name: "貓咪美容服務", description: "專業的貓咪美容服務...",
          category: ServiceCategory.GROOMING, coverImageUrl: "/images/services/service2-cover.jpg", iconUrl: "/images/services/service2-icon.png",
          providerId: provider2.id, isActive: true, isRecommended: true,
      }
  });
  const service3 = await prisma.service.upsert({
      where: { id: "3" }, update: {}, create: {
          id: "3", name: "貓咪豪華住宿", description: "舒適安全的貓咪住宿服務...",
          category: ServiceCategory.BOARDING, coverImageUrl: "/images/services/service3-cover.jpg", iconUrl: "/images/services/service3-icon.png",
          providerId: provider3.id, isActive: true, isRecommended: true,
      }
  });
    const service4 = await prisma.service.upsert({
      where: { id: "4" }, update: {}, create: {
          id: "4", name: "貓咪疫苗接種", description: "專業的貓咪疫苗接種服務...",
          category: ServiceCategory.HEALTH_CHECK, coverImageUrl: "/images/services/service4-cover.jpg", iconUrl: "/images/services/service4-icon.png",
          providerId: provider1.id, isActive: true, isRecommended: false,
      }
  });
    const service5 = await prisma.service.upsert({
      where: { id: "5" }, update: {}, create: {
          id: "5", name: "貓咪牙齒護理", description: "專業的貓咪牙齒檢查和清潔服務...",
          category: ServiceCategory.HEALTH_CHECK, coverImageUrl: "/images/services/service5-cover.jpg", iconUrl: "/images/services/service5-icon.png",
          providerId: provider1.id, isActive: true, isRecommended: false,
      }
  });
  console.log('Services seeded:', { service1, service2, service3, service4, service5 });

  // --- Seed Service Items ---
  // Note: For brevity, only adding a few. Add the rest from your fake data.
  console.log(`Seeding service items ...`);
  await prisma.serviceItem.upsert({
      where: { id: "1" }, update: {}, create: {
          id: "1", serviceId: service1.id, name: "基礎健康檢查", description: "包含體重測量...",
          price: 800, duration: 30, imageUrl: "/images/services/item1.jpg", isPopular: true,
      }
  });
  await prisma.serviceItem.upsert({
      where: { id: "2" }, update: {}, create: {
          id: "2", serviceId: service1.id, name: "進階健康檢查", description: "包含基礎檢查項目...",
          price: 2500, duration: 60, imageUrl: "/images/services/item2.jpg", isPopular: true,
      }
  });
  await prisma.serviceItem.upsert({
      where: { id: "4" }, update: {}, create: {
          id: "4", serviceId: service2.id, name: "基礎洗澡", description: "基礎的貓咪洗澡服務...",
          price: 1200, duration: 60, imageUrl: "/images/services/item4.jpg", isPopular: true,
      }
  });
  await prisma.serviceItem.upsert({
      where: { id: "6" }, update: {}, create: {
          id: "6", serviceId: service3.id, name: "標準套房", description: "舒適的標準套房...",
          price: 800, duration: 1440, imageUrl: "/images/services/item6.jpg", isPopular: true,
      }
  });
  console.log('Service items seeded.');

  // --- Seed Service Bookings & Reviews (Optional) ---
  // You can add seeding for these if needed for testing, linking them to seeded users and services.
  // Remember to handle potential foreign key constraints correctly.

  console.log(`Seeding finished.`);
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });