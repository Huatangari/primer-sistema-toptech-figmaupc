# BuildTrack - Gestion Tecnica de Edificios

Aplicacion frontend (TypeScript + Vite + React) para gestion de activos, incidencias, documentos y proveedores con backend en Supabase.

## Objetivo

Dejar una base profesional para trabajo colaborativo, CI/CD, despliegue por entornos y entrega tecnica a cliente.

## Stack

- Frontend: React 18, TypeScript 5, Vite 6
- Estilos: Tailwind CSS v4 + componentes UI
- Backend: Supabase (PostgreSQL, Auth, RLS, Edge Functions)
- Testing: Vitest + Testing Library + Playwright
- Calidad: ESLint, Stylelint, Husky, lint-staged, commitlint

## Requisitos

- Node.js `>=20.11 <25`
- npm `>=10`
- Proyecto Supabase (para modo conectado)

## Instalacion

```bash
git clone <repo-url>
cd buildingtoptechupc
npm install
cp .env.example .env.local
```

Completa `.env.local` y ejecuta:

```bash
npm run dev
```

App local: `http://localhost:5173`

## Variables de entorno

Ver detalle completo en [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md).

Minimas para modo conectado:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Opcionales:
- `VITE_ALLOW_DEMO_MODE`
- `VITE_SENTRY_DSN`
- `VITE_APP_ENV`
- `VITE_APP_VERSION`

## Scripts

- `npm run dev`: servidor de desarrollo
- `npm run build`: build produccion
- `npm run preview`: previsualizacion local del build
- `npm run lint`: eslint
- `npm run lint:css`: stylelint
- `npm run lint:all`: lint JS/TS + CSS
- `npm run typecheck`: chequeo estricto de tipos
- `npm run test`: tests unitarios
- `npm run test:e2e`: smoke E2E (Playwright)
- `npm run check`: lint + typecheck + test + build

## Estructura principal

- `src/app`: rutas, paginas y componentes de UI
- `src/lib/services`: acceso a datos
- `src/lib/api`: mutaciones y mappers
- `src/lib/auth`: cliente/auth hooks
- `src/lib/types`: tipos de app y DB
- `supabase/schema.sql`: esquema base
- `supabase/rls.sql`: politicas RLS de produccion
- `supabase/functions`: Edge Functions
- `supabase/migrations`: migraciones SQL versionadas

## Flujo Git

Definido en [CONTRIBUTING.md](CONTRIBUTING.md).

Ramas oficiales:
- `main`
- `develop`
- `feature/*`
- `fix/*`
- `hotfix/*`

Commits: Conventional Commits (validado por commitlint).

## CI/CD

Workflows en `.github/workflows`:
- `ci.yml`: install + lint + typecheck + test + build + e2e
- `deploy-preview.yml`: preview en PR
- `deploy-staging.yml`: deploy staging (`develop`)
- `deploy-prod.yml`: deploy produccion (`main`)

Documentacion operativa:
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- [docs/RELEASE.md](docs/RELEASE.md)
- [docs/HANDOFF.md](docs/HANDOFF.md)

## Base de datos y seguridad

- RLS habilitado y forzado en tablas de negocio.
- Helpers `security definer` con permisos explicitos a `authenticated`.
- Integridad adicional: constraints de fechas, FK compuestas para relaciones denormalizadas.

Mas detalle: [docs/database.md](docs/database.md).

## Troubleshooting rapido

1. Error de entorno Supabase
- Verifica `.env.local` y reinicia `npm run dev`.

2. Error de tipos
- Ejecuta `npm run typecheck` y corrige el primer error.

3. Fallo de build
- Ejecuta `npm run check` para reproducir el pipeline localmente.

4. Error de auth o permisos
- Revisar membresias en `building_users` y politicas en `supabase/rls.sql`.
