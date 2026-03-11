import { createContext, useContext, ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { useAuth } from "./useAuth";

// ─── Context ──────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook para consumir el contexto ──────────────────────────────────────────

/**
 * Accede al usuario y sesión actual desde cualquier componente.
 *
 * @example
 *   const { user, loading } = useAuthContext();
 *   if (!user) return <Navigate to="/login" />;
 */
export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext);
}
