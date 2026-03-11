import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, Star, Phone, Mail, ArrowRight, Users } from "lucide-react";
import { ProviderStatusBadge } from "../components/shared/StatusBadge";
import { CategoryIcon } from "../components/shared/CategoryIcon";
import { EmptyState } from "../components/shared/EmptyState";
import { ErrorState } from "../components/shared/ErrorState";
import { useData } from "../hooks/useData";
import { getProviders } from "../../lib/services/providers";
import { getAssets } from "../../lib/services/assets";
import { getCategoryColor, formatDate } from "../../lib/utils";
import { Asset, Provider } from "../../lib/types";

export function Providers() {
  const navigate = useNavigate();
  const { data: { providers, assets }, loading, error, refetch } = useData(
    () => Promise.all([getProviders(), getAssets()])
      .then(([providers, assets]) => ({ providers, assets })),
    { providers: [] as Provider[], assets: [] as Asset[] }
  );
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return providers.filter((p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.rubro.toLowerCase().includes(search.toLowerCase()) ||
      p.contactName.toLowerCase().includes(search.toLowerCase())
    );
  }, [providers, search]);

  const selectedProvider = providers.find((p) => p.id === selected);

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="p-6 space-y-5 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar proveedor, rubro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-white focus:border-blue-400"
          />
        </div>
        <button
          onClick={() => navigate("/proveedores/nuevo")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0"
        >
          <Plus size={15} />
          Nuevo Proveedor
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Proveedores", value: providers.length, color: "text-blue-600" },
          { label: "Activos", value: providers.filter((p) => p.status === "Activo").length, color: "text-emerald-600" },
          { label: "Pend. Evaluación", value: providers.filter((p) => p.status === "Pendiente Evaluación").length, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className={`flex gap-5 ${selected ? "flex-col xl:flex-row" : ""}`}>
        {/* Table */}
        <div className={selected ? "xl:flex-1" : "w-full"}>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200">
              <EmptyState
                icon={<Users size={24} aria-hidden="true" />}
                title="Sin proveedores"
                description="No se encontraron proveedores."
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Proveedor</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Rubro</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Contacto</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Último Servicio</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Rating</th>
                      <th className="px-4 py-3 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((prov) => (
                      <tr
                        key={prov.id}
                        onClick={() => setSelected(selected === prov.id ? null : prov.id)}
                        className={`cursor-pointer transition-colors ${
                          selected === prov.id ? "bg-blue-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-semibold">
                                {prov.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{prov.name}</p>
                              {prov.contractType && (
                                <p className="text-xs text-gray-400">{prov.contractType}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <p className="text-sm text-gray-600">{prov.rubro}</p>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <p className="text-sm font-medium text-gray-700">{prov.contactName}</p>
                          <p className="text-xs text-gray-400">{prov.contactPhone}</p>
                        </td>
                        <td className="px-4 py-3.5 hidden lg:table-cell">
                          <p className="text-sm text-gray-600">{formatDate(prov.lastService)}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <ProviderStatusBadge status={prov.status} />
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <div className="flex items-center gap-1">
                            <Star size={13} className="text-amber-400 fill-amber-400" />
                            <span className="text-sm font-medium text-gray-700">{prov.rating}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <button type="button" aria-label="Ver detalle del proveedor" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                            <ArrowRight size={15} aria-hidden="true" />
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

        {/* Detail panel */}
        {selectedProvider && (
          <div className="xl:w-80 bg-white rounded-xl border border-gray-200 p-5 space-y-5 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-xl bg-slate-700 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {selectedProvider.name.charAt(0)}
                </span>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900">{selectedProvider.name}</h3>
              <p className="text-gray-500 text-sm mt-0.5">{selectedProvider.rubro}</p>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={s <= Math.round(selectedProvider.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
                  />
                ))}
                <span className="text-gray-500 text-xs ml-1">{selectedProvider.rating}/5</span>
              </div>
            </div>

            <ProviderStatusBadge status={selectedProvider.status} />

            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Phone size={13} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Teléfono</p>
                  <p className="text-sm text-gray-700">{selectedProvider.contactPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Mail size={13} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm text-gray-700 break-all">{selectedProvider.contactEmail}</p>
                </div>
              </div>
            </div>

            {/* Categories covered */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 mb-2">Categorías atendidas</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedProvider.categories.map((cat) => (
                  <span
                    key={cat}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${getCategoryColor(cat)}`}
                  >
                    <CategoryIcon category={cat} size={11} />
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Assets managed */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 mb-2">Activos asignados</p>
              <div className="space-y-1.5">
                {assets.filter((a) => a.providerId === selectedProvider.id).slice(0, 4).map((a) => (
                  <div key={a.id} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${getCategoryColor(a.category)}`}>
                      <CategoryIcon category={a.category} size={11} />
                    </div>
                    <p className="text-xs text-gray-600 truncate">{a.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
                Contactar proveedor
              </button>
              <button type="button" className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm py-2.5 rounded-lg transition-colors">
                Ver historial de servicios
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


