import { beforeEach, describe, expect, it } from "vitest";
import { getIncidents } from "./incidents";
import { mockIncidents } from "../mock-data/incidents";

describe("incidents service", () => {
  const initialIncidents = [...mockIncidents];

  beforeEach(() => {
    mockIncidents.splice(0, mockIncidents.length, ...initialIncidents.map((incident) => ({ ...incident })));
  });

  it("normaliza estados cerrados legacy a Resuelta", async () => {
    const incidents = await getIncidents();
    const legacy = incidents.find((incident) => incident.id === "inc-007");

    expect(legacy).toBeDefined();
    expect(legacy?.status).toBe("Resuelta");
  });
});
