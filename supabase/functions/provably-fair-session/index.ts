import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";
import {
  ensureActiveCommit,
  jsonResponse,
  toCommitState,
} from "../_shared/provably-fair.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const { walletId } = await req.json();
    if (!walletId || typeof walletId !== "string") {
      return jsonResponse({ error: "walletId is required." }, 400);
    }

    const { activeCommit, revealedCommit } = await ensureActiveCommit(walletId);
    return jsonResponse({
      activeCommit: toCommitState(activeCommit),
      ...(revealedCommit ? { revealedCommit } : {}),
    });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500
    );
  }
});
