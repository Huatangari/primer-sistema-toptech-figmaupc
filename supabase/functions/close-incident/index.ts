/**
 * Edge Function: close-incident
 * Marca una incidencia como resuelta y registra el evento de resolucion.
 *
 * POST /functions/v1/close-incident
 * Body: { incident_id, resolution_notes? }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleCors, jsonResponse } from "../_shared/cors.ts";
import { requireAuth, createServiceClient } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return handleCors(req);
  if (req.method !== "POST") {
    return jsonResponse({ error: "Metodo no permitido" }, 405, req);
  }

  try {
    const { user, client } = await requireAuth(req);
    const { incident_id, resolution_notes } = await req.json();

    if (!incident_id) {
      return jsonResponse({ error: "incident_id es requerido" }, 400, req);
    }

    // Verificar acceso a la incidencia via RLS
    const { data: incident, error: fetchErr } = await client
      .from("incidents")
      .select("id, status, building_id")
      .eq("id", incident_id)
      .single();

    if (fetchErr || !incident) {
      return jsonResponse({ error: "Incidencia no encontrada o sin acceso" }, 404, req);
    }

    if (incident.status === "Resuelta" || incident.status === "Cerrada") {
      return jsonResponse({ error: "La incidencia ya esta cerrada" }, 409, req);
    }

    const serviceClient = createServiceClient();
    const now = new Date().toISOString();

    // Actualizar estado
    const { data: updated, error: updateErr } = await serviceClient
      .from("incidents")
      .update({
        status: "Resuelta",
        resolved_at: now,
        observations: resolution_notes ?? null,
        updated_at: now,
      })
      .eq("id", incident_id)
      .select()
      .single();

    if (updateErr) return jsonResponse({ error: updateErr.message }, 500, req);

    // Evento de auditoria
    await serviceClient.from("incident_events").insert({
      incident_id,
      building_id: incident.building_id,
      type: "Resolución",
      description: resolution_notes
        ? `Incidencia resuelta por ${user.email ?? user.id}. Notas: ${resolution_notes}`
        : `Incidencia resuelta por ${user.email ?? user.id}.`,
      author: user.email ?? user.id,
    });

    return jsonResponse({ data: updated }, 200, req);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return jsonResponse({ error: message }, message === "No autorizado" ? 401 : 500, req);
  }
});
