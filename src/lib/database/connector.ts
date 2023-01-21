import { PrismaClient, Prisma } from '@prisma/client';

const db = new PrismaClient({
  log: ['query'],
});

const sql = Prisma.sql;

export { db, sql };
