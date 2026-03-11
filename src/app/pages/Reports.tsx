import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { FileText, Download, BarChart3, PieChartIcon, TrendingUp, Package2, AlertTriangle, CheckCircle } from "lucide-react";
import { ErrorState } from "../components/shared/ErrorState";
import { useData } from "../hooks/useData";
import { getAssets } from "../../lib/services/assets";
import { getIncidents } from "../../lib/services/incidents";
import { getDocuments } from "../../lib/services/documents";
import { Asset, AssetCategory, Document, Incident } from "../../lib/types";

const CATEGORIES: AssetCategory[] = [
  "Ascensores", "Extintores", "CCTV", "Sistema Eléctrico",
  "Bombas de Agua", "Alarmas CI", "Internet", "Áreas Comunes",
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#84cc16"];

export function Reports() {
  const { data: { assets, incidents, documents }, loading, error, refetch } = useData(
    () => Promise.all([getAssets(), getIncidents(), getDocuments()])
      .then(([assets, incidents, documents]) => ({ assets, incidents, documents })),
    { assets: [] as Asset[], incidents: [] as Incident[], documents: [] as Document[] }
  );

  // Asset by category
  const assetsByCategory = useMemo(() => CATEGORIES.map((cat) => ({
    name: cat.length > 10 ? cat.substring(0, 10) + "…" : cat,
    fullName: cat,
    total: assets.filter((a) => a.category === cat).length,
    operativo: assets.filter((a) => a.category === cat && a.status === "Operativo").length,
    falla: assets.filter((a) => a.category === cat && (a.status === "Falla" || a.status === "Vencido")).length,
  })).filter((c) => c.total > 0), [assets]);

  // Asset status distribution
  const assetStatusData = useMemo(() => [
    { name: "Operativo", value: assets.filter((a) => a.status === "Operativo").length, color: "#10b981" },
    { name: "En Mantención", value: assets.filter((a) => a.status === "En Mantenimiento").length, color: "#f59e0b" },
    { name: "Falla", value: assets.filter((a) => a.status === "Falla").length, color: "#ef4444" },
    { name: "Vencido", value: assets.filter((a) => a.status === "Vencido").length, color: "#dc2626" },
  ].filter((d) => d.value > 0), [assets]);

  // Incidents by priority
  const incidentsByPriority = useMemo(() => [
    { name: "Crítica", value: incidents.filter((i) => i.priority === "Crítica").length, color: "#ef4444" },
    { name: "Alta", value: incidents.filter((i) => i.priority === "Alta").length, color: "#f97316" },
    { name: "Media", value: incidents.filter((i) => i.priority === "Media").length, color: "#f59e0b" },
    { name: "Baja", value: incidents.filter((i) => i.priority === "Baja").length, color: "#3b82f6" },
  ], [incidents]);

  // Incidents by month (simulated)
  const incidentsByMonth = [
    { mes: "Oct", incidencias: 2, resueltas: 2 },
    { mes: "Nov", incidencias: 3, resueltas: 2 },
    { mes: "Dic", incidencias: 1, resueltas: 1 },
    { mes: "Ene", incidencias: 4, resueltas: 3 },
    { mes: "Feb", incidencias: 3, resueltas: 2 },
    { mes: "Mar", incidencias: 5, resueltas: 1 },
  ];

  // Documents by type
  const docsByType = useMemo(() => [
    { name: "Manual", value: documents.filter((d) => d.type === "Manual").length },
    { name: "Certificado", value: documents.filter((d) => d.type === "Certificado").length },
    { name: "Contrato", value: documents.filter((d) => d.type === "Contrato").length },
    { name: "Informe", value: documents.filter((d) => d.type === "Informe Técnico").length },
    { name: "Plano", value: documents.filter((d) => d.type === "Plano").length },
  ], [documents]);

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const reportTypes = [
    { icon: <Package2 size={20} className="text-blue-600" />, iconBg: "bg-blue-100", title: "Activos Registrados", desc: "Inventario completo por categoría y estado", badge: "PDF · Excel" },
    { icon: <AlertTriangle size={20} className="text-red-600" />, iconBg: "bg-red-100", title: "Historial de Incidencias", desc: "Registro cronológico con estado y resolución", badge: "PDF · Excel" },
    { icon: <FileText size={20} className="text-violet-600" />, iconBg: "bg-violet-100", title: "Documentos por Categoría", desc: "Inventario documental con vencimientos", badge: "PDF" },
    { icon: <TrendingUp size={20} className="text-emerald-600" />, iconBg: "bg-emerald-100", title: "Resumen Ejecutivo", desc: "Estado técnico general del edificio", badge: "PDF" },
    { icon: <BarChart3 size={20} className="text-amber-600" />, iconBg: "bg-amber-100", title: "Análisis de Mantenimientos", desc: "Frecuencia y costo estimado por categoría", badge: "PDF · Excel" },
    { icon: <CheckCircle size={20} className="text-cyan-600" />, iconBg: "bg-cyan-100", title: "KPIs de Gestión", desc: "Métricas de desempeño operativo", badge: "PDF" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">
      {/* Report types */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "16px" }}>Tipos de Reportes Disponibles</h3>
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full" style={{ fontWeight: 500 }}>
            Exportación disponible en versión completa
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((r) => (
            <div
              key={r.title}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${r.iconBg} flex items-center justify-center`}>
                  {r.icon}
                </div>
                <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">{r.badge}</span>
              </div>
              <h4 className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>{r.title}</h4>
              <p className="text-gray-500 text-sm">{r.desc}</p>
              <button className="mt-3 flex items-center gap-1.5 text-blue-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontWeight: 500 }}>
                <Download size={12} />
                Generar reporte
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Assets by category */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>Activos por Categoría</h3>
          <p className="text-gray-400 text-sm mb-4">Distribución y estado operativo</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={assetsByCategory} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip
                formatter={(value, name) => [value, name === "operativo" ? "Operativo" : "Con falla"]}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
              />
              <Bar dataKey="operativo" fill="#10b981" radius={[4, 4, 0, 0]} name="Operativo" />
              <Bar dataKey="falla" fill="#ef4444" radius={[4, 4, 0, 0]} name="Con falla" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Incidents by month */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>Incidencias por Mes</h3>
          <p className="text-gray-400 text-sm mb-4">Registradas vs. resueltas (últimos 6 meses)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={incidentsByMonth} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
              <Line type="monotone" dataKey="incidencias" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Registradas" />
              <Line type="monotone" dataKey="resueltas" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Resueltas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Asset status pie */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>Estado de Activos</h3>
          <p className="text-gray-400 text-sm mb-4">Distribución por estado operativo</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={assetStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {assetStatusData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {assetStatusData.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-sm text-gray-600">{d.name}</span>
                  </div>
                  <span className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Documents by type */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-gray-900 mb-1" style={{ fontWeight: 600 }}>Documentos por Tipo</h3>
          <p className="text-gray-400 text-sm mb-4">Repositorio documental clasificado</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={docsByType} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Documentos">
                {docsByType.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Incidents by priority */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-gray-900 mb-4" style={{ fontWeight: 600 }}>Resumen de Incidencias por Prioridad</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {incidentsByPriority.map((p) => (
            <div key={p.name} className="text-center p-4 rounded-xl border border-gray-100 bg-gray-50">
              <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: p.color + "20" }}>
                <AlertTriangle size={18} style={{ color: p.color }} />
              </div>
              <p className="text-gray-900" style={{ fontSize: "26px", fontWeight: 700 }}>{p.value}</p>
              <p className="text-sm" style={{ color: p.color, fontWeight: 600 }}>{p.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
