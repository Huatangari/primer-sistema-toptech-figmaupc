-- =============================================================================
-- TopTech · Row Level Security — Producción
-- Ejecutar DESPUÉS de schema.sql para reemplazar las políticas dev.
--
-- Orden:
--   1. Funciones helper (security definer — evitan recursión RLS)
--   2. Limpieza de políticas existentes
--   3. Políticas por tabla y por rol
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. FUNCIONES HELPER
-- security definer = se ejecutan con los permisos del creador, no del llamador.
-- Esto evita el bucle RLS cuando building_users también tiene RLS activo.
-- -----------------------------------------------------------------------------

create or replace function is_building_member(bid uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from building_users
    where user_id = auth.uid() and building_id = bid
  )
$$;

create or replace function building_role(bid uuid)
returns text language sql security definer stable as $$
  select role::text from building_users
  where user_id = auth.uid() and building_id = bid
  limit 1
$$;

create or replace function is_building_admin(bid uuid)
returns boolean language sql security definer stable as $$
  select coalesce(building_role(bid) = 'admin', false)
$$;

create or replace function can_write(bid uuid)
returns boolean language sql security definer stable as $$
  select coalesce(building_role(bid) in ('admin', 'technician'), false)
$$;


-- -----------------------------------------------------------------------------
-- 2. LIMPIEZA DE POLITICAS EXISTENTES
-- Evita conflictos cuando schema.sql ya trae RLS base y este archivo se re-ejecuta.
-- -----------------------------------------------------------------------------

do $$
declare
  p record;
begin
  for p in
    select tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'building_users',
        'buildings',
        'providers',
        'provider_categories',
        'assets',
        'asset_history',
        'incidents',
        'incident_events',
        'documents'
      )
  loop
    execute format('drop policy if exists %I on %I', p.policyname, p.tablename);
  end loop;
end
$$;


-- -----------------------------------------------------------------------------
-- 3. POLITICAS POR TABLA
-- Convencion de nombres: "{tabla}_{operacion}_{rol}"
-- -----------------------------------------------------------------------------

-- ── building_users ──────────────────────────────────────────────────────────
-- Los usuarios ven solo sus propias membresías.
-- Solo admins pueden gestionar membresías de su edificio.

alter table building_users enable row level security;

create policy "building_users_select_own"
  on building_users for select
  using (user_id = auth.uid());

create policy "building_users_insert_admin"
  on building_users for insert
  with check (is_building_admin(building_id));

create policy "building_users_update_admin"
  on building_users for update
  using (is_building_admin(building_id))
  with check (is_building_admin(building_id));

create policy "building_users_delete_admin"
  on building_users for delete
  using (is_building_admin(building_id));


-- ── buildings ───────────────────────────────────────────────────────────────
-- Cualquier miembro puede ver su edificio.
-- Solo admins pueden actualizar datos del edificio.

create policy "buildings_select_member"
  on buildings for select
  using (is_building_member(id));

create policy "buildings_update_admin"
  on buildings for update
  using (is_building_admin(id))
  with check (is_building_admin(id));


-- ── providers ───────────────────────────────────────────────────────────────

create policy "providers_select_member"
  on providers for select
  using (is_building_member(building_id));

create policy "providers_insert_admin"
  on providers for insert
  with check (is_building_admin(building_id));

create policy "providers_update_admin"
  on providers for update
  using (is_building_admin(building_id))
  with check (is_building_admin(building_id));

create policy "providers_delete_admin"
  on providers for delete
  using (is_building_admin(building_id));


-- ── provider_categories ─────────────────────────────────────────────────────

create policy "provider_categories_select_member"
  on provider_categories for select
  using (
    exists (
      select 1 from providers p
      where p.id = provider_id and is_building_member(p.building_id)
    )
  );

create policy "provider_categories_write_admin"
  on provider_categories for all
  using (
    exists (
      select 1 from providers p
      where p.id = provider_id and is_building_admin(p.building_id)
    )
  )
  with check (
    exists (
      select 1 from providers p
      where p.id = provider_id and is_building_admin(p.building_id)
    )
  );


-- ── assets ──────────────────────────────────────────────────────────────────

create policy "assets_select_member"
  on assets for select
  using (is_building_member(building_id));

create policy "assets_insert_admin"
  on assets for insert
  with check (is_building_admin(building_id));

create policy "assets_update_writer"
  on assets for update
  using (can_write(building_id))
  with check (can_write(building_id));

create policy "assets_delete_admin"
  on assets for delete
  using (is_building_admin(building_id));


-- ── asset_history ───────────────────────────────────────────────────────────
-- Lectura: cualquier miembro.
-- Escritura: admin o technician (las Edge Functions usan service role y bypass RLS).

create policy "asset_history_select_member"
  on asset_history for select
  using (is_building_member(building_id));

create policy "asset_history_insert_writer"
  on asset_history for insert
  with check (can_write(building_id));

create policy "asset_history_delete_admin"
  on asset_history for delete
  using (is_building_admin(building_id));


-- ── incidents ───────────────────────────────────────────────────────────────

create policy "incidents_select_member"
  on incidents for select
  using (is_building_member(building_id));

create policy "incidents_insert_writer"
  on incidents for insert
  with check (can_write(building_id));

create policy "incidents_update_writer"
  on incidents for update
  using (can_write(building_id))
  with check (can_write(building_id));

create policy "incidents_delete_admin"
  on incidents for delete
  using (is_building_admin(building_id));


-- ── incident_events ─────────────────────────────────────────────────────────

create policy "incident_events_select_member"
  on incident_events for select
  using (is_building_member(building_id));

create policy "incident_events_insert_writer"
  on incident_events for insert
  with check (can_write(building_id));

create policy "incident_events_delete_admin"
  on incident_events for delete
  using (is_building_admin(building_id));


-- ── documents ───────────────────────────────────────────────────────────────

create policy "documents_select_member"
  on documents for select
  using (is_building_member(building_id));

create policy "documents_insert_writer"
  on documents for insert
  with check (can_write(building_id));

create policy "documents_update_writer"
  on documents for update
  using (can_write(building_id))
  with check (can_write(building_id));

create policy "documents_delete_admin"
  on documents for delete
  using (is_building_admin(building_id));


-- =============================================================================
-- RESUMEN DE PERMISOS POR ROL
--
-- Tabla            admin   technician   viewer
-- ─────────────────────────────────────────────
-- buildings        RU      R            R
-- providers        CRUD    R            R
-- assets           CRUD    RU           R
-- asset_history    CRUD    CRU          R
-- incidents        CRUD    CRU          R
-- incident_events  CRUD    CRU          R
-- documents        CRUD    CRU          R
-- building_users   CRUD    R(own)       R(own)
-- =============================================================================

