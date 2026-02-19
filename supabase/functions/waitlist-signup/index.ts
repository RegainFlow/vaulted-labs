// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const INCENTIVE_TIERS: IncentiveTier[] = [
  {
    label: "Founder",
    creditAmount: 100,
    endAt: 25,
  },
  {
    label: "Early Access",
    creditAmount: 75,
    endAt: 50,
  },
  {
    label: "Beta",
    creditAmount: 50,
    endAt: 75,
  },
  {
    label: "Early Bird",
    creditAmount: 25,
    endAt: 100,
  },
];

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

interface TurnstileVerificationResponse {
  success: boolean;
  ["error-codes"]?: string[];
}

// Disposable email domain blocklist — fetched once, cached in module scope
let disposableDomainsCache: Set<string> | null = null;

async function loadDisposableDomains(): Promise<Set<string>> {
  if (disposableDomainsCache) return disposableDomainsCache;
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/master/disposable_email_blocklist.conf"
    );
    if (!res.ok) throw new Error(`Failed to fetch blocklist: ${res.status}`);
    const text = await res.text();
    disposableDomainsCache = new Set(
      text
        .split("\n")
        .map((d) => d.trim().toLowerCase())
        .filter(Boolean)
    );
  } catch {
    // If fetch fails, use an empty set — don't block signups
    disposableDomainsCache = new Set();
  }
  return disposableDomainsCache;
}

function getTierForCount(count: number): {
  tier: string | null;
  creditAmount: number;
} {
  for (const t of INCENTIVE_TIERS) {
    if (count < t.endAt) {
      return { tier: t.label, creditAmount: t.creditAmount };
    }
  }
  return { tier: null, creditAmount: 0 };
}

function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ?? "unknown";
}

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getTurnstileSecret() {
  return (
    Deno.env.get("CLOUDFLARE_TURNSTILE_SECRET_KEY") ??
    Deno.env.get("CLOUDFLARE_SECRET_KEY") ??
    Deno.env.get("TURNSTILE_SECRET_KEY") ??
    ""
  );
}

async function verifyTurnstile(token: string, ipAddress: string) {
  const secret = getTurnstileSecret();
  if (!secret) {
    return true;
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  if (ipAddress && ipAddress !== "unknown") {
    formData.append("remoteip", ipAddress);
  }

  const verifyRes = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    body: formData,
  });

  if (!verifyRes.ok) {
    return false;
  }

  const verification =
    (await verifyRes.json()) as TurnstileVerificationResponse;
  if (!verification.success) {
    console.warn("Turnstile verification failed:", verification["error-codes"]);
  }

  return verification.success;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const { email, token, turnstileToken } = await req.json();

    // --- Turnstile verification ---
    const turnstileSecret = getTurnstileSecret();
    const captchaToken =
      typeof token === "string"
        ? token
        : typeof turnstileToken === "string"
          ? turnstileToken
          : "";

    if (turnstileSecret && !captchaToken) {
      return jsonResponse(
        { error: "Bot verification failed. Please try again." },
        403
      );
    }

    const ip = getClientIP(req);
    if (turnstileSecret) {
      const verified = await verifyTurnstile(captchaToken, ip);
      if (!verified) {
        return jsonResponse(
          { error: "Bot verification failed. Please try again." },
          403
        );
      }
    }

    // --- Email validation ---
    if (!email || typeof email !== "string") {
      return jsonResponse({ error: "Email is required." }, 400);
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(cleanEmail)) {
      return jsonResponse({ error: "Invalid email format." }, 400);
    }

    // --- Disposable email check ---
    const blocklist = await loadDisposableDomains();
    const domain = cleanEmail.split("@")[1];
    if (blocklist.has(domain)) {
      return jsonResponse(
        { error: "Disposable emails are not accepted." },
        400
      );
    }

    if (!supabaseAdmin) {
      return jsonResponse({ error: "Server is not configured." }, 500);
    }

    // --- Rate limiting ---
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { count: minuteCount } = await supabaseAdmin
      .from("waitlist_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("attempted_at", oneMinuteAgo);

    if ((minuteCount ?? 0) >= 1) {
      return jsonResponse(
        { error: "Please wait a minute before trying again." },
        429
      );
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: hourCount } = await supabaseAdmin
      .from("waitlist_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("attempted_at", oneHourAgo);

    if ((hourCount ?? 0) >= 3) {
      return jsonResponse(
        { error: "Too many attempts. Try again later." },
        429
      );
    }

    // --- Get verified waitlist count for tier calculation ---
    const { count: waitlistCount } = await supabaseAdmin
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    const { tier, creditAmount } = getTierForCount(waitlistCount ?? 0);

    // --- Insert into waitlist ---
    const { error: insertError } = await supabaseAdmin.from("waitlist").insert([
      {
        email: cleanEmail,
        credit_amount: creditAmount,
        tier,
        ip_address: ip,
      },
    ]);

    if (insertError) {
      if (insertError.code === "23505") {
        return jsonResponse(
          { error: "This email is already registered." },
          409
        );
      }
      throw insertError;
    }

    // --- Record rate limit hit ---
    await supabaseAdmin
      .from("waitlist_rate_limits")
      .insert([{ ip_address: ip }]);

    return jsonResponse({ success: true, tier, creditAmount }, 200);
  } catch (err) {
    console.error("waitlist-signup error:", err);
    return jsonResponse(
      { error: "An unexpected error occurred. Please try again." },
      500
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/waitlist-signup' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"email":"person@example.com","token":"optional-token"}'

*/
