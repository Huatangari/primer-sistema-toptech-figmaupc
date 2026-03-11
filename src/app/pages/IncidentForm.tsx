import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Upload, X, Camera, CheckCircle } from "lucide-react";
import { getAssets } from "../../lib/services/assets";
import { Asset } from "../../lib/types";

export function IncidentForm() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    getAssets().then(setAssets);
  }, []);

  const [form, setForm] = useState({
    assetId: "",
    title: "",
    description: "",
    priority: "Media",
    observations: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate("/incidencias");
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center h-full min-h-96 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h3 className="text-gray-900 mb-2" style={{ fontWeight: 700, fontSize: "20px" }}>
            Incidencia registrada
          </h3>
          <p className="text-gray-500 text-sm">Redirigiendo al listado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <button
        onClick={() => navigate("/incidencias")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft size={15} />
        Volver a Incidencias
      </button>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-gray-900" style={{ fontWeight: 700, fontSize: "18px" }}>Registrar Nueva Incidencia</h2>
          <p className="text-gray-500 text-sm mt-0.5">Documenta la falla o evento para su seguimiento</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Asset */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Activo relacionado <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.assetId}
              onChange={(e) => setForm({ ...form, assetId: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-100 text-gray-700"
            >
              <option value="">Seleccionar activo...</option>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.code} – {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Título de la incidencia <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ej: Falla en sensor de puerta"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-100 text-gray-700"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Prioridad <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {["Crítica", "Alta", "Media", "Baja"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, priority: p })}
                  className={`py-2 rounded-lg text-sm border transition-all ${
                    form.priority === p
                      ? p === "Crítica"
                        ? "bg-red-600 border-red-600 text-white"
                        : p === "Alta"
                        ? "bg-orange-500 border-orange-500 text-white"
                        : p === "Media"
                        ? "bg-amber-500 border-amber-500 text-white"
                        : "bg-blue-500 border-blue-500 text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                  style={{ fontWeight: form.priority === p ? 600 : 400 }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Descripción detallada <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe la falla con detalle: qué ocurrió, cuándo, qué síntomas se observan..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-100 text-gray-700 resize-none"
            />
          </div>

          {/* Evidence upload */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Evidencia fotográfica
            </label>

            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-lg border border-gray-200" />
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Camera size={20} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-1" style={{ fontWeight: 500 }}>Adjuntar fotografía</p>
                <p className="text-xs text-gray-400">Arrastra una imagen o haz clic para seleccionar</p>
                <p className="text-xs text-gray-300 mt-1">JPG, PNG hasta 10 MB</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Observations */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5" style={{ fontWeight: 500 }}>
              Observaciones adicionales
            </label>
            <textarea
              rows={2}
              value={form.observations}
              onChange={(e) => setForm({ ...form, observations: e.target.value })}
              placeholder="Acciones tomadas, contexto adicional..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-white focus:border-blue-400 text-gray-700 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/incidencias")}
              className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm py-2.5 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              style={{ fontWeight: 600 }}
            >
              <Upload size={15} />
              Registrar Incidencia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
