import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../../lib/auth/AuthProvider";
import { IS_AUTH_BYPASS_ENABLED, IS_SUPABASE_CONFIGURED } from "../../lib/auth/authClient";

/**
 * Protege rutas privadas.
 * - Demo explicitamente habilitada: acceso libre sin Supabase.
 * - Supabase configurado: requiere sesion activa.
 * - Sin Supabase y sin demo: bloquea acceso y redirige a /login.
 */
export function ProtectedRoute() {
  const { user, loading } = useAuthContext();

  if (IS_AUTH_BYPASS_ENABLED) return <Outlet />;

  if (!IS_SUPABASE_CONFIGURED) return <Navigate to="/login" replace />;

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
