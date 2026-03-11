/**
 * Mappers DB → App types
 * Convierten snake_case (Supabase/PostgreSQL) a camelCase (TypeScript app).
 * Usados en los servicios cuando Supabase está configurado.
 */

import type {
  AssetRow, AssetHistoryRow, IncidentRow, IncidentEventRow, DocumentRow, ProviderRow,
} from "../types/database";
import type {
  Asset, AssetHistoryEvent, Incident, IncidentEvent, Document, Provider,
} from "../types";
import { normalizeIncidentStatus } from "../utils/incidentStatus";

// ─── Assets ───────────────────────────────────────────────────────────────────

export function mapAsset(row: AssetRow): Asset {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    category: row.category,
    location: row.location,
    status: row.status,
    installationDate: row.installation_date ?? "",
    lastMaintenance: row.last_maintenance ?? "",
    nextMaintenance: row.next_maintenance ?? "",
    description: row.description,
    observations: row.observations,
    providerId: row.provider_id ?? "",
    serialNumber: row.serial_number ?? undefined,
    brand: row.brand ?? undefined,
    model: row.model ?? undefined,
  };
}

export function mapAssetHistoryEvent(row: AssetHistoryRow): AssetHistoryEvent {
  return {
    id: row.id,
    assetId: row.asset_id,
    date: row.date,
    type: row.type,
    title: row.title,
    description: row.description,
    technician: row.technician,
  };
}

// ─── Incidents ────────────────────────────────────────────────────────────────

export function mapIncident(row: IncidentRow): Incident {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    description: row.description,
    assetId: row.asset_id,
    priority: row.priority,
    status: normalizeIncidentStatus(row.status),
    reportedBy: row.reported_by,
    assignedTo: row.assigned_to ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    resolvedAt: row.resolved_at ?? undefined,
    observations: row.observations ?? undefined,
    hasEvidence: row.has_evidence,
  };
}

export function mapIncidentEvent(row: IncidentEventRow): IncidentEvent {
  return {
    id: row.id,
    incidentId: row.incident_id,
    date: row.date,
    type: row.type,
    description: row.description,
    author: row.author,
  };
}

// ─── Documents ────────────────────────────────────────────────────────────────

export function mapDocument(row: DocumentRow): Document {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    assetId: row.asset_id ?? undefined,
    providerId: row.provider_id ?? undefined,
    uploadedBy: row.uploaded_by,
    uploadedAt: row.uploaded_at,
    expiresAt: row.expires_at ?? undefined,
    fileSize: row.file_size,
    fileType: row.file_type,
    fileUrl: row.file_url ?? undefined,
    description: row.description,
    tags: row.tags,
  };
}

// ─── Providers ────────────────────────────────────────────────────────────────

export function mapProvider(row: ProviderRow): Provider {
  return {
    id: row.id,
    name: row.name,
    rubro: row.rubro,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    status: row.status,
    lastService: row.last_service ?? "",
    rating: row.rating ?? 0,
    contractType: row.contract_type ?? undefined,
    categories: (row.provider_categories ?? []).map((pc) => pc.category),
  };
}
