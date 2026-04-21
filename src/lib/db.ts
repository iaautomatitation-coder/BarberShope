import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

/**
 * Prisma client with dual-mode DB:
 *   - If TURSO_DATABASE_URL is set → connect via libSQL adapter (production / demo pública).
 *   - Otherwise → fall back to the local SQLite file declared in DATABASE_URL (dev).
 *
 * Required env vars for Turso:
 *   TURSO_DATABASE_URL=libsql://<your-db>.turso.io
 *   TURSO_AUTH_TOKEN=<token from: turso db tokens create <your-db>>
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function buildPrisma(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl) {
    const adapter = new PrismaLibSql({ url: tursoUrl, authToken: tursoToken });
    return new PrismaClient({ adapter });
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? [] : ['query'],
  });
}

export const db = globalForPrisma.prisma ?? buildPrisma();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
