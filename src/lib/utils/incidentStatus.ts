import type { IncidentStatus } from "../types";

export function normalizeIncidentStatus(status: IncidentStatus): IncidentStatus {
  return status === "Cerrada" ? "Resuelta" : status;
}

export function isIncidentClosed(status: IncidentStatus): boolean {
  return status === "Resuelta" || status === "Cerrada";
}

export function isIncidentOpen(status: IncidentStatus): boolean {
  return !isIncidentClosed(status);
}
