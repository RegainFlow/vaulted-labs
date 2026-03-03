import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "jsr:@supabase/supabase-js@2/cors";
import {
  PROVABLY_FAIR_ALGORITHM_VERSION,
  deriveFairDigest,
  digestToUnit,
  hashPayload,
  hashServerSeed,
} from "./provably-fair-core.ts";
import {
  resolveBattleFromUnits,
  resolveBonusLockFromUnits,
  resolveForgeRollFromUnits,
  resolveVaultOpenFromUnits,
} from "./provably-fair-games.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ROTATION_THRESHOLD = 25;
const COMMIT_TTL_MS = 24 * 60 * 60 * 1000;

export const supabaseAdmin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

export function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function randomHex(bytes = 24) {
  const values = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(values)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

export interface DbCommitRow {
  id: string;
  wallet_id: string;
  algorithm_version: string;
  server_seed: string;
  server_seed_hash: string;
  next_nonce: number;
  rotation_threshold: number;
  status: "active" | "revealed";
  created_at: string;
  expires_at: string;
  revealed_at: string | null;
}

function toCommitState(row: DbCommitRow) {
  return {
    commitId: row.id,
    serverSeedHash: row.server_seed_hash,
    algorithmVersion: row.algorithm_version,
    nextNonce: row.next_nonce,
    rotationThreshold: row.rotation_threshold,
    createdAt: row.created_at,
  };
}

export async function createCommit(walletId: string) {
  if (!supabaseAdmin) throw new Error("Supabase service role is not configured.");
  const serverSeed = randomHex(32);
  const serverSeedHash = await hashServerSeed(serverSeed);
  const row: DbCommitRow = {
    id: crypto.randomUUID(),
    wallet_id: walletId,
    algorithm_version: PROVABLY_FAIR_ALGORITHM_VERSION,
    server_seed: serverSeed,
    server_seed_hash: serverSeedHash,
    next_nonce: 0,
    rotation_threshold: ROTATION_THRESHOLD,
    status: "active",
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + COMMIT_TTL_MS).toISOString(),
    revealed_at: null,
  };

  const { error } = await supabaseAdmin.from("provably_fair_commits").insert(row);
  if (error) {
    const isDuplicateActiveCommit =
      error.code === "23505" &&
      typeof error.message === "string" &&
      error.message.includes("provably_fair_commits_wallet_active_idx");

    if (isDuplicateActiveCommit) {
      const existing = await getActiveCommit(walletId);
      if (existing) return existing;
    }
    throw error;
  }
  return row;
}

export async function getActiveCommit(walletId: string): Promise<DbCommitRow | null> {
  if (!supabaseAdmin) throw new Error("Supabase service role is not configured.");
  const { data, error } = await supabaseAdmin
    .from("provably_fair_commits")
    .select("*")
    .eq("wallet_id", walletId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as DbCommitRow | null;
}

export async function revealCommit(row: DbCommitRow) {
  if (!supabaseAdmin) throw new Error("Supabase service role is not configured.");
  const revealedAt = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from("provably_fair_commits")
    .update({ status: "revealed", revealed_at: revealedAt })
    .eq("id", row.id);
  if (error) throw error;
  return {
    commitId: row.id,
    serverSeedHash: row.server_seed_hash,
    serverSeed: row.server_seed,
    revealedAt,
  };
}

export async function ensureActiveCommit(walletId: string) {
  let revealedCommit:
    | {
        commitId: string;
        serverSeedHash: string;
        serverSeed: string;
        revealedAt: string;
      }
    | undefined;
  let activeCommit = await getActiveCommit(walletId);

  if (
    activeCommit &&
    (activeCommit.next_nonce >= activeCommit.rotation_threshold ||
      new Date(activeCommit.expires_at).getTime() <= Date.now())
  ) {
    revealedCommit = await revealCommit(activeCommit);
    activeCommit = await createCommit(walletId);
  }

  if (!activeCommit) {
    activeCommit = await createCommit(walletId);
  }

  return { activeCommit, revealedCommit };
}

function traceLabels(gameType: string, count: number) {
  return Array.from({ length: count }).map((_, index) => `${gameType}_${index}`);
}

function gameTraceCount(gameType: string) {
  switch (gameType) {
    case "vault_open":
      return 8;
    case "bonus_lock":
      return 4;
    case "forge_roll":
      return 6;
    case "battle_sim":
      return 41;
    default:
      return 8;
  }
}

export async function resolveFairRoll(input: {
  walletId: string;
  clientSeed: string;
  gameType: string;
  requestPayload: Record<string, unknown>;
  linkedTransactionId?: string;
  linkedItemId?: string;
  linkedParentReceiptId?: string;
}) {
  if (!supabaseAdmin) throw new Error("Supabase service role is not configured.");

  const { activeCommit, revealedCommit } = await ensureActiveCommit(input.walletId);
  const payloadHash = await hashPayload(input.requestPayload);
  const nonce = activeCommit.next_nonce;
  const count = gameTraceCount(input.gameType);
  const labels = traceLabels(input.gameType, count);

  const rollTrace = [];
  const units: number[] = [];
  for (let cursor = 0; cursor < count; cursor += 1) {
    const digest = await deriveFairDigest(
      activeCommit.server_seed,
      input.clientSeed,
      nonce,
      cursor,
      input.gameType,
      payloadHash,
      PROVABLY_FAIR_ALGORITHM_VERSION
    );
    const unit = digestToUnit(digest);
    units.push(unit);
    rollTrace.push({
      cursor,
      label: labels[cursor],
      digest,
      unit,
      derivedValue: null,
    });
  }

  let resultPayload: Record<string, unknown>;
  switch (input.gameType) {
    case "vault_open":
      resultPayload = resolveVaultOpenFromUnits({
        vaultName: input.requestPayload.vaultName as
          | "Bronze"
          | "Silver"
          | "Gold"
          | "Platinum"
          | "Obsidian"
          | "Diamond",
        price: Number(input.requestPayload.price),
        prestigeLevel: Number(input.requestPayload.prestigeLevel ?? 0),
        categoryKey:
          typeof input.requestPayload.categoryKey === "string"
            ? input.requestPayload.categoryKey
            : null,
        funkoPools: input.requestPayload.funkoPools as
          | Partial<Record<"common" | "uncommon" | "rare" | "legendary", Array<Record<string, unknown>>>>
          | undefined,
        units,
      }) as Record<string, unknown>;
      break;
    case "bonus_lock":
      resultPayload = resolveBonusLockFromUnits({
        purchasedTierName: input.requestPayload.vaultName as
          | "Bronze"
          | "Silver"
          | "Gold"
          | "Platinum"
          | "Obsidian"
          | "Diamond",
        units,
      }) as Record<string, unknown>;
      break;
    case "forge_roll":
      resultPayload = resolveForgeRollFromUnits({
        inputRarities: input.requestPayload.inputRarities as any,
        inputVaultTiers: input.requestPayload.inputVaultTiers as any,
        inputValues: input.requestPayload.inputValues as [number, number, number],
        spinsUsed: Number(input.requestPayload.spinsUsed ?? 0),
        units,
      }) as Record<string, unknown>;
      break;
    case "battle_sim":
      resultPayload = resolveBattleFromUnits({
        battleId: input.requestPayload.battleId as string,
        squadStats: input.requestPayload.squadStats as {
          totalAtk: number;
          totalDef: number;
          totalAgi: number;
          memberCount: number;
        },
        rankLevel: Number(input.requestPayload.rankLevel ?? 0),
        units,
      }) as unknown as Record<string, unknown>;
      break;
    default:
      throw new Error(`Unsupported game type: ${input.gameType}`);
  }

  const receipt = {
    id: crypto.randomUUID(),
    wallet_id: input.walletId,
    commit_id: activeCommit.id,
    game_type: input.gameType,
    algorithm_version: PROVABLY_FAIR_ALGORITHM_VERSION,
    nonce,
    client_seed: input.clientSeed,
    payload_hash: payloadHash,
    request_payload: input.requestPayload,
    result_payload: resultPayload,
    roll_trace: rollTrace,
    linked_transaction_id: input.linkedTransactionId ?? null,
    linked_item_id: input.linkedItemId ?? null,
    linked_parent_receipt_id: input.linkedParentReceiptId ?? null,
  };

  const { error: receiptError } = await supabaseAdmin
    .from("provably_fair_receipts")
    .insert(receipt);
  if (receiptError) throw receiptError;

  const { error: commitUpdateError } = await supabaseAdmin
    .from("provably_fair_commits")
    .update({ next_nonce: nonce + 1 })
    .eq("id", activeCommit.id);
  if (commitUpdateError) throw commitUpdateError;

  return {
    resultPayload,
    receipt: {
      id: receipt.id,
      walletId: input.walletId,
      gameType: input.gameType,
      algorithmVersion: PROVABLY_FAIR_ALGORITHM_VERSION,
      commitId: activeCommit.id,
      serverSeedHash: activeCommit.server_seed_hash,
      revealStatus: "pending_reveal" as const,
      clientSeed: input.clientSeed,
      nonce,
      payloadHash,
      requestPayload: input.requestPayload,
      resultPayload,
      rollTrace,
      linkedTransactionId: input.linkedTransactionId,
      linkedItemId: input.linkedItemId,
      linkedParentReceiptId: input.linkedParentReceiptId,
      createdAt: new Date().toISOString(),
    },
    activeCommit: toCommitState({ ...activeCommit, next_nonce: nonce + 1 }),
    revealedCommit,
  };
}

export { toCommitState };
