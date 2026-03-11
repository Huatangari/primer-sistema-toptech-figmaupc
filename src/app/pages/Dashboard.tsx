// React is used via JSX
// Hooks removed: not used in this component
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
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { KpiCard } from "../components/shared/KpiCard";
import { AssetStatusBadge, IncidentPriorityBadge, IncidentStatusBadge } from "../components/shared/StatusBadge";
import { CategoryIcon } from "../components/shared/CategoryIcon";
import { ErrorState } from "../components/shared/ErrorState";
import { useData } from "../hooks/useData";
import { getAssets } from "../../lib/services/assets";
import { getIncidents } from "../../lib/services/incidents";
import { getCategoryColor, formatDate, timeAgo } from "../../lib/utils";
import { Asset, AssetCategory, Incident } from "../../lib/types";
import styles from "./Dashboard.module.css";

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

  const { data: { assets, incidents }, loading, error, refetch } = useData(
    () => Promise.all([getAssets(), getIncidents()])
      .then(([assets, incidents]) => ({ assets, incidents })),
    { assets: [] as Asset[], incidents: [] as Incident[] }
  );

  // KPI calculations
  const totalAssets = assets.length;
  const openIncidents = incidents.filter((i) => i.status === "Abierta" || i.status === "En Proceso").length;
  const closedIncidents = incidents.filter((i) => i.status === "Resuelta" || i.status === "Cerrada").length;
  const criticalIncidents = incidents.filter(
    (i) => i.priority === "Crítica" && i.status !== "Resuelta" && i.status !== "Cerrada"
  ).length;
  const assetsWithIssues = assets.filter((a) => a.status === "Falla" || a.status === "Vencido").length;
  const healthScore = totalAssets > 0 ? Math.round(((totalAssets - assetsWithIssues) / totalAssets) * 100) : 0;
  const todayLabel = new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const headerDateLabel = `${todayLabel.charAt(0).toUpperCase()}${todayLabel.slice(1)}`;

  // Category status
  const categoryStatus = CATEGORIES.map((cat) => {
    const catAssets = assets.filter((a) => a.category === cat);
    const operational = catAssets.filter((a) => a.status === "Operativo").length;
    const issues = catAssets.filter((a) => a.status === "Falla" || a.status === "Vencido").length;
    const maintenance = catAssets.filter((a) => a.status === "En Mantenimiento").length;
    return { category: cat, total: catAssets.length, operational, issues, maintenance };
  }).filter((c) => c.total > 0);

  // Recent incidents (last 5)
  const recentIncidents = [...incidents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Critical assets
  const criticalAssets = assets.filter(
    (a) => a.status === "Falla" || a.status === "Vencido" || a.status === "En Mantenimiento"
  ).slice(0, 4);

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className={styles.container}>
      {/* Welcome banner */}
      <div className={styles.headerCard}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-blue-300 text-sm mb-1">Panel de Control · {headerDateLabel}</p>
            <h2 className={styles.headerTitle}>
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
                  <p className={styles.headerIncidents}>{criticalIncidents} incidencia{criticalIncidents > 1 ? "s" : ""} crítica{criticalIncidents > 1 ? "s" : ""}</p>
                </div>
              </div>
            )}
            <button
              onClick={() => navigate("/incidencias")}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
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
                <h3 className={`text-gray-900 text-sm ${styles.categoryTitle}`}>Estado por Categoría</h3>
                <p className="text-gray-400 text-xs mt-0.5">Resumen operativo por tipo de activo</p>
              </div>
              <button type="button" onClick={() => navigate("/activos")} className="text-blue-600 text-xs flex items-center gap-1 hover:underline">
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
                        <p className={`text-sm text-gray-800 ${styles.categoryName}`}>
                          {cat.category}
                        </p>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{cat.total} activo{cat.total !== 1 ? "s" : ""}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <svg
                          className="flex-1"
                          height="6"
                          width="100%"
                          aria-hidden="true"
                        >
                          <rect width="100%" height="6" rx="3" className="fill-gray-100" />
                          <rect
                            width={`${healthPct}%`}
                            height="6"
                            rx="3"
                            className={
                              healthPct >= 80 ? "fill-emerald-500" : healthPct >= 50 ? "fill-amber-500" : "fill-red-500"
                            }
                          />
                        </svg>
                        <span className="text-xs text-gray-500 flex-shrink-0">{healthPct}%</span>
                        {cat.issues > 0 && (
                          <span className={`text-xs text-red-500 ${styles.issuesBadge}`}>
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
                <h3 className={`text-gray-900 text-sm ${styles.categoryTitle}`}>Incidencias Recientes</h3>
                <p className="text-gray-400 text-xs mt-0.5">Últimas incidencias registradas</p>
              </div>
              <button type="button" onClick={() => navigate("/incidencias")} className="text-blue-600 text-xs flex items-center gap-1 hover:underline">
                Ver todas <ArrowRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {recentIncidents.map((inc) => {
                const asset = assets.find((a) => a.id === inc.assetId);
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
                      <p className={`text-sm text-gray-800 mt-0.5 truncate ${styles.incidentTitle}`}>
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
                <h3 className={`text-gray-900 text-sm ${styles.categoryTitle}`}>Salud Técnica</h3>
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
                  <span className={`${styles.healthValue} ${healthScore >= 80 ? styles.healthGreen : healthScore >= 60 ? styles.healthYellow : styles.healthRed}`}>
                    {healthScore}%
                  </span>
                  <span className={`text-gray-400 ${styles.healthLabel}`}>Salud</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3 text-center">
              <div>
                <p className={`text-emerald-600 ${styles.statusValue}`}>
                  {assets.filter((a) => a.status === "Operativo").length}
                </p>
                <p className="text-gray-400 text-xs">Operativo</p>
              </div>
              <div>
                <p className={`text-amber-600 ${styles.statusValue}`}>
                  {assets.filter((a) => a.status === "En Mantenimiento").length}
                </p>
                <p className="text-gray-400 text-xs">Mantención</p>
              </div>
              <div>
                <p className={`text-red-600 ${styles.statusValue}`}>
                  {assetsWithIssues}
                </p>
                <p className="text-gray-400 text-xs">Con falla</p>
              </div>
            </div>
          </div>

          {/* Critical assets */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className={`text-gray-900 text-sm ${styles.categoryTitle}`}>Activos Prioritarios</h3>
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
                    <p className={`text-sm text-gray-800 truncate ${styles.assetName}`}>{asset.name}</p>
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
              <h3 className={`text-gray-900 text-sm ${styles.categoryTitle}`}>Próximos Mantenimientos</h3>
              <p className="text-gray-400 text-xs mt-0.5">En los próximos 60 días</p>
            </div>
            <div className="divide-y divide-gray-50">
              {assets
                .filter((a) => a.nextMaintenance)
                .sort((a, b) => new Date(a.nextMaintenance).getTime() - new Date(b.nextMaintenance).getTime())
                .slice(0, 4)
                .map((asset) => {
                  const next = new Date(asset.nextMaintenance);
                  const now = new Date();
                  const daysLeft = Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={asset.id} className="px-5 py-3 flex items-center gap-3">
                      <Clock size={14} className={daysLeft <= 14 ? "text-amber-500" : "text-gray-400"} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm text-gray-700 truncate ${styles.assetName}`}>{asset.name}</p>
                        <p className="text-xs text-gray-400">{formatDate(asset.nextMaintenance)}</p>
                      </div>
                      <span
                        className={`text-xs flex-shrink-0 px-2 py-0.5 rounded-full font-medium ${
                          daysLeft <= 7
                            ? "bg-red-100 text-red-600"
                            : daysLeft <= 30
                            ? "bg-amber-100 text-amber-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
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
          <h3 className={`text-gray-900 text-sm ${styles.categoryTitle}`}>Resumen General del Sistema</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categoryStatus.map((cat) => (
            <div key={cat.category} className="text-center">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1.5 ${getCategoryColor(cat.category)}`}>
                <CategoryIcon category={cat.category} size={14} />
              </div>
              <p className={`text-gray-900 text-sm ${styles.statusValue}`}>{cat.total}</p>
              <p className={`text-gray-400 ${styles.summaryLabel}`}>{cat.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
