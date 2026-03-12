# Supabase migrations

Este directorio contiene migraciones SQL versionadas para ejecucion con Supabase CLI.

## Convencion de nombre

`YYYYMMDDHHMMSS_descripcion.sql`

Ejemplos:
- `20260312090000_initial_schema.sql`
- `20260312101500_add_provider_email_index.sql`

## Flujo recomendado

1. Crear migracion local:
```bash
supabase migration new <descripcion>
```

2. Editar el archivo generado.

3. Probar en local/staging antes de produccion.

4. Registrar cambios equivalentes en:
- `supabase/schema.sql`
- `supabase/rls.sql`
- `docs/database.md` (si cambia modelo de datos o permisos)

## Baseline actual

- `supabase/schema.sql` define el esquema base vigente.
- `supabase/rls.sql` define las politicas RLS de produccion.

Usar este directorio para cambios incrementales desde este punto.
