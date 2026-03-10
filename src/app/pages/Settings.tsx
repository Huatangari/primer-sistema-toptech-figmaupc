import { useState } from "react";
import { Building2, Bell, Shield, Users, Palette, Database, Save, Check } from "lucide-react";

type Section = "edificio" | "notificaciones" | "usuarios" | "apariencia" | "datos";

const sections = [
  { key: "edificio" as Section, label: "Datos del Edificio", icon: <Building2 size={16} /> },
  { key: "notificaciones" as Section, label: "Notificaciones", icon: <Bell size={16} /> },
  { key: "usuarios" as Section, label: "Usuarios y Roles", icon: <Users size={16} /> },
  { key: "apariencia" as Section, label: "Apariencia", icon: <Palette size={16} /> },
  { key: "datos" as Section, label: "Datos y Exportación", icon: <Database size={16} /> },
];

function SaveButton({ onClick }: { onClick: () => void }) {
  const [saved, setSaved] = useState(false);

  const handleClick = () => {
    onClick();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
        saved ? "bg-emerald-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
      style={{ fontWeight: 600 }}
    >
      {saved ? <Check size={15} /> : <Save size={15} />}
      {saved ? "Guardado" : "Guardar cambios"}
    </button>
  );
}

export function Settings() {
  const [activeSection, setActiveSection] = useState<Section>("edificio");

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex gap-6 flex-col md:flex-row">
        {/* Sidebar nav */}
        <div className="md:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm border-b border-gray-50 last:border-0 transition-colors ${
                  activeSection === s.key
                    ? "bg-blue-50 text-blue-700 border-l-2 border-l-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                style={{ fontWeight: activeSection === s.key ? 600 : 400 }}
              >
                <span className={activeSection === s.key ? "text-blue-600" : "text-gray-400"}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5">
          {/* Building data */}
          {activeSection === "edificio" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "16px" }}>Datos del Edificio</h3>
                  <p className="text-gray-500 text-sm mt-0.5">Información general del edificio gestionado</p>
                </div>
                <SaveButton onClick={() => {}} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: "Nombre del edificio", value: "Torres del Parque", type: "text" },
                  { label: "Dirección", value: "Av. Libertador 1450", type: "text" },
                  { label: "Ciudad", value: "Buenos Aires", type: "text" },
                  { label: "País", value: "Argentina", type: "text" },
                  { label: "Total de pisos", value: "14", type: "number" },
                  { label: "Total de unidades", value: "87", type: "number" },
                  { label: "Año de construcción", value: "2017", type: "number" },
                  { label: "Administrador responsable", value: "Admin Edificio", type: "text" },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-100 text-gray-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === "notificaciones" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "16px" }}>Configuración de Notificaciones</h3>
                  <p className="text-gray-500 text-sm mt-0.5">Gestiona qué alertas recibir y por qué canal</p>
                </div>
                <SaveButton onClick={() => {}} />
              </div>

              <div className="space-y-4">
                {[
                  { label: "Incidencias críticas", desc: "Alerta inmediata cuando se registra una incidencia de prioridad crítica", enabled: true },
                  { label: "Vencimiento de certificados", desc: "Aviso 30 días antes del vencimiento de certificados", enabled: true },
                  { label: "Próximos mantenimientos", desc: "Recordatorio 7 días antes del mantenimiento programado", enabled: true },
                  { label: "Incidencias sin asignar", desc: "Alerta si una incidencia lleva más de 24hs sin asignar", enabled: false },
                  { label: "Resumen semanal", desc: "Email con resumen técnico del edificio cada lunes", enabled: false },
                  { label: "Nuevos documentos", desc: "Notificación cuando se sube un nuevo documento al repositorio", enabled: false },
                ].map((notif) => (
                  <div key={notif.label} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{notif.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{notif.desc}</p>
                    </div>
                    <Toggle defaultEnabled={notif.enabled} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users */}
          {activeSection === "usuarios" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "16px" }}>Usuarios y Roles</h3>
                  <p className="text-gray-500 text-sm mt-0.5">Gestiona el acceso al sistema</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg" style={{ fontWeight: 500 }}>
                  <Users size={14} />
                  Invitar usuario
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Admin Edificio", email: "admin@torresdelparque.com", role: "Administrador", status: "Activo" },
                  { name: "Juan Encargado", email: "j.encargado@torresdelparque.com", role: "Operativo", status: "Activo" },
                  { name: "María García", email: "m.garcia@torresdelparque.com", role: "Solo lectura", status: "Activo" },
                  { name: "Carlos Presidente", email: "c.presidente@consorcio.com", role: "Solo lectura", status: "Pendiente" },
                ].map((user) => (
                  <div key={user.email} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm" style={{ fontWeight: 600 }}>{user.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      user.role === "Administrador" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                    }`} style={{ fontWeight: 500 }}>
                      {user.role}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full hidden sm:inline ${
                      user.status === "Activo" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`} style={{ fontWeight: 500 }}>
                      {user.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeSection === "apariencia" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-gray-900" style={{ fontWeight: 700, fontSize: "16px" }}>Apariencia del sistema</h3>
                  <p className="text-gray-500 text-sm mt-0.5">Personalización visual del dashboard</p>
                </div>
                <SaveButton onClick={() => {}} />
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-700 mb-3" style={{ fontWeight: 500 }}>Color principal</p>
                  <div className="flex gap-3 flex-wrap">
                    {["#2563eb", "#7c3aed", "#059669", "#dc2626", "#d97706", "#0891b2"].map((color) => (
                      <button
                        key={color}
                        className={`w-10 h-10 rounded-xl border-4 transition-all ${color === "#2563eb" ? "border-gray-900 scale-110" : "border-transparent"}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-700 mb-3" style={{ fontWeight: 500 }}>Nombre del sistema</p>
                  <input
                    type="text"
                    defaultValue="BuildTrack"
                    className="w-full max-w-xs border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-white focus:border-blue-400 text-gray-700"
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-700 mb-1" style={{ fontWeight: 500 }}>Zona horaria</p>
                  <select className="w-full max-w-xs border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white outline-none text-gray-700">
                    <option>America/Argentina/Buenos_Aires (UTC-3)</option>
                    <option>America/Santiago (UTC-4)</option>
                    <option>America/Bogota (UTC-5)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Data */}
          {activeSection === "datos" && (
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-gray-900 mb-4" style={{ fontWeight: 700, fontSize: "16px" }}>Exportación de datos</h3>
                <div className="space-y-3">
                  {[
                    { label: "Exportar activos", desc: "Descarga el inventario completo en formato Excel o CSV" },
                    { label: "Exportar incidencias", desc: "Historial completo de incidencias con detalles" },
                    { label: "Exportar documentos", desc: "Lista de documentos registrados con metadatos" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{item.label}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => alert("Función disponible en la versión completa")}
                        className="text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Shield size={13} />
                        Exportar
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 rounded-xl border border-red-200 p-5">
                <h4 className="text-red-800 mb-1" style={{ fontWeight: 600 }}>Zona de peligro</h4>
                <p className="text-red-600 text-sm mb-3">Estas acciones son irreversibles. Procede con cuidado.</p>
                <button
                  onClick={() => alert("Función disponible en la versión completa")}
                  className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  Restablecer demo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({ defaultEnabled }: { defaultEnabled: boolean }) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
        enabled ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 mt-0.5 ${
          enabled ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
