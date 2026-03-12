# Runbook de operaciones — TopTech

## Severidades

| Nivel | Descripción | Tiempo de respuesta | Ejemplo |
|-------|-------------|---------------------|---------|
| **P1 — Crítico** | Producción caída / datos en riesgo | < 30 min | Login imposible, DB inaccesible |
| **P2 — Alto** | Funcionalidad principal degradada | < 2 h | Formularios no guardan, carga lenta |
| **P3 — Medio** | Funcionalidad secundaria afectada | < 24 h | Export falla, campo incorrecto |
| **P4 — Bajo** | Bug menor / cosmético | Próximo sprint | Typo, alineación incorrecta |

---

## Procedimiento general de incidente

1. **Detectar** — Sentry, monitoreo, reporte de usuario
2. **Registrar** — Abrir issue en GitHub con template `bug_report.md`
3. **Clasificar** — Asignar severidad P1–P4
4. **Comunicar** — Notificar en canal `#incidentes` (P1/P2 inmediato, P3 en el día)
5. **Investigar** — Ver logs, Sentry, reproducir
6. **Resolver** — Fix en rama `hotfix/<descripción>` → PR directo a `master` (P1/P2) o flujo normal (P3/P4)
7. **Verificar** — Tests pasan, comportamiento correcto en staging
8. **Cerrar** — Actualizar issue, documentar causa raíz en comentario

---

## P1: Aplicación inaccesible

### Síntomas
- Pantalla en blanco / error 5xx en la URL de producción
- Sentry: spike de `Error: ChunkLoadError` o errores de red

### Diagnóstico

```bash
# 1. Verificar estado del deployment en Vercel
vercel ls --scope <org>

# 2. Ver logs del último deploy
vercel logs <deployment-url>

# 3. Verificar estado de Supabase
# → https://status.supabase.com
```

### Resolución

```bash
# Rollback inmediato al deployment anterior
vercel promote <previous-deployment-url> --scope <org>
```

Si el problema es del código, crear rama `hotfix/`, corregir, PR a `master`.

---

## P1: Base de datos inaccesible o datos corruptos

```bash
# 1. Confirmar estado del proyecto Supabase
#    Dashboard → Settings → General → Project status

# 2. Verificar conexiones activas
SELECT count(*), state FROM pg_stat_activity GROUP BY state;

# 3. Cancelar queries bloqueadas (si aplica)
SELECT pg_cancel_backend(pid)
FROM pg_stat_activity
WHERE state = 'active' AND duration > interval '5 minutes';

# 4. Si los datos están corruptos → ejecutar procedimiento de Restore
#    Ver docs/backup-restore.md
```

---

## P2: Login falla para todos los usuarios

### Diagnóstico

```bash
# Verificar configuración Auth en Supabase
# Dashboard → Authentication → Settings

# Revisar CORS permitidos
# Dashboard → API → CORS Origins → agregar dominio si falta
```

### Causas comunes

| Causa | Solución |
|-------|----------|
| VITE_SUPABASE_ANON_KEY rotada | Actualizar secret en Vercel + redeploy |
| Dominio no en lista CORS | Agregar en Supabase → API → CORS |
| JWT secret cambiado | Regenerar en Authentication → Settings |
| RLS mal configurada | Revisar `supabase/rls.sql`, aplicar corrección |

---

## P2: Edge Function falla

```bash
# Ver logs de la función específica
supabase functions logs create-incident --project-ref <REF>

# Redesplegar la función
supabase functions deploy create-incident --project-ref <REF>

# Redesplegar todas
supabase functions deploy --project-ref <REF>
```

---

## P3: Subida de documentos falla

```bash
# 1. Verificar políticas del bucket en Storage
# Dashboard → Storage → Policies → bucket 'documents'

# 2. Verificar límite de tamaño
# Dashboard → Storage → Settings → File size limit

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

Ver error exacto en **GitHub → Actions → run fallido → job → step**.

---

## Monitoreo continuo

| Herramienta | Qué monitorear | URL |
|-------------|----------------|-----|
| **Sentry** | Errores JS en frontend, tasa de error, performance | sentry.io/organizations/toptech |
| **Supabase Dashboard** | Queries lentas, conexiones, uso de storage | app.supabase.com/project/<ref>/reports |
| **Vercel Analytics** | Core Web Vitals, LCP, CLS, FID | vercel.com/toptech/analytics |
| **GitHub Actions** | Estado de CI/CD, duración de workflows | github.com/Huatangari/.../actions |

### Alertas Sentry recomendadas

```
Condición: error_rate > 5 % en 5 min  → Slack #incidentes
Condición: new_issue (P1)              → PagerDuty / email
Condición: p95_latency > 3 s           → Slack #performance
```

---

## Rotación de secrets

Cuando se rota `VITE_SUPABASE_ANON_KEY` o `VITE_SENTRY_DSN`:

1. Actualizar en Vercel: `Settings → Environment Variables`
2. Actualizar en GitHub: `Settings → Secrets → Actions`
3. Forzar redeploy: `vercel deploy --force --prod`
4. Verificar que el login funciona en staging antes de aplicar en prod

---

## Contactos del equipo

| Rol | Nombre | Contacto |
|-----|--------|----------|
| Tech Lead | — | — |
| DevOps | — | — |
| Supabase owner | — | — |
| Cliente | — | — |
