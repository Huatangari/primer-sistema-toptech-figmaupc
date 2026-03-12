/**
 * Edge Function: upload-document
 * Registra metadatos de un documento ya subido a Supabase Storage.
 * El archivo debe subirse primero con supabase.storage.from('documents').upload()
 *
 * POST /functions/v1/upload-document
 * Body: { building_id, name, type, description, file_size, file_type, file_url, asset_id?, provider_id?, tags?, expires_at? }
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleCors, jsonResponse } from "../_shared/cors.ts";
import { requireAuth, requireBuildingAccess, createServiceClient } from "../_shared/auth.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return handleCors(req);
  if (req.method !== "POST") {
    return jsonResponse({ error: "Metodo no permitido" }, 405, req);
  }

  try {
    const { user, client } = await requireAuth(req);
    const body = await req.json();
    const {
      building_id,
      name,
      type,
      description,
      file_size,
      file_type,
      file_url,
      asset_id,
      provider_id,
      tags,
      expires_at,
    } = body;

    if (!building_id || !name || !type || !file_size || !file_type) {
      return jsonResponse({ error: "Faltan campos requeridos" }, 400, req);
    }

    // Verificar acceso al edificio (minimo technician)
    const role = await requireBuildingAccess(client, user.id, building_id);
    if (role === "viewer") {
      return jsonResponse({ error: "Sin permisos para subir documentos" }, 403, req);
    }

    const serviceClient = createServiceClient();

    const { data: doc, error: docErr } = await serviceClient
      .from("documents")
      .insert({
        building_id,
        asset_id: asset_id ?? null,
        provider_id: provider_id ?? null,
        name,
        type,
        description: description ?? "",
        file_size,
        file_type,
        file_url: file_url ?? null,
        tags: tags ?? [],
        uploaded_by: user.email ?? user.id,
        expires_at: expires_at ?? null,
      })
      .select()
      .single();

    if (docErr) return jsonResponse({ error: docErr.message }, 500, req);

    return jsonResponse({ data: doc }, 201, req);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return jsonResponse({ error: message }, message === "No autorizado" ? 401 : 500, req);
  }
});
