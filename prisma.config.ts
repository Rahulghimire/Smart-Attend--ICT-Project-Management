// prisma.config.ts
import 'dotenv/config'; // loads .env file
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',           // or 'src/prisma/schema.prisma' if using src/
  migrations: {
    path: 'prisma/migrations',
    // seed: 'ts-node prisma/seed.ts',    // optional later
  },
  datasource: {
    url: env('DATABASE_URL'),               // CLI uses this for migrate/db push/etc.
  },
});