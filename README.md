# Plataforma Inmobiliaria

Aplicación full-stack para publicar y explorar propiedades en venta, construida con el T3 Stack.

## Demo

> Agregar link de Vercel aquí una vez desplegado

## Stack

- **Framework**: [Next.js](https://nextjs.org) (Pages Router)
- **Lenguaje**: TypeScript
- **API**: [tRPC](https://trpc.io) — tipado end-to-end sin código extra
- **Base de datos**: PostgreSQL + [Prisma](https://prisma.io)
- **Auth**: [NextAuth.js](https://next-auth.js.org) con JWT y bcrypt
- **Estilos**: [Tailwind CSS](https://tailwindcss.com)
- **Imágenes**: [Cloudinary](https://cloudinary.com)
- **Tests**: [Vitest](https://vitest.dev)
- **CI**: GitHub Actions

## Funcionalidades

- Registro e inicio de sesión con email y contraseña
- Publicar, editar y eliminar propiedades (solo el dueño)
- Subida de hasta 6 imágenes por propiedad
- Búsqueda y filtros por precio y dormitorios
- Paginación del listado
- Rutas protegidas con middleware de Next.js
- Validación de formularios por campo

## Setup local

### 1. Clonar e instalar

```bash
git clone https://github.com/tu-usuario/plataforma-inmobiliaria.git
cd plataforma-inmobiliaria
npm install


Estructura

src/
├── components/     # Layout, ImageUploader, ErrorBoundary
├── constants/      # Constantes globales (PAGE_SIZE, MAX_IMAGES)
├── hooks/          # Custom hooks (useProperties, useProperty)
├── pages/          # Rutas Next.js + handlers API
├── server/         # tRPC routers + configuración NextAuth
├── styles/         # CSS global con Tailwind
└── __tests__/      # Tests unitarios con Vitest
prisma/
└── schema.prisma   # Modelos de base de datos

Decisiones técnicas
tRPC en lugar de REST: elimina la necesidad de definir tipos en cliente y servidor por separado
JWT strategy en NextAuth: evita consultas extra a la base de datos en cada request
Middleware de Next.js para proteger rutas: el redirect ocurre en el servidor antes de cargar la página
next/image para optimización automática de imágenes (WebP, lazy loading, tamaños responsivos)