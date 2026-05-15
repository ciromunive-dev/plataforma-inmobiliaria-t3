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
  images: z.array(z.string().url()).max(6).default([]),
});

const PAGE_SIZE = 9;

export const propertyRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ page: z.number().int().min(1).default(1) }))
    .query(async ({ ctx, input }) => {
      const skip = (input.page - 1) * PAGE_SIZE;
      const [items, total] = await Promise.all([
        ctx.db.property.findMany({
          skip,
          take: PAGE_SIZE,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true, email: true } } },
        }),
        ctx.db.property.count(),
      ]);
      return {
        items,
        total,
        pageCount: Math.ceil(total / PAGE_SIZE),
        page: input.page,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.property.findUnique({
        where: { id: input.id },
        include: { user: { select: { name: true, email: true } } },
      });
    }),

  create: protectedProcedure
    .input(propertyInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.property.create({
        data: { ...input, userId: Number(ctx.session.user.id) },
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number() }).merge(propertyInput))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const existing = await ctx.db.property.findUnique({ where: { id } });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Propiedad no encontrada" });
      if (existing.userId !== Number(ctx.session.user.id))
        throw new TRPCError({ code: "FORBIDDEN", message: "No tienes permiso para editar esta propiedad" });
      return ctx.db.property.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.property.findUnique({ where: { id: input.id } });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Propiedad no encontrada" });
      if (existing.userId !== Number(ctx.session.user.id))
        throw new TRPCError({ code: "FORBIDDEN", message: "No tienes permiso para eliminar esta propiedad" });
      return ctx.db.property.delete({ where: { id: input.id } });
    }),
});
