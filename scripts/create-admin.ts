import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const firstName = process.argv[4] || "Admin";
  const lastName = process.argv[5] || "User";

  if (!email || !password) {
    console.error("Usage: ts-node scripts/create-admin.ts <email> <password> [firstName] [lastName]");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: "+21690000000",
        role: Role.ADMIN,
      },
    });

    console.log(`Admin user created successfully: ${user.email}`);
  } catch (error: any) {
    if (error.code === "P2002") {
      console.error("User with this email already exists");
    } else {
      console.error("Error creating admin user:", error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
