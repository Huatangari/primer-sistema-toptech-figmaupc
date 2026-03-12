import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CheckCircle, Save } from "lucide-react";
import { createProvider } from "../../lib/services/providers";
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

export function ProviderForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    rubro: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contractType: "",
    categories: [] as AssetCategory[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const isValid = useMemo(
    () =>
      form.name.trim().length > 2 &&
      form.rubro.trim().length > 2 &&
      form.contactName.trim().length > 2 &&
      form.contactEmail.includes("@") &&
      form.contactPhone.trim().length >= 6,
    [form]
  );

  const toggleCategory = (category: AssetCategory) => {
    const next = form.categories.includes(category)
      ? form.categories.filter((item) => item !== category)
      : [...form.categories, category];

    setForm({ ...form, categories: next });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await createProvider({
        name: form.name.trim(),
        rubro: form.rubro.trim(),
        contactName: form.contactName.trim(),
        contactEmail: form.contactEmail.trim(),
        contactPhone: form.contactPhone.trim(),
        contractType: form.contractType.trim() || undefined,
        categories: form.categories,
      });
      setSaved(true);
      setTimeout(() => navigate("/proveedores"), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el proveedor");
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">Proveedor creado</h3>
          <p className="text-gray-500 text-sm">Redirigiendo al directorio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <button
        type="button"
        onClick={() => navigate("/proveedores")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={15} />
        Volver a Proveedores
      </button>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Registrar Nuevo Proveedor</h2>
          <p className="text-gray-500 text-sm mt-0.5">Completa la ficha comercial y técnica</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="provider-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                id="provider-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label htmlFor="provider-rubro" className="block text-sm font-medium text-gray-700 mb-1.5">
                Rubro <span className="text-red-500">*</span>
              </label>
              <input
                id="provider-rubro"
                required
                value={form.rubro}
                onChange={(e) => setForm({ ...form, rubro: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label htmlFor="provider-contract" className="block text-sm font-medium text-gray-700 mb-1.5">
                Tipo de contrato
              </label>
              <input
                id="provider-contract"
                value={form.contractType}
                onChange={(e) => setForm({ ...form, contractType: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label htmlFor="provider-contact-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Contacto <span className="text-red-500">*</span>
              </label>
              <input
                id="provider-contact-name"
                required
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label htmlFor="provider-contact-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="provider-contact-email"
                type="email"
                required
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="provider-contact-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                id="provider-contact-phone"
                required
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div className="sm:col-span-2">
              <p className="block text-sm font-medium text-gray-700 mb-1.5">Categorías atendidas</p>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((category) => {
                  const active = form.categories.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                        active ? "bg-blue-50 border-blue-300 text-blue-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/proveedores")}
              disabled={submitting}
              className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || !isValid}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Save size={15} />
              {submitting ? "Guardando..." : "Crear Proveedor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

