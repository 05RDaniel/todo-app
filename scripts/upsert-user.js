/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("1234", 10);
  await prisma.user.upsert({
    where: { username: "dronkus" },
    update: { email: "d@gmail.com", password: hashedPassword },
    create: { username: "dronkus", email: "d@gmail.com", password: hashedPassword },
  });
  console.log("User ensured: dronkus");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

