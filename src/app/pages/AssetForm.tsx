import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CheckCircle, Save } from "lucide-react";
import { useData } from "../hooks/useData";
import { createAsset } from "../../lib/services/assets";
import { getProviders } from "../../lib/services/providers";
import { AssetCategory, AssetStatus, Provider } from "../../lib/types";

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

const STATUSES: AssetStatus[] = ["Operativo", "En Mantenimiento", "Falla", "Vencido", "Inactivo"];

export function AssetForm() {
  const navigate = useNavigate();
  const { data: providers } = useData(getProviders, [] as Provider[]);

  const [form, setForm] = useState({
    name: "",
    category: "Ascensores" as AssetCategory,
    location: "",
    status: "Operativo" as AssetStatus,
    providerId: "",
    description: "",
    observations: "",
    installationDate: "",
    nextMaintenance: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await createAsset({
        name: form.name.trim(),
        category: form.category,
        location: form.location.trim(),
        status: form.status,
        providerId: form.providerId || undefined,
        description: form.description.trim(),
        observations: form.observations.trim(),
        installationDate: form.installationDate || undefined,
        nextMaintenance: form.nextMaintenance || undefined,
      });
      setSaved(true);
      setTimeout(() => navigate("/activos"), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el activo");
      setSubmitting(false);
    }
  };

  if (saved) {
    return (
      <div className="flex items-center justify-center h-full min-h-96 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Activo creado</h3>
          <p className="text-gray-500 text-sm">Redirigiendo al inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <button
        type="button"
        onClick={() => navigate("/activos")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={15} />
        Volver a Activos
      </button>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Registrar Nuevo Activo</h2>
          <p className="text-gray-500 text-sm mt-0.5">Completa la información técnica del activo</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="asset-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                id="asset-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label htmlFor="asset-category" className="block text-sm font-medium text-gray-700 mb-1.5">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                id="asset-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as AssetCategory })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="asset-status" className="block text-sm font-medium text-gray-700 mb-1.5">
                Estado inicial
              </label>
              <select
                id="asset-status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as AssetStatus })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="asset-location" className="block text-sm font-medium text-gray-700 mb-1.5">
                Ubicación <span className="text-red-500">*</span>
              </label>
              <input
                id="asset-location"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label htmlFor="asset-provider" className="block text-sm font-medium text-gray-700 mb-1.5">
                Proveedor
              </label>
              <select
                id="asset-provider"
                value={form.providerId}
                onChange={(e) => setForm({ ...form, providerId: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              >
                <option value="">Sin asignar</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="asset-installation" className="block text-sm font-medium text-gray-700 mb-1.5">
                Fecha de instalación
              </label>
              <input
                id="asset-installation"
                type="date"
                value={form.installationDate}
                onChange={(e) => setForm({ ...form, installationDate: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label htmlFor="asset-next-maintenance" className="block text-sm font-medium text-gray-700 mb-1.5">
                Próximo mantenimiento
              </label>
              <input
                id="asset-next-maintenance"
                type="date"
                value={form.nextMaintenance}
                onChange={(e) => setForm({ ...form, nextMaintenance: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="asset-description" className="block text-sm font-medium text-gray-700 mb-1.5">
                Descripción
              </label>
              <textarea
                id="asset-description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="asset-observations" className="block text-sm font-medium text-gray-700 mb-1.5">
                Observaciones
              </label>
              <textarea
                id="asset-observations"
                rows={2}
                value={form.observations}
                onChange={(e) => setForm({ ...form, observations: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/activos")}
              disabled={submitting}
              className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Save size={15} />
              {submitting ? "Guardando..." : "Crear Activo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

