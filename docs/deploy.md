# Guía de despliegue — TopTech

## Entornos

| Entorno | Rama | URL | Trigger |
|---------|------|-----|---------|
| **Preview** | cualquier PR | URL efímera de Vercel | Automático al abrir/actualizar PR |
| **Staging** | `develop` | `staging.toptech.app` | Automático al hacer push a `develop` |
| **Production** | `master` | `app.toptech.app` | Automático al hacer push a `master` (requiere confirmación en `workflow_dispatch`) |

---

## Prerrequisitos

### Secrets en GitHub (`Settings → Secrets → Actions`)

| Secret | Descripción | Entorno |
|--------|-------------|---------|
| `VERCEL_TOKEN` | Token de Vercel (`vercel login → Settings → Tokens`) | todos |
| `VERCEL_ORG_ID` | ID de organización en Vercel (`vercel link`) | todos |
| `VERCEL_PROJECT_ID` | ID del proyecto en Vercel (`vercel link`) | todos |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase (preview/CI) | preview |
| `VITE_SUPABASE_ANON_KEY` | Anon key pública de Supabase (preview/CI) | preview |
| `STAGING_SUPABASE_URL` | URL del proyecto Supabase staging | staging |
| `STAGING_SUPABASE_ANON_KEY` | Anon key de staging | staging |
| `PROD_SUPABASE_URL` | URL del proyecto Supabase producción | prod |
| `PROD_SUPABASE_ANON_KEY` | Anon key de producción | prod |
| `VITE_SENTRY_DSN` | DSN del proyecto en Sentry | staging + prod |

### Environments en GitHub

Crear en `Settings → Environments`:
- `staging` — sin protección adicional
- `production` — requerir aprobación de al menos 1 reviewer

---

## Primer despliegue (setup inicial)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Autenticarse
vercel login

# 3. Vincular el proyecto (genera .vercel/project.json con los IDs)
vercel link

# 4. Copiar VERCEL_ORG_ID y VERCEL_PROJECT_ID al repositorio como secrets
cat .vercel/project.json

# 5. Configurar variables de entorno en Vercel por entorno
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_SENTRY_DSN production
```

---

## Flujo normal de desarrollo

```
feature/* → develop (PR + review) → merge automático a staging
                                 ↓
                           QA en staging
                                 ↓
develop → master (PR + review) → deploy a producción
```

---

## Deploy manual a producción

Solo en caso de emergencia o hotfix:

1. Ir a **Actions → Deploy Production → Run workflow**
2. En el campo `confirm` escribir `yes`
3. El job `gate` valida la confirmación antes de proceder

---

## Rollback

```bash
# Ver últimos deployments
vercel ls

# Promover el deployment anterior a producción
vercel promote <deployment-url> --scope <org>
```

O desde el dashboard de Vercel: Deployments → seleccionar → "Promote to Production".

---

## Variables de entorno locales

Copiar `.env.example` a `.env.local` y completar los valores:

```bash
cp .env.example .env.local
```

Ver `.env.example` para la lista completa de variables requeridas.
