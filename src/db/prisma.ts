import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClient = globalThis.prisma ?? new PrismaClient();

export default prismaClient;
