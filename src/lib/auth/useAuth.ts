import { useState, useEffect } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "./authClient";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

/**
 * Hook interno — escucha cambios de sesión de Supabase en tiempo real.
 * Usado por AuthProvider; en componentes preferir useAuthContext().
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carga inicial desde localStorage (sincrónica vía getSession)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escucha cambios: login, logout, token refresh, etc.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, session, loading };
}
