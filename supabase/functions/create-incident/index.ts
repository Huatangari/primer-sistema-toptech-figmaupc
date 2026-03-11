/**
 * Edge Function: create-incident
 * Crea una incidencia y registra el evento inicial de auditoría.
 *
 * POST /functions/v1/create-incident
 * Body: { asset_id, title, description, priority, observations? }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCors, jsonResponse } from "../_shared/cors.ts";
import { requireAuth, createServiceClient } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return handleCors();

  try {
    // 1. Autenticar usuario
    const { user, client } = await requireAuth(req);

    // 2. Parsear body
    const body = await req.json();
    const { asset_id, title, description, priority, observations } = body;

    if (!asset_id || !title || !priority) {
      return jsonResponse({ error: "asset_id, title y priority son requeridos" }, 400);
    }

    // 3. Obtener building_id del activo (via RLS — el usuario debe tener acceso)
    const { data: asset, error: assetErr } = await client
      .from("assets")
      .select("id, building_id")
      .eq("id", asset_id)
      .single();

    if (assetErr || !asset) {
      return jsonResponse({ error: "Activo no encontrado o sin acceso" }, 404);
    }

    // 4. Generar código único INC-XXX
    const serviceClient = createServiceClient();
    const { count } = await serviceClient
      .from("incidents")
      .select("*", { count: "exact", head: true })
      .eq("building_id", asset.building_id);

    const code = `INC-${String((count ?? 0) + 1).padStart(3, "0")}`;

    // 5. Insertar incidencia
    const { data: incident, error: incErr } = await serviceClient
      .from("incidents")
      .insert({
        building_id: asset.building_id,
        asset_id,
        code,
        title,
        description: description ?? "",
        priority,
        status: "Abierta",
        reported_by: user.email ?? user.id,
        observations: observations ?? null,
        has_evidence: false,
      })
      .select()
      .single();

    if (incErr) return jsonResponse({ error: incErr.message }, 500);

    // 6. Registrar evento de auditoría
    await serviceClient.from("incident_events").insert({
      incident_id: incident.id,
      building_id: asset.building_id,
      type: "Creación",
      description: `Incidencia registrada por ${user.email ?? user.id} con prioridad ${priority}.`,
      author: user.email ?? user.id,
    });

    return jsonResponse({ data: incident }, 201);

  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return jsonResponse({ error: message }, message === "No autorizado" ? 401 : 500);
  }
});
