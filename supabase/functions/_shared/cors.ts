/**
 * Headers CORS para Edge Functions.
 * Define ALLOWED_ORIGINS como lista separada por comas.
 * Ejemplo: https://app.example.com,https://staging.example.com
 */
const configuredOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const fallbackOrigin = "http://localhost:5173";

function resolveOrigin(request?: Request) {
  const requestOrigin = request?.headers.get("origin") ?? null;

  if (configuredOrigins.length === 0) {
    return requestOrigin ?? fallbackOrigin;
  }

  if (requestOrigin && configuredOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return configuredOrigins[0];
}

function buildCorsHeaders(request?: Request) {
  return {
    "Access-Control-Allow-Origin": resolveOrigin(request),
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Vary": "Origin",
  };
}

/** Respuesta para preflight OPTIONS. */
export function handleCors(request?: Request) {
  return new Response(null, { status: 204, headers: buildCorsHeaders(request) });
}

/** Envuelve una respuesta JSON con headers CORS. */
export function jsonResponse(data: unknown, status = 200, request?: Request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...buildCorsHeaders(request), "Content-Type": "application/json" },
  });
}
