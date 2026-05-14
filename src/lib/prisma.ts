import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "~/env"; // Ahora esto funcionará perfecto

// 1. Crear el Pool usando la variable validada
const pool = new Pool({ connectionString: env.DATABASE_URL });

// 2. Instanciar el Driver Adapter
const adapter = new PrismaPg(pool);

// 3. Tipar la variable global
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 4. Exportar el cliente unificando el uso de env
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// 5. Guardar la instancia global
if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;