// web/prisma/seed.ts
import { PrismaClient, UserRole, MembershipLevel, Visibility, MediaType, PetGender } from '@prisma/client';
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

  console.log('Follows seeded.');

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