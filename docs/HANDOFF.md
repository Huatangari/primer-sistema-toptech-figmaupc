# HANDOFF

Documento de entrega tecnica para cliente/equipo operador.

## 1) Estado entregado

- Frontend en TypeScript + Vite con build reproducible.
- CI/CD en GitHub Actions para calidad y despliegue.
- Integracion Supabase con RLS endurecida.
- Documentacion operativa por entorno y release.

## 2) Activos entregados

- Codigo fuente y workflows CI/CD.
- SQL de esquema y politicas (`supabase/schema.sql`, `supabase/rls.sql`).
- Baseline de migracion (`supabase/migrations/20260312000000_initial_baseline.sql`).
- Manuales operativos en `docs/`.

## 3) Requisitos operativos

- Acceso admin a GitHub repo.
- Acceso admin a proyecto Vercel.
- Acceso admin a proyecto Supabase.
- Acceso a Sentry (si aplica).

## 4) Checklist de go-live

- [ ] Secrets de GitHub Actions configurados
- [ ] Variables de Vercel por entorno configuradas
- [ ] Migraciones SQL aplicadas en produccion
- [ ] Politicas RLS verificadas con usuario real
- [ ] Smoke test funcional post-deploy
- [ ] Monitoreo y alertas activas

## 5) Operacion post-entrega

- Monitorear errores en Sentry diariamente.
- Revisar estado de workflows en GitHub Actions.
- Revisar consumo y estado de Supabase.
- Ejecutar backup/restore segun `docs/backup-restore.md`.

## 6) Soporte y continuidad

- Para cambios funcionales: ramas `feature/*`.
- Para correcciones: `fix/*`.
- Para incidentes criticos en produccion: `hotfix/*`.
- Todo cambio debe pasar por PR y CI en verde.
