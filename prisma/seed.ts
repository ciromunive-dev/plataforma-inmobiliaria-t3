import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@inmobiliaria.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@inmobiliaria.com",
      password: hashedPassword,
    },
  });

  await prisma.property.createMany({
    data: [
      {
        title: "Casa en Miraflores",
        description: "Hermosa casa con jardín y cochera en zona exclusiva.",
        price: 450000,
        bedrooms: 3,
        bathrooms: 2,
        area: 150,
        images: [],
        userId: admin.id,
      },
      {
        title: "Departamento en San Isidro",
        description: "Moderno departamento con vista panorámica, cerca al centro financiero.",
        price: 280000,
        bedrooms: 2,
        bathrooms: 1,
        area: 80,
        images: [],
        userId: admin.id,
      },
    ],
    skipDuplicates: true,
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
