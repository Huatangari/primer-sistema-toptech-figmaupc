import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProtectedRoute } from "./ProtectedRoute";

const authState = {
  user: null as { id: string } | null,
  loading: false,
};

const authFlags = {
  configured: true,
  bypass: false,
};

vi.mock("../../lib/auth/AuthProvider", () => ({
  useAuthContext: () => authState,
}));

vi.mock("../../lib/auth/authClient", () => ({
  get IS_SUPABASE_CONFIGURED() {
    return authFlags.configured;
  },
  get IS_AUTH_BYPASS_ENABLED() {
    return authFlags.bypass;
  },
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    authState.user = null;
    authState.loading = false;
    authFlags.configured = true;
    authFlags.bypass = false;
  });

  it("redirige a login cuando no hay sesion", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/login" element={<div>Login Screen</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Private Area</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Login Screen")).toBeTruthy();
  });

  it("permite acceso cuando hay usuario autenticado", async () => {
    authState.user = { id: "usr-1" };

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/login" element={<div>Login Screen</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Private Area</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Private Area")).toBeTruthy();
  });

  it("permite acceso en bypass de demo", async () => {
    authFlags.configured = false;
    authFlags.bypass = true;

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/login" element={<div>Login Screen</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Private Area</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Private Area")).toBeTruthy();
  });
});
