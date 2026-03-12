# RELEASE APPROVAL CHECKLIST

Checklist operativo para aprobar salida a produccion desde `develop` hacia `main`.

## 1) Branch Protection (GitHub)
- [ ] `main` protegido con:
- [ ] Requerir PR (sin push directo)
- [ ] Requerir al menos 1 review
- [ ] Requerir checks en verde (`CI`, deploy workflow relevante)
- [ ] Bloquear merge con conversaciones sin resolver
- [ ] `develop` protegido con reglas equivalentes
- [ ] Confirmar politica de `hotfix/*` (PR a `main` + back-merge a `develop`)

## 2) CI/CD
- [ ] `ci.yml` en verde para el commit candidato
- [ ] `deploy-preview.yml` operativo en PRs
- [ ] `deploy-staging.yml` exitoso desde `develop`
- [ ] `deploy-prod.yml` listo (con gate manual `confirm=yes` para `workflow_dispatch`)
- [ ] Artefactos de fallo (Playwright report) disponibles en caso de error

## 3) Secrets y Environments
- [ ] GitHub Secrets configurados:
- [ ] `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- [ ] `VITE_SENTRY_DSN`
- [ ] `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (preview)
- [ ] `STAGING_SUPABASE_URL`, `STAGING_SUPABASE_ANON_KEY`
- [ ] `PROD_SUPABASE_URL`, `PROD_SUPABASE_ANON_KEY`
- [ ] Variables de Vercel validadas por entorno (`preview`, `staging`, `production`)
- [ ] `VITE_APP_ENV` y `VITE_APP_VERSION` coherentes con release

## 4) Baseline y Migraciones (Supabase)
- [ ] Baseline identificado: `supabase/migrations/20260312000000_initial_baseline.sql`
- [ ] Secuencia de aplicacion validada en staging (`schema.sql` + `rls.sql` / migraciones)
- [ ] Sin drift entre SQL versionado y estado real de staging
- [ ] Plan de aplicacion a produccion definido y con ventana aprobada

## 5) Validacion RLS
- [ ] Validar lectura/escritura con usuarios reales por rol:
- [ ] `admin`: CRUD completo en tablas de negocio permitidas
- [ ] `technician`: permisos de escritura segun policies
- [ ] `viewer`: solo lectura permitida
- [ ] Confirmar `FORCE ROW LEVEL SECURITY` activo en tablas objetivo
- [ ] Confirmar helpers con `set search_path = public` y grants a `authenticated`

## 6) QA Funcional
- [ ] `npm run check` en verde
- [ ] `npm run test:e2e` en verde
- [ ] Smoke funcional en staging (auth, activos, incidencias, documentos, settings)
- [ ] Verificacion de edge functions endurecidas (metodos no permitidos retornan `405`)

## 7) Observabilidad y Operacion
- [ ] Sentry activo y DSN configurado por entorno
- [ ] Monitoreo de workflows habilitado (CI y deploys)
- [ ] Runbook de rollback disponible (`docs/DEPLOYMENT.md`)
- [ ] Responsable on-call definido para ventana de release

## 8) Documentacion
- [ ] `README.md` actualizado y consistente con scripts/workflows
- [ ] `docs/ENVIRONMENT.md` validado contra secrets reales
- [ ] `docs/DEPLOYMENT.md` y `docs/RELEASE.md` alineados con la ejecucion
- [ ] `docs/HANDOFF.md` listo para cierre con cliente/equipo operador
- [ ] Confirmar owner real en `.github/CODEOWNERS` (`@Huatangari` pendiente de validacion)

## 9) Aprobacion Final
- [ ] Aprobacion tecnica (Engineering)
- [ ] Aprobacion QA
- [ ] Aprobacion Release/Operaciones
- [ ] Go/No-Go registrado (fecha, version, responsables)

## Registro de aprobacion
- Release version: `vX.Y.Z`
- Fecha/hora aprobacion:
- Engineering approver:
- QA approver:
- Release approver:
- Notas:
