/**
 * Endpoints tipados — capa de acciones sobre el backend.
 * Usa Edge Functions (vía supabase.functions.invoke) para operaciones
 * con lógica de negocio y auditoría automática.
 *
 * Las consultas de lectura (GET) van directo a los servicios.
 * Las mutaciones (CREATE / UPDATE) pasan por Edge Functions.
 */

import { supabase, IS_SUPABASE_CONFIGURED } from "../auth/authClient";
import type { Incident, Document } from "../types";
import type { IncidentPriority } from "../types";

// ─── Input types ─────────────────────────────────────────────────────────────

export interface CreateIncidentInput {
  asset_id: string;
  title: string;
  description: string;
  priority: IncidentPriority;
  observations?: string;
}

export interface CloseIncidentInput {
  incident_id: string;
  resolution_notes?: string;
}

export interface UploadDocumentInput {
  building_id: string;
  name: string;
  type: Document["type"];
  description: string;
  file_size: string;
  file_type: string;
  file_url?: string;
  asset_id?: string;
  provider_id?: string;
  tags?: string[];
  expires_at?: string;
}

export interface MaintenanceLogInput {
  asset_id: string;
  type: "Mantenimiento" | "Inspección" | "Reemplazo" | "Instalación";
  title: string;
  description: string;
  technician: string;
  next_maintenance?: string;
}

// ─── Mock fallbacks (modo demo sin Supabase) ─────────────────────────────────

function notConfigured(fn: string) {
  console.warn(`[endpoints] ${fn}: Supabase no configurado — operación simulada`);
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

/**
 * Crea una incidencia con evento de auditoría inicial.
 * Edge Function: create-incident
 */
export async function createIncident(input: CreateIncidentInput): Promise<Incident> {
  if (!IS_SUPABASE_CONFIGURED) {
    notConfigured("createIncident");
    throw new Error("Conecta Supabase para crear incidencias reales");
  }

  const { data, error } = await supabase.functions.invoke("create-incident", {
    body: input,
  });

  if (error) throw new Error(error.message);
  return data.data as Incident;
}

/**
 * Cierra una incidencia y registra el evento de cierre.
 * Edge Function: close-incident
 */
export async function closeIncident(input: CloseIncidentInput): Promise<Incident> {
  if (!IS_SUPABASE_CONFIGURED) {
    notConfigured("closeIncident");
    throw new Error("Conecta Supabase para cerrar incidencias reales");
  }

  const { data, error } = await supabase.functions.invoke("close-incident", {
    body: input,
  });

  if (error) throw new Error(error.message);
  return data.data as Incident;
}

/**
 * Registra metadatos de un documento.
 * Edge Function: upload-document
 * Nota: sube el archivo primero con supabase.storage.from('documents').upload()
 */
export async function uploadDocument(input: UploadDocumentInput): Promise<Document> {
  if (!IS_SUPABASE_CONFIGURED) {
    notConfigured("uploadDocument");
    throw new Error("Conecta Supabase para subir documentos reales");
  }

  const { data, error } = await supabase.functions.invoke("upload-document", {
    body: input,
  });

  if (error) throw new Error(error.message);
  return data.data as Document;
}

/**
 * Registra un evento de mantenimiento y actualiza last_maintenance del activo.
 * Edge Function: asset-maintenance-log
 */
export async function logMaintenance(input: MaintenanceLogInput): Promise<void> {
  if (!IS_SUPABASE_CONFIGURED) {
    notConfigured("logMaintenance");
    return;
  }

  const { error } = await supabase.functions.invoke("asset-maintenance-log", {
    body: input,
  });

  if (error) throw new Error(error.message);
}

/**
 * Devuelve el rol del usuario actual para un edificio.
 * null si el usuario no pertenece al edificio.
 */
export async function getUserRole(buildingId: string): Promise<string | null> {
  if (!IS_SUPABASE_CONFIGURED) return "admin";

  const { data } = await supabase
    .from("building_users")
    .select("role")
    .eq("building_id", buildingId)
    .single();

  return data?.role ?? null;
}
