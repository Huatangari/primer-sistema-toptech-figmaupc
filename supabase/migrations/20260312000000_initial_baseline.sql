-- Baseline migration generated on 2026-03-12
-- Source files: supabase/schema.sql + supabase/rls.sql
-- This migration is intended for fresh environments.

-- =============================================================================
-- TopTech · Gestión Técnica de Edificios
-- Schema SQL – Supabase / PostgreSQL
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. EXTENSIONS
-- -----------------------------------------------------------------------------

create extension if not exists pgcrypto;


-- -----------------------------------------------------------------------------
-- 2. ENUMS
-- -----------------------------------------------------------------------------

do $$ begin
  create type asset_category as enum (
    'Ascensores', 'Extintores', 'CCTV', 'Sistema Eléctrico',
    'Bombas de Agua', 'Alarmas CI', 'Internet', 'Áreas Comunes'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type asset_status as enum (
    'Operativo', 'En Mantenimiento', 'Falla', 'Vencido', 'Inactivo'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type asset_history_type as enum (
    'Mantenimiento', 'Incidencia', 'Instalación', 'Inspección', 'Reemplazo'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type incident_priority as enum (
    'Crítica', 'Alta', 'Media', 'Baja'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type incident_status as enum (
    'Abierta', 'En Proceso', 'Resuelta', 'Cerrada'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type incident_event_type as enum (
    'Creación', 'Actualización', 'Asignación', 'Resolución', 'Cierre', 'Comentario'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type document_type as enum (
    'Manual', 'Certificado', 'Contrato', 'Informe Técnico', 'Plano'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type provider_status as enum (
    'Activo', 'Inactivo', 'Pendiente Evaluación'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type user_role as enum ('admin', 'technician', 'viewer');
exception when duplicate_object then null;
end $$;


-- -----------------------------------------------------------------------------
-- 3. TABLES
-- -----------------------------------------------------------------------------

create table if not exists buildings (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  address     text,
  floors      integer check (floors is null or floors >= 0),
  units       integer check (units is null or units >= 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists building_users (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  building_id  uuid not null references buildings(id) on delete cascade,
  role         user_role not null default 'viewer',
  created_at   timestamptz not null default now(),
  unique (user_id, building_id)
);

create table if not exists providers (
  id              uuid primary key default gen_random_uuid(),
  building_id     uuid not null references buildings(id) on delete cascade,
  name            text not null,
  rubro           text not null,
  contact_name    text not null,
  contact_email   text not null check (position('@' in contact_email) > 1),
  contact_phone   text not null,
  status          provider_status not null default 'Activo',
  last_service    date,
  rating          numeric(2,1) check (rating >= 0 and rating <= 5),
  contract_type   text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists provider_categories (
  provider_id  uuid not null references providers(id) on delete cascade,
  category     asset_category not null,
  primary key (provider_id, category)
);

create table if not exists assets (
  id                  uuid primary key default gen_random_uuid(),
  building_id         uuid not null references buildings(id) on delete cascade,
  provider_id         uuid references providers(id) on delete set null,
  code                text not null,
  name                text not null,
  category            asset_category not null,
  location            text not null,
  status              asset_status not null default 'Operativo',
  installation_date   date,
  last_maintenance    date,
  next_maintenance    date,
  description         text not null default '',
  observations        text not null default '',
  serial_number       text,
  brand               text,
  model               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (building_id, code),
  unique (id, building_id),
  check (next_maintenance is null or installation_date is null or next_maintenance >= installation_date),
  check (last_maintenance is null or installation_date is null or last_maintenance >= installation_date),
  check (next_maintenance is null or last_maintenance is null or next_maintenance >= last_maintenance)
);

create table if not exists asset_history (
  id           uuid primary key default gen_random_uuid(),
  asset_id     uuid not null,
  building_id  uuid not null references buildings(id) on delete cascade,
  date         timestamptz not null default now(),
  type         asset_history_type not null,
  title        text not null,
  description  text not null default '',
  technician   text not null,
  created_at   timestamptz not null default now(),
  foreign key (asset_id, building_id) references assets(id, building_id) on delete cascade
);

create table if not exists incidents (
  id           uuid primary key default gen_random_uuid(),
  building_id  uuid not null references buildings(id) on delete cascade,
  asset_id     uuid not null references assets(id) on delete restrict,
  code         text not null,
  title        text not null,
  description  text not null default '',
  priority     incident_priority not null default 'Media',
  status       incident_status not null default 'Abierta',
  reported_by  text not null,
  assigned_to  text,
  observations text,
  has_evidence boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  resolved_at  timestamptz,
  unique (building_id, code),
  unique (id, building_id),
  check (resolved_at is null or status in ('Resuelta', 'Cerrada'))
);

create table if not exists incident_events (
  id           uuid primary key default gen_random_uuid(),
  incident_id  uuid not null,
  building_id  uuid not null references buildings(id) on delete cascade,
  date         timestamptz not null default now(),
  type         incident_event_type not null,
  description  text not null default '',
  author       text not null,
  created_at   timestamptz not null default now(),
  foreign key (incident_id, building_id) references incidents(id, building_id) on delete cascade
);

create table if not exists documents (
  id           uuid primary key default gen_random_uuid(),
  building_id  uuid not null references buildings(id) on delete cascade,
  asset_id     uuid references assets(id) on delete set null,
  provider_id  uuid references providers(id) on delete set null,
  name         text not null,
  type         document_type not null,
  description  text not null default '',
  file_size    text not null,
  file_type    text not null,
  file_url     text,
  tags         text[] not null default '{}',
  uploaded_by  text not null,
  uploaded_at  timestamptz not null default now(),
  expires_at   date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);


-- -----------------------------------------------------------------------------
-- 4. INDEXES
-- -----------------------------------------------------------------------------

create index if not exists idx_building_users_user      on building_users(user_id);
create index if not exists idx_building_users_building  on building_users(building_id);
create index if not exists idx_assets_building          on assets(building_id);
create index if not exists idx_assets_provider          on assets(provider_id);
create index if not exists idx_assets_category          on assets(category);
create index if not exists idx_assets_status            on assets(status);
create index if not exists idx_assets_next_maint        on assets(next_maintenance);
create index if not exists idx_asset_history_asset      on asset_history(asset_id);
create index if not exists idx_asset_history_building   on asset_history(building_id);
create index if not exists idx_asset_history_date       on asset_history(date desc);
create index if not exists idx_incidents_building       on incidents(building_id);
create index if not exists idx_incidents_asset          on incidents(asset_id);
create index if not exists idx_incidents_status         on incidents(status);
create index if not exists idx_incidents_priority       on incidents(priority);
create index if not exists idx_incidents_created        on incidents(created_at desc);
create index if not exists idx_incident_events_incident on incident_events(incident_id);
create index if not exists idx_incident_events_building on incident_events(building_id);
create index if not exists idx_incident_events_date     on incident_events(date desc);
create index if not exists idx_documents_building       on documents(building_id);
create index if not exists idx_documents_asset          on documents(asset_id);
create index if not exists idx_documents_provider       on documents(provider_id);
create index if not exists idx_documents_type           on documents(type);
create index if not exists idx_documents_expires        on documents(expires_at);
create index if not exists idx_providers_building       on providers(building_id);
create index if not exists idx_providers_status         on providers(status);


-- -----------------------------------------------------------------------------
-- 5. TRIGGERS
-- -----------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_buildings_updated_at
  before update on buildings
  for each row execute function set_updated_at();

create or replace trigger trg_providers_updated_at
  before update on providers
  for each row execute function set_updated_at();

create or replace trigger trg_assets_updated_at
  before update on assets
  for each row execute function set_updated_at();

create or replace trigger trg_incidents_updated_at
  before update on incidents
  for each row execute function set_updated_at();

create or replace trigger trg_documents_updated_at
  before update on documents
  for each row execute function set_updated_at();


-- -----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------

alter table buildings           enable row level security;
alter table building_users      enable row level security;
alter table providers           enable row level security;
alter table provider_categories enable row level security;
alter table assets              enable row level security;
alter table asset_history       enable row level security;
alter table incidents           enable row level security;
alter table incident_events     enable row level security;
alter table documents           enable row level security;

alter table buildings           force row level security;
alter table building_users      force row level security;
alter table providers           force row level security;
alter table provider_categories force row level security;
alter table assets              force row level security;
alter table asset_history       force row level security;
alter table incidents           force row level security;
alter table incident_events     force row level security;
alter table documents           force row level security;

-- Helper functions

drop function if exists is_building_member(uuid) cascade;
drop function if exists has_building_role(uuid, user_role[]) cascade;
drop function if exists building_role(uuid) cascade;
drop function if exists is_building_admin(uuid) cascade;
drop function if exists can_write(uuid) cascade;

create or replace function is_building_member(bid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from building_users
    where user_id = auth.uid() and building_id = bid
  )
$$;

create or replace function building_role(bid uuid)
returns text language sql security definer stable set search_path = public as $$
  select role::text from building_users
  where user_id = auth.uid() and building_id = bid
  limit 1
$$;

create or replace function is_building_admin(bid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select coalesce(building_role(bid) = 'admin', false)
$$;

create or replace function can_write(bid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select coalesce(building_role(bid) in ('admin', 'technician'), false)
$$;

revoke all on function is_building_member(uuid) from public;
revoke all on function building_role(uuid) from public;
revoke all on function is_building_admin(uuid) from public;
revoke all on function can_write(uuid) from public;

grant execute on function is_building_member(uuid) to authenticated;
grant execute on function building_role(uuid) to authenticated;
grant execute on function is_building_admin(uuid) to authenticated;
grant execute on function can_write(uuid) to authenticated;

-- Drop all existing policies

do $$
declare p record;
begin
  for p in
    select tablename, policyname from pg_policies
    where schemaname = 'public'
      and tablename in (
        'building_users','buildings','providers','provider_categories',
        'assets','asset_history','incidents','incident_events','documents'
      )
  loop
    execute format('drop policy if exists %I on %I', p.policyname, p.tablename);
  end loop;
end
$$;

-- Policies: building_users
create policy "building_users_select_own"
  on building_users for select using (user_id = auth.uid());
create policy "building_users_insert_admin"
  on building_users for insert with check (is_building_admin(building_id));
create policy "building_users_update_admin"
  on building_users for update
  using (is_building_admin(building_id)) with check (is_building_admin(building_id));
create policy "building_users_delete_admin"
  on building_users for delete using (is_building_admin(building_id));

-- Policies: buildings
create policy "buildings_select_member"
  on buildings for select using (is_building_member(id));
create policy "buildings_update_admin"
  on buildings for update
  using (is_building_admin(id)) with check (is_building_admin(id));

-- Policies: providers
create policy "providers_select_member"
  on providers for select using (is_building_member(building_id));
create policy "providers_insert_admin"
  on providers for insert with check (is_building_admin(building_id));
create policy "providers_update_admin"
  on providers for update
  using (is_building_admin(building_id)) with check (is_building_admin(building_id));
create policy "providers_delete_admin"
  on providers for delete using (is_building_admin(building_id));

-- Policies: provider_categories
create policy "provider_categories_select_member"
  on provider_categories for select using (
    exists (select 1 from providers p where p.id = provider_id and is_building_member(p.building_id))
  );
create policy "provider_categories_write_admin"
  on provider_categories for all
  using (exists (select 1 from providers p where p.id = provider_id and is_building_admin(p.building_id)))
  with check (exists (select 1 from providers p where p.id = provider_id and is_building_admin(p.building_id)));

-- Policies: assets
create policy "assets_select_member"
  on assets for select using (is_building_member(building_id));
create policy "assets_insert_admin"
  on assets for insert with check (is_building_admin(building_id));
create policy "assets_update_writer"
  on assets for update using (can_write(building_id)) with check (can_write(building_id));
create policy "assets_delete_admin"
  on assets for delete using (is_building_admin(building_id));

-- Policies: asset_history
create policy "asset_history_select_member"
  on asset_history for select using (is_building_member(building_id));
create policy "asset_history_insert_writer"
  on asset_history for insert with check (can_write(building_id));
create policy "asset_history_delete_admin"
  on asset_history for delete using (is_building_admin(building_id));

-- Policies: incidents
create policy "incidents_select_member"
  on incidents for select using (is_building_member(building_id));
create policy "incidents_insert_writer"
  on incidents for insert with check (can_write(building_id));
create policy "incidents_update_writer"
  on incidents for update using (can_write(building_id)) with check (can_write(building_id));
create policy "incidents_delete_admin"
  on incidents for delete using (is_building_admin(building_id));

-- Policies: incident_events
create policy "incident_events_select_member"
  on incident_events for select using (is_building_member(building_id));
create policy "incident_events_insert_writer"
  on incident_events for insert with check (can_write(building_id));
create policy "incident_events_delete_admin"
  on incident_events for delete using (is_building_admin(building_id));

-- Policies: documents
create policy "documents_select_member"
  on documents for select using (is_building_member(building_id));
create policy "documents_insert_writer"
  on documents for insert with check (can_write(building_id));
create policy "documents_update_writer"
  on documents for update using (can_write(building_id)) with check (can_write(building_id));
create policy "documents_delete_admin"
  on documents for delete using (is_building_admin(building_id));
