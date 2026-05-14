/**
 * Este es el cliente de tRPC en el frontend (React).
 * Permite llamar a los endpoints del backend desde cualquier componente.
 * Ejemplo: api.property.getAll.useQuery()
 */
import { createTRPCReact } from "@trpc/react-query"; 
// Crea el cliente de tRPC para usarlo en React (con React Query por debajo)

import type { AppRouter } from "~/server/api/root"; 
// Importa los tipos del backend completo (solo TypeScript, no se ejecuta en runtime)
// Sirve para que el frontend sepa qué endpoints existen y qué devuelven

export const api = createTRPCReact<AppRouter>(); 
// Crea el objeto "api" que usarás en React
// Con esto tienes autocompletado, tipado y conexión directa con el backend