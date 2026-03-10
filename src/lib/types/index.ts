// ─── Asset Types ────────────────────────────────────────────────────────────

export type AssetCategory =
  | "Ascensores"
  | "Extintores"
  | "CCTV"
  | "Sistema Eléctrico"
  | "Bombas de Agua"
  | "Alarmas CI"
  | "Internet"
  | "Áreas Comunes";

export type AssetStatus = "Operativo" | "En Mantenimiento" | "Falla" | "Vencido" | "Inactivo";

export interface Asset {
  id: string;
  code: string;
  name: string;
  category: AssetCategory;
  location: string;
  status: AssetStatus;
  installationDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  description: string;
  observations: string;
  providerId: string;
  serialNumber?: string;
  brand?: string;
  model?: string;
}

export interface AssetHistoryEvent {
  id: string;
  assetId: string;
  date: string;
  type: "Mantenimiento" | "Incidencia" | "Instalación" | "Inspección" | "Reemplazo";
  title: string;
  description: string;
  technician: string;
}

// ─── Incident Types ──────────────────────────────────────────────────────────

export type IncidentPriority = "Crítica" | "Alta" | "Media" | "Baja";
export type IncidentStatus = "Abierta" | "En Proceso" | "Resuelta" | "Cerrada";

export interface Incident {
  id: string;
  code: string;
  title: string;
  description: string;
  assetId: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  reportedBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  observations?: string;
  hasEvidence: boolean;
}

export interface IncidentEvent {
  id: string;
  incidentId: string;
  date: string;
  type: "Creación" | "Actualización" | "Asignación" | "Resolución" | "Cierre" | "Comentario";
  description: string;
  author: string;
}

// ─── Document Types ──────────────────────────────────────────────────────────

export type DocumentType = "Manual" | "Certificado" | "Contrato" | "Informe Técnico" | "Plano";

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  assetId?: string;
  providerId?: string;
  uploadedBy: string;
  uploadedAt: string;
  expiresAt?: string;
  fileSize: string;
  fileType: string;
  description: string;
  tags: string[];
}

// ─── Provider Types ──────────────────────────────────────────────────────────

export type ProviderStatus = "Activo" | "Inactivo" | "Pendiente Evaluación";

export interface Provider {
  id: string;
  name: string;
  rubro: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: ProviderStatus;
  lastService: string;
  rating: number;
  contractType?: string;
  categories: AssetCategory[];
}

// ─── Dashboard Types ─────────────────────────────────────────────────────────

export interface KpiData {
  label: string;
  value: number | string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  color?: string;
}

export interface CategoryStatus {
  category: AssetCategory;
  total: number;
  operational: number;
  issues: number;
  health: number;
}
