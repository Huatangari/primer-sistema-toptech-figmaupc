import { createBrowserRouter } from "react-router";
import { MainLayout } from "./components/layout/MainLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { AssetsList } from "./pages/AssetsList";
import { AssetDetail } from "./pages/AssetDetail";
import { IncidentsList } from "./pages/IncidentsList";
import { IncidentForm } from "./pages/IncidentForm";
import { IncidentDetail } from "./pages/IncidentDetail";
import { Documents } from "./pages/Documents";
import { Providers } from "./pages/Providers";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
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
]);
