import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Asset, Incident } from "../../lib/types";
import { closeIncident } from "../../lib/api/endpoints";
import { getAssetById } from "../../lib/services/assets";
import { getIncidentById, getIncidentEvents } from "../../lib/services/incidents";
import { IncidentDetail } from "./IncidentDetail";

vi.mock("../../lib/services/incidents", () => ({
  getIncidentById: vi.fn(),
  getIncidentEvents: vi.fn(),
}));

vi.mock("../../lib/services/assets", () => ({
  getAssetById: vi.fn(),
}));

vi.mock("../../lib/api/endpoints", () => ({
  closeIncident: vi.fn(),
}));

const mockedGetIncidentById = vi.mocked(getIncidentById);
const mockedGetIncidentEvents = vi.mocked(getIncidentEvents);
const mockedGetAssetById = vi.mocked(getAssetById);
const mockedCloseIncident = vi.mocked(closeIncident);

describe("IncidentDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("cierra la incidencia al confirmar y navega al listado", async () => {
    const incident: Incident = {
      id: "inc-001",
      code: "INC-2025-001",
      title: "Incidencia abierta",
      description: "Descripción de prueba",
      assetId: "ast-001",
      priority: "Alta",
      status: "Abierta",
      reportedBy: "Admin",
      createdAt: "2025-03-01T10:00:00Z",
      updatedAt: "2025-03-01T10:00:00Z",
      hasEvidence: false,
    };

    const asset: Asset = {
      id: "ast-001",
      code: "ASC-001",
      name: "Ascensor principal",
      category: "Ascensores",
      location: "Torre A",
      status: "Operativo",
      installationDate: "2020-01-01",
      lastMaintenance: "2025-02-01",
      nextMaintenance: "2025-05-01",
      description: "Activo de prueba",
      observations: "Sin observaciones",
      providerId: "prov-001",
    };

    mockedGetIncidentById.mockResolvedValue(incident);
    mockedGetIncidentEvents.mockResolvedValue([]);
    mockedGetAssetById.mockResolvedValue(asset);
    mockedCloseIncident.mockResolvedValue({
      ...incident,
      status: "Resuelta",
      resolvedAt: "2025-03-02T11:00:00Z",
      updatedAt: "2025-03-02T11:00:00Z",
    });

    render(
      <MemoryRouter initialEntries={["/incidencias/inc-001"]}>
        <Routes>
          <Route path="/incidencias/:id" element={<IncidentDetail />} />
          <Route path="/incidencias" element={<div>Listado de incidencias</div>} />
        </Routes>
      </MemoryRouter>
    );

    const closeButton = await screen.findByRole("button", { name: "Marcar como Resuelta" });
    fireEvent.click(closeButton);
    fireEvent.click(await screen.findByRole("button", { name: "Confirmar" }));

    await waitFor(() => {
      expect(mockedCloseIncident).toHaveBeenCalledWith({ incident_id: "inc-001" });
    });

    expect(await screen.findByText("Listado de incidencias")).toBeTruthy();
  });
});
