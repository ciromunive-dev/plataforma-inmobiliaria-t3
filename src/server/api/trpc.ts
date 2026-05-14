import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { db } from "~/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

export const createTRPCContext = async (_opts: CreateNextContextOptions) => {
  const session = await getServerSession(_opts.req, _opts.res, authOptions);
  return {
    db,
    session,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
