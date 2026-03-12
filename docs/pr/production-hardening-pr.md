# PR: Production Hardening Baseline for Release Candidate

## Objetivo
Consolidar hardening tecnico y operativo para dejar el repositorio en estado release candidate, manteniendo build/test estables y mejorando seguridad, gobernanza y despliegue.

## Resumen ejecutivo
Este PR agrupa mejoras ya implementadas en calidad, seguridad de aplicacion, endurecimiento de base de datos/RLS, CI/CD y documentacion de entrega.  
El resultado es un baseline de produccion mas predecible, con controles explicitos en pipelines, permisos y flujo de merge hacia `main`.

## Cambios por area

### 1) quality/tooling
- Estandarizacion de scripts y dependencias en `package.json`.
- Actualizacion de `vite` a `6.4.1` (sin vulnerabilidades reportadas).
- Tipado centralizado de variables de entorno en `src/vite-env.d.ts`.
- Correccion de typecheck en `src/app/components/ErrorBoundary.tsx`.
- Hook de calidad `pre-push` con `npm run typecheck` + `npm run test:smoke`.
- Archivos de colaboracion: `CONTRIBUTING.md`, `.github/pull_request_template.md`, `.github/CODEOWNERS`, mejoras en `.gitignore`.

### 2) security
- Endurecimiento de cliente/auth en `src/lib/auth/authClient.ts` (validacion de env, placeholders defensivos, helper de configuracion).
- Mejora de sesion/cache en `src/lib/auth/useAuth.ts` (limpieza de cache y estado ante cambios de sesion o fallback sin Supabase).
- Endurecimiento del reset demo en `src/app/pages/Settings.tsx` (guard clause por flag explicito y limpieza acotada por prefijos).
- Guard clauses `HTTP 405` en Edge Functions para metodos no permitidos:
  - `supabase/functions/create-incident/index.ts`
  - `supabase/functions/close-incident/index.ts`
  - `supabase/functions/upload-document/index.ts`
  - `supabase/functions/asset-maintenance-log/index.ts`

### 3) database/RLS
- `supabase/schema.sql` endurecido con:
  - `pgcrypto`
  - checks de integridad (fechas, estado/resolucion, rating, email basico)
  - foreign keys compuestas para tablas denormalizadas (`asset_history`, `incident_events`)
  - `ENABLE` + `FORCE ROW LEVEL SECURITY` en tablas de negocio
  - helpers `security definer` con `set search_path = public`
  - `revoke/grant execute` explicitos en funciones helper
- `supabase/rls.sql` endurecido con:
  - funciones helper `security definer` + `set search_path = public`
  - grants explicitos para rol `authenticated`
  - limpieza dinamica de policies existentes
  - `ENABLE` + `FORCE ROW LEVEL SECURITY`
  - policies por tabla/rol para `admin`, `technician`, `viewer`
- Base inicial de migraciones:
  - `supabase/migrations/README.md`
  - `supabase/migrations/20260312000000_initial_baseline.sql`

### 4) CI/CD
- Estrategia de ramas alineada en workflows:
  - `main`
  - `develop`
  - `hotfix/*`
- Endurecimiento de pipelines en deploys con `lint` + `typecheck` + `test` antes de build/deploy.
- Gate manual en produccion (`workflow_dispatch` con confirmacion `yes`).
- Workflows actualizados:
  - `.github/workflows/ci.yml`
  - `.github/workflows/deploy-preview.yml`
  - `.github/workflows/deploy-staging.yml`
  - `.github/workflows/deploy-prod.yml`

### 5) auth/app hardening
- Ajustes de confiabilidad en boundary de errores y manejo de sesion para evitar estados inconsistentes.
- Mejor comportamiento cuando Supabase no esta configurado (fallback controlado y sin operaciones inseguras).
- Refuerzo de flujos de mutacion con validaciones de metodo y control de permisos.

### 6) docs/handoff
- Documentacion de entrega y operacion:
  - `README.md`
  - `docs/ENVIRONMENT.md`
  - `docs/DEPLOYMENT.md`
  - `docs/RELEASE.md`
  - `docs/HANDOFF.md`

## Validaciones ejecutadas
- `npm run check` (OK)
- `npm run test:e2e` (OK)
- `npm audit` (OK)
- Vulnerabilidades: `0`

## Riesgos pendientes
- Existian cambios locales sin commit previos a esta auditoria; fueron preservados y no revertidos.
- `.github/CODEOWNERS` usa `@Huatangari`; confirmar owner definitivo.
- Branch protection de `main` y `develop` no se define por codigo; requiere configuracion manual en GitHub UI.

## Pasos recomendados antes de merge
1. Configurar branch protection en `main` y `develop` con required checks y reviews.
2. Verificar secrets/environments en GitHub Actions y Vercel segun `docs/ENVIRONMENT.md`.
3. Aplicar baseline/migraciones en staging.
4. Validar RLS con usuarios reales por rol (`admin`, `technician`, `viewer`).
5. Ejecutar PR `develop -> main` y validar CI completo en verde.
6. Definir y crear tag de version.
7. Ejecutar deploy controlado y cerrar handoff con `docs/HANDOFF.md`.

## Outcome final
Este PR deja el repositorio en estado **release candidate** porque combina:
- calidad automatizada (lint/typecheck/test/build/e2e),
- superficie de seguridad reducida (app + edge + DB/RLS),
- flujo de despliegue controlado por entornos,
- y documentacion operativa para release/handoff.
