import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../../lib/auth/AuthProvider";
import { IS_SUPABASE_CONFIGURED } from "../../lib/auth/authClient";

/**
 * Protege rutas privadas.
 * - Si Supabase no está configurado: modo demo, acceso libre.
 * - Si está configurado: redirige a /login si no hay sesión activa.
 */
export function ProtectedRoute() {
  const { user, loading } = useAuthContext();

  // Modo demo sin Supabase — pasa directo
  if (!IS_SUPABASE_CONFIGURED) return <Outlet />;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
