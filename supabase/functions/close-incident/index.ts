/**
 * Edge Function: close-incident
 * Cierra una incidencia y registra el evento de cierre.
 *
 * POST /functions/v1/close-incident
 * Body: { incident_id, resolution_notes? }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleCors, jsonResponse } from "../_shared/cors.ts";
import { requireAuth, createServiceClient } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return handleCors();

  try {
    const { user, client } = await requireAuth(req);
    const { incident_id, resolution_notes } = await req.json();

    if (!incident_id) {
      return jsonResponse({ error: "incident_id es requerido" }, 400);
    }

    // Verificar acceso a la incidencia vía RLS
    const { data: incident, error: fetchErr } = await client
      .from("incidents")
      .select("id, status, building_id")
      .eq("id", incident_id)
      .single();

    if (fetchErr || !incident) {
      return jsonResponse({ error: "Incidencia no encontrada o sin acceso" }, 404);
    }

    if (incident.status === "Cerrada") {
      return jsonResponse({ error: "La incidencia ya está cerrada" }, 409);
    }

    const serviceClient = createServiceClient();
    const now = new Date().toISOString();

    // Actualizar estado
    const { data: updated, error: updateErr } = await serviceClient
      .from("incidents")
      .update({
        status: "Cerrada",
        resolved_at: now,
        observations: resolution_notes ?? null,
        updated_at: now,
      })
      .eq("id", incident_id)
      .select()
      .single();

    if (updateErr) return jsonResponse({ error: updateErr.message }, 500);

    // Evento de auditoría
    await serviceClient.from("incident_events").insert({
      incident_id,
      building_id: incident.building_id,
      type: "Cierre",
      description: resolution_notes
        ? `Incidencia cerrada por ${user.email ?? user.id}. Notas: ${resolution_notes}`
        : `Incidencia cerrada por ${user.email ?? user.id}.`,
      author: user.email ?? user.id,
    });

    return jsonResponse({ data: updated });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return jsonResponse({ error: message }, message === "No autorizado" ? 401 : 500);
  }
});
