# ENVIRONMENT

## Variables por entorno

| Variable | Local | Staging | Production | Requerida |
|---|---|---|---|---|
| `VITE_SUPABASE_URL` | si | si | si | si |
| `VITE_SUPABASE_ANON_KEY` | si | si | si | si |
| `VITE_ALLOW_DEMO_MODE` | opcional (`false` recomendado) | no | no | no |
| `VITE_SENTRY_DSN` | opcional | recomendado | recomendado | no |
| `VITE_APP_ENV` | `development` | `staging` | `production` | si |
| `VITE_APP_VERSION` | `local` | sha/tag | sha/tag | si |
| `VITE_API_URL` | opcional legacy | opcional legacy | opcional legacy | no |

## Archivos locales

- `/.env.example`: plantilla versionada
- `/.env.local`: configuracion local (ignorada por git)

## Reglas de seguridad

- No commitear `.env.local`.
- Nunca exponer `SUPABASE_SERVICE_ROLE_KEY` en frontend.
- Rotar secrets en caso de exposicion accidental.
- Usar secretos de GitHub Actions para CI/CD.

## Secrets de GitHub Actions

### Compartidos
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VITE_SENTRY_DSN`

### Preview
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Staging
- `STAGING_SUPABASE_URL`
- `STAGING_SUPABASE_ANON_KEY`

### Production
- `PROD_SUPABASE_URL`
- `PROD_SUPABASE_ANON_KEY`

## Validacion rapida

```bash
npm run typecheck
npm run build
```

Si falta una variable critica, la app no debe autenticar ni mutar datos en modo conectado.
