import { useState } from "react";
import { Bell, Building2, Check, Database, Palette, Save, Shield, Users } from "lucide-react";
import { IS_DEMO_MODE_ENABLED } from "../../lib/auth/authClient";
import { getAssets } from "../../lib/services/assets";
import { getDocuments } from "../../lib/services/documents";
import { getIncidents } from "../../lib/services/incidents";

type Section = "edificio" | "notificaciones" | "usuarios" | "apariencia" | "datos";

type ExportResource = "activos" | "incidencias" | "documentos";

const sections = [
  { key: "edificio" as Section, label: "Datos del Edificio", icon: <Building2 size={16} /> },
  { key: "notificaciones" as Section, label: "Notificaciones", icon: <Bell size={16} /> },
  { key: "usuarios" as Section, label: "Usuarios y Roles", icon: <Users size={16} /> },
  { key: "apariencia" as Section, label: "Apariencia", icon: <Palette size={16} /> },
  { key: "datos" as Section, label: "Datos y Exportacion", icon: <Database size={16} /> },
];

const BUILDING_FIELDS = [
  { id: "building-name", label: "Nombre del edificio", value: "Torres del Parque", type: "text" },
  { id: "building-address", label: "Direccion", value: "Av. Libertador 1450", type: "text" },
  { id: "building-city", label: "Ciudad", value: "Buenos Aires", type: "text" },
  { id: "building-country", label: "Pais", value: "Argentina", type: "text" },
  { id: "building-floors", label: "Total de pisos", value: "14", type: "number" },
  { id: "building-units", label: "Total de unidades", value: "87", type: "number" },
  { id: "building-year", label: "Ano de construccion", value: "2017", type: "number" },
  { id: "building-admin", label: "Administrador responsable", value: "Admin Edificio", type: "text" },
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
      type="button"
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
        saved ? "bg-emerald-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
    >
      {saved ? <Check size={15} /> : <Save size={15} />}
      {saved ? "Guardado" : "Guardar cambios"}
    </button>
  );
}

function Toggle({ defaultEnabled }: { defaultEnabled: boolean }) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  return (
    <button
      type="button"
      role="switch"
      aria-checked="false"
      ref={(el) => { if (el) el.setAttribute('aria-checked', String(enabled)); }}
      aria-label={enabled ? "Desactivar notificacion" : "Activar notificacion"}
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

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function clearStorageByPrefix(storage: Storage, prefixes: readonly string[]) {
  const keysToRemove: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key) continue;
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => storage.removeItem(key));
}

function resetDemoSessionStorage() {
  // Only clear app/supabase keys. Avoid wiping unrelated app data in same origin.
  const prefixes = ["sb-", "supabase.", "toptech.", "buildtrack."];
  clearStorageByPrefix(window.localStorage, prefixes);
  clearStorageByPrefix(window.sessionStorage, prefixes);
}

export function Settings() {
  const [activeSection, setActiveSection] = useState<Section>("edificio");
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exportingKey, setExportingKey] = useState<ExportResource | null>(null);

  const handleExport = async (resource: ExportResource) => {
    setActionError(null);
    setActionMessage(null);
    setExportingKey(resource);

    try {
      if (resource === "activos") {
        const assets = await getAssets();
        downloadJson(`activos-${new Date().toISOString().slice(0, 10)}.json`, assets);
      } else if (resource === "incidencias") {
        const incidents = await getIncidents();
        downloadJson(`incidencias-${new Date().toISOString().slice(0, 10)}.json`, incidents);
      } else {
        const documents = await getDocuments();
        downloadJson(`documentos-${new Date().toISOString().slice(0, 10)}.json`, documents);
      }

      setActionMessage(`Exportacion de ${resource} completada.`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "No se pudo exportar.");
    } finally {
      setExportingKey(null);
    }
  };

  const handleResetDemo = () => {
    setActionError(null);
    setActionMessage(null);

    if (!IS_DEMO_MODE_ENABLED) {
      setActionError("La accion de restablecer demo solo esta disponible con VITE_ALLOW_DEMO_MODE=true.");
      return;
    }

    resetDemoSessionStorage();
    setActionMessage("Demo restablecida. Recargando vista...");
    setTimeout(() => window.location.reload(), 900);
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex gap-6 flex-col md:flex-row">
        <div className="md:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {sections.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setActiveSection(s.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm border-b border-gray-50 last:border-0 transition-colors ${
                  activeSection === s.key
                    ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-l-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className={activeSection === s.key ? "text-blue-600" : "text-gray-400"}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-5">
          {actionMessage && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{actionMessage}</p>
          )}
          {actionError && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2" role="alert">
              {actionError}
            </p>
          )}

          {activeSection === "edificio" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Datos del Edificio</h3>
                  <p className="text-gray-500 text-sm mt-0.5">Informacion general del edificio gestionado</p>
                </div>
                <SaveButton onClick={() => setActionMessage("Cambios de edificio guardados.")} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {BUILDING_FIELDS.map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1.5">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      defaultValue={field.value}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-100 text-gray-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "notificaciones" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Configuracion de Notificaciones</h3>
                  <p className="text-gray-500 text-sm mt-0.5">Gestiona que alertas recibir y por que canal</p>
                </div>
                <SaveButton onClick={() => setActionMessage("Preferencias de notificacion guardadas.")} />
              </div>

              <div className="space-y-4">
                {[
                  { label: "Incidencias criticas", desc: "Alerta inmediata cuando se registra una incidencia critica", enabled: true },
                  { label: "Vencimiento de certificados", desc: "Aviso 30 dias antes del vencimiento", enabled: true },
                  { label: "Proximos mantenimientos", desc: "Recordatorio 7 dias antes", enabled: true },
                  { label: "Incidencias sin asignar", desc: "Alerta si supera 24h sin asignacion", enabled: false },
                  { label: "Resumen semanal", desc: "Email con resumen tecnico cada lunes", enabled: false },
                  { label: "Nuevos documentos", desc: "Notificacion cuando se sube documento", enabled: false },
                ].map((notif) => (
                  <div key={notif.label} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{notif.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{notif.desc}</p>
                    </div>
                    <Toggle defaultEnabled={notif.enabled} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "usuarios" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Usuarios y Roles</h3>
                  <p className="text-gray-500 text-sm mt-0.5">Gestiona el acceso al sistema</p>
                </div>
                <button type="button" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
                  <Users size={14} />
                  Invitar usuario
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Admin Edificio", email: "admin@torresdelparque.com", role: "Administrador", status: "Activo" },
                  { name: "Juan Encargado", email: "j.encargado@torresdelparque.com", role: "Operativo", status: "Activo" },
                  { name: "Maria Garcia", email: "m.garcia@torresdelparque.com", role: "Solo lectura", status: "Activo" },
                  { name: "Carlos Presidente", email: "c.presidente@consorcio.com", role: "Solo lectura", status: "Pendiente" },
                ].map((user) => (
                  <div key={user.email} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">{user.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      user.role === "Administrador" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {user.role}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full hidden sm:inline ${
                      user.status === "Activo" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {user.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "apariencia" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Apariencia del sistema</h3>
                  <p className="text-gray-500 text-sm mt-0.5">Personalizacion visual del dashboard</p>
                </div>
                <SaveButton onClick={() => setActionMessage("Preferencias visuales guardadas.")} />
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Color principal</p>
                  <div className="flex gap-3 flex-wrap" role="group" aria-label="Seleccionar color principal">
                    <button type="button" aria-label="Color Azul" aria-pressed="true" className="w-10 h-10 rounded-xl border-4 transition-all bg-[#2563eb] border-gray-900 scale-110" />
                    <button type="button" aria-label="Color Violeta" aria-pressed="false" className="w-10 h-10 rounded-xl border-4 transition-all bg-[#7c3aed] border-transparent" />
                    <button type="button" aria-label="Color Verde" aria-pressed="false" className="w-10 h-10 rounded-xl border-4 transition-all bg-[#059669] border-transparent" />
                    <button type="button" aria-label="Color Rojo" aria-pressed="false" className="w-10 h-10 rounded-xl border-4 transition-all bg-[#dc2626] border-transparent" />
                    <button type="button" aria-label="Color Ambar" aria-pressed="false" className="w-10 h-10 rounded-xl border-4 transition-all bg-[#d97706] border-transparent" />
                    <button type="button" aria-label="Color Cian" aria-pressed="false" className="w-10 h-10 rounded-xl border-4 transition-all bg-[#0891b2] border-transparent" />
                  </div>
                </div>

                <div>
                  <label htmlFor="system-name" className="block text-sm font-medium text-gray-700 mb-3">
                    Nombre del sistema
                  </label>
                  <input
                    id="system-name"
                    type="text"
                    defaultValue="BuildTrack"
                    className="w-full max-w-xs border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-white focus:border-blue-400 text-gray-700"
                  />
                </div>

                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                    Zona horaria
                  </label>
                  <select id="timezone" className="w-full max-w-xs border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white outline-none text-gray-700">
                    <option>America/Argentina/Buenos_Aires (UTC-3)</option>
                    <option>America/Santiago (UTC-4)</option>
                    <option>America/Bogota (UTC-5)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === "datos" && (
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">Exportacion de datos</h3>
                <div className="space-y-3">
                  {[
                    { key: "activos" as const, label: "Exportar activos", desc: "Descarga el inventario completo en formato JSON" },
                    { key: "incidencias" as const, label: "Exportar incidencias", desc: "Historial completo de incidencias" },
                    { key: "documentos" as const, label: "Exportar documentos", desc: "Lista de documentos con metadatos" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleExport(item.key)}
                        disabled={Boolean(exportingKey)}
                        className="text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-60"
                      >
                        <Shield size={13} />
                        {exportingKey === item.key ? "Exportando..." : "Exportar"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 rounded-xl border border-red-200 p-5">
                <h4 className="text-red-800 font-semibold mb-1">Zona de peligro</h4>
                <p className="text-red-600 text-sm mb-3">Estas acciones son irreversibles. Procede con cuidado.</p>
                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="text-sm font-medium bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
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
