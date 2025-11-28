const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { username: "dronkus" },
    update: { email: "d@gmail.com", password: "1234" },
    create: { username: "dronkus", email: "d@gmail.com", password: "1234" },
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

