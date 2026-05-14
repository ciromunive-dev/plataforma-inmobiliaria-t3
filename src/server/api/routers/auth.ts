import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "El email ya está registrado",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      await ctx.db.user.create({
        data: {
          name: input.name ?? null,
          email: input.email,
          password: hashedPassword,
        },
      });

      return { success: true };
    }),
});
