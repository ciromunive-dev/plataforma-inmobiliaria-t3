import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  // Crear usuario admin
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@inmobiliaria.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@inmobiliaria.com",
      password: hashedPassword,
    },
  });

  // Propiedades de ejemplo
  await prisma.property.createMany({
    data: [
      { title: "Casa en Miraflores", description: "Hermosa casa...", price: 450000, bedrooms: 3, bathrooms: 2, area: 150 },
      { title: "Departamento en San Isidro", description: "Moderno depa...", price: 280000, bedrooms: 2, bathrooms: 1, area: 80 },
    ],
    skipDuplicates: true,
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
