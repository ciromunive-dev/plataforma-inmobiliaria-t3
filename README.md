# Plataforma Inmobiliaria

Plataforma web para publicar y explorar propiedades inmobiliarias. Construida con el T3 Stack, permite a los usuarios registrarse, publicar propiedades con fotos y ubicación en el mapa, y contactar al vendedor por WhatsApp.

> **Portfolio project** — Full-stack real estate platform built with modern web technologies (2025–2026).

---

## Screenshots

![Home](screenshots/home.png)
![Detalle de propiedad](screenshots/detalle.png)
![Nueva propiedad](screenshots/nueva-propiedad.png)
![Vista móvil](screenshots/mobile.png)

---

## Features

- **Autenticación** — Registro e inicio de sesión con email y contraseña (NextAuth.js + JWT)
- **CRUD de propiedades** — Crear, editar y eliminar propiedades (solo el propietario)
- **Galería de imágenes** — Subida de hasta 6 imágenes por propiedad vía Cloudinary, con drag-and-drop
- **Mapa interactivo** — Selección y visualización de ubicación con Leaflet + OpenStreetMap (sin API key)
- **Filtros y búsqueda** — Filtrar por texto, precio mínimo/máximo y número de dormitorios
- **Paginación** — 9 propiedades por página
- **Vista grid / lista** — Toggle entre modos de visualización
- **Contacto por WhatsApp** — Botón directo al WhatsApp del vendedor con mensaje pre-completado
- **Responsive design** — Mobile-first, funciona en móvil, tablet y desktop
- **Ownership** — Solo el propietario puede editar o eliminar sus propiedades
- **Tests unitarios** — 51 tests con Vitest cubriendo filtros, paginación, esquemas Zod y validación de formularios

---

## Tech Stack

| Categoría | Tecnología |
|-----------|-----------|
| Framework | [Next.js](https://nextjs.org/) 15 (Pages Router) |
| Lenguaje | [TypeScript](https://www.typescriptlang.org/) |
| Estilos | [Tailwind CSS](https://tailwindcss.com/) v4 |
| API | [tRPC](https://trpc.io/) v11 + React Query |
| ORM | [Prisma](https://www.prisma.io/) v6 |
| Base de datos | PostgreSQL |
| Autenticación | [NextAuth.js](https://next-auth.js.org/) v4 |
| Imágenes | [Cloudinary](https://cloudinary.com/) |
| Mapas | [Leaflet](https://leafletjs.com/) + [OpenStreetMap](https://www.openstreetmap.org/) |
| Geocoding | [Nominatim API](https://nominatim.org/) (gratuito) |
| Testing | [Vitest](https://vitest.dev/) |

---

## Estructura del proyecto

```
src/
├── components/
│   ├── ui/               # Button, Card, Input — componentes reutilizables
│   ├── Layout.tsx         # Header + sidebar + layout principal
│   ├── ImageUploader.tsx  # Drag-and-drop con validación
│   ├── MapPicker.tsx      # Mapa interactivo para seleccionar ubicación
│   └── MapView.tsx        # Mapa de solo lectura
├── hooks/
│   ├── useProperties.ts   # Listado con filtros y paginación
│   └── useProperty.ts     # Detalle, edición y eliminación
├── pages/
│   ├── index.tsx                     # Listado de propiedades
│   ├── properties/new.tsx            # Nueva propiedad
│   ├── properties/[id].tsx           # Detalle y edición
│   ├── properties/my-properties.tsx  # Mis propiedades
│   └── auth/login.tsx & register.tsx
├── server/
│   └── api/routers/
│       ├── property.ts   # getAll, getById, create, update, delete
│       └── auth.ts       # register
└── ___tests___/           # 51 tests unitarios con Vitest
```

---

## Instalación local

### Prerrequisitos

- Node.js 18+
- PostgreSQL (local o en la nube, ej. [Neon](https://neon.tech/))
- Cuenta en [Cloudinary](https://cloudinary.com/) (gratuita)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/plataforma-inmobiliaria.git
cd plataforma-inmobiliaria

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores (ver sección abajo)

# 4. Crear las tablas en la base de datos
npx prisma migrate dev

# 5. Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@host:5432/nombre_db"

# NextAuth
NEXTAUTH_SECRET="genera-uno-con: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (para subir imágenes)
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"
```

> Para producción, cambia `NEXTAUTH_URL` por la URL de tu dominio en Vercel.

---

## Scripts disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run start      # Iniciar en producción
npm run lint       # Verificar código con ESLint
npm run test       # Ejecutar tests con Vitest
npm run typecheck  # Verificar tipos TypeScript
```

---

## Base de datos

El esquema incluye los modelos principales:

- **User** — Usuarios registrados con email y contraseña
- **Property** — Propiedades con título, descripción, precio, dormitorios, baños, área, imágenes, ubicación GPS y teléfono de contacto
- **Account / Session / VerificationToken** — Modelos internos de NextAuth

Para ver el esquema completo: [`prisma/schema.prisma`](prisma/schema.prisma)

---

## Tests

```bash
npm run test
```

51 tests unitarios cubriendo:

| Archivo | Tests | Qué cubre |
|---------|-------|-----------|
| `property.test.ts` | 11 | Lógica de filtrado de propiedades |
| `pagination.test.ts` | 9 | Cálculos de paginación |
| `property-schema.test.ts` | 13 | Validación Zod del schema de propiedad |
| `property-validation.test.ts` | 13 | Validación del formulario de nueva propiedad |
| `filters.test.ts` | 5 | Conteo y limpieza de filtros activos |

---

## Deploy

Este proyecto está diseñado para desplegarse en [Vercel](https://vercel.com/) con base de datos en [Neon](https://neon.tech/) (PostgreSQL serverless gratuito).

> Link al deploy: _próximamente_

---

## Autor

**Ciro Munive** — [@ciromunive-dev](https://github.com/ciromunive-dev)
