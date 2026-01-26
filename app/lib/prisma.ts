// lib/prisma.ts
import { Pool } from 'pg';                        // npm install pg
import { PrismaPg } from '@prisma/adapter-pg';    // npm install @prisma/adapter-pg

import { PrismaClient } from '@prisma/client';    // This now works with the new generator

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL missing in .env');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });     // ← Pass adapter here

// Optional singleton for dev hot-reload
if (process.env.NODE_ENV !== 'production') {
  (global as any).prisma = prisma;
}

export default prisma;