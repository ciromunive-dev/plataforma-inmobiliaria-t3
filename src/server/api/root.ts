import { createTRPCRouter } from "~/server/api/trpc";
import { propertyRouter } from "~/server/api/routers/property";
import { authRouter } from "~/server/api/routers/auth";

/**
 * This is the primary router for your server.
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  property: propertyRouter,
  auth: authRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;