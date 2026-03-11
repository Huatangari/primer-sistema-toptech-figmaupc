import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Crea un cliente Supabase autenticado con el JWT del request.
 * El cliente respeta RLS del usuario que hace la llamada.
 */
export function createUserClient(req: Request): SupabaseClient {
  const authHeader = req.headers.get("Authorization");
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader ?? "" } } }
  );
}

/**
 * Crea un cliente Supabase con service role — bypasea RLS.
 * Usar solo en Edge Functions para operaciones de auditoría.
 */
export function createServiceClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

/**
 * Valida el JWT del request y devuelve el usuario autenticado.
 * Lanza error si no hay sesión válida.
 */
export async function requireAuth(req: Request) {
  const client = createUserClient(req);
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) throw new Error("No autorizado");
  return { user, client };
}

/**
 * Verifica que el usuario pertenece al edificio indicado.
 * Devuelve el rol del usuario.
 */
export async function requireBuildingAccess(
  client: SupabaseClient,
  userId: string,
  buildingId: string
): Promise<string> {
  const { data, error } = await client
    .from("building_users")
    .select("role")
    .eq("user_id", userId)
    .eq("building_id", buildingId)
    .single();

  if (error || !data) throw new Error("Acceso denegado al edificio");
  return data.role;
}
