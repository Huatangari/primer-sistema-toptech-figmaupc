import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Camera, MessageSquare, CheckCircle, AlertTriangle, User, Calendar } from "lucide-react";
import { IncidentPriorityBadge, IncidentStatusBadge, AssetStatusBadge } from "../components/shared/StatusBadge";
import { CategoryIcon } from "../components/shared/CategoryIcon";
import { Timeline } from "../components/shared/Timeline";
import { EmptyState } from "../components/shared/EmptyState";
import { ErrorState } from "../components/shared/ErrorState";
import { useData } from "../hooks/useData";
import { getIncidentById, getIncidentEvents } from "../../lib/services/incidents";
import { getAssetById } from "../../lib/services/assets";
import { getCategoryColor, formatDate, formatDateTime } from "../../lib/utils";
import { Asset, Incident, IncidentEvent } from "../../lib/types";

export function IncidentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const { data: { incident, asset, events }, loading, error, refetch } = useData(
    async () => {
      const incident = await getIncidentById(id!);
      if (!incident) return { incident: undefined, asset: undefined, events: [] as IncidentEvent[] };
      const [asset, events] = await Promise.all([getAssetById(incident.assetId), getIncidentEvents(id!)]);
      return { incident, asset, events };
    },
    { incident: undefined as Incident | undefined, asset: undefined as Asset | undefined, events: [] as IncidentEvent[] },
    id
  );

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  if (!incident) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<AlertTriangle size={24} aria-hidden="true" />}
          title="Incidencia no encontrada"
          action={
            <button type="button" onClick={() => navigate("/incidencias")} className="text-blue-600 text-sm">
              Volver a incidencias
            </button>
          }
        />
      </div>
    );
  }

  const isOpen = incident.status === "Abierta" || incident.status === "En Proceso";

  // Severity color
  const headerColor =
    incident.priority === "Crítica"
      ? "from-red-950 to-red-900"
      : incident.priority === "Alta"
      ? "from-orange-950 to-orange-900"
      : "from-slate-900 to-slate-800";

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate("/incidencias")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={15} />
        Volver a Incidencias
      </button>

      {/* Header */}
      <div className={`bg-gradient-to-r ${headerColor} text-white rounded-xl p-6`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-white/50 text-sm">{incident.code}</span>
              <IncidentPriorityBadge priority={incident.priority} />
              <IncidentStatusBadge status={incident.status} />
            </div>
            <h2 className="text-white mb-2 text-xl font-bold">
              {incident.title}
            </h2>
            <div className="flex items-center gap-4 text-white/60 text-sm flex-wrap">
              <div className="flex items-center gap-1.5">
                <User size={13} />
                <span>Reportado por: {incident.reportedBy}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} />
                <span>{formatDateTime(incident.createdAt)}</span>
              </div>
            </div>
          </div>
          {isOpen && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCloseConfirm(true)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <CheckCircle size={15} />
                Marcar como Resuelta
              </button>
            </div>
          )}
          {incident.status === "Resuelta" && (
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-4 py-2">
              <CheckCircle size={16} className="text-emerald-400" />
              <div>
                <p className="text-emerald-300 text-xs">Resuelta el</p>
                <p className="text-white text-sm font-semibold">{formatDate(incident.resolvedAt || "")}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close confirm modal */}
      {showCloseConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={24} className="text-emerald-600" />
            </div>
            <h3 className="text-center text-gray-900 mb-2 font-bold">
              ¿Marcar como resuelta?
            </h3>
            <p className="text-center text-gray-500 text-sm mb-5">
              Esta acción registrará la incidencia como resuelta en el historial.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCloseConfirm(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => { setShowCloseConfirm(false); navigate("/incidencias"); }}
                className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="xl:col-span-2 space-y-5">
          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-gray-900 mb-3 font-semibold">Descripción del caso</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{incident.description}</p>
            {incident.observations && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-xs text-amber-600 mb-1 font-semibold">Observaciones</p>
                <p className="text-sm text-gray-700">{incident.observations}</p>
              </div>
            )}
          </div>

          {/* Evidence placeholder */}
          {incident.hasEvidence && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-gray-900 mb-3 font-semibold">Evidencia fotográfica</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[1, 2].map((n) => (
                  <div
                    key={n}
                    className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center border border-gray-200 hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    <Camera size={20} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-400">Foto {n}</span>
                  </div>
                ))}
                <div className="aspect-video bg-blue-50 rounded-lg flex flex-col items-center justify-center border border-dashed border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
                  <span className="text-xs text-blue-500 font-medium">+ Agregar</span>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-gray-900 mb-4 font-semibold">Timeline del caso</h3>
            {events.length === 0 ? (
              <p className="text-sm text-gray-400">Sin eventos registrados</p>
            ) : (
              <Timeline
                events={events.map((e) => ({
                  id: e.id,
                  date: e.date,
                  type: e.type,
                  title: e.type,
                  description: e.description,
                  author: e.author,
                }))}
                dateFormat="datetime"
              />
            )}
          </div>

          {/* Add comment */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-gray-900 mb-3 font-semibold">Agregar comentario</h3>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe una actualización del estado o acción tomada..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-white focus:border-blue-400 text-gray-700 resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={() => setComment("")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                disabled={!comment.trim()}
              >
                <MessageSquare size={14} />
                Agregar
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Incident details */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-gray-900 mb-4 font-semibold">Detalles</h3>
            <div className="space-y-3">
              {[
                { label: "Código", value: incident.code },
                { label: "Estado", value: <IncidentStatusBadge status={incident.status} /> },
                { label: "Prioridad", value: <IncidentPriorityBadge priority={incident.priority} /> },
                { label: "Reportado por", value: incident.reportedBy },
                { label: "Asignado a", value: incident.assignedTo || <span className="text-gray-300">Sin asignar</span> },
                { label: "Creado", value: formatDate(incident.createdAt) },
                { label: "Actualizado", value: formatDate(incident.updatedAt) },
                incident.resolvedAt ? { label: "Resuelto", value: formatDate(incident.resolvedAt) } : null,
              ]
                .filter(Boolean)
                .map((item) => (
                  <div key={item!.label} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{item!.label}</span>
                    <span className="text-sm text-gray-700">{item!.value}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Related asset */}
          {asset && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-gray-900 mb-3 font-semibold">Activo Relacionado</h3>
              <div
                onClick={() => navigate(`/activos/${asset.id}`)}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getCategoryColor(asset.category)}`}>
                  <CategoryIcon category={asset.category} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate font-medium">{asset.name}</p>
                  <p className="text-xs text-gray-400">{asset.code} · {asset.location}</p>
                </div>
                <AssetStatusBadge status={asset.status} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
