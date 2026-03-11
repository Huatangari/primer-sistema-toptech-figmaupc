import { Filter } from "lucide-react";
import styles from "./AssetsFilters.module.css";
import type { AssetCategory, AssetStatus } from "../../../lib/types";

// ─── Constants ────────────────────────────────────────────────────────────────

export const ASSET_CATEGORIES: (AssetCategory | "Todas")[] = [
  "Todas",
  "Ascensores",
  "Extintores",
  "CCTV",
  "Sistema Eléctrico",
  "Bombas de Agua",
  "Alarmas CI",
  "Internet",
  "Áreas Comunes",
];

export const ASSET_STATUSES: (AssetStatus | "Todos")[] = [
  "Todos",
  "Operativo",
  "En Mantenimiento",
  "Falla",
  "Vencido",
  "Inactivo",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface AssetsFiltersProps {
  categoryFilter: AssetCategory | "Todas";
  statusFilter: AssetStatus | "Todos";
  onCategoryChange: (value: AssetCategory | "Todas") => void;
  onStatusChange: (value: AssetStatus | "Todos") => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Category and status filter selects for the assets list.
 * Stateless — all state is owned by the parent.
 */
export function AssetsFilters({
  categoryFilter,
  statusFilter,
  onCategoryChange,
  onStatusChange,
}: AssetsFiltersProps) {
  return (
    <div className={styles.wrapper}>
      <Filter size={14} className={styles.icon} aria-hidden="true" />

      <select
        aria-label="Filtrar activos por categoría"
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value as AssetCategory | "Todas")}
        className={styles.select}
      >
        {ASSET_CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        aria-label="Filtrar activos por estado"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as AssetStatus | "Todos")}
        className={styles.select}
      >
        {ASSET_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
}
