import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  await prisma.property.createMany({
    data: [
      { title: "Casa en Miraflores", description: "Hermosa casa...", price: 450000, bedrooms: 3, bathrooms: 2, area: 150 },
      { title: "Departamento en San Isidro", description: "Moderno depa...", price: 280000, bedrooms: 2, bathrooms: 1, area: 80 },
    ],
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());