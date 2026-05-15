import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

const propertyInput = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().int().positive(),
  area: z.number().positive(),
});

export const propertyRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.property.findMany({ orderBy: { createdAt: "desc" } });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.property.findUnique({ where: { id: input.id } });
    }),

  create: protectedProcedure
    .input(propertyInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.property.create({ data: input });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number() }).merge(propertyInput))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const existing = await ctx.db.property.findUnique({ where: { id } });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Propiedad no encontrada" });
      return ctx.db.property.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.property.findUnique({ where: { id: input.id } });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Propiedad no encontrada" });
      return ctx.db.property.delete({ where: { id: input.id } });
    }),
});
