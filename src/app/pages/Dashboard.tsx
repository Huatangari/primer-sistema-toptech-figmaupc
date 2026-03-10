import { useNavigate } from "react-router";
import {
  Package2,
  AlertTriangle,
  FileText,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldAlert,
  Clock,
} from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts";
import { KpiCard } from "../components/shared/KpiCard";
import { AssetStatusBadge, IncidentPriorityBadge, IncidentStatusBadge } from "../components/shared/StatusBadge";
import { CategoryIcon } from "../components/shared/CategoryIcon";
import { mockAssets, mockIncidents } from "../../lib/mock-data";
import { getCategoryColor, formatDate, timeAgo } from "../../lib/utils";
import { AssetCategory } from "../../lib/types";

const CATEGORIES: AssetCategory[] = [
  "Ascensores",
  "Extintores",
  "CCTV",
  "Sistema Eléctrico",
  "Bombas de Agua",
  "Alarmas CI",
  "Internet",
  "Áreas Comunes",
];

export function Dashboard() {
  const navigate = useNavigate();

  // KPI calculations
  const totalAssets = mockAssets.length;
  const openIncidents = mockIncidents.filter((i) => i.status === "Abierta" || i.status === "En Proceso").length;
  const closedIncidents = mockIncidents.filter((i) => i.status === "Resuelta" || i.status === "Cerrada").length;
  const criticalIncidents = mockIncidents.filter((i) => i.priority === "Crítica" && i.status !== "Cerrada").length;
  const assetsWithIssues = mockAssets.filter((a) => a.status === "Falla" || a.status === "Vencido").length;
  const healthScore = Math.round(((totalAssets - assetsWithIssues) / totalAssets) * 100);

  // Category status
  const categoryStatus = CATEGORIES.map((cat) => {
    const catAssets = mockAssets.filter((a) => a.category === cat);
    const operational = catAssets.filter((a) => a.status === "Operativo").length;
    const issues = catAssets.filter((a) => a.status === "Falla" || a.status === "Vencido").length;
    const maintenance = catAssets.filter((a) => a.status === "En Mantenimiento").length;
    return { category: cat, total: catAssets.length, operational, issues, maintenance };
  }).filter((c) => c.total > 0);

  // Recent incidents (last 5)
  const recentIncidents = [...mockIncidents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Critical assets
  const criticalAssets = mockAssets.filter(
    (a) => a.status === "Falla" || a.status === "Vencido" || a.status === "En Mantenimiento"
  ).slice(0, 4);

  // Health data for radial chart
  const healthData = [{ name: "Salud", value: healthScore, fill: healthScore >= 80 ? "#10b981" : healthScore >= 60 ? "#f59e0b" : "#ef4444" }];

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-blue-300 text-sm mb-1">Panel de Control · Martes 10 de Marzo, 2025</p>
            <h2 className="text-white mb-1" style={{ fontSize: "22px", fontWeight: 700 }}>
              Torres del Parque
            </h2>
            <p className="text-slate-400 text-sm">Av. Libertador 1450, CABA · 14 pisos · 87 unidades</p>
          </div>
          <div className="flex items-center gap-3">
            {criticalIncidents > 0 && (
              <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-2">
                <ShieldAlert size={16} className="text-red-400" />
                <div>
                  <p className="text-red-300 text-xs">Atención requerida</p>
                  <p className="text-white text-sm" style={{ fontWeight: 600 }}>{criticalIncidents} incidencia{criticalIncidents > 1 ? "s" : ""} crítica{criticalIncidents > 1 ? "s" : ""}</p>
                </div>
              </div>
            )}
            <button
              onClick={() => navigate("/incidencias")}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              style={{ fontWeight: 500 }}
            >
              Ver incidencias <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Activos"
          value={totalAssets}
          subtitle="8 categorías registradas"
          icon={<Package2 size={20} className="text-blue-600" />}
          iconBg="bg-blue-100"
          trend="neutral"
          trendLabel="Estable"
          onClick={() => navigate("/activos")}
        />
        <KpiCard
          title="Incidencias Abiertas"
          value={openIncidents}
          subtitle={`${criticalIncidents} crítica${criticalIncidents !== 1 ? "s" : ""}`}
          icon={<AlertTriangle size={20} className="text-red-600" />}
          iconBg="bg-red-100"
          trend={openIncidents > 3 ? "down" : "neutral"}
          trendLabel={openIncidents > 3 ? "Requiere atención" : "Normal"}
          onClick={() => navigate("/incidencias")}
        />
        <KpiCard
          title="Incidencias Cerradas"
          value={closedIncidents}
          subtitle="Último período"
          icon={<CheckCircle2 size={20} className="text-emerald-600" />}
          iconBg="bg-emerald-100"
          trend="up"
          trendLabel="Este mes"
          onClick={() => navigate("/incidencias")}
        />
        <KpiCard
          title="Documentos"
          value={12}
          subtitle="3 tipos de documento"
          icon={<FileText size={20} className="text-violet-600" />}
          iconBg="bg-violet-100"
          trend="neutral"
          trendLabel="Actualizado"
          onClick={() => navigate("/documentos")}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left col: Category status + Recent incidents */}
        <div className="xl:col-span-2 space-y-6">
          {/* Category health */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>Estado por Categoría</h3>
                <p className="text-gray-400 text-xs mt-0.5">Resumen operativo por tipo de activo</p>
              </div>
              <button onClick={() => navigate("/activos")} className="text-blue-600 text-xs flex items-center gap-1 hover:underline">
                Ver activos <ArrowRight size={12} />
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categoryStatus.map((cat) => {
                const healthPct = cat.total > 0 ? Math.round((cat.operational / cat.total) * 100) : 0;
                return (
                  <div
                    key={cat.category}
                    onClick={() => navigate(`/activos?categoria=${encodeURIComponent(cat.category)}`)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${getCategoryColor(cat.category)}`}>
                      <CategoryIcon category={cat.category} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-800" style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {cat.category}
                        </p>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{cat.total} activo{cat.total !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              healthPct >= 80 ? "bg-emerald-500" : healthPct >= 50 ? "bg-amber-500" : "bg-red-500"
                            }`}
                            style={{ width: `${healthPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0">{healthPct}%</span>
                        {cat.issues > 0 && (
                          <span className="text-xs text-red-500" style={{ fontWeight: 500 }}>
                            {cat.issues} falla{cat.issues > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent incidents */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>Incidencias Recientes</h3>
                <p className="text-gray-400 text-xs mt-0.5">Últimas incidencias registradas</p>
              </div>
              <button onClick={() => navigate("/incidencias")} className="text-blue-600 text-xs flex items-center gap-1 hover:underline">
                Ver todas <ArrowRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {recentIncidents.map((inc) => {
                const asset = mockAssets.find((a) => a.id === inc.assetId);
                return (
                  <div
                    key={inc.id}
                    onClick={() => navigate(`/incidencias/${inc.id}`)}
                    className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gray-400 text-xs">{inc.code}</span>
                        <IncidentPriorityBadge priority={inc.priority} />
                      </div>
                      <p className="text-sm text-gray-800 mt-0.5 truncate" style={{ fontWeight: 500 }}>
                        {inc.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {asset?.name} · {timeAgo(inc.createdAt)}
                      </p>
                    </div>
                    <IncidentStatusBadge status={inc.status} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right col: Health score + Critical assets + Alerts */}
        <div className="space-y-6">
          {/* Health score */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>Salud Técnica</h3>
                <p className="text-gray-400 text-xs">Estado general del edificio</p>
              </div>
              <Activity size={18} className="text-gray-400" />
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <ResponsiveContainer width={160} height={160}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    startAngle={90}
                    endAngle={-270}
                    data={[{ value: healthScore, fill: healthScore >= 80 ? "#10b981" : healthScore >= 60 ? "#f59e0b" : "#ef4444" }]}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={8}
                      background={{ fill: "#f3f4f6" }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span style={{ fontSize: "28px", fontWeight: 700, color: healthScore >= 80 ? "#10b981" : healthScore >= 60 ? "#f59e0b" : "#ef4444" }}>
                    {healthScore}%
                  </span>
                  <span className="text-gray-400" style={{ fontSize: "11px" }}>Salud</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3 text-center">
              <div>
                <p className="text-emerald-600" style={{ fontSize: "18px", fontWeight: 700 }}>
                  {mockAssets.filter((a) => a.status === "Operativo").length}
                </p>
                <p className="text-gray-400 text-xs">Operativo</p>
              </div>
              <div>
                <p className="text-amber-600" style={{ fontSize: "18px", fontWeight: 700 }}>
                  {mockAssets.filter((a) => a.status === "En Mantenimiento").length}
                </p>
                <p className="text-gray-400 text-xs">Mantención</p>
              </div>
              <div>
                <p className="text-red-600" style={{ fontSize: "18px", fontWeight: 700 }}>
                  {assetsWithIssues}
                </p>
                <p className="text-gray-400 text-xs">Con falla</p>
              </div>
            </div>
          </div>

          {/* Critical assets */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>Activos Prioritarios</h3>
              <p className="text-gray-400 text-xs mt-0.5">Requieren atención inmediata</p>
            </div>
            <div className="divide-y divide-gray-50">
              {criticalAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => navigate(`/activos/${asset.id}`)}
                  className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getCategoryColor(asset.category)}`}>
                    <CategoryIcon category={asset.category} size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate" style={{ fontWeight: 500 }}>{asset.name}</p>
                    <p className="text-xs text-gray-400 truncate">{asset.location}</p>
                  </div>
                  <AssetStatusBadge status={asset.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming maintenance */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>Próximos Mantenimientos</h3>
              <p className="text-gray-400 text-xs mt-0.5">En los próximos 60 días</p>
            </div>
            <div className="divide-y divide-gray-50">
              {mockAssets
                .filter((a) => a.nextMaintenance)
                .sort((a, b) => new Date(a.nextMaintenance).getTime() - new Date(b.nextMaintenance).getTime())
                .slice(0, 4)
                .map((asset) => {
                  const next = new Date(asset.nextMaintenance);
                  const now = new Date("2025-03-10");
                  const daysLeft = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={asset.id} className="px-5 py-3 flex items-center gap-3">
                      <Clock size={14} className={daysLeft <= 14 ? "text-amber-500" : "text-gray-400"} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate" style={{ fontWeight: 500 }}>{asset.name}</p>
                        <p className="text-xs text-gray-400">{formatDate(asset.nextMaintenance)}</p>
                      </div>
                      <span
                        className={`text-xs flex-shrink-0 px-2 py-0.5 rounded-full ${
                          daysLeft <= 7
                            ? "bg-red-100 text-red-600"
                            : daysLeft <= 30
                            ? "bg-amber-100 text-amber-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                        style={{ fontWeight: 500 }}
                      >
                        {daysLeft <= 0 ? "Vencido" : `${daysLeft}d`}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-blue-600" />
          <h3 className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>Resumen General del Sistema</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categoryStatus.map((cat) => (
            <div key={cat.category} className="text-center">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1.5 ${getCategoryColor(cat.category)}`}>
                <CategoryIcon category={cat.category} size={14} />
              </div>
              <p className="text-gray-900 text-sm" style={{ fontWeight: 700 }}>{cat.total}</p>
              <p className="text-gray-400" style={{ fontSize: "11px", lineHeight: "1.3" }}>{cat.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
