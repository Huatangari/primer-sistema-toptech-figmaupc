import { describe, expect, it } from "vitest";
import { isIncidentClosed, isIncidentOpen, normalizeIncidentStatus } from "./incidentStatus";

describe("incidentStatus utils", () => {
  it("normaliza Cerrada a Resuelta", () => {
    expect(normalizeIncidentStatus("Cerrada")).toBe("Resuelta");
    expect(normalizeIncidentStatus("Abierta")).toBe("Abierta");
  });

  it("reconoce estados cerrados y abiertos", () => {
    expect(isIncidentClosed("Resuelta")).toBe(true);
    expect(isIncidentClosed("Cerrada")).toBe(true);
    expect(isIncidentOpen("Abierta")).toBe(true);
    expect(isIncidentOpen("En Proceso")).toBe(true);
  });
});
