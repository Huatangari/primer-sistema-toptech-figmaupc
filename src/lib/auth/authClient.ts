import { createClient } from "@supabase/supabase-js";

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const demoModeFlag = String(import.meta.env.VITE_ALLOW_DEMO_MODE ?? "false").toLowerCase();
const placeholderFragments = ["YOUR_PROJECT_ID", "YOUR_ANON_KEY", "tu-proyecto", "tu-anon-key"];
const hasValidSupabaseUrl = Boolean(
  rawSupabaseUrl && !placeholderFragments.some((fragment) => rawSupabaseUrl.includes(fragment)),
);
const hasValidSupabaseAnonKey = Boolean(
  rawSupabaseAnonKey && !placeholderFragments.some((fragment) => rawSupabaseAnonKey.includes(fragment)),
);

/** True si las variables de entorno de Supabase estan configuradas correctamente. */
export const IS_SUPABASE_CONFIGURED =
  hasValidSupabaseUrl &&
  hasValidSupabaseAnonKey;

/** Habilita login demo sin backend real. Debe activarse explicitamente por env. */
export const IS_DEMO_MODE_ENABLED = demoModeFlag === "true";

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
