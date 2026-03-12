import { beforeEach, describe, expect, it } from "vitest";
import { createAsset, getAssets } from "./assets";
import { mockAssets } from "../mock-data/assets";

describe("assets service", () => {
  const initialAssets = [...mockAssets];

  beforeEach(() => {
    mockAssets.splice(0, mockAssets.length, ...initialAssets.map((asset) => ({ ...asset })));
  });

  it("crea activo en modo mock y lo devuelve en listados", async () => {
    const created = await createAsset({
      name: "Activo de prueba",
      category: "CCTV",
      location: "Piso 2",
      description: "Nuevo activo para smoke test",
    });

    expect(created.name).toBe("Activo de prueba");
    expect(created.code.startsWith("CCTV-")).toBe(true);

    const assets = await getAssets();
    expect(assets.some((asset) => asset.id === created.id)).toBe(true);
  });
});
