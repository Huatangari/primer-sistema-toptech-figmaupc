import { useState, useMemo, useCallback, ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Search, Plus, Package2 } from "lucide-react";
import { EmptyState } from "../components/shared/EmptyState";
import { ErrorState } from "../components/shared/ErrorState";
import { AssetRow } from "../components/assets/AssetRow";
import { AssetsFilters } from "../components/assets/AssetsFilters";
import { useData } from "../hooks/useData";
import { getAssets } from "../../lib/services/assets";
import type { Asset, AssetCategory, AssetStatus } from "../../lib/types";
import styles from "./AssetsList.module.css";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Status chips rendered in the summary bar with their dot color. */
const STATUS_CHIPS: { status: AssetStatus; dotClass: string }[] = [
  { status: "Operativo",       dotClass: "bg-emerald-500" },
  { status: "En Mantenimiento", dotClass: "bg-amber-500"  },
  { status: "Falla",           dotClass: "bg-red-500"     },
  { status: "Vencido",         dotClass: "bg-red-500"     },
];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Assets list page.
 * Orchestrates data fetching, filtering and delegates rendering to sub-components.
 * No inline styles — all styling via AssetsList.module.css + Tailwind.
 */
export function AssetsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ── Data ──────────────────────────────────────────────────────────────────

  const { data: assets, loading, error, refetch } = useData(getAssets, [] as Asset[]);

  // ── Local state ───────────────────────────────────────────────────────────

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<AssetCategory | "Todas">(
    (searchParams.get("categoria") as AssetCategory | null) || "Todas"
  );
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "Todos">("Todos");

  // ── Derived state ─────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return assets.filter((a) => {
      const matchSearch =
        !search ||
        a.name.toLowerCase().includes(lower) ||
        a.code.toLowerCase().includes(lower) ||
        a.location.toLowerCase().includes(lower);
      const matchCat    = categoryFilter === "Todas" || a.category === categoryFilter;
      const matchStatus = statusFilter   === "Todos" || a.status   === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [assets, search, categoryFilter, statusFilter]);

  /**
   * Pre-computed count per status so STATUS_CHIPS rendering
   * doesn't run filtered.filter() N times inside JSX.
   */
  const statusCounts = useMemo(
    () =>
      STATUS_CHIPS.reduce<Partial<Record<AssetStatus, number>>>((acc, { status }) => {
        acc[status] = filtered.filter((a: Asset) => a.status === status).length;
        return acc;
      }, {}),
    [filtered]
  );

  // ── Stable callbacks ──────────────────────────────────────────────────────

  const handleNavigate = useCallback(
    (id: string) => navigate(`/activos/${id}`),
    [navigate]
  );

  const handleStatusToggle = useCallback(
    (s: AssetStatus) => setStatusFilter((prev: AssetStatus | "Todos") => (prev === s ? "Todos" : s)),
    []
  );

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setCategoryFilter("Todas");
    setStatusFilter("Todos");
  }, []);

  // ── Guards ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div
          className={styles.spinner}
          role="status"
          aria-label="Cargando activos"
        />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={styles.container}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.searchAndFilters}>

          {/* Search */}
          <div className={styles.searchWrapper}>
            <Search size={15} className={styles.searchIcon} aria-hidden="true" />
            <input
              type="search"
              aria-label="Buscar activos por nombre, código o ubicación"
              placeholder="Buscar activo, código, ubicación..."
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Filters */}
          <AssetsFilters
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            onCategoryChange={setCategoryFilter}
            onStatusChange={setStatusFilter}
          />
        </div>

        <button
          type="button"
          onClick={() => alert("Función disponible en la versión completa")}
          className={styles.addButton}
        >
          <Plus size={15} aria-hidden="true" />
          Nuevo Activo
        </button>
      </div>

      {/* ── Stats bar ───────────────────────────────────────────────────── */}
      <div
        className={styles.statsRow}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Mostrando ${filtered.length} de ${assets.length} activos`}
      >
        <span className={styles.countText}>
          Mostrando{" "}
          <span className={styles.countValue}>{filtered.length}</span> de{" "}
          <span className={styles.countValue}>{assets.length}</span> activos
        </span>

        <div className={styles.chips} role="group" aria-label="Filtrar por estado rápido">
          {STATUS_CHIPS.map(({ status, dotClass }) => {
            const count = statusCounts[status] ?? 0;
            if (count === 0) return null;
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => handleStatusToggle(status)}
                aria-pressed={isActive ? "true" : "false"}
                className={`${styles.chip} ${isActive ? styles.chipActive : styles.chipInactive}`}
              >
                <span className={`${styles.chipDot} ${dotClass}`} aria-hidden="true" />
                {status}: {count}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table / Empty ───────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className={styles.emptyWrapper}>
          <EmptyState
            icon={<Package2 size={24} aria-hidden="true" />}
            title="Sin activos"
            description="No se encontraron activos con los filtros seleccionados."
            action={
              <button
                type="button"
                onClick={handleClearFilters}
                className={styles.clearFiltersButton}
              >
                Limpiar filtros
              </button>
            }
          />
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <div className={styles.tableScroll}>
            <table
              className={styles.table}
              aria-label="Listado de activos técnicos del edificio"
            >
              <thead>
                <tr className={styles.tableHeadRow}>
                  <th scope="col" className={styles.thFirst}>Activo</th>
                  <th scope="col" className={`${styles.th} hidden sm:table-cell`}>Categoría</th>
                  <th scope="col" className={`${styles.th} hidden md:table-cell`}>Ubicación</th>
                  <th scope="col" className={styles.th}>Estado</th>
                  <th scope="col" className={`${styles.th} hidden lg:table-cell`}>Último Mtto.</th>
                  <th scope="col" className={`${styles.th} hidden lg:table-cell`}>Próximo Mtto.</th>
                  <th scope="col" className={styles.thAction}>
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                {filtered.map((asset) => (
                  <AssetRow
                    key={asset.id}
                    asset={asset}
                    onClick={handleNavigate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
