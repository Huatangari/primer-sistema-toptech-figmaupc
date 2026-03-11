/** Headers CORS para Edge Functions. */
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

/** Respuesta para preflight OPTIONS. */
export function handleCors() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

/** Envuelve una respuesta JSON con headers CORS. */
export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
