import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Creating admin user...");
  const email = "siala.oussema@gmail.com";
  const password = "bezwich";

  const hashedPassword = await hash(password, 12);

  const existingUser = await prisma.user.findUnique({ where: { email } });

  let user;
  if (existingUser) {
    user = await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: "ADMIN"
      }
    });
  } else {
    user = await prisma.user.create({
      data: {
        email,
        firstName: "Oussema",
        lastName: "Siala",
        phone: "+21600000000",
        password: hashedPassword,
        role: "ADMIN"
      }
    });
  }

  console.log(`✅ Admin user créé/mis à jour: ${user.email}`);
  console.log(`🔑 Mot de passe: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
