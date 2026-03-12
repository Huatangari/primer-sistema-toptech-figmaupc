import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProtectedRoute } from "./ProtectedRoute";

const authState = {
  user: null as { id: string } | null,
  session: null as { access_token: string } | null,
  loading: false,
};

const authFlags = {
  configured: true,
};

vi.mock("../../lib/auth/AuthProvider", () => ({
  useAuthContext: () => authState,
}));

vi.mock("../../lib/auth/authClient", () => ({
  get IS_SUPABASE_CONFIGURED() {
    return authFlags.configured;
  },
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    authState.user = null;
    authState.session = null;
    authState.loading = false;
    authFlags.configured = true;
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
    authState.session = { access_token: "token" };

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

  it("redirige a login cuando Supabase no esta configurado", async () => {
    authFlags.configured = false;

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
});
