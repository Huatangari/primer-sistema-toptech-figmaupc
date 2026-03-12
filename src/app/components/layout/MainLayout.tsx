import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  "/": { title: "Dashboard", subtitle: "Torres del Parque - Resumen tecnico" },
  "/activos": { title: "Activos", subtitle: "Gestion de activos del edificio" },
  "/activos/nuevo": { title: "Nuevo Activo", subtitle: "Registro de activo tecnico" },
  "/incidencias": { title: "Incidencias", subtitle: "Registro y seguimiento de fallas" },
  "/incidencias/nueva": { title: "Registrar Incidencia", subtitle: "Nueva incidencia" },
  "/documentos": { title: "Documentos", subtitle: "Repositorio documental tecnico" },
  "/documentos/nuevo": { title: "Nuevo Documento", subtitle: "Registro de metadatos documentales" },
  "/proveedores": { title: "Proveedores", subtitle: "Directorio de proveedores y servicios" },
  "/proveedores/nuevo": { title: "Nuevo Proveedor", subtitle: "Registro de ficha comercial" },
  "/reportes": { title: "Reportes", subtitle: "Reportes e informes ejecutivos" },
  "/configuracion": { title: "Configuracion", subtitle: "Configuracion del sistema" },
};

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  let pageInfo = pageTitles[location.pathname];
  if (!pageInfo) {
    if (location.pathname.startsWith("/activos/")) {
      pageInfo = { title: "Detalle de Activo", subtitle: "Informacion detallada del activo" };
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

