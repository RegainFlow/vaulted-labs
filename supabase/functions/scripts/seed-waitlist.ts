/**
 * Seed script — insert test users into the waitlist table.
 *
 * Usage:
 *   npx tsx scripts/seed-waitlist.ts                  # insert 1000 users
 *   npx tsx scripts/seed-waitlist.ts --count 500      # insert 500 users
 *   npx tsx scripts/seed-waitlist.ts --clear           # wipe test data first, then insert
 *   npx tsx scripts/seed-waitlist.ts --clear-only      # wipe test data without inserting
 *
 * Required env vars (set in .env or export manually):
 *   VITE_SUPABASE_URL              — your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY      — service role key (bypasses RLS)
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";
import { INCENTIVE_TIERS } from "../src/data/vaults";

/* ─── Load .env manually (no dotenv dependency) ─── */

function loadEnv() {
  try {
    const envPath = resolve(import.meta.dirname ?? ".", "..", ".env");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  } catch {
    throw new Error(".env not found — rely on exported env vars");
  }
}

loadEnv();

/* ─── Config ─── */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "\n✘ Missing env vars. Make sure these are set:\n" +
      "  VITE_SUPABASE_URL             (in .env)\n" +
      "  SUPABASE_SERVICE_ROLE_KEY      (export it or add to .env)\n"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

/* ─── Tier logic (mirrors Edge Function) ─── */

function getTierForPosition(position: number): {
  tier: string | null;
  creditAmount: number;
} {
  for (const t of INCENTIVE_TIERS) {
    if (position < t.endAt) {
      return { tier: t.label, creditAmount: t.creditAmount };
    }
  }
  return { tier: null, creditAmount: 0 };
}

/* ─── Fake data generators ─── */

const FIRST_NAMES = [
  "alex",
  "jordan",
  "taylor",
  "morgan",
  "casey",
  "riley",
  "avery",
  "quinn",
  "parker",
  "blake",
  "drew",
  "sage",
  "reese",
  "skyler",
  "jamie",
  "devon",
  "kai",
  "rowan",
  "finley",
  "emerson",
  "harper",
  "logan",
  "dakota",
  "phoenix",
  "river",
  "eden",
  "micah",
  "nico",
  "jude",
  "max",
  "leo",
  "zara",
  "mia",
  "ella",
  "noah",
  "liam",
  "ava",
  "luna",
  "ivy",
  "ruby",
  "oscar",
  "felix",
  "iris",
  "vera",
  "cole",
  "ace",
  "zoe",
  "aria",
  "maya",
  "erin",
];

const LAST_NAMES = [
  "smith",
  "chen",
  "garcia",
  "kim",
  "patel",
  "nguyen",
  "jones",
  "williams",
  "brown",
  "davis",
  "miller",
  "wilson",
  "moore",
  "taylor",
  "anderson",
  "lee",
  "thomas",
  "jackson",
  "white",
  "harris",
  "martin",
  "thompson",
  "clark",
  "lewis",
  "walker",
  "hall",
  "allen",
  "king",
  "wright",
  "lopez",
  "hill",
  "scott",
  "green",
  "baker",
  "ross",
  "rivera",
  "campbell",
  "mitchell",
  "santos",
  "reed",
  "cox",
  "diaz",
  "soto",
  "ramos",
  "reyes",
  "cruz",
  "morales",
  "ortiz",
  "silva",
  "perez",
];

const DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "protonmail.com",
  "fastmail.com",
  "hey.com",
  "pm.me",
  "tutanota.com",
  "zoho.com",
  "aol.com",
  "mail.com",
  "yandex.com",
  "gmx.com",
];

const SEPARATORS = [".", "_", "", "-"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmail(index: number): string {
  const first = randomItem(FIRST_NAMES);
  const last = randomItem(LAST_NAMES);
  const sep = randomItem(SEPARATORS);
  const domain = randomItem(DOMAINS);
  // Add index suffix to guarantee uniqueness
  const suffix = index.toString().padStart(4, "0");
  return `${first}${sep}${last}${suffix}@${domain}`;
}

function generateIP(): string {
  // Generate realistic-looking IPs (avoid reserved ranges)
  const a = Math.floor(Math.random() * 200) + 10; // 10-209
  const b = Math.floor(Math.random() * 256);
  const c = Math.floor(Math.random() * 256);
  const d = Math.floor(Math.random() * 254) + 1;
  return `${a}.${b}.${c}.${d}`;
}

function generateTimestamp(index: number, total: number): string {
  // Spread signups over the past 60 days with an accelerating curve
  // (slow trickle early, faster as word spreads)
  const now = Date.now();
  const sixtyDaysMs = 60 * 24 * 60 * 60 * 1000;
  const progress = index / total; // 0→1
  const curved = progress * progress; // quadratic = accelerating
  const ts = now - sixtyDaysMs * (1 - curved);
  // Add some jitter (±2 hours)
  const jitter = (Math.random() - 0.5) * 4 * 60 * 60 * 1000;
  return new Date(ts + jitter).toISOString();
}

/* ─── CLI args ─── */

const args = process.argv.slice(2);
const shouldClear = args.includes("--clear") || args.includes("--clear-only");
const clearOnly = args.includes("--clear-only");
const countIdx = args.indexOf("--count");
const COUNT = countIdx !== -1 ? parseInt(args[countIdx + 1], 10) : 1000;

if (isNaN(COUNT) || COUNT < 1) {
  console.error("✘ --count must be a positive number");
  process.exit(1);
}

/* ─── Main ─── */

async function clearTestData() {
  console.log("\n🧹 Clearing existing waitlist data...");

  const { error, count } = await supabase
    .from("waitlist")
    .delete()
    .neq("id", 0) // delete all rows
    .select("*", { count: "exact", head: true });

  if (error) {
    // If the neq trick doesn't work, try a different approach
    const { error: err2 } = await supabase
      .from("waitlist")
      .delete()
      .gte("id", 0);
    if (err2) {
      console.error("  ✘ Failed to clear:", err2.message);
      process.exit(1);
    }
  }

  // Also clear rate limits
  await supabase.from("waitlist_rate_limits").delete().gte("id", 0);

  console.log(`  ✓ Cleared waitlist data`);
}

async function getExistingCount(): Promise<number> {
  const { count, error } = await supabase
    .from("waitlist")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("✘ Failed to get existing count:", error.message);
    process.exit(1);
  }
  return count ?? 0;
}

async function seed() {
  console.log(`\n🔗 Connected to: ${SUPABASE_URL}`);

  if (shouldClear) {
    await clearTestData();
    if (clearOnly) {
      console.log("\n✓ Done (clear only).\n");
      return;
    }
  }

  const existingCount = await getExistingCount();
  console.log(`📊 Existing waitlist entries: ${existingCount}`);
  console.log(`🚀 Inserting ${COUNT} test users...\n`);

  const BATCH_SIZE = 100;
  let inserted = 0;
  const tierCounts: Record<string, number> = {
    founder: 0,
    early_access: 0,
    beta: 0,
    early_bird: 0,
    none: 0,
  };

  for (let batch = 0; batch < COUNT; batch += BATCH_SIZE) {
    const batchSize = Math.min(BATCH_SIZE, COUNT - batch);
    const rows = [];

    for (let i = 0; i < batchSize; i++) {
      const position = existingCount + batch + i;
      const { tier, creditAmount } = getTierForPosition(position);

      rows.push({
        email: generateEmail(batch + i),
        credit_amount: creditAmount,
        tier,
        ip_address: generateIP(),
        created_at: generateTimestamp(batch + i, COUNT),
      });

      tierCounts[tier ?? "none"]++;
    }

    const { error } = await supabase.from("waitlist").insert(rows);

    if (error) {
      console.error(
        `  ✘ Batch ${batch / BATCH_SIZE + 1} failed:`,
        error.message
      );
      // If it's a unique constraint violation, try one-by-one
      if (error.code === "23505") {
        console.log("    ↳ Retrying individually (duplicate emails)...");
        let skipped = 0;
        for (const row of rows) {
          const { error: singleErr } = await supabase
            .from("waitlist")
            .insert([row]);
          if (singleErr) {
            skipped++;
          } else {
            inserted++;
          }
        }
        if (skipped > 0) console.log(`    ↳ Skipped ${skipped} duplicates`);
        continue;
      }
      process.exit(1);
    }

    inserted += batchSize;
    const pct = Math.round(((batch + batchSize) / COUNT) * 100);
    process.stdout.write(`\r  Progress: ${pct}% (${inserted} inserted)`);
  }

  // Final count
  const finalCount = await getExistingCount();

  console.log(`\n\n✓ Done! Inserted ${inserted} users.\n`);
  console.log("── Tier Breakdown ──────────────────────────");
  console.log(
    `  Founder ($200)      : ${tierCounts.founder.toString().padStart(5)} users  (positions 0–49)`
  );
  console.log(
    `  Early Access ($100) : ${tierCounts.early_access.toString().padStart(5)} users  (positions 50–149)`
  );
  console.log(
    `  Beta ($50)          : ${tierCounts.beta.toString().padStart(5)} users  (positions 150–349)`
  );
  console.log(
    `  Early Bird ($25)    : ${tierCounts.early_bird.toString().padStart(5)} users  (positions 350–449)`
  );
  console.log(
    `  No Tier ($0)        : ${tierCounts.none.toString().padStart(5)} users  (positions 450+)`
  );
  console.log("────────────────────────────────────────────");
  console.log(`  Total in DB         : ${finalCount.toString().padStart(5)}`);
  console.log("");
}

seed().catch((err) => {
  console.error("\n✘ Unexpected error:", err);
  process.exit(1);
});
