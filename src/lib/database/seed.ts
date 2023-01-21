import { DaysRange, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // await db.$queryRawUnsafe(
  //   `INSERT INTO "User" (id, name, email, password, "createdAt", "updatedAt") VALUES
  //   ('1', 'John Doe', '
  // )`,
  // );
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
