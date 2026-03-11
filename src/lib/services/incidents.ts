import { mockIncidents, mockIncidentEvents } from "../mock-data";
import type { Incident, IncidentEvent } from "../types";

export async function getIncidents(): Promise<Incident[]> {
  return mockIncidents;
}

export async function getIncidentById(id: string): Promise<Incident | undefined> {
  return mockIncidents.find((i) => i.id === id);
}

export async function getIncidentEvents(incidentId: string): Promise<IncidentEvent[]> {
  return mockIncidentEvents.filter((e) => e.incidentId === incidentId);
}

export async function getIncidentsByAssetId(assetId: string): Promise<Incident[]> {
  return mockIncidents.filter((i) => i.assetId === assetId);
}
