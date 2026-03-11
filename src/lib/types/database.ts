/**
 * Tipos raw de la base de datos (snake_case).
 * Auto-generado con: npm run generate:types
 *
 * Este archivo es un stub manual. Para regenerar a partir del schema real:
 *   1. Instala Supabase CLI: npm install -g supabase
 *   2. Configura tu proyecto: supabase link --project-ref YOUR_PROJECT_ID
 *   3. Ejecuta: npm run generate:types
 */

export type UserRole = "admin" | "technician" | "viewer";
export type AssetCategoryDB = "Ascensores" | "Extintores" | "CCTV" | "Sistema Eléctrico" | "Bombas de Agua" | "Alarmas CI" | "Internet" | "Áreas Comunes";
export type AssetStatusDB = "Operativo" | "En Mantenimiento" | "Falla" | "Vencido" | "Inactivo";
export type AssetHistoryTypeDB = "Mantenimiento" | "Incidencia" | "Instalación" | "Inspección" | "Reemplazo";
export type IncidentPriorityDB = "Crítica" | "Alta" | "Media" | "Baja";
export type IncidentStatusDB = "Abierta" | "En Proceso" | "Resuelta" | "Cerrada";
export type IncidentEventTypeDB = "Creación" | "Actualización" | "Asignación" | "Resolución" | "Cierre" | "Comentario";
export type DocumentTypeDB = "Manual" | "Certificado" | "Contrato" | "Informe Técnico" | "Plano";
export type ProviderStatusDB = "Activo" | "Inactivo" | "Pendiente Evaluación";

// ─── Row types (DB → TypeScript) ─────────────────────────────────────────────

export interface BuildingRow {
  id: string;
  name: string;
  address: string | null;
  floors: number | null;
  units: number | null;
  created_at: string;
  updated_at: string;
}

export interface BuildingUserRow {
  id: string;
  user_id: string;
  building_id: string;
  role: UserRole;
  created_at: string;
}

export interface ProviderRow {
  id: string;
  building_id: string;
  name: string;
  rubro: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: ProviderStatusDB;
  last_service: string | null;
  rating: number | null;
  contract_type: string | null;
  created_at: string;
  updated_at: string;
  // join opcional
  provider_categories?: { category: AssetCategoryDB }[];
}

export interface AssetRow {
  id: string;
  building_id: string;
  provider_id: string | null;
  code: string;
  name: string;
  category: AssetCategoryDB;
  location: string;
  status: AssetStatusDB;
  installation_date: string | null;
  last_maintenance: string | null;
  next_maintenance: string | null;
  description: string;
  observations: string;
  serial_number: string | null;
  brand: string | null;
  model: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssetHistoryRow {
  id: string;
  asset_id: string;
  building_id: string;
  date: string;
  type: AssetHistoryTypeDB;
  title: string;
  description: string;
  technician: string;
  created_at: string;
}

export interface IncidentRow {
  id: string;
  building_id: string;
  asset_id: string;
  code: string;
  title: string;
  description: string;
  priority: IncidentPriorityDB;
  status: IncidentStatusDB;
  reported_by: string;
  assigned_to: string | null;
  observations: string | null;
  has_evidence: boolean;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface IncidentEventRow {
  id: string;
  incident_id: string;
  building_id: string;
  date: string;
  type: IncidentEventTypeDB;
  description: string;
  author: string;
  created_at: string;
}

export interface DocumentRow {
  id: string;
  building_id: string;
  asset_id: string | null;
  provider_id: string | null;
  name: string;
  type: DocumentTypeDB;
  description: string;
  file_size: string;
  file_type: string;
  file_url: string | null;
  tags: string[];
  uploaded_by: string;
  uploaded_at: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}
