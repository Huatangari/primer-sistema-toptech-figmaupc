import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./router/ProtectedRoute";
import {
  Login,
  Dashboard,
  AssetsList,
  AssetDetail,
  IncidentsList,
  IncidentForm,
  IncidentDetail,
  Documents,
  Providers,
  Reports,
  Settings,
} from "./pages";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    // ProtectedRoute verifica sesión antes de renderizar cualquier ruta privada
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        Component: MainLayout,
        children: [
          { index: true, Component: Dashboard },
          { path: "activos", Component: AssetsList },
          { path: "activos/:id", Component: AssetDetail },
          { path: "incidencias", Component: IncidentsList },
          { path: "incidencias/nueva", Component: IncidentForm },
          { path: "incidencias/:id", Component: IncidentDetail },
          { path: "documentos", Component: Documents },
          { path: "proveedores", Component: Providers },
          { path: "reportes", Component: Reports },
          { path: "configuracion", Component: Settings },
        ],
      },
    ],
  },
]);
