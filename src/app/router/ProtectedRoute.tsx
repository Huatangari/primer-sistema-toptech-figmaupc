import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../../lib/auth/AuthProvider";
import { IS_SUPABASE_CONFIGURED } from "../../lib/auth/authClient";

/**
 * Protege rutas privadas.
 * - Supabase configurado: requiere sesion activa.
 * - Sin Supabase: bloquea acceso y redirige a /login.
 */
export function ProtectedRoute() {
  const { session, loading } = useAuthContext();

  if (!IS_SUPABASE_CONFIGURED) return <Navigate to="/login" replace />;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;

  return <Outlet />;
}
