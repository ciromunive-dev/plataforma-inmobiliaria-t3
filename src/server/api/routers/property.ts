import { z } from "zod"; 
// Librería para validar datos de entrada (inputs)

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// createTRPCRouter → crea un grupo de endpoints
// publicProcedure → endpoint público (sin autenticación obligatoria)

export const propertyRouter = createTRPCRouter({
  // Router que agrupa todas las rutas relacionadas a "property"

  getAll: publicProcedure.query(async ({ ctx }) => {
    // Endpoint de tipo "query" (solo lectura)
    // ctx = contexto (aquí tienes acceso a la base de datos)

    const properties = await ctx.db.property.findMany();
    // Prisma: trae todas las propiedades de la base de datos

    return properties;
    // Devuelve el resultado al frontend
  }),

  getById: publicProcedure
    // Endpoint público

    .input(z.object({ id: z.number() }))
    // Define y valida la entrada:
    // espera un objeto con "id" de tipo number

    .query(async ({ ctx, input }) => {
      // query = lectura
      // ctx = base de datos
      // input = datos validados (id)

      const property = await ctx.db.property.findUnique({
        where: { id: input.id },
        // Busca una sola propiedad por su ID
      });

      return property;
      // Devuelve la propiedad encontrada
    }),
});