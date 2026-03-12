import { createClient } from "@supabase/supabase-js";

const rawSupabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const rawSupabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();
const demoModeFlag = String(import.meta.env.VITE_ALLOW_DEMO_MODE ?? "false").toLowerCase();

/** True si las variables de entorno de Supabase estan configuradas correctamente. */
export const IS_SUPABASE_CONFIGURED =
  Boolean(rawSupabaseUrl) &&
  Boolean(rawSupabaseAnonKey) &&
  !rawSupabaseUrl!.includes("YOUR_PROJECT_ID") &&
  !rawSupabaseAnonKey!.includes("YOUR_ANON_KEY");

/** Habilita login demo sin backend real. Debe activarse explicitamente por env. */
export const IS_DEMO_MODE_ENABLED = demoModeFlag === "true";

/** Permite acceso sin auth real solo en demo local controlada por env. */
export const IS_AUTH_BYPASS_ENABLED = !IS_SUPABASE_CONFIGURED && IS_DEMO_MODE_ENABLED;

const supabaseUrl = IS_SUPABASE_CONFIGURED ? rawSupabaseUrl! : "https://placeholder.supabase.co";
const supabaseAnonKey = IS_SUPABASE_CONFIGURED ? rawSupabaseAnonKey! : "placeholder-key";

/**
 * Supabase client - singleton usado en toda la app.
 * La sesion se persiste automaticamente en localStorage.
 * RLS se aplica con el JWT del usuario autenticado.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

function assertSupabaseConfigured() {
  if (!IS_SUPABASE_CONFIGURED) {
    throw new Error("Supabase no configurado. Completa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.");
  }
}

// Auth helpers

export async function login(email: string, password: string) {
  assertSupabaseConfigured();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

export async function logout() {
  if (!IS_SUPABASE_CONFIGURED) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUser() {
  if (!IS_SUPABASE_CONFIGURED) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentSession() {
  if (!IS_SUPABASE_CONFIGURED) return null;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
