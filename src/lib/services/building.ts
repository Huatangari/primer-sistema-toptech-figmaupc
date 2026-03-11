import { supabase } from "../auth/authClient";

let cachedBuildingId: string | null = null;

/**
 * Resuelve el building_id activo del usuario autenticado.
 * Usa cache en memoria para evitar repetir la misma consulta.
 */
export async function getActiveBuildingId(): Promise<string> {
  if (cachedBuildingId) return cachedBuildingId;

  const membership = await supabase
    .from("building_users")
    .select("building_id")
    .limit(1)
    .maybeSingle();

  if (!membership.error && membership.data?.building_id) {
    const buildingId = membership.data.building_id;
    cachedBuildingId = buildingId;
    return buildingId;
  }

  // Fallback para proyectos demo existentes sin building_users poblado.
  const asset = await supabase
    .from("assets")
    .select("building_id")
    .limit(1)
    .maybeSingle();

  if (!asset.error && asset.data?.building_id) {
    const buildingId = asset.data.building_id;
    cachedBuildingId = buildingId;
    return buildingId;
  }

  const provider = await supabase
    .from("providers")
    .select("building_id")
    .limit(1)
    .maybeSingle();

  if (!provider.error && provider.data?.building_id) {
    const buildingId = provider.data.building_id;
    cachedBuildingId = buildingId;
    return buildingId;
  }

  const document = await supabase
    .from("documents")
    .select("building_id")
    .limit(1)
    .maybeSingle();

  if (!document.error && document.data?.building_id) {
    const buildingId = document.data.building_id;
    cachedBuildingId = buildingId;
    return buildingId;
  }

  throw new Error("No se pudo resolver building_id activo para la sesion actual.");
}

export function clearActiveBuildingIdCache() {
  cachedBuildingId = null;
}
