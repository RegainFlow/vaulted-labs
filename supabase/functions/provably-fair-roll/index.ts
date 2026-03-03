import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";
import { jsonResponse, resolveFairRoll } from "../_shared/provably-fair.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const payload = await req.json();
    if (
      !payload.walletId ||
      !payload.clientSeed ||
      !payload.gameType ||
      !payload.requestPayload
    ) {
      return jsonResponse({ error: "Missing required provably fair payload." }, 400);
    }

    const response = await resolveFairRoll(payload);
    return jsonResponse(response);
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500
    );
  }
});
