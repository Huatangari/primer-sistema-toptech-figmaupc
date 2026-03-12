import type { ComponentType } from "react";
import type { RouteObject } from "react-router";
import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./router/ProtectedRoute";

type LazyComponentModule = { [key: string]: ComponentType };

function lazyPage<T extends LazyComponentModule>(
  loader: () => Promise<T>,
  exportName: keyof T
): NonNullable<RouteObject["lazy"]> {
  return async () => {
    const mod = await loader();
    return { Component: mod[exportName] as ComponentType };
  };
}

export const appRoutes: RouteObject[] = [
  {
    path: "/login",
    lazy: lazyPage(() => import("./pages/Login"), "Login"),
  },
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        Component: MainLayout,
        children: [
          { index: true, lazy: lazyPage(() => import("./pages/Dashboard"), "Dashboard") },
          { path: "activos", lazy: lazyPage(() => import("./pages/AssetsList"), "AssetsList") },
          { path: "activos/nuevo", lazy: lazyPage(() => import("./pages/AssetForm"), "AssetForm") },
          { path: "activos/:id", lazy: lazyPage(() => import("./pages/AssetDetail"), "AssetDetail") },
          { path: "incidencias", lazy: lazyPage(() => import("./pages/IncidentsList"), "IncidentsList") },
          { path: "incidencias/nueva", lazy: lazyPage(() => import("./pages/IncidentForm"), "IncidentForm") },
          { path: "incidencias/:id", lazy: lazyPage(() => import("./pages/IncidentDetail"), "IncidentDetail") },
          { path: "documentos", lazy: lazyPage(() => import("./pages/Documents"), "Documents") },
          { path: "documentos/nuevo", lazy: lazyPage(() => import("./pages/DocumentForm"), "DocumentForm") },
          { path: "proveedores", lazy: lazyPage(() => import("./pages/Providers"), "Providers") },
          { path: "proveedores/nuevo", lazy: lazyPage(() => import("./pages/ProviderForm"), "ProviderForm") },
          { path: "reportes", lazy: lazyPage(() => import("./pages/Reports"), "Reports") },
          { path: "configuracion", lazy: lazyPage(() => import("./pages/Settings"), "Settings") },
        ],
      },
    ],
  },
];

