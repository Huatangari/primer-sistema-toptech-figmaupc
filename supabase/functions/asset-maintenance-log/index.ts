/**
 * Edge Function: asset-maintenance-log
 * Registra un evento de mantenimiento en el historial de un activo
 * y actualiza la fecha de ultimo mantenimiento.
 *
 * POST /functions/v1/asset-maintenance-log
 * Body: { asset_id, type, title, description, technician, next_maintenance? }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleCors, jsonResponse } from "../_shared/cors.ts";
import { requireAuth, createServiceClient } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return handleCors(req);

  try {
    const { client } = await requireAuth(req);
    const { asset_id, type, title, description, technician, next_maintenance } = await req.json();

    if (!asset_id || !type || !title || !technician) {
      return jsonResponse({ error: "asset_id, type, title y technician son requeridos" }, 400, req);
    }

    // Obtener el activo con acceso RLS
    const { data: asset, error: assetErr } = await client
      .from("assets")
      .select("id, building_id, status")
      .eq("id", asset_id)
      .single();

    if (assetErr || !asset) {
      return jsonResponse({ error: "Activo no encontrado o sin acceso" }, 404, req);
    }

    const serviceClient = createServiceClient();
    const now = new Date().toISOString();

    // Insertar evento de historial
    const { data: historyEntry, error: histErr } = await serviceClient
      .from("asset_history")
      .insert({
        asset_id,
        building_id: asset.building_id,
        date: now,
        type,
        title,
        description: description ?? "",
        technician,
      })
      .select()
      .single();

    if (histErr) return jsonResponse({ error: histErr.message }, 500, req);

    // Actualizar last_maintenance (y next_maintenance si se provee)
    const assetUpdate: Record<string, string> = {
      last_maintenance: now.split("T")[0],
      updated_at: now,
    };
    if (next_maintenance) assetUpdate.next_maintenance = next_maintenance;

    await serviceClient.from("assets").update(assetUpdate).eq("id", asset_id);

    return jsonResponse({ data: historyEntry }, 201, req);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return jsonResponse({ error: message }, message === "No autorizado" ? 401 : 500, req);
  }
});
