import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Search, Plus, Filter, ArrowRight, Package2 } from "lucide-react";
import { AssetStatusBadge } from "../components/shared/StatusBadge";
import { CategoryIcon } from "../components/shared/CategoryIcon";
import { EmptyState } from "../components/shared/EmptyState";
import { getAssets } from "../../lib/services/assets";
import { getCategoryColor, formatDate } from "../../lib/utils";
import { Asset, AssetCategory, AssetStatus } from "../../lib/types";

const CATEGORIES: (AssetCategory | "Todas")[] = [
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

const STATUSES: (AssetStatus | "Todos")[] = ["Todos", "Operativo", "En Mantenimiento", "Falla", "Vencido", "Inactivo"];

export function AssetsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<AssetCategory | "Todas">(
    (searchParams.get("categoria") as AssetCategory) || "Todas"
  );
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "Todos">("Todos");

  useEffect(() => {
    getAssets().then((data) => { setAssets(data); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const matchSearch =
        !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.code.toLowerCase().includes(search.toLowerCase()) ||
        a.location.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "Todas" || a.category === categoryFilter;
      const matchStatus = statusFilter === "Todos" || a.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [assets, search, categoryFilter, statusFilter]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 max-w-screen-2xl mx-auto">
      {/* Header actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-48 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar activo, código, ubicación..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter size={14} className="text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as AssetCategory | "Todas")}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-blue-400 text-gray-700"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AssetStatus | "Todos")}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-blue-400 text-gray-700"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => alert("Función disponible en la versión completa")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors flex-shrink-0"
          style={{ fontWeight: 500 }}
        >
          <Plus size={15} />
          Nuevo Activo
        </button>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm text-gray-500">
          Mostrando <strong className="text-gray-700">{filtered.length}</strong> de <strong className="text-gray-700">{assets.length}</strong> activos
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {(["Operativo", "En Mantenimiento", "Falla", "Vencido"] as AssetStatus[]).map((s) => {
            const count = filtered.filter((a) => a.status === s).length;
            if (count === 0) return null;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(statusFilter === s ? "Todos" : s)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  statusFilter === s ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    s === "Operativo" ? "bg-emerald-500" : s === "En Mantenimiento" ? "bg-amber-500" : "bg-red-500"
                  }`}
                />
                {s}: {count}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <EmptyState
            icon={<Package2 size={24} className="text-gray-400" />}
            title="Sin activos"
            description="No se encontraron activos con los filtros seleccionados."
            action={
              <button onClick={() => { setSearch(""); setCategoryFilter("Todas"); setStatusFilter("Todos"); }} className="text-blue-600 text-sm">
                Limpiar filtros
              </button>
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>
                    Activo
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide hidden sm:table-cell" style={{ fontWeight: 600 }}>
                    Categoría
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide hidden md:table-cell" style={{ fontWeight: 600 }}>
                    Ubicación
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>
                    Estado
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide hidden lg:table-cell" style={{ fontWeight: 600 }}>
                    Último Mtto.
                  </th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide hidden lg:table-cell" style={{ fontWeight: 600 }}>
                    Próximo Mtto.
                  </th>
                  <th className="px-4 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((asset) => (
                  <tr
                    key={asset.id}
                    onClick={() => navigate(`/activos/${asset.id}`)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${getCategoryColor(asset.category)}`}>
                          <CategoryIcon category={asset.category} size={15} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900" style={{ fontWeight: 500 }}>{asset.name}</p>
                          <p className="text-xs text-gray-400">{asset.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${getCategoryColor(asset.category)}`} style={{ fontWeight: 500 }}>
                        {asset.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <p className="text-sm text-gray-600">{asset.location}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <AssetStatusBadge status={asset.status} />
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <p className="text-sm text-gray-600">{formatDate(asset.lastMaintenance)}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      {(() => {
                        const next = new Date(asset.nextMaintenance);
                        const now = new Date();
                        const days = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                        return (
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-600">{formatDate(asset.nextMaintenance)}</p>
                            {days <= 30 && days > 0 && (
                              <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded" style={{ fontWeight: 500 }}>
                                {days}d
                              </span>
                            )}
                            {days <= 0 && (
                              <span className="text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded" style={{ fontWeight: 500 }}>
                                Vencido
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3.5">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <ArrowRight size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
