# Guia de Contribucion - BuildTrack

Este repositorio usa un flujo Git orientado a equipos.

## Estrategia de ramas

- `main`: rama estable de produccion.
- `develop`: rama de integracion continua.
- `feature/*`: nuevas funcionalidades.
- `fix/*`: correcciones no criticas.
- `hotfix/*`: correcciones urgentes para produccion.

Reglas:
- No hacer push directo a `main` ni a `develop`.
- Todo cambio entra por Pull Request.
- Requerir al menos 1 aprobacion para merge.
- `hotfix/*` puede abrir PR directo a `main` y luego debe sincronizarse en `develop`.

## Flujo de trabajo

1. Crear rama desde `develop`

```bash
git checkout develop
git pull origin develop

git checkout -b feature/nombre-corto
# o
git checkout -b fix/descripcion-corta
```

2. Ejecutar validaciones locales

```bash
npm run lint:all
npm run typecheck
npm test
npm run build
```

3. Commits con Conventional Commits

Formato:

```text
<tipo>(<scope opcional>): <descripcion>
```

Tipos recomendados:
- `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `style`, `perf`, `ci`, `revert`

Ejemplos:

```bash
git commit -m "feat(assets): agregar filtro por categoria"
git commit -m "fix(auth): manejar sesion expirada"
git commit -m "chore(ci): agregar typecheck a deploy staging"
```

4. Publicar y abrir PR

```bash
git push origin feature/nombre-corto
```

- Base normal: `develop`
- Base para hotfix: `main`

5. Merge

- Squash merge recomendado.
- Verificar que CI este en verde antes de merge.

## Hotfix a produccion

```bash
git checkout main
git pull origin main
git checkout -b hotfix/descripcion-corta
```

Despues del merge a `main`, crear PR adicional `main -> develop` para evitar drift.

## Estandares de calidad

Antes de pedir review:
- `npm run lint:all`
- `npm run typecheck`
- `npm test`
- `npm run build`

Hooks locales:
- `pre-commit`: `lint-staged`
- `pre-push`: `typecheck` + smoke tests
- `commit-msg`: `commitlint`

## Base de datos

- Cambios SQL en `supabase/schema.sql` y `supabase/rls.sql`.
- Agregar migraciones en `supabase/migrations/` siguiendo timestamp (`YYYYMMDDHHMMSS_descripcion.sql`).
- Documentar impacto en `docs/database.md`.
