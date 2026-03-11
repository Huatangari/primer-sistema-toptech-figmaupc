-- =============================================================================
-- TopTech · Gestión Técnica de Edificios
-- Schema SQL — Supabase / PostgreSQL
--
-- Generado a partir de src/lib/types/index.ts
-- Convención: camelCase (TS) → snake_case (SQL)
--
-- Orden de ejecución:
--   1. extensions
--   2. enums
--   3. tables (en orden de dependencias)
--   4. indexes
--   5. triggers
--   6. row level security
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. EXTENSIONS
-- -----------------------------------------------------------------------------

create extension if not exists "uuid-ossp";


-- -----------------------------------------------------------------------------
-- 2. ENUMS
-- Mapeados 1:1 desde los union types de TypeScript
-- -----------------------------------------------------------------------------

create type asset_category as enum (
  'Ascensores',
  'Extintores',
  'CCTV',
  'Sistema Eléctrico',
  'Bombas de Agua',
  'Alarmas CI',
  'Internet',
  'Áreas Comunes'
);

create type asset_status as enum (
  'Operativo',
  'En Mantenimiento',
  'Falla',
  'Vencido',
  'Inactivo'
);

create type asset_history_type as enum (
  'Mantenimiento',
  'Incidencia',
  'Instalación',
  'Inspección',
  'Reemplazo'
);

create type incident_priority as enum (
  'Crítica',
  'Alta',
  'Media',
  'Baja'
);

create type incident_status as enum (
  'Abierta',
  'En Proceso',
  'Resuelta',
  'Cerrada'
);

create type incident_event_type as enum (
  'Creación',
  'Actualización',
  'Asignación',
  'Resolución',
  'Cierre',
  'Comentario'
);

create type document_type as enum (
  'Manual',
  'Certificado',
  'Contrato',
  'Informe Técnico',
  'Plano'
);

create type provider_status as enum (
  'Activo',
  'Inactivo',
  'Pendiente Evaluación'
);


-- -----------------------------------------------------------------------------
-- 3. TABLES
-- -----------------------------------------------------------------------------

-- ── buildings ──────────────────────────────────────────────────────────────
-- No existe en los tipos actuales pero es el eje del modelo multi-edificio.
-- Cada entidad tiene building_id para aislar datos por cliente en el futuro.

create table buildings (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  address     text,
  floors      integer,
  units       integer,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table buildings is
  'Edificio gestionado. Eje del modelo multi-tenant futuro.';


-- ── building_users ─────────────────────────────────────────────────────────
-- Relación usuario ↔ edificio con rol. Eje del multi-tenant.
-- Un usuario puede pertenecer a varios edificios con distintos roles.

create type user_role as enum ('admin', 'technician', 'viewer');

create table building_users (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  building_id  uuid not null references buildings(id) on delete cascade,
  role         user_role not null default 'viewer',
  created_at   timestamptz not null default now(),

  unique (user_id, building_id)
);

create index idx_building_users_user      on building_users(user_id);
create index idx_building_users_building  on building_users(building_id);

comment on table building_users is
  'Pertenencia de un usuario a un edificio con un rol (admin|technician|viewer).';


-- ── providers ──────────────────────────────────────────────────────────────
-- Provider interface — categories es una relación separada (ver provider_categories)

create table providers (
  id              uuid primary key default gen_random_uuid(),
  building_id     uuid not null references buildings(id) on delete cascade,

  name            text not null,
  rubro           text not null,
  contact_name    text not null,
  contact_email   text not null,
  contact_phone   text not null,
  status          provider_status not null default 'Activo',
  last_service    date,
  rating          numeric(2,1) check (rating >= 0 and rating <= 5),
  contract_type   text,                           -- optional en el tipo TS

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table providers is
  'Proveedores de servicios técnicos. Mapeado desde la interface Provider.';


-- ── provider_categories ────────────────────────────────────────────────────
-- Provider.categories: AssetCategory[] — relación muchos-a-muchos

create table provider_categories (
  provider_id  uuid not null references providers(id) on delete cascade,
  category     asset_category not null,
  primary key (provider_id, category)
);

comment on table provider_categories is
  'Categorías de activos que atiende cada proveedor (Provider.categories[]).';


-- ── assets ─────────────────────────────────────────────────────────────────
-- Asset interface

create table assets (
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

  serial_number       text,                       -- optional en el tipo TS
  brand               text,                       -- optional
  model               text,                       -- optional

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  unique (building_id, code)
);

comment on table assets is
  'Activos técnicos del edificio. Mapeado desde la interface Asset.';


-- ── asset_history ──────────────────────────────────────────────────────────
-- AssetHistoryEvent interface
-- building_id denormalizado para RLS directo (evita subquery sobre assets)

create table asset_history (
  id           uuid primary key default gen_random_uuid(),
  asset_id     uuid not null references assets(id) on delete cascade,
  building_id  uuid not null references buildings(id) on delete cascade,

  date         timestamptz not null default now(),
  type         asset_history_type not null,
  title        text not null,
  description  text not null default '',
  technician   text not null,

  created_at   timestamptz not null default now()
);

comment on table asset_history is
  'Timeline de eventos por activo. Mapeado desde AssetHistoryEvent.';


-- ── incidents ──────────────────────────────────────────────────────────────
-- Incident interface

create table incidents (
  id           uuid primary key default gen_random_uuid(),
  building_id  uuid not null references buildings(id) on delete cascade,
  asset_id     uuid not null references assets(id) on delete restrict,

  code         text not null,
  title        text not null,
  description  text not null default '',
  priority     incident_priority not null default 'Media',
  status       incident_status not null default 'Abierta',

  reported_by  text not null,
  assigned_to  text,                              -- optional en el tipo TS
  observations text,                             -- optional

  has_evidence boolean not null default false,

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  resolved_at  timestamptz,                       -- optional

  unique (building_id, code)
);

comment on table incidents is
  'Incidencias o fallas registradas. Mapeado desde la interface Incident.';


-- ── incident_events ────────────────────────────────────────────────────────
-- IncidentEvent interface — timeline de cada incidencia
-- building_id denormalizado para RLS directo (evita subquery sobre incidents)

create table incident_events (
  id           uuid primary key default gen_random_uuid(),
  incident_id  uuid not null references incidents(id) on delete cascade,
  building_id  uuid not null references buildings(id) on delete cascade,

  date         timestamptz not null default now(),
  type         incident_event_type not null,
  description  text not null default '',
  author       text not null,

  created_at   timestamptz not null default now()
);

comment on table incident_events is
  'Eventos del timeline de cada incidencia. Mapeado desde IncidentEvent.';


-- ── documents ──────────────────────────────────────────────────────────────
-- Document interface

create table documents (
  id           uuid primary key default gen_random_uuid(),
  building_id  uuid not null references buildings(id) on delete cascade,
  asset_id     uuid references assets(id) on delete set null,       -- optional
  provider_id  uuid references providers(id) on delete set null,    -- optional

  name         text not null,
  type         document_type not null,
  description  text not null default '',

  file_size    text not null,
  file_type    text not null,
  file_url     text,               -- ruta real al archivo en Storage (Supabase)

  tags         text[] not null default '{}',

  uploaded_by  text not null,
  uploaded_at  timestamptz not null default now(),
  expires_at   date,               -- optional — fecha de vencimiento

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table documents is
  'Repositorio documental técnico. Mapeado desde la interface Document.';


-- -----------------------------------------------------------------------------
-- 4. INDEXES
-- En columnas usadas en WHERE, ORDER BY y JOIN frecuentes
-- -----------------------------------------------------------------------------

-- assets
create index idx_assets_building    on assets(building_id);
create index idx_assets_provider    on assets(provider_id);
create index idx_assets_category    on assets(category);
create index idx_assets_status      on assets(status);
create index idx_assets_next_maint  on assets(next_maintenance);

-- asset_history
create index idx_asset_history_asset     on asset_history(asset_id);
create index idx_asset_history_building  on asset_history(building_id);
create index idx_asset_history_date      on asset_history(date desc);

-- incidents
create index idx_incidents_building   on incidents(building_id);
create index idx_incidents_asset      on incidents(asset_id);
create index idx_incidents_status     on incidents(status);
create index idx_incidents_priority   on incidents(priority);
create index idx_incidents_created    on incidents(created_at desc);

-- incident_events
create index idx_incident_events_incident  on incident_events(incident_id);
create index idx_incident_events_building  on incident_events(building_id);
create index idx_incident_events_date      on incident_events(date desc);

-- documents
create index idx_documents_building   on documents(building_id);
create index idx_documents_asset      on documents(asset_id);
create index idx_documents_provider   on documents(provider_id);
create index idx_documents_type       on documents(type);
create index idx_documents_expires    on documents(expires_at);

-- providers
create index idx_providers_building   on providers(building_id);
create index idx_providers_status     on providers(status);


-- -----------------------------------------------------------------------------
-- 5. TRIGGERS — updated_at automático
-- -----------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_buildings_updated_at
  before update on buildings
  for each row execute function set_updated_at();

create trigger trg_providers_updated_at
  before update on providers
  for each row execute function set_updated_at();

create trigger trg_assets_updated_at
  before update on assets
  for each row execute function set_updated_at();

create trigger trg_incidents_updated_at
  before update on incidents
  for each row execute function set_updated_at();

create trigger trg_documents_updated_at
  before update on documents
  for each row execute function set_updated_at();


-- -----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- Habilitar en todas las tablas.
-- Las políticas reales dependen del modelo de usuarios (roles, edificios asignados).
-- Placeholder: cuando agregues auth, reemplaza las políticas con algo como:
--   create policy "users see own building"
--     on assets for select
--     using (building_id = (select building_id from user_profiles where id = auth.uid()));
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

-- Helpers multi-tenant para validar membresia y roles por edificio.
-- SECURITY DEFINER evita recursion cuando la policy consulta building_users.
create or replace function is_building_member(target_building uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from building_users bu
    where bu.building_id = target_building
      and bu.user_id = auth.uid()
  );
$$;

create or replace function has_building_role(target_building uuid, allowed_roles user_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from building_users bu
    where bu.building_id = target_building
      and bu.user_id = auth.uid()
      and bu.role = any(allowed_roles)
  );
$$;

-- Limpieza de politicas abiertas anteriores (dev_all_*)
drop policy if exists "dev_all_buildings" on buildings;
drop policy if exists "dev_all_providers" on providers;
drop policy if exists "dev_all_provider_categories" on provider_categories;
drop policy if exists "dev_all_assets" on assets;
drop policy if exists "dev_all_asset_history" on asset_history;
drop policy if exists "dev_all_incidents" on incidents;
drop policy if exists "dev_all_incident_events" on incident_events;
drop policy if exists "dev_all_documents" on documents;

-- building_users: cada usuario solo puede ver su propia membresia.
drop policy if exists "building_users_select_own" on building_users;
create policy "building_users_select_own"
  on building_users
  for select
  using (user_id = auth.uid());

-- buildings
drop policy if exists "buildings_select_member" on buildings;
drop policy if exists "buildings_update_admin" on buildings;
create policy "buildings_select_member"
  on buildings
  for select
  using (is_building_member(id));
create policy "buildings_update_admin"
  on buildings
  for update
  using (has_building_role(id, array['admin']::user_role[]))
  with check (has_building_role(id, array['admin']::user_role[]));

-- providers
drop policy if exists "providers_select_member" on providers;
drop policy if exists "providers_insert_writer" on providers;
drop policy if exists "providers_update_writer" on providers;
drop policy if exists "providers_delete_admin" on providers;
create policy "providers_select_member"
  on providers
  for select
  using (is_building_member(building_id));
create policy "providers_insert_writer"
  on providers
  for insert
  with check (has_building_role(building_id, array['admin','technician']::user_role[]));
create policy "providers_update_writer"
  on providers
  for update
  using (has_building_role(building_id, array['admin','technician']::user_role[]))
  with check (has_building_role(building_id, array['admin','technician']::user_role[]));
create policy "providers_delete_admin"
  on providers
  for delete
  using (has_building_role(building_id, array['admin']::user_role[]));

-- provider_categories (via providers.building_id)
drop policy if exists "provider_categories_select_member" on provider_categories;
drop policy if exists "provider_categories_insert_writer" on provider_categories;
drop policy if exists "provider_categories_update_writer" on provider_categories;
drop policy if exists "provider_categories_delete_admin" on provider_categories;
create policy "provider_categories_select_member"
  on provider_categories
  for select
  using (
    exists (
      select 1
      from providers p
      where p.id = provider_id
        and is_building_member(p.building_id)
    )
  );
create policy "provider_categories_insert_writer"
  on provider_categories
  for insert
  with check (
    exists (
      select 1
      from providers p
      where p.id = provider_id
        and has_building_role(p.building_id, array['admin','technician']::user_role[])
    )
  );
create policy "provider_categories_update_writer"
  on provider_categories
  for update
  using (
    exists (
      select 1
      from providers p
      where p.id = provider_id
        and has_building_role(p.building_id, array['admin','technician']::user_role[])
    )
  )
  with check (
    exists (
      select 1
      from providers p
      where p.id = provider_id
        and has_building_role(p.building_id, array['admin','technician']::user_role[])
    )
  );
create policy "provider_categories_delete_admin"
  on provider_categories
  for delete
  using (
    exists (
      select 1
      from providers p
      where p.id = provider_id
        and has_building_role(p.building_id, array['admin']::user_role[])
    )
  );

-- assets
drop policy if exists "assets_select_member" on assets;
drop policy if exists "assets_insert_writer" on assets;
drop policy if exists "assets_update_writer" on assets;
drop policy if exists "assets_delete_admin" on assets;
create policy "assets_select_member"
  on assets
  for select
  using (is_building_member(building_id));
create policy "assets_insert_writer"
  on assets
  for insert
  with check (has_building_role(building_id, array['admin','technician']::user_role[]));
create policy "assets_update_writer"
  on assets
  for update
  using (has_building_role(building_id, array['admin','technician']::user_role[]))
  with check (has_building_role(building_id, array['admin','technician']::user_role[]));
create policy "assets_delete_admin"
  on assets
  for delete
  using (has_building_role(building_id, array['admin']::user_role[]));

-- asset_history (via assets.building_id)
drop policy if exists "asset_history_select_member" on asset_history;
drop policy if exists "asset_history_insert_writer" on asset_history;
drop policy if exists "asset_history_update_writer" on asset_history;
drop policy if exists "asset_history_delete_admin" on asset_history;
create policy "asset_history_select_member"
  on asset_history
  for select
  using (
    exists (
      select 1
      from assets a
      where a.id = asset_id
        and is_building_member(a.building_id)
    )
  );
create policy "asset_history_insert_writer"
  on asset_history
  for insert
  with check (
    exists (
      select 1
      from assets a
      where a.id = asset_id
        and has_building_role(a.building_id, array['admin','technician']::user_role[])
    )
  );
create policy "asset_history_update_writer"
  on asset_history
  for update
  using (
    exists (
      select 1
      from assets a
      where a.id = asset_id
        and has_building_role(a.building_id, array['admin','technician']::user_role[])
    )
  )
  with check (
    exists (
      select 1
      from assets a
      where a.id = asset_id
        and has_building_role(a.building_id, array['admin','technician']::user_role[])
    )
  );
create policy "asset_history_delete_admin"
  on asset_history
  for delete
  using (
    exists (
      select 1
      from assets a
      where a.id = asset_id
        and has_building_role(a.building_id, array['admin']::user_role[])
    )
  );

-- incidents
drop policy if exists "incidents_select_member" on incidents;
drop policy if exists "incidents_insert_writer" on incidents;
drop policy if exists "incidents_update_writer" on incidents;
drop policy if exists "incidents_delete_admin" on incidents;
create policy "incidents_select_member"
  on incidents
  for select
  using (is_building_member(building_id));
create policy "incidents_insert_writer"
  on incidents
  for insert
  with check (has_building_role(building_id, array['admin','technician']::user_role[]));
create policy "incidents_update_writer"
  on incidents
  for update
  using (has_building_role(building_id, array['admin','technician']::user_role[]))
  with check (has_building_role(building_id, array['admin','technician']::user_role[]));
create policy "incidents_delete_admin"
  on incidents
  for delete
  using (has_building_role(building_id, array['admin']::user_role[]));

-- incident_events (via incidents.building_id)
drop policy if exists "incident_events_select_member" on incident_events;
drop policy if exists "incident_events_insert_writer" on incident_events;
drop policy if exists "incident_events_update_writer" on incident_events;
drop policy if exists "incident_events_delete_admin" on incident_events;
create policy "incident_events_select_member"
  on incident_events
  for select
  using (
    exists (
      select 1
      from incidents i
      where i.id = incident_id
        and is_building_member(i.building_id)
    )
  );
create policy "incident_events_insert_writer"
  on incident_events
  for insert
  with check (
    exists (
      select 1
      from incidents i
      where i.id = incident_id
        and has_building_role(i.building_id, array['admin','technician']::user_role[])
    )
  );
create policy "incident_events_update_writer"
  on incident_events
  for update
  using (
    exists (
      select 1
      from incidents i
      where i.id = incident_id
        and has_building_role(i.building_id, array['admin','technician']::user_role[])
    )
  )
  with check (
    exists (
      select 1
      from incidents i
      where i.id = incident_id
        and has_building_role(i.building_id, array['admin','technician']::user_role[])
    )
  );
create policy "incident_events_delete_admin"
  on incident_events
  for delete
  using (
    exists (
      select 1
      from incidents i
      where i.id = incident_id
        and has_building_role(i.building_id, array['admin']::user_role[])
    )
  );

-- documents
drop policy if exists "documents_select_member" on documents;
drop policy if exists "documents_insert_writer" on documents;
drop policy if exists "documents_update_writer" on documents;
drop policy if exists "documents_delete_admin" on documents;
create policy "documents_select_member"
  on documents
  for select
  using (is_building_member(building_id));
create policy "documents_insert_writer"
  on documents
  for insert
  with check (has_building_role(building_id, array['admin','technician']::user_role[]));
create policy "documents_update_writer"
  on documents
  for update
  using (has_building_role(building_id, array['admin','technician']::user_role[]))
  with check (has_building_role(building_id, array['admin','technician']::user_role[]));
create policy "documents_delete_admin"
  on documents
  for delete
  using (has_building_role(building_id, array['admin']::user_role[]));

-- =============================================================================
-- CONEXIÓN CON EL FRONTEND
--
-- Cuando el backend esté listo, cada servicio cambia de mock a apiFetch:
--
--   // services/assets.ts
--   export async function getAssets(): Promise<Asset[]> {
--     return apiFetch<Asset[]>('/assets');
--   }
--
-- El endpoint REST de Supabase auto-generado es:
--   GET  /rest/v1/assets?building_id=eq.{id}&select=*
--   POST /rest/v1/assets
--   etc.
--
-- O con el cliente JS de Supabase:
--   const { data } = await supabase.from('assets').select('*').eq('building_id', id)
--
-- Mapeo de nombres (camelCase TS ↔ snake_case SQL):
--   Asset.providerId       → assets.provider_id
--   Asset.installationDate → assets.installation_date
--   Asset.lastMaintenance  → assets.last_maintenance
--   Asset.nextMaintenance  → assets.next_maintenance
--   Asset.serialNumber     → assets.serial_number
--   Incident.assetId       → incidents.asset_id
--   Incident.reportedBy    → incidents.reported_by
--   Incident.assignedTo    → incidents.assigned_to
--   Incident.hasEvidence   → incidents.has_evidence
--   Incident.createdAt     → incidents.created_at
--   Incident.resolvedAt    → incidents.resolved_at
--   Document.assetId       → documents.asset_id
--   Document.providerId    → documents.provider_id
--   Document.uploadedBy    → documents.uploaded_by
--   Document.uploadedAt    → documents.uploaded_at
--   Document.expiresAt     → documents.expires_at
--   Document.fileSize      → documents.file_size
--   Document.fileType      → documents.file_type
--   Document.fileUrl       → documents.file_url  (nuevo campo — URL en Supabase Storage)
--   Provider.contactName   → providers.contact_name
--   Provider.contactEmail  → providers.contact_email
--   Provider.contactPhone  → providers.contact_phone
--   Provider.lastService   → providers.last_service
--   Provider.contractType  → providers.contract_type
--   Provider.categories    → provider_categories (tabla junction)
-- =============================================================================


