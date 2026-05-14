import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const propertyRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.property.findMany({ orderBy: { createdAt: "desc" } });
  }),
});
