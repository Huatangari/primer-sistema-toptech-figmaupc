const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Centralized fetch wrapper.
 * All services should use this function instead of calling fetch() directly.
 *
 * To add auth headers when the backend is ready, add:
 *   Authorization: `Bearer ${getToken()}`
 * to the headers object below.
 */
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${getToken()}`,
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new ApiError(res.status, `Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}
