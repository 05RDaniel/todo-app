/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const username = process.argv[2] || "daniel";

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    console.log(`User "${username}" not found`);
    return;
  }

  // Delete all tasks for this user
  await prisma.task.deleteMany({
    where: { userId: user.id },
  });

  // Delete the user
  await prisma.user.delete({
    where: { username },
  });

  console.log(`User "${username}" and all their tasks have been deleted`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

