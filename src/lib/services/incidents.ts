import { mockIncidents, mockIncidentEvents } from "../mock-data";
import type { Incident, IncidentEvent } from "../types";
import { supabase, IS_SUPABASE_CONFIGURED } from "../auth/authClient";
import { mapIncident, mapIncidentEvent } from "../api/mappers";
import { normalizeIncidentStatus } from "../utils/incidentStatus";

function normalizeIncident(incident: Incident): Incident {
  return { ...incident, status: normalizeIncidentStatus(incident.status) };
}

export async function getIncidents(): Promise<Incident[]> {
  if (!IS_SUPABASE_CONFIGURED) return mockIncidents.map(normalizeIncident);
  const { data, error } = await supabase
    .from("incidents")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapIncident);
}

export async function getIncidentById(id: string): Promise<Incident | undefined> {
  if (!IS_SUPABASE_CONFIGURED) {
    const incident = mockIncidents.find((i) => i.id === id);
    return incident ? normalizeIncident(incident) : undefined;
  }
  const { data, error } = await supabase.from("incidents").select("*").eq("id", id).single();
  if (error || !data) return undefined;
  return mapIncident(data);
}

export async function getIncidentEvents(incidentId: string): Promise<IncidentEvent[]> {
  if (!IS_SUPABASE_CONFIGURED) return mockIncidentEvents.filter((e) => e.incidentId === incidentId);
  const { data, error } = await supabase
    .from("incident_events")
    .select("*")
    .eq("incident_id", incidentId)
    .order("date", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapIncidentEvent);
}

export async function getIncidentsByAssetId(assetId: string): Promise<Incident[]> {
  if (!IS_SUPABASE_CONFIGURED) return mockIncidents.filter((i) => i.assetId === assetId).map(normalizeIncident);
  const { data, error } = await supabase
    .from("incidents")
    .select("*")
    .eq("asset_id", assetId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapIncident);
}
