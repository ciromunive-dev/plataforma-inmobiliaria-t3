import { createNextApiHandler } from "@trpc/server/adapters/next";
// Importa el adaptador que convierte tRPC en una API real de Next.js (HTTP)

import { appRouter } from "~/server/api/root";
// Importa el router principal que contiene todos los endpoints de la API

import { createTRPCContext } from "~/server/api/trpc";
// Importa la función que crea el contexto (db, sesión, etc. disponible en cada request)

// Export API handler
export default createNextApiHandler({
  // Crea el handler de la API de tRPC (el endpoint /api/trpc)

  router: appRouter,
  // Le dice a tRPC cuál es el backend completo (todos los routers unidos)

  createContext: createTRPCContext,
  // Define qué datos tendrá disponible cada request (ctx.db, ctx.session, etc.)
});