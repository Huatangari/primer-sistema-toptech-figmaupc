import { Menu, Bell, Search, ChevronDown } from "lucide-react";
import { useState } from "react";

interface TopbarProps {
  onMenuToggle: () => void;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Topbar({ onMenuToggle, title, subtitle, actions }: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 z-30 sticky top-0">
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-gray-900" style={{ fontSize: "17px", fontWeight: 600, lineHeight: "1.3" }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-500" style={{ fontSize: "12px", lineHeight: "1.2" }}>{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right: Search + Actions + Notifications + User */}
      <div className="flex items-center gap-2">
        {/* Search - hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-48">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Custom actions */}
        {actions && <div className="flex items-center gap-2">{actions}</div>}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm" style={{ fontWeight: 600 }}>Notificaciones</p>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { title: "Extintores vencidos – Sótano", time: "Hace 2 días", type: "critical" },
                  { title: "Cámaras CCTV sin señal – Parking", time: "Hace 5 días", type: "warning" },
                  { title: "Certificado ascensor próximo a vencer", time: "Hace 1 semana", type: "info" },
                ].map((n, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        n.type === "critical" ? "bg-red-500" : n.type === "warning" ? "bg-amber-500" : "bg-blue-500"
                      }`} />
                      <div>
                        <p className="text-sm text-gray-800">{n.title}</p>
                        <p className="text-gray-400" style={{ fontSize: "12px" }}>{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-gray-100">
                <button className="text-blue-600 text-sm w-full text-center">Ver todas</button>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <button className="hidden md:flex items-center gap-2 pl-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm" style={{ fontWeight: 600 }}>
            A
          </div>
          <span className="text-sm text-gray-700" style={{ fontWeight: 500 }}>Admin</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}
