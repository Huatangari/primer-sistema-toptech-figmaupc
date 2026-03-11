# Arquitectura del Sistema — BuildTrack

---

## Visión general

```
┌─────────────────────────────────────────────────────┐
│                   NAVEGADOR                         │
│                                                     │
│   React + Vite + TypeScript                         │
│   ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│   │  pages/  │  │ services/│  │  auth/           │ │
│   │  (UI)    │→ │  (data)  │→ │  authClient.ts   │ │
│   └──────────┘  └──────────┘  └──────────────────┘ │
│        ↓              ↓                ↓            │
│   hooks/useData   api/mappers    supabase client    │
└────────────────────────────┬────────────────────────┘
                             │ HTTPS
                    ┌────────▼────────┐
                    │   SUPABASE      │
                    │                 │
                    │  ┌───────────┐  │
                    │  │  Auth     │  │
                    │  │  (JWT)    │  │
                    │  └───────────┘  │
                    │  ┌───────────┐  │
                    │  │ PostgREST │  │
                    │  │  (REST)   │  │
                    │  └───────────┘  │
                    │  ┌───────────┐  │
                    │  │   Edge    │  │
                    │  │Functions  │  │
                    │  │  (Deno)   │  │
                    │  └───────────┘  │
                    │  ┌───────────┐  │
                    │  │PostgreSQL │  │
                    │  │  + RLS    │  │
                    │  └───────────┘  │
                    └─────────────────┘
```

---

## Frontend

### Estructura de carpetas

```
src/
├── app/
│   ├── components/
│   │   ├── layout/         Sidebar, Topbar, MainLayout
│   │   ├── shared/         KpiCard, StatusBadge, Timeline,
│   │   │                   EmptyState, ErrorState, CategoryIcon
│   │   └── ui/             Primitivos shadcn/ui (accordion, button, etc.)
│   ├── hooks/
│   │   └── useData.ts      Hook genérico para cargas async
│   ├── pages/              Una página por módulo (Dashboard, Assets, etc.)
│   └── router/
│       └── ProtectedRoute.tsx
│
├── lib/
│   ├── api/
│   │   ├── client.ts       apiFetch centralizado con auth header
│   │   ├── endpoints.ts    Mutaciones tipadas via Edge Functions
│   │   └── mappers.ts      DB row → App type converters
│   ├── auth/
│   │   ├── authClient.ts   Supabase client + login/logout helpers
│   │   ├── useAuth.ts      Hook que escucha onAuthStateChange
│   │   └── AuthProvider.tsx Context provider para toda la app
│   ├── mock-data/          Datos demo locales (fallback sin Supabase)
│   ├── services/           getAssets(), getIncidents(), etc.
│   └── types/
│       ├── index.ts        Tipos app (camelCase) — Asset, Incident, etc.
│       └── database.ts     Tipos DB raw (snake_case) — AssetRow, etc.
│
└── styles/
    ├── index.css
    ├── tailwind.css
    └── theme.css
```

### Patrón de datos async

Todas las páginas cargan datos con el hook `useData`:

```tsx
const { data, loading, error, refetch } = useData(
  () => getAssets(),       // función async del servicio
  [] as Asset[]            // valor inicial
);
```

El hook maneja: loading state, error state, cancelación de requests obsoletos, y refetch manual.

### Modo demo vs. producción

Los servicios tienen dual-mode:

```typescript
// services/assets.ts
export async function getAssets(): Promise<Asset[]> {
  if (!IS_SUPABASE_CONFIGURED) return mockAssets;  // demo
  const { data } = await supabase.from("assets").select("*");  // producción
  return (data ?? []).map(mapAsset);
}
```

`IS_SUPABASE_CONFIGURED` es `true` solo si `VITE_SUPABASE_URL` está presente y no es el placeholder.

---

## Backend (Supabase)

### Autenticación

Supabase Auth con email/password. El JWT del usuario se envía automáticamente en cada request del cliente JS. Las Edge Functions validan el token con `auth.getUser()`.

### PostgREST (API REST auto-generada)

Supabase expone automáticamente una REST API por tabla:

```
GET  /rest/v1/assets?building_id=eq.{id}&select=*
POST /rest/v1/assets
PATCH /rest/v1/assets?id=eq.{id}
```

La RLS filtra los datos según el usuario autenticado — no hay posibilidad de acceder a datos de otro edificio.

### Edge Functions (Deno)

Para operaciones con lógica de negocio compleja (auditoría, validaciones cross-tabla):

| Función | Propósito |
|---|---|
| `create-incident` | Crea incidencia + evento inicial de auditoría |
| `close-incident` | Cierra incidencia + registra fecha y notas |
| `upload-document` | Registra metadatos de documento en Storage |
| `asset-maintenance-log` | Registra historial + actualiza `last_maintenance` |

Las funciones se llaman desde el frontend vía:
```typescript
await supabase.functions.invoke("create-incident", { body: input });
```

### Row Level Security

Cada tabla tiene políticas RLS. El patrón central:

```sql
-- Usuario solo ve datos de edificios donde es miembro
create policy "assets_select_member"
  on assets for select
  using (is_building_member(building_id));
```

Las funciones helper `is_building_member()`, `building_role()`, `can_write()` son `security definer` para evitar recursión.

---

## Modelo multi-tenant

```
User (auth.users)
    │ 1
    │
    │ N
BuildingUser (user_id, building_id, role)
    │ N
    │
    │ 1
Building (id, name)
    │ 1
    │
    │ N
Assets / Incidents / Documents / Providers
```

**Regla:** Ningún query puede devolver datos de un edificio al que el usuario no pertenece — esto lo garantiza RLS a nivel de base de datos, no a nivel de aplicación.

---

## Flujo de una acción típica

**Ejemplo: el técnico registra una incidencia**

```
1. Usuario en IncidentForm completa el formulario
2. handleSubmit() llama a createIncident() de endpoints.ts
3. endpoints.ts llama a supabase.functions.invoke("create-incident")
4. Edge Function:
   a. Valida JWT → obtiene user
   b. Verifica que el user tiene acceso al asset (vía RLS)
   c. Genera código INC-XXX
   d. INSERT en incidents (service role)
   e. INSERT en incident_events (auditoría automática)
5. Retorna la incidencia creada
6. Frontend hace refetch() del listado
```

---

## Convenciones de código

- **Tipos app:** camelCase (`Asset`, `Incident`, `reportedBy`)
- **Tipos DB:** snake_case (`AssetRow`, `incident_events`, `reported_by`)
- **Mappers:** `mapAsset(row: AssetRow): Asset` — la conversión ocurre solo en servicios
- **Imports:** usar barrel exports (`from '../components/shared'`, `from '../pages'`)
- **Errores:** los servicios lanzar `new Error(message)` — `useData` los captura en `error`
