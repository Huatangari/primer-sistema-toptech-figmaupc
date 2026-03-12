# Runbook de operaciones â€” TopTech

## Severidades

| Nivel | DescripciÃ³n | Tiempo de respuesta | Ejemplo |
|-------|-------------|---------------------|---------|
| **P1 â€” CrÃ­tico** | ProducciÃ³n caÃ­da / datos en riesgo | < 30 min | Login imposible, DB inaccesible |
| **P2 â€” Alto** | Funcionalidad principal degradada | < 2 h | Formularios no guardan, carga lenta |
| **P3 â€” Medio** | Funcionalidad secundaria afectada | < 24 h | Export falla, campo incorrecto |
| **P4 â€” Bajo** | Bug menor / cosmÃ©tico | PrÃ³ximo sprint | Typo, alineaciÃ³n incorrecta |

---

## Procedimiento general de incidente

1. **Detectar** â€” Sentry, monitoreo, reporte de usuario
2. **Registrar** â€” Abrir issue en GitHub con template `bug_report.md`
3. **Clasificar** â€” Asignar severidad P1â€“P4
4. **Comunicar** â€” Notificar en canal `#incidentes` (P1/P2 inmediato, P3 en el dÃ­a)
5. **Investigar** â€” Ver logs, Sentry, reproducir
6. **Resolver** â€” Fix en rama `hotfix/<descripciÃ³n>` â†’ PR directo a `main` (P1/P2) o flujo normal (P3/P4)
7. **Verificar** â€” Tests pasan, comportamiento correcto en staging
8. **Cerrar** â€” Actualizar issue, documentar causa raÃ­z en comentario

---

## P1: AplicaciÃ³n inaccesible

### SÃ­ntomas
- Pantalla en blanco / error 5xx en la URL de producciÃ³n
- Sentry: spike de `Error: ChunkLoadError` o errores de red

### DiagnÃ³stico

```bash
# 1. Verificar estado del deployment en Vercel
vercel ls --scope <org>

# 2. Ver logs del Ãºltimo deploy
vercel logs <deployment-url>

# 3. Verificar estado de Supabase
# â†’ https://status.supabase.com
```

### ResoluciÃ³n

```bash
# Rollback inmediato al deployment anterior
vercel promote <previous-deployment-url> --scope <org>
```

Si el problema es del cÃ³digo, crear rama `hotfix/`, corregir, PR a `main`.

---

## P1: Base de datos inaccesible o datos corruptos

```bash
# 1. Confirmar estado del proyecto Supabase
#    Dashboard â†’ Settings â†’ General â†’ Project status

# 2. Verificar conexiones activas
SELECT count(*), state FROM pg_stat_activity GROUP BY state;

# 3. Cancelar queries bloqueadas (si aplica)
SELECT pg_cancel_backend(pid)
FROM pg_stat_activity
WHERE state = 'active' AND duration > interval '5 minutes';

# 4. Si los datos estÃ¡n corruptos â†’ ejecutar procedimiento de Restore
#    Ver docs/backup-restore.md
```

---

## P2: Login falla para todos los usuarios

### DiagnÃ³stico

```bash
# Verificar configuraciÃ³n Auth en Supabase
# Dashboard â†’ Authentication â†’ Settings

# Revisar CORS permitidos
# Dashboard â†’ API â†’ CORS Origins â†’ agregar dominio si falta
```

### Causas comunes

| Causa | SoluciÃ³n |
|-------|----------|
| VITE_SUPABASE_ANON_KEY rotada | Actualizar secret en Vercel + redeploy |
| Dominio no en lista CORS | Agregar en Supabase â†’ API â†’ CORS |
| JWT secret cambiado | Regenerar en Authentication â†’ Settings |
| RLS mal configurada | Revisar `supabase/rls.sql`, aplicar correcciÃ³n |

---

## P2: Edge Function falla

```bash
# Ver logs de la funciÃ³n especÃ­fica
supabase functions logs create-incident --project-ref <REF>

# Redesplegar la funciÃ³n
supabase functions deploy create-incident --project-ref <REF>

# Redesplegar todas
supabase functions deploy --project-ref <REF>
```

---

## P3: Subida de documentos falla

```bash
# 1. Verificar polÃ­ticas del bucket en Storage
# Dashboard â†’ Storage â†’ Policies â†’ bucket 'documents'

# 2. Verificar lÃ­mite de tamaÃ±o
# Dashboard â†’ Storage â†’ Settings â†’ File size limit

# 3. Revisar logs de upload-document function
supabase functions logs upload-document --project-ref <REF>
```

---

## P3: Build de CI falla

```bash
# Reproducir localmente
npm ci
npx tsc --noEmit          # type errors
npm run lint              # eslint
npm run lint:css          # stylelint
npm test                  # unit tests
npm run build             # build production
```

Ver error exacto en **GitHub â†’ Actions â†’ run fallido â†’ job â†’ step**.

---

## Monitoreo continuo

| Herramienta | QuÃ© monitorear | URL |
|-------------|----------------|-----|
| **Sentry** | Errores JS en frontend, tasa de error, performance | sentry.io/organizations/toptech |
| **Supabase Dashboard** | Queries lentas, conexiones, uso de storage | app.supabase.com/project/<ref>/reports |
| **Vercel Analytics** | Core Web Vitals, LCP, CLS, FID | vercel.com/toptech/analytics |
| **GitHub Actions** | Estado de CI/CD, duraciÃ³n de workflows | github.com/Huatangari/.../actions |

### Alertas Sentry recomendadas

```
CondiciÃ³n: error_rate > 5 % en 5 min  â†’ Slack #incidentes
CondiciÃ³n: new_issue (P1)              â†’ PagerDuty / email
CondiciÃ³n: p95_latency > 3 s           â†’ Slack #performance
```

---

## RotaciÃ³n de secrets

Cuando se rota `VITE_SUPABASE_ANON_KEY` o `VITE_SENTRY_DSN`:

1. Actualizar en Vercel: `Settings â†’ Environment Variables`
2. Actualizar en GitHub: `Settings â†’ Secrets â†’ Actions`
3. Forzar redeploy: `vercel deploy --force --prod`
4. Verificar que el login funciona en staging antes de aplicar en prod

---

## Contactos del equipo

| Rol | Nombre | Contacto |
|-----|--------|----------|
| Tech Lead | â€” | â€” |
| DevOps | â€” | â€” |
| Supabase owner | â€” | â€” |
| Cliente | â€” | â€” |


