# Modelo de Datos — BuildTrack

El schema completo está en [`supabase/schema.sql`](../supabase/schema.sql).
Las políticas de seguridad de producción están en [`supabase/rls.sql`](../supabase/rls.sql).

---

## Modelo multi-tenant

El sistema es **multi-edificio (multi-tenant)**. Cada tabla de datos tiene una columna `building_id` que vincula los registros a un edificio específico.

Un usuario puede pertenecer a uno o más edificios con distintos roles:

```
auth.users
    │
    └── building_users (user_id, building_id, role)
            │
            └── buildings (id, name, address, floors, units)
```

**Roles:** `admin` | `technician` | `viewer`

---

## Diagrama de tablas

```
buildings
    │
    ├── building_users       (user_id → auth.users, role)
    │
    ├── providers
    │       └── provider_categories  (junction: provider_id, category)
    │
    ├── assets               (provider_id → providers)
    │       └── asset_history        (asset_id)
    │
    ├── incidents            (asset_id → assets)
    │       └── incident_events      (incident_id)
    │
    └── documents            (asset_id?, provider_id?)
```

---

## Tablas

### `buildings`
El edificio gestionado. Eje del modelo.

| Columna | Tipo | Descripción |
|---|---|---|
| id | uuid PK | Identificador único |
| name | text | Nombre del edificio |
| address | text? | Dirección |
| floors | integer? | Número de pisos |
| units | integer? | Número de unidades |
| created_at / updated_at | timestamptz | Auditoría |

---

### `building_users`
Membresía de un usuario en un edificio con un rol.

| Columna | Tipo | Descripción |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → auth.users | Usuario de Supabase Auth |
| building_id | uuid FK → buildings | Edificio |
| role | enum | admin / technician / viewer |
| created_at | timestamptz | |

**Restricción:** `unique(user_id, building_id)` — un usuario tiene un solo rol por edificio.

---

### `providers`
Proveedores de servicios técnicos.

| Columna | Tipo | Descripción |
|---|---|---|
| id | uuid PK | |
| building_id | uuid FK | Aislamiento multi-tenant |
| name | text | Nombre de la empresa |
| rubro | text | Especialidad |
| contact_name / email / phone | text | Contacto |
| status | enum | Activo / Inactivo / Pendiente Evaluación |
| last_service | date? | Último servicio realizado |
| rating | numeric(2,1)? | Calificación 0–5 |
| contract_type | text? | Tipo de contrato |

### `provider_categories`
Relación muchos-a-muchos entre proveedores y categorías de activos.

| Columna | Tipo |
|---|---|
| provider_id | uuid FK → providers |
| category | enum (asset_category) |

---

### `assets`
Activos técnicos del edificio.

| Columna | Tipo | Descripción |
|---|---|---|
| id | uuid PK | |
| building_id | uuid FK | Multi-tenant |
| provider_id | uuid FK? | Proveedor responsable |
| code | text UNIQUE/building | Código (ej: ASC-001) |
| name | text | Nombre descriptivo |
| category | enum | Ascensores / CCTV / etc. |
| status | enum | Operativo / Falla / etc. |
| installation_date | date? | Fecha de instalación |
| last_maintenance | date? | Último mantenimiento |
| next_maintenance | date? | Próximo mantenimiento programado |
| description | text | Descripción técnica |
| observations | text | Observaciones actuales |
| serial_number / brand / model | text? | Datos técnicos |

### `asset_history`
Timeline de eventos por activo.

| Columna | Tipo | Descripción |
|---|---|---|
| id | uuid PK | |
| asset_id | uuid FK → assets | |
| building_id | uuid FK | Denormalizado para RLS directo |
| date | timestamptz | Fecha del evento |
| type | enum | Mantenimiento / Incidencia / etc. |
| title | text | Resumen del evento |
| description | text | Detalle |
| technician | text | Técnico responsable |

---

### `incidents`
Incidencias o fallas registradas.

| Columna | Tipo | Descripción |
|---|---|---|
| id | uuid PK | |
| building_id | uuid FK | Multi-tenant |
| asset_id | uuid FK → assets | Activo afectado |
| code | text UNIQUE/building | Código (ej: INC-001) |
| title | text | Título descriptivo |
| description | text | Descripción detallada |
| priority | enum | Crítica / Alta / Media / Baja |
| status | enum | Abierta / En Proceso / Resuelta / Cerrada |
| reported_by | text | Email/ID del reportador |
| assigned_to | text? | Email/ID del técnico asignado |
| has_evidence | boolean | Tiene fotografías adjuntas |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| resolved_at | timestamptz? | Fecha de resolución |

### `incident_events`
Auditoría del ciclo de vida de cada incidencia.

| Columna | Tipo | Descripción |
|---|---|---|
| id | uuid PK | |
| incident_id | uuid FK → incidents | |
| building_id | uuid FK | Denormalizado para RLS directo |
| date | timestamptz | |
| type | enum | Creación / Actualización / Cierre / etc. |
| description | text | Detalle de la acción |
| author | text | Email/ID del autor |

---

### `documents`
Repositorio documental técnico.

| Columna | Tipo | Descripción |
|---|---|---|
| id | uuid PK | |
| building_id | uuid FK | Multi-tenant |
| asset_id | uuid FK? | Activo vinculado (opcional) |
| provider_id | uuid FK? | Proveedor vinculado (opcional) |
| name | text | Nombre del documento |
| type | enum | Manual / Certificado / Contrato / etc. |
| description | text | |
| file_size | text | Tamaño (ej: "245 KB") |
| file_type | text | Extensión (ej: "PDF") |
| file_url | text? | URL en Supabase Storage |
| tags | text[] | Etiquetas de búsqueda |
| uploaded_by | text | Email del uploader |
| uploaded_at | timestamptz | |
| expires_at | date? | Vencimiento del documento |

---

## Row Level Security

Todas las tablas tienen RLS habilitado. Ver [`supabase/rls.sql`](../supabase/rls.sql).

**Resumen de permisos por rol:**

| Tabla | admin | technician | viewer |
|---|---|---|---|
| buildings | RU | R | R |
| providers | CRUD | R | R |
| assets | CRUD | RU | R |
| asset_history | CRUD | CRU | R |
| incidents | CRUD | CRU | R |
| incident_events | CRUD | CRU | R |
| documents | CRUD | CRU | R |
| building_users | CRUD | R(propio) | R(propio) |

Las políticas usan funciones helper `security definer` para evitar recursión RLS:
`is_building_member()`, `building_role()`, `is_building_admin()`, `can_write()`
