/**
 * This is the tRPC context - shared between all tRPC procedures.
 */
import { initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { db } from "~/lib/prisma";

/**
 * 1. CONTEXT
 * Define what every tRPC procedure has access to.
 */
export const createTRPCContext = async (_opts: CreateNextContextOptions) => {
  return {
    db,
  };
};

/**
 * 2. INITIALIZATION
 */
const t = initTRPC.context<typeof createTRPCContext>().create();

/**
 * 3. ROUTER & PROCEDURE (helpers)
 */
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;