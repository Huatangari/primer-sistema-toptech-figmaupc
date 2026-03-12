import { describe, expect, it } from "vitest";
import { appRoutes } from "./routeConfig";

describe("App routes smoke", () => {
  it("declara ruta de login", () => {
    const loginRoute = appRoutes.find((route) => route.path === "/login");
    expect(loginRoute).toBeDefined();
  });

  it("declara rutas privadas clave", () => {
    const privateRoot = appRoutes.find((route) => route.path === "/");
    expect(privateRoot?.children?.length).toBeGreaterThan(0);

    const mainLayout = privateRoot?.children?.[0];
    const paths = (mainLayout?.children ?? []).map((route) => route.path).filter(Boolean);

    expect(paths).toContain("activos");
    expect(paths).toContain("activos/nuevo");
    expect(paths).toContain("proveedores/nuevo");
    expect(paths).toContain("documentos/nuevo");
    expect(paths).toContain("incidencias/nueva");
  });

  it("mantiene rutas de detalle y modulos principales", () => {
    const privateRoot = appRoutes.find((route) => route.path === "/");
    const mainLayout = privateRoot?.children?.[0];
    const paths = (mainLayout?.children ?? []).map((route) => route.path).filter(Boolean);

    expect(paths).toContain("activos/:id");
    expect(paths).toContain("incidencias/:id");
    expect(paths).toContain("reportes");
    expect(paths).toContain("configuracion");
  });
});
