# DEPLOYMENT

## Estrategia

- Preview: PRs a `develop`/`main`
- Staging: push a `develop`
- Production: push a `main` o `workflow_dispatch`

## Workflows

- `.github/workflows/ci.yml`
- `.github/workflows/deploy-preview.yml`
- `.github/workflows/deploy-staging.yml`
- `.github/workflows/deploy-prod.yml`

## Pipeline minimo por workflow

1. `npm ci`
2. `npm run lint:all`
3. `npm run typecheck`
4. `npm test`
5. `npm run build`
6. deploy (Vercel)

## Primer setup en Vercel

```bash
npm i -g vercel
vercel login
vercel link
```

Cargar `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` como secrets en GitHub.

## Deploy manual de produccion

1. GitHub -> Actions -> `Deploy Production`
2. `Run workflow`
3. Confirmar input `confirm=yes`

## Rollback

```bash
vercel ls
vercel promote <deployment-url> --scope <org>
```

## Checklist pre-deploy

- [ ] `npm run check` pasa localmente
- [ ] migraciones aplicadas en staging
- [ ] RLS validada en staging
- [ ] smoke E2E en verde
- [ ] variables de entorno correctas
