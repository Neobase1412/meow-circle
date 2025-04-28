// web/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// 宣告一個全域變數來緩存 PrismaClient
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// 在開發環境中，避免 HMR (Hot Module Replacement) 建立過多 PrismaClient 實例
const prisma = global.prisma || new PrismaClient({
  // 可以選擇性地加上日誌配置
  // log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;