import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CheckCircle, Save } from "lucide-react";
import { useData } from "../hooks/useData";
import { createDocument } from "../../lib/services/documents";
import { getAssets } from "../../lib/services/assets";
import { getProviders } from "../../lib/services/providers";
import { Asset, DocumentType, Provider } from "../../lib/types";

const DOC_TYPES: DocumentType[] = ["Manual", "Certificado", "Contrato", "Informe Técnico", "Plano"];

export function DocumentForm() {
  const navigate = useNavigate();
  const { data: assets } = useData(getAssets, [] as Asset[]);
  const { data: providers } = useData(getProviders, [] as Provider[]);

  const [form, setForm] = useState({
    name: "",
    type: "Manual" as DocumentType,
    description: "",
    fileSize: "",
    fileType: "PDF",
    fileUrl: "",
    tags: "",
    assetId: "",
    providerId: "",
    expiresAt: "",
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
      await createDocument({
        name: form.name.trim(),
        type: form.type,
        description: form.description.trim(),
        fileSize: form.fileSize.trim(),
        fileType: form.fileType.trim(),
        fileUrl: form.fileUrl.trim() || undefined,
        tags: form.tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        assetId: form.assetId || undefined,
        providerId: form.providerId || undefined,
        expiresAt: form.expiresAt || undefined,
      });
      setSaved(true);
      setTimeout(() => navigate("/documentos"), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el documento");
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">Documento registrado</h3>
          <p className="text-gray-500 text-sm">Redirigiendo al repositorio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <button
        type="button"
        onClick={() => navigate("/documentos")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={15} />
        Volver a Documentos
      </button>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Registrar Documento</h2>
          <p className="text-gray-500 text-sm mt-0.5">Carga metadatos y vinculación técnica</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="doc-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                id="doc-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label htmlFor="doc-type" className="block text-sm font-medium text-gray-700 mb-1.5">
                Tipo <span className="text-red-500">*</span>
              </label>
              <select
                id="doc-type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as DocumentType })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              >
                {DOC_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="doc-file-type" className="block text-sm font-medium text-gray-700 mb-1.5">
                Formato <span className="text-red-500">*</span>
              </label>
              <input
                id="doc-file-type"
                required
                value={form.fileType}
                onChange={(e) => setForm({ ...form, fileType: e.target.value })}
                placeholder="PDF"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label htmlFor="doc-file-size" className="block text-sm font-medium text-gray-700 mb-1.5">
                Tamaño <span className="text-red-500">*</span>
              </label>
              <input
                id="doc-file-size"
                required
                value={form.fileSize}
                onChange={(e) => setForm({ ...form, fileSize: e.target.value })}
                placeholder="Ej: 1.2 MB"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label htmlFor="doc-expires" className="block text-sm font-medium text-gray-700 mb-1.5">
                Fecha de vencimiento
              </label>
              <input
                id="doc-expires"
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="doc-url" className="block text-sm font-medium text-gray-700 mb-1.5">
                URL del archivo
              </label>
              <input
                id="doc-url"
                value={form.fileUrl}
                onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label htmlFor="doc-asset" className="block text-sm font-medium text-gray-700 mb-1.5">
                Activo relacionado
              </label>
              <select
                id="doc-asset"
                value={form.assetId}
                onChange={(e) => setForm({ ...form, assetId: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              >
                <option value="">Sin activo</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.code} - {asset.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="doc-provider" className="block text-sm font-medium text-gray-700 mb-1.5">
                Proveedor relacionado
              </label>
              <select
                id="doc-provider"
                value={form.providerId}
                onChange={(e) => setForm({ ...form, providerId: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              >
                <option value="">Sin proveedor</option>
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="doc-description" className="block text-sm font-medium text-gray-700 mb-1.5">
                Descripción
              </label>
              <textarea
                id="doc-description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="doc-tags" className="block text-sm font-medium text-gray-700 mb-1.5">
                Tags (separados por coma)
              </label>
              <input
                id="doc-tags"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="incendio, certificado, anual"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/documentos")}
              disabled={submitting}
              className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || !form.name.trim() || !form.fileSize.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Save size={15} />
              {submitting ? "Guardando..." : "Registrar Documento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

