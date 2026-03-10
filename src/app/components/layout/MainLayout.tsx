import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  "/": { title: "Dashboard", subtitle: "Torres del Parque – Resumen técnico" },
  "/activos": { title: "Activos", subtitle: "Gestión de activos del edificio" },
  "/incidencias": { title: "Incidencias", subtitle: "Registro y seguimiento de fallas" },
  "/incidencias/nueva": { title: "Registrar Incidencia", subtitle: "Nueva incidencia" },
  "/documentos": { title: "Documentos", subtitle: "Repositorio documental técnico" },
  "/proveedores": { title: "Proveedores", subtitle: "Directorio de proveedores y servicios" },
  "/reportes": { title: "Reportes", subtitle: "Reportes e informes ejecutivos" },
  "/configuracion": { title: "Configuración", subtitle: "Configuración del sistema" },
};

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine page title
  let pageInfo = pageTitles[location.pathname];
  if (!pageInfo) {
    if (location.pathname.startsWith("/activos/")) {
      pageInfo = { title: "Detalle de Activo", subtitle: "Información detallada del activo" };
    } else if (location.pathname.startsWith("/incidencias/")) {
      pageInfo = { title: "Detalle de Incidencia", subtitle: "Seguimiento de la incidencia" };
    } else {
      pageInfo = { title: "BuildTrack", subtitle: "" };
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
