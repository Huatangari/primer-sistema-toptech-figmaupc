import { AssetStatus, IncidentPriority, IncidentStatus, DocumentType, ProviderStatus } from "../types";

// ─── Re-export cn from ui/utils to provide a single import point ─────────────
export { cn } from "../../app/components/ui/utils";

// ─── Date formatting ─────────────────────────────────────────────────────────

export function formatDate(dateString: string): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
  return `Hace ${Math.floor(diffDays / 365)} años`;
}

// ─── Status color helpers ────────────────────────────────────────────────────

export function getAssetStatusColors(status: AssetStatus) {
  switch (status) {
    case "Operativo":
      return { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" };
    case "En Mantenimiento":
      return { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" };
    case "Falla":
      return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" };
    case "Vencido":
      return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" };
    case "Inactivo":
      return { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
  }
}

export function getIncidentPriorityColors(priority: IncidentPriority) {
  switch (priority) {
    case "Crítica":
      return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" };
    case "Alta":
      return { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" };
    case "Media":
      return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" };
    case "Baja":
      return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200" };
  }
}

export function getIncidentStatusColors(status: IncidentStatus) {
  switch (status) {
    case "Abierta":
      return { bg: "bg-red-100", text: "text-red-700" };
    case "En Proceso":
      return { bg: "bg-blue-100", text: "text-blue-700" };
    case "Resuelta":
      return { bg: "bg-emerald-100", text: "text-emerald-700" };
    case "Cerrada":
      return { bg: "bg-gray-100", text: "text-gray-600" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-600" };
  }
}

export function getDocumentTypeColors(type: DocumentType) {
  switch (type) {
    case "Manual":
      return { bg: "bg-blue-100", text: "text-blue-700" };
    case "Certificado":
      return { bg: "bg-emerald-100", text: "text-emerald-700" };
    case "Contrato":
      return { bg: "bg-violet-100", text: "text-violet-700" };
    case "Informe Técnico":
      return { bg: "bg-amber-100", text: "text-amber-700" };
    case "Plano":
      return { bg: "bg-cyan-100", text: "text-cyan-700" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-600" };
  }
}

export function getProviderStatusColors(status: ProviderStatus) {
  switch (status) {
    case "Activo":
      return { bg: "bg-emerald-100", text: "text-emerald-700" };
    case "Inactivo":
      return { bg: "bg-gray-100", text: "text-gray-600" };
    case "Pendiente Evaluación":
      return { bg: "bg-amber-100", text: "text-amber-700" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-600" };
  }
}

// ─── Category icons (using string names for lucide) ──────────────────────────

export function getCategoryIcon(category: string): string {
  const map: Record<string, string> = {
    "Ascensores": "ArrowUpDown",
    "Extintores": "Flame",
    "CCTV": "Video",
    "Sistema Eléctrico": "Zap",
    "Bombas de Agua": "Droplets",
    "Alarmas CI": "Bell",
    "Internet": "Wifi",
    "Áreas Comunes": "Building2",
  };
  return map[category] || "Package";
}

export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    "Ascensores": "bg-blue-100 text-blue-700",
    "Extintores": "bg-red-100 text-red-700",
    "CCTV": "bg-purple-100 text-purple-700",
    "Sistema Eléctrico": "bg-yellow-100 text-yellow-700",
    "Bombas de Agua": "bg-cyan-100 text-cyan-700",
    "Alarmas CI": "bg-orange-100 text-orange-700",
    "Internet": "bg-indigo-100 text-indigo-700",
    "Áreas Comunes": "bg-emerald-100 text-emerald-700",
  };
  return map[category] || "bg-gray-100 text-gray-600";
}
