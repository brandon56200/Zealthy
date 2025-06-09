import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

// Get the base URL from Supabase
const baseUrl = process.env.POSTGRES_PRISMA_URL || '';
// Add PgBouncer parameters if not present
const dbUrl = baseUrl.includes('pgbouncer=true') 
  ? baseUrl 
  : `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}pgbouncer=true&connection_limit=1&pool_timeout=0`;

console.log('Database URL configuration:', {
  hasPgbouncer: dbUrl.includes('pgbouncer=true'),
  hasConnectionLimit: dbUrl.includes('connection_limit'),
  hasPoolTimeout: dbUrl.includes('pool_timeout'),
  isSupabase: dbUrl.includes('supabase.co')
});

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query'],
    datasources: {
      db: {
        url: dbUrl
      }
    }
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}