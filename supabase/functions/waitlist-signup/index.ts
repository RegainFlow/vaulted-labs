import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Tier calculation — mirrors src/data/vaults.ts getActiveTierInfo()
const INCENTIVE_TIERS = [
  { label: "founder", creditAmount: 200, endAt: 50 },
  { label: "early_access", creditAmount: 100, endAt: 150 },
  { label: "beta", creditAmount: 50, endAt: 350 },
  { label: "early_bird", creditAmount: 25, endAt: 450 },
];

function getTierForCount(count: number): { tier: string | null; creditAmount: number } {
  for (const t of INCENTIVE_TIERS) {
    if (count < t.endAt) {
      return { tier: t.label, creditAmount: t.creditAmount };
    }
  }
  return { tier: null, creditAmount: 0 };
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
      text.split("\n").map((d) => d.trim().toLowerCase()).filter(Boolean)
    );
  } catch {
    // If fetch fails, use an empty set — don't block signups
    disposableDomainsCache = new Set();
  }
  return disposableDomainsCache;
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

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const { email, turnstileToken } = await req.json();

    // --- Turnstile verification ---
    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");
    if (turnstileSecret) {
      if (!turnstileToken) {
        return jsonResponse({ error: "Bot verification failed. Please try again." }, 403);
      }
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: turnstileSecret,
          response: turnstileToken,
          remoteip: getClientIP(req),
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return jsonResponse({ error: "Bot verification failed. Please try again." }, 403);
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
      return jsonResponse({ error: "Disposable emails are not accepted." }, 400);
    }

    // --- Supabase client (service role) ---
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const ip = getClientIP(req);

    // --- Rate limiting ---
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { count: minuteCount } = await supabase
      .from("waitlist_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("attempted_at", oneMinuteAgo);

    if ((minuteCount ?? 0) >= 1) {
      return jsonResponse({ error: "Please wait a minute before trying again." }, 429);
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: hourCount } = await supabase
      .from("waitlist_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("attempted_at", oneHourAgo);

    if ((hourCount ?? 0) >= 3) {
      return jsonResponse({ error: "Too many attempts. Try again later." }, 429);
    }

    // --- Get verified waitlist count for tier calculation ---
    const { count: waitlistCount } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    const { tier, creditAmount } = getTierForCount(waitlistCount ?? 0);

    // --- Insert into waitlist ---
    const { error: insertError } = await supabase
      .from("waitlist")
      .insert([{ email: cleanEmail, credit_amount: creditAmount, tier, ip_address: ip }]);

    if (insertError) {
      if (insertError.code === "23505") {
        return jsonResponse({ error: "This email is already registered." }, 409);
      }
      throw insertError;
    }

    // --- Record rate limit hit ---
    await supabase.from("waitlist_rate_limits").insert([{ ip_address: ip }]);

    return jsonResponse({ success: true, tier, creditAmount }, 200);
  } catch (err) {
    console.error("waitlist-signup error:", err);
    return jsonResponse({ error: "An unexpected error occurred. Please try again." }, 500);
  }
});
