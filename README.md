# BuildTrack — Gestión Técnica de Edificios

SaaS multi-tenant para la gestión técnica de edificios residenciales. Permite administrar activos, incidencias, documentos y proveedores desde un panel centralizado.

> Demo original generada desde Figma (cuenta UPC): [ver diseño](https://www.figma.com/design/m9dL627mjs7S5UuoSvlvml/buildingtoptechupc)

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite 6 + TypeScript |
| Estilos | Tailwind CSS v4 + shadcn/ui (Radix UI) |
| Routing | React Router v7 |
| Backend | Supabase (PostgreSQL + Auth + Edge Functions + Storage) |
| Iconos | lucide-react |

---

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- Cuenta en [Supabase](https://supabase.com) *(opcional para modo demo)*

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Huatangari/primer-sistema-toptech-figmaupc.git
cd primer-sistema-toptech-figmaupc

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase

# 4. Iniciar en desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

> **Sin Supabase configurado:** la app funciona en modo demo con datos mock locales.

---

## Base de datos

El schema completo está definido en [`supabase/schema.sql`](supabase/schema.sql).

```bash
# Para crear la base de datos en Supabase:
# 1. Crea un proyecto en https://supabase.com
# 2. Abre el SQL Editor del proyecto
# 3. Ejecuta supabase/schema.sql
# 4. Ejecuta supabase/rls.sql  (políticas de seguridad producción)
# 5. Ejecuta supabase/seed.sql (datos de prueba, opcional)
```

Ver [`docs/database.md`](docs/database.md) para el modelo de datos completo.

---

## Edge Functions

Las operaciones con lógica de negocio y auditoría se ejecutan como Supabase Edge Functions (Deno):

```bash
# Desplegar todas las funciones
supabase functions deploy

# Desplegar una función específica
supabase functions deploy create-incident
```

Funciones disponibles: `create-incident`, `close-incident`, `upload-document`, `asset-maintenance-log`.

---

## Scripts disponibles

```bash
npm run dev            # Servidor de desarrollo
npm run build          # Build de producción
npm run generate:types # Regenerar tipos TypeScript desde Supabase
```

---

## Arquitectura del frontend

```
src/
├── app/
│   ├── components/
│   │   ├── layout/     # Sidebar, Topbar, MainLayout
│   │   ├── shared/     # KpiCard, StatusBadge, Timeline, ErrorState...
│   │   └── ui/         # Primitivos shadcn/ui
│   ├── hooks/
│   │   └── useData.ts  # Hook genérico async (loading + error + refetch)
│   ├── pages/          # Una página por módulo
│   └── router/
│       └── ProtectedRoute.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts      # apiFetch centralizado
│   │   ├── endpoints.ts   # Mutaciones tipadas (Edge Functions)
│   │   └── mappers.ts     # DB snake_case → TS camelCase
│   ├── auth/
│   │   ├── authClient.ts  # Supabase client + helpers de sesión
│   │   ├── useAuth.ts     # Hook de sesión
│   │   └── AuthProvider.tsx
│   ├── mock-data/         # Datos locales para modo demo
│   ├── services/          # Acceso a datos (Supabase + fallback mock)
│   └── types/
│       ├── index.ts       # Tipos de la aplicación (camelCase)
│       └── database.ts    # Tipos raw de la DB (snake_case)
```

Ver [`docs/architecture.md`](docs/architecture.md) para el detalle completo.

---

## Módulos

| Ruta | Módulo |
|---|---|
| `/` | Dashboard — KPIs y resumen ejecutivo |
| `/activos` | Inventario de activos técnicos |
| `/activos/:id` | Detalle con historial e incidencias |
| `/incidencias` | Listado y gestión de fallas |
| `/incidencias/nueva` | Formulario de registro |
| `/documentos` | Repositorio documental |
| `/proveedores` | Gestión de proveedores |
| `/reportes` | Reportes y gráficos ejecutivos |
| `/configuracion` | Configuración del sistema |

---

## Contribución

Lee [`CONTRIBUTING.md`](CONTRIBUTING.md) antes de comenzar a trabajar en el proyecto.

---

## Licencia

Proyecto privado — uso interno.
