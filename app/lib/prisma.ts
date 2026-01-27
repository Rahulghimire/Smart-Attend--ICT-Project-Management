import 'dotenv/config';
import { PrismaClient } from './generated/prisma'
import { PrismaLibSql } from '@prisma/adapter-libsql';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not configured');
}

// Global singleton to avoid multiple instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaAdapter: PrismaLibSql | undefined;
};

// Create the libSQL adapter
const adapter =
  globalForPrisma.prismaAdapter ??
  new PrismaLibSql({
    url: databaseUrl,
  });

// Create Prisma client with the adapter
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  });

// In development, save instances globally
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaAdapter = adapter;
}
