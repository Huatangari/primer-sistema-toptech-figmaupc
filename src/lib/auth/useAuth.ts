import { useState, useEffect } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { IS_SUPABASE_CONFIGURED, supabase } from "./authClient";
import { identifyUser, clearUser } from "../monitoring/sentry";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

/**
 * Hook interno: escucha cambios de sesion de Supabase en tiempo real.
 * Usado por AuthProvider; en componentes preferir useAuthContext().
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!IS_SUPABASE_CONFIGURED) {
      setLoading(false);
      return;
    }

    // Carga inicial desde localStorage (sincronica via getSession)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escucha cambios: login, logout, token refresh, etc.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
      if (nextSession?.user) {
        identifyUser(nextSession.user.id, nextSession.user.email);
      } else {
        clearUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, session, loading };
}
