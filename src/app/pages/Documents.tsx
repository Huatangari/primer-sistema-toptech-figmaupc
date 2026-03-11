import { useState, useMemo } from "react";
import { Search, Filter, Upload, FileText, Download, Eye, Calendar, Tag } from "lucide-react";
import { DocumentTypeBadge } from "../components/shared/StatusBadge";
import { EmptyState } from "../components/shared/EmptyState";
import { ErrorState } from "../components/shared/ErrorState";
import { useData } from "../hooks/useData";
import { getDocuments } from "../../lib/services/documents";
import { getAssets } from "../../lib/services/assets";
import { getProviders } from "../../lib/services/providers";
import { formatDate } from "../../lib/utils";
import { Asset, Document, DocumentType, Provider } from "../../lib/types";

const DOC_TYPES: (DocumentType | "Todos")[] = ["Todos", "Manual", "Certificado", "Contrato", "Informe Técnico", "Plano"];

export function Documents() {
  const { data: { documents, assets, providers }, loading, error, refetch } = useData(
    () => Promise.all([getDocuments(), getAssets(), getProviders()])
      .then(([documents, assets, providers]) => ({ documents, assets, providers })),
    { documents: [] as Document[], assets: [] as Asset[], providers: [] as Provider[] }
  );
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "Todos">("Todos");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      const matchSearch =
        !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchType = typeFilter === "Todos" || d.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [documents, search, typeFilter]);

  const selectedDoc = documents.find((d) => d.id === selected);

  const typeCounts = DOC_TYPES.slice(1).map((type) => ({
    type,
    count: documents.filter((d) => d.type === type).length,
  }));

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="p-6 space-y-5 max-w-screen-2xl mx-auto">
      {/* Type summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {typeCounts.map(({ type, count }) => (
          <button
            key={type}
            onClick={() => setTypeFilter(typeFilter === type ? "Todos" : type as DocumentType)}
            className={`p-3 rounded-xl border text-left transition-all ${
              typeFilter === type
                ? "border-blue-300 bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            <p className="text-gray-900" style={{ fontSize: "22px", fontWeight: 700 }}>{count}</p>
            <p className="text-gray-500 text-xs mt-0.5">{type}</p>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar documento, etiqueta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none bg-white focus:border-blue-400"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as DocumentType | "Todos")}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none text-gray-700"
            >
              {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={() => alert("Función disponible en la versión completa")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors flex-shrink-0"
          style={{ fontWeight: 500 }}
        >
          <Upload size={15} />
          Subir Documento
        </button>
      </div>

      {/* Content */}
      <div className={`flex gap-5 ${selected ? "flex-col xl:flex-row" : ""}`}>
        {/* Document list */}
        <div className={selected ? "xl:flex-1" : "w-full"}>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200">
              <EmptyState
                icon={<FileText size={24} className="text-gray-400" />}
                title="Sin documentos"
                description="No se encontraron documentos con los filtros seleccionados."
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-5 py-3 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Documento</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Tipo</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide hidden md:table-cell" style={{ fontWeight: 600 }}>Vinculado a</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide hidden lg:table-cell" style={{ fontWeight: 600 }}>Fecha</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide hidden lg:table-cell" style={{ fontWeight: 600 }}>Vencimiento</th>
                      <th className="px-4 py-3 w-24"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((doc) => {
                      const asset = assets.find((a) => a.id === doc.assetId);
                      const provider = providers.find((p) => p.id === doc.providerId);
                      const isExpiringSoon = doc.expiresAt && (() => {
                        const exp = new Date(doc.expiresAt!);
                        const now = new Date();
                        const days = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                        return days <= 30;
                      })();
                      const isExpired = doc.expiresAt && new Date(doc.expiresAt) < new Date();

                      return (
                        <tr
                          key={doc.id}
                          onClick={() => setSelected(selected === doc.id ? null : doc.id)}
                          className={`cursor-pointer transition-colors ${
                            selected === doc.id ? "bg-blue-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                <FileText size={16} className="text-red-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{doc.name}</p>
                                <p className="text-xs text-gray-400">{doc.fileType} · {doc.fileSize}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <DocumentTypeBadge type={doc.type} />
                          </td>
                          <td className="px-4 py-3.5 hidden md:table-cell">
                            <p className="text-sm text-gray-600">{asset?.name || provider?.name || <span className="text-gray-300">General</span>}</p>
                          </td>
                          <td className="px-4 py-3.5 hidden lg:table-cell">
                            <p className="text-sm text-gray-600">{formatDate(doc.uploadedAt)}</p>
                          </td>
                          <td className="px-4 py-3.5 hidden lg:table-cell">
                            {doc.expiresAt ? (
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  isExpired ? "bg-red-100 text-red-600" : isExpiringSoon ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-600"
                                }`}
                                style={{ fontWeight: 500 }}
                              >
                                {isExpired ? "Vencido" : formatDate(doc.expiresAt)}
                              </span>
                            ) : (
                              <span className="text-gray-300 text-sm">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1">
                              <button className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                <Eye size={14} />
                              </button>
                              <button className="p-1.5 rounded text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors">
                                <Download size={14} />
                              </button>
                            </div>
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

        {/* Detail panel */}
        {selectedDoc && (
          <div className="xl:w-80 bg-white rounded-xl border border-gray-200 p-5 space-y-4 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <FileText size={22} className="text-red-600" />
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
            </div>

            <div>
              <h3 className="text-gray-900" style={{ fontWeight: 600, fontSize: "15px" }}>{selectedDoc.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{selectedDoc.description}</p>
            </div>

            <DocumentTypeBadge type={selectedDoc.type} />

            <div className="space-y-2.5 pt-2 border-t border-gray-100">
              {[
                { icon: <Tag size={13} />, label: "Formato", value: selectedDoc.fileType },
                { icon: <Download size={13} />, label: "Tamaño", value: selectedDoc.fileSize },
                { icon: <Calendar size={13} />, label: "Subido", value: formatDate(selectedDoc.uploadedAt) },
                selectedDoc.expiresAt ? { icon: <Calendar size={13} />, label: "Vence", value: formatDate(selectedDoc.expiresAt) } : null,
                { icon: <Tag size={13} />, label: "Subido por", value: selectedDoc.uploadedBy },
              ]
                .filter(Boolean)
                .map((item) => (
                  <div key={item!.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      {item!.icon}
                      {item!.label}
                    </div>
                    <span className="text-gray-700 text-xs">{item!.value}</span>
                  </div>
                ))}
            </div>

            {selectedDoc.tags.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-2">Etiquetas</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDoc.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 space-y-2">
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5 rounded-lg transition-colors" style={{ fontWeight: 500 }}>
                <Eye size={14} />
                Ver documento
              </button>
              <button className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm py-2.5 rounded-lg transition-colors">
                <Download size={14} />
                Descargar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
