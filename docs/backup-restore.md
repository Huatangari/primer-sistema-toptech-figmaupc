# Backups y restauración — TopTech

## Cobertura

| Dato | Mecanismo | Frecuencia | Retención |
|------|-----------|------------|-----------|
| Base de datos PostgreSQL | Supabase PITR (Point-in-Time Recovery) | Continua | 7 días (Pro) / 30 días (Team) |
| Backups diarios automáticos | Supabase Dashboard | Diaria | 7 días |
| Storage (documentos adjuntos) | Supabase Storage (S3-compatible) | N/A | Manual |
| Schema SQL versionado | `supabase/schema.sql` en Git | Por commit | Indefinida |

---

## Backup manual de la base de datos

### Opción A — Supabase CLI

```bash
# Instalar CLI si no está disponible
npm i -g supabase

# Autenticarse
supabase login

# Exportar schema + datos de producción
supabase db dump --project-ref <PROJECT_REF> -f backup_$(date +%Y%m%d_%H%M%S).sql

# Solo schema (sin datos)
supabase db dump --project-ref <PROJECT_REF> --schema-only -f schema_$(date +%Y%m%d).sql
```

### Opción B — pg_dump directo

```bash
# La cadena de conexión se obtiene en: Supabase Dashboard → Settings → Database
pg_dump \
  "postgresql://postgres:<PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres" \
  --no-acl --no-owner \
  -f backup_$(date +%Y%m%d_%H%M%S).sql
```

### Opción C — Dashboard de Supabase

1. Ir a **Database → Backups**
2. Seleccionar fecha/hora objetivo (PITR)
3. Clic en **Download backup**

---

## Backup de Storage (archivos adjuntos)

```bash
# Listar buckets
supabase storage ls --project-ref <PROJECT_REF>

# Descargar todos los archivos de un bucket
supabase storage cp -r ss:///documents ./backup_storage/documents_$(date +%Y%m%d) \
  --project-ref <PROJECT_REF>
```

---

## Restauración de base de datos

> **IMPORTANTE**: La restauración en producción requiere aprobación del Tech Lead y comunicación previa al cliente.

### Restaurar desde PITR (recomendado)

1. Supabase Dashboard → **Database → Backups**
2. Seleccionar timestamp de recuperación
3. Clic en **Restore** → confirmar en el modal
4. La base queda en modo mantenimiento ~10 min

### Restaurar desde archivo `.sql`

```bash
# PELIGROSO: sobreescribe datos actuales
psql \
  "postgresql://postgres:<PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres" \
  -f backup_20240115_030000.sql
```

### Restaurar solo el schema (sin datos)

```bash
# Útil para recrear un entorno de staging limpio
psql "postgresql://..." -f supabase/schema.sql
psql "postgresql://..." -f supabase/rls.sql
psql "postgresql://..." -f supabase/seed.sql  # solo en staging
```

---

## Verificación post-restore

```sql
-- Contar registros clave para validar integridad
SELECT
  (SELECT count(*) FROM buildings)      AS buildings,
  (SELECT count(*) FROM assets)         AS assets,
  (SELECT count(*) FROM incidents)      AS incidents,
  (SELECT count(*) FROM documents)      AS documents,
  (SELECT count(*) FROM building_users) AS users;
```

---

## Checklist de backup semanal (manual hasta automatizar)

- [ ] Descargar dump con pg_dump a `backups/YYYY-MM-DD/`
- [ ] Verificar tamaño del archivo (debe ser > 0 bytes)
- [ ] Subir copia cifrada a almacenamiento externo (Google Drive / S3)
- [ ] Registrar en el log de backups: fecha, responsable, tamaño
- [ ] Cada mes: probar restauración en entorno staging y validar conteos

---

## Contactos de emergencia

| Servicio | Soporte | URL |
|----------|---------|-----|
| Supabase | support@supabase.io | https://supabase.com/dashboard/support |
| Vercel | support.vercel.com | https://vercel.com/help |
| Sentry | sentry.io/support | https://sentry.io/support/ |
