import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "No se pudieron cargar los datos.", onRetry }: ErrorStateProps) {
  return (
    <div className="p-6 flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertTriangle size={20} className="text-red-500" />
        </div>
        <p className="text-sm text-gray-800 mb-1" style={{ fontWeight: 600 }}>
          Error al cargar datos
        </p>
        <p className="text-xs text-gray-400 mb-4">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
          >
            <RefreshCw size={13} />
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
