import { PrismaClient } from '@/generated/prisma'; // adjust path as needed
import { withAccelerate } from '@prisma/extension-accelerate';

const _prisma = new PrismaClient().$extends(withAccelerate());

declare global {
  // Avoid multiple instances in dev
  var prisma: typeof _prisma | undefined;
}

export const prisma = global.prisma ?? _prisma;

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
