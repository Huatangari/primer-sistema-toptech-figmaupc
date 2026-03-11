import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, Filter, ArrowRight, AlertTriangle } from "lucide-react";
import { IncidentPriorityBadge, IncidentStatusBadge } from "../components/shared/StatusBadge";
import { EmptyState } from "../components/shared/EmptyState";
import { ErrorState } from "../components/shared/ErrorState";
import { useData } from "../hooks/useData";
import { getIncidents } from "../../lib/services/incidents";
import { getAssets } from "../../lib/services/assets";
import { formatDate, isIncidentClosed, timeAgo } from "../../lib/utils";
import { Asset, Incident, IncidentPriority, IncidentStatus } from "../../lib/types";

const STATUSES: (IncidentStatus | "Todos")[] = ["Todos", "Abierta", "En Proceso", "Resuelta"];
const PRIORITIES: (IncidentPriority | "Todas")[] = ["Todas", "Crítica", "Alta", "Media", "Baja"];

export function IncidentsList() {
  const navigate = useNavigate();
  const { data: { incidents, assets }, loading, error, refetch } = useData(
    () => Promise.all([getIncidents(), getAssets()])
      .then(([incidents, assets]) => ({ incidents, assets })),
    { incidents: [] as Incident[], assets: [] as Asset[] }
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | "Todos">("Todos");
  const [priorityFilter, setPriorityFilter] = useState<IncidentPriority | "Todas">("Todas");

  const filtered = useMemo(() => {
    return incidents
      .filter((i) => {
        const asset = assets.find((a) => a.id === i.assetId);
        const matchSearch =
          !search ||
          i.title.toLowerCase().includes(search.toLowerCase()) ||
          i.code.toLowerCase().includes(search.toLowerCase()) ||
          asset?.name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "Todos" || i.status === statusFilter;
        const matchPriority = priorityFilter === "Todas" || i.priority === priorityFilter;
        return matchSearch && matchStatus && matchPriority;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [incidents, assets, search, statusFilter, priorityFilter]);

  const openCount = incidents.filter((i) => i.status === "Abierta").length;
  const inProcessCount = incidents.filter((i) => i.status === "En Proceso").length;
  const criticalCount = incidents.filter((i) => i.priority === "Crítica" && !isIncidentClosed(i.status)).length;

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="p-6 space-y-5 max-w-screen-2xl mx-auto">
      {/* Alert banner */}
      {criticalCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle size={18} className="text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">
              {criticalCount} incidencia{criticalCount > 1 ? "s" : ""} crítica{criticalCount > 1 ? "s" : ""} pendiente{criticalCount > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-red-600">Requieren atención inmediata</p>
          </div>
          <button
            onClick={() => setPriorityFilter("Crítica")}
            className="text-xs font-medium text-red-600 border border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors flex-shrink-0"
          >
            Ver críticas
          </button>
        </div>
      )}

      {/* Header actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar incidencia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-white focus:border-blue-400"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter size={14} aria-hidden="true" />
            <select
              title="Filtrar por estado"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as IncidentStatus | "Todos")}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none text-gray-700"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              title="Filtrar por prioridad"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as IncidentPriority | "Todas")}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none text-gray-700"
            >
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={() => navigate("/incidencias/nueva")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0"
        >
          <Plus size={15} />
          Registrar Incidencia
        </button>
      </div>

      {/* Summary chips */}
      <div className="flex items-center gap-3 flex-wrap text-sm">
        <span className="text-gray-500">
          <strong className="text-gray-700">{filtered.length}</strong> incidencias
        </span>
        {[
          { label: "Abiertas", count: openCount, color: "bg-red-100 text-red-700" },
          { label: "En Proceso", count: inProcessCount, color: "bg-blue-100 text-blue-700" },
        ].map((chip) => (
          <span key={chip.label} className={`text-xs font-medium px-2.5 py-1 rounded-full ${chip.color}`}>
            {chip.count} {chip.label}
          </span>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200">
          <EmptyState
            icon={<AlertTriangle size={24} aria-hidden="true" />}
            title="Sin incidencias"
            description="No se encontraron incidencias con los filtros seleccionados."
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Incidencia</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Activo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Prioridad</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Fecha</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Responsable</th>
                  <th className="px-4 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((inc) => {
                  const asset = assets.find((a) => a.id === inc.assetId);
                  return (
                    <tr
                      key={inc.id}
                      onClick={() => navigate(`/incidencias/${inc.id}`)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-start gap-2">
                          {inc.hasEvidence && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" title="Con evidencia" />
                          )}
                          <div>
                            <p className="text-xs text-gray-400 mb-0.5">{inc.code}</p>
                            <p className="text-sm font-medium text-gray-800">{inc.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{timeAgo(inc.createdAt)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <p className="text-sm text-gray-600">{asset?.name || "—"}</p>
                        <p className="text-xs text-gray-400">{asset?.category}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <IncidentPriorityBadge priority={inc.priority} />
                      </td>
                      <td className="px-4 py-3.5">
                        <IncidentStatusBadge status={inc.status} />
                      </td>
                      <td className="px-4 py-3.5 hidden lg:table-cell">
                        <p className="text-sm text-gray-600">{formatDate(inc.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <p className="text-sm text-gray-600">{inc.assignedTo || <span className="text-gray-300">Sin asignar</span>}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <button type="button" aria-label="Ver detalle de incidencia" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                          <ArrowRight size={15} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
