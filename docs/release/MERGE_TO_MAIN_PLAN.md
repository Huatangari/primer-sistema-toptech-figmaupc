# MERGE TO MAIN PLAN

Plan operativo para promover una version candidata desde `develop` a `main` con despliegue controlado.

Referencias:
- `docs/RELEASE.md`
- `docs/DEPLOYMENT.md`
- `docs/HANDOFF.md`
- `docs/ENVIRONMENT.md`

## 0) Precondiciones
1. Freeze de cambios en `develop` para ventana de release.
2. Checklist de aprobacion completo: `docs/release/RELEASE_APPROVAL_CHECKLIST.md`.
3. CI en verde sobre el commit candidato.
4. Responsables asignados: Engineering, QA, Release.

## 1) Preparacion en develop
1. Sincronizar rama:
```bash
git checkout develop
git pull origin develop
```
2. Ejecutar validaciones locales:
```bash
npm ci
npm run check
npm run test:e2e
```
3. Confirmar que no haya cambios pendientes fuera de alcance release.
4. Confirmar version objetivo (`vX.Y.Z`) y notas de release.

## 2) Validacion en staging
1. Verificar deploy de staging desde `develop` (`deploy-staging.yml`).
2. Verificar variables staging (`STAGING_SUPABASE_URL`, `STAGING_SUPABASE_ANON_KEY`, `VITE_SENTRY_DSN`).
3. Aplicar baseline/migraciones en staging si corresponde:
- `supabase/migrations/20260312000000_initial_baseline.sql`
4. Validar RLS con usuarios reales por rol (`admin`, `technician`, `viewer`).

## 3) QA funcional
1. Ejecutar smoke funcional end-to-end en staging:
- Login/logout y sesion.
- Flujo de activos.
- Flujo de incidencias (crear/cerrar).
- Flujo de documentos.
- Settings (incluyendo reset demo condicionado por flag).
2. Verificar guard clauses `405` en Edge Functions para metodos no permitidos.
3. Registrar evidencias de QA y aprobar Go/No-Go tecnico.

## 4) Creacion del PR `develop -> main`
1. Abrir PR con base `main` y compare `develop`.
2. Usar template de PR del repo y adjuntar:
- Resumen de impacto.
- Evidencias de CI/QA.
- Riesgos pendientes.
3. Solicitar reviews requeridos (engineering + QA/release segun politica).
4. Confirmar checks obligatorios en verde antes de merge.

## 5) Merge controlado
1. Ejecutar merge en ventana acordada.
2. Metodo recomendado: squash merge (segun `CONTRIBUTING.md`).
3. Verificar disparo automatico de `deploy-prod.yml` por push a `main`.
4. Si se usa trigger manual, ejecutar `workflow_dispatch` con `confirm=yes`.

## 6) Tagging de version
1. Etiquetar inmediatamente despues del merge:
```bash
git checkout main
git pull origin main
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin vX.Y.Z
```
2. Registrar tag en release notes internas/cliente.

## 7) Despliegue a produccion
1. Confirmar deploy exitoso en GitHub Actions y Vercel.
2. Verificar URL productiva esperada y version desplegada (`VITE_APP_VERSION`).
3. Monitorear logs/errores durante la ventana de observacion inicial.

## 8) Smoke test post-deploy
1. Ejecutar smoke rapido en produccion:
- Acceso y auth basica.
- Lectura de listas principales.
- Acciones criticas de negocio no destructivas.
2. Revisar Sentry por errores nuevos o regresiones.
3. Confirmar estado de salud con QA y Release.

## 9) Handoff al cliente/equipo operador
1. Actualizar y cerrar `docs/HANDOFF.md`.
2. Compartir:
- Version liberada (`vX.Y.Z`).
- Fecha/hora de despliegue.
- Cambios principales y riesgos residuales.
- Punto de contacto para soporte.

## 10) Contingencia y rollback basico
1. Criterio de rollback:
- Incidente critico en auth, integridad de datos o indisponibilidad sostenida.
2. Accion de rollback:
- Promover despliegue previo estable en Vercel (ver `docs/DEPLOYMENT.md`).
3. Contencion:
- Abrir `hotfix/*` desde `main` para correccion urgente.
- PR a `main` y back-merge a `develop` para evitar drift.
4. Comunicacion:
- Registrar incidente, causa probable y estado del servicio.
