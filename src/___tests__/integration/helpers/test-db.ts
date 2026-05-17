import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const TEST_DATABASE_URL =
  "postgresql://postgres:admin123@localhost:5432/plataforma_inmobiliaria_test";

const pool = new Pool({ connectionString: TEST_DATABASE_URL });
const adapter = new PrismaPg(pool);

export const testDb = new PrismaClient({ adapter });

export async function cleanDb() {
  await testDb.property.deleteMany();
  await testDb.session.deleteMany();
  await testDb.account.deleteMany();
  await testDb.user.deleteMany();
}
