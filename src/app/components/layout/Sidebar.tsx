import { NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  Package2,
  AlertTriangle,
  FileText,
  Users,
  BarChart3,
  Settings,
  Building2,
  ChevronRight,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
  { label: "Activos", path: "/activos", icon: <Package2 size={18} /> },
  { label: "Incidencias", path: "/incidencias", icon: <AlertTriangle size={18} /> },
  { label: "Documentos", path: "/documentos", icon: <FileText size={18} /> },
  { label: "Proveedores", path: "/proveedores", icon: <Users size={18} /> },
  { label: "Reportes", path: "/reportes", icon: <BarChart3 size={18} /> },
  { label: "Configuración", path: "/configuracion", icon: <Settings size={18} /> },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 w-64 flex flex-col
          bg-slate-900 text-white
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Building2 size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm text-white" style={{ fontWeight: 600, lineHeight: "1.2" }}>BuildTrack</p>
              <p className="text-slate-400" style={{ fontSize: "11px" }}>Gestión Técnica</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>

        {/* Building info */}
        <div className="mx-4 my-3 px-3 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700/40">
          <p className="text-slate-400" style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Edificio activo</p>
          <p className="text-white text-sm mt-0.5" style={{ fontWeight: 500 }}>Torres del Parque</p>
          <p className="text-slate-400" style={{ fontSize: "12px" }}>Av. Libertador 1450, CABA</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150
                      ${isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }
                    `}
                  >
                    <span className={isActive ? "text-white" : "text-slate-400"}>{item.icon}</span>
                    <span style={{ fontWeight: isActive ? 500 : 400 }}>{item.label}</span>
                    {isActive && <ChevronRight size={14} className="ml-auto text-blue-300" />}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm" style={{ fontWeight: 600 }}>
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate" style={{ fontWeight: 500 }}>Admin Edificio</p>
              <p className="text-slate-400 truncate" style={{ fontSize: "12px" }}>admin@torresdelparque.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
