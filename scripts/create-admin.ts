import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "siala.omar@gmail.com";
  const hashedPassword = await bcrypt.hash("admin123", 10); // Default temporary password

  console.log(`Creating admin user: ${email}...`);

  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: {
      email,
      password: hashedPassword,
      firstName: "Omar",
      lastName: "Siala",
      phone: "+21622000000",
      role: "ADMIN",
    },
  });

  console.log("Admin user created/updated successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
