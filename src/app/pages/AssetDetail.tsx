import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Wrench,
  Tag,
  Info,
  Clock,
  FileText,
  AlertTriangle,
  Package2,
} from "lucide-react";
import { AssetStatusBadge, DocumentTypeBadge, IncidentPriorityBadge, IncidentStatusBadge } from "../components/shared/StatusBadge";
import { CategoryIcon } from "../components/shared/CategoryIcon";
import { Timeline } from "../components/shared/Timeline";
import { EmptyState } from "../components/shared/EmptyState";
import { getAssetById, getAssetHistory, getAssetsByProviderId } from "../../lib/services/assets";
import { getIncidentsByAssetId } from "../../lib/services/incidents";
import { getDocumentsByAssetId } from "../../lib/services/documents";
import { getCategoryColor, formatDate, timeAgo } from "../../lib/utils";
import { Asset, AssetHistoryEvent, Document, Incident } from "../../lib/types";

type Tab = "resumen" | "historial" | "documentos" | "incidencias";

export function AssetDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("resumen");
  const [asset, setAsset] = useState<Asset | undefined>();
  const [assetHistory, setAssetHistory] = useState<AssetHistoryEvent[]>([]);
  const [assetIncidents, setAssetIncidents] = useState<Incident[]>([]);
  const [assetDocuments, setAssetDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getAssetById(id),
      getAssetHistory(id),
      getIncidentsByAssetId(id),
      getDocumentsByAssetId(id),
    ]).then(([a, history, incidents, documents]) => {
      setAsset(a);
      setAssetHistory(history);
      setAssetIncidents(incidents);
      setAssetDocuments(documents);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<Package2 size={24} className="text-gray-400" />}
          title="Activo no encontrado"
          description="El activo solicitado no existe o fue eliminado."
          action={
            <button onClick={() => navigate("/activos")} className="text-blue-600 text-sm">
              Volver a activos
            </button>
          }
        />
      </div>
    );
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "resumen", label: "Resumen" },
    { key: "historial", label: "Historial", count: assetHistory.length },
    { key: "documentos", label: "Documentos", count: assetDocuments.length },
    { key: "incidencias", label: "Incidencias", count: assetIncidents.length },
  ];

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-5">
      {/* Back + Header */}
      <div>
        <button
          onClick={() => navigate("/activos")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft size={15} />
          Volver a Activos
        </button>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start gap-4 flex-wrap">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${getCategoryColor(asset.category)}`}>
              <CategoryIcon category={asset.category} size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(asset.category)}`} style={{ fontWeight: 500 }}>
                  {asset.category}
                </span>
                <span className="text-gray-400 text-sm">{asset.code}</span>
              </div>
              <h2 className="text-gray-900 mb-1" style={{ fontSize: "20px", fontWeight: 700 }}>
                {asset.name}
              </h2>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <MapPin size={13} />
                <span>{asset.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AssetStatusBadge status={asset.status} />
              <button
                onClick={() => navigate("/incidencias/nueva")}
                className="flex items-center gap-2 text-sm bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
                style={{ fontWeight: 500 }}
              >
                <AlertTriangle size={14} />
                Registrar Incidencia
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Instalación</p>
                <p className="text-sm text-gray-700" style={{ fontWeight: 500 }}>{formatDate(asset.installationDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wrench size={14} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Último Mtto.</p>
                <p className="text-sm text-gray-700" style={{ fontWeight: 500 }}>{formatDate(asset.lastMaintenance)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Próximo Mtto.</p>
                <p className="text-sm text-gray-700" style={{ fontWeight: 500 }}>{formatDate(asset.nextMaintenance)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Incidencias</p>
                <p className="text-sm text-gray-700" style={{ fontWeight: 500 }}>{assetIncidents.length} registradas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm flex-shrink-0 border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              style={{ fontWeight: activeTab === tab.key ? 600 : 400 }}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {/* RESUMEN */}
          {activeTab === "resumen" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-gray-900" style={{ fontWeight: 600 }}>Información General</h4>
                <div className="space-y-3">
                  {[
                    { label: "Nombre completo", value: asset.name, icon: <Tag size={14} /> },
                    { label: "Código de activo", value: asset.code, icon: <Tag size={14} /> },
                    { label: "Categoría", value: asset.category, icon: <Tag size={14} /> },
                    { label: "Ubicación", value: asset.location, icon: <MapPin size={14} /> },
                    asset.brand ? { label: "Marca", value: asset.brand, icon: <Info size={14} /> } : null,
                    asset.model ? { label: "Modelo", value: asset.model, icon: <Info size={14} /> } : null,
                    asset.serialNumber ? { label: "N° de Serie", value: asset.serialNumber, icon: <Info size={14} /> } : null,
                  ]
                    .filter(Boolean)
                    .map((item) => (
                      <div key={item!.label} className="flex items-start gap-3">
                        <span className="text-gray-400 flex-shrink-0 mt-0.5">{item!.icon}</span>
                        <div>
                          <p className="text-xs text-gray-400">{item!.label}</p>
                          <p className="text-sm text-gray-800">{item!.value}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-gray-900" style={{ fontWeight: 600 }}>Descripción y Notas</h4>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Descripción técnica</p>
                  <p className="text-sm text-gray-700">{asset.description}</p>
                </div>
                <div className={`p-4 rounded-lg border ${
                  asset.status === "Falla" || asset.status === "Vencido"
                    ? "bg-red-50 border-red-100"
                    : asset.status === "En Mantenimiento"
                    ? "bg-amber-50 border-amber-100"
                    : "bg-emerald-50 border-emerald-100"
                }`}>
                  <p className="text-xs text-gray-400 mb-1">Observaciones actuales</p>
                  <p className="text-sm text-gray-700">{asset.observations}</p>
                </div>
              </div>
            </div>
          )}

          {/* HISTORIAL */}
          {activeTab === "historial" && (
            <div>
              {assetHistory.length === 0 ? (
                <EmptyState
                  title="Sin historial"
                  description="No hay eventos registrados para este activo."
                />
              ) : (
                <Timeline events={assetHistory} dateFormat="date" />
              )}
            </div>
          )}

          {/* DOCUMENTOS */}
          {activeTab === "documentos" && (
            <div>
              {assetDocuments.length === 0 ? (
                <EmptyState
                  icon={<FileText size={24} className="text-gray-400" />}
                  title="Sin documentos"
                  description="No hay documentos vinculados a este activo."
                  action={
                    <button
                      onClick={() => navigate("/documentos")}
                      className="text-sm text-blue-600"
                    >
                      Ir a Documentos
                    </button>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {assetDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                        <FileText size={18} className="text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{doc.name}</p>
                        <p className="text-xs text-gray-400">{doc.fileType} · {doc.fileSize} · Subido {formatDate(doc.uploadedAt)}</p>
                      </div>
                      <DocumentTypeBadge type={doc.type} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* INCIDENCIAS */}
          {activeTab === "incidencias" && (
            <div>
              {assetIncidents.length === 0 ? (
                <EmptyState
                  icon={<AlertTriangle size={24} className="text-gray-400" />}
                  title="Sin incidencias"
                  description="No hay incidencias registradas para este activo."
                />
              ) : (
                <div className="space-y-3">
                  {assetIncidents.map((inc) => (
                    <div
                      key={inc.id}
                      onClick={() => navigate(`/incidencias/${inc.id}`)}
                      className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-400">{inc.code}</span>
                          <IncidentPriorityBadge priority={inc.priority} />
                        </div>
                        <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{inc.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(inc.createdAt)}</p>
                      </div>
                      <IncidentStatusBadge status={inc.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
