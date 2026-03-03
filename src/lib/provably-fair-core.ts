import type {
  ProvablyFairReceipt,
  ProvablyFairVerificationResult,
} from "../types/provably-fair";

export const PROVABLY_FAIR_ALGORITHM_VERSION = "pf_v1";

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function canonicalizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => canonicalizeValue(entry));
  }

  if (isPlainObject(value)) {
    return Object.keys(value)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = canonicalizeValue(value[key]);
        return acc;
      }, {});
  }

  return value;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(input: string): Promise<string> {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input)
  );
  return bytesToHex(new Uint8Array(hash));
}

async function hmacSha256Hex(key: string, input: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(input)
  );
  return bytesToHex(new Uint8Array(signature));
}

export function canonicalizePayload(payload: Record<string, unknown>): string {
  return JSON.stringify(canonicalizeValue(payload));
}

export async function hashServerSeed(serverSeed: string): Promise<string> {
  return sha256Hex(serverSeed);
}

export async function hashPayload(
  payload: Record<string, unknown>
): Promise<string> {
  return sha256Hex(canonicalizePayload(payload));
}

export async function deriveFairDigest(
  serverSeed: string,
  clientSeed: string,
  nonce: number,
  cursor: number,
  gameType: string,
  payloadHash: string,
  algorithmVersion = PROVABLY_FAIR_ALGORITHM_VERSION
): Promise<string> {
  const message = `${clientSeed}:${nonce}:${cursor}:${gameType}:${payloadHash}:${algorithmVersion}`;
  return hmacSha256Hex(serverSeed, message);
}

export function digestToUnit(digest: string): number {
  const slice = digest.slice(0, 13);
  const numerator = Number.parseInt(slice, 16);
  return numerator / Math.pow(2, 52);
}

export async function verifyReceipt(
  receipt: ProvablyFairReceipt
): Promise<ProvablyFairVerificationResult> {
  if (!receipt.serverSeed) {
    return {
      valid: false,
      mismatches: ["Server seed has not been revealed yet."],
    };
  }

  const mismatches: string[] = [];
  const expectedHash = await hashServerSeed(receipt.serverSeed);
  if (expectedHash !== receipt.serverSeedHash) {
    mismatches.push("Server seed hash mismatch.");
  }

  const expectedPayloadHash = await hashPayload(receipt.requestPayload);
  if (expectedPayloadHash !== receipt.payloadHash) {
    mismatches.push("Payload hash mismatch.");
  }

  for (const trace of receipt.rollTrace) {
    const expectedDigest = await deriveFairDigest(
      receipt.serverSeed,
      receipt.clientSeed,
      receipt.nonce,
      trace.cursor,
      receipt.gameType,
      receipt.payloadHash,
      receipt.algorithmVersion
    );
    if (expectedDigest !== trace.digest) {
      mismatches.push(`Digest mismatch at cursor ${trace.cursor}.`);
      continue;
    }

    const expectedUnit = digestToUnit(expectedDigest);
    if (Math.abs(expectedUnit - trace.unit) > Number.EPSILON) {
      mismatches.push(`Unit mismatch at cursor ${trace.cursor}.`);
    }
  }

  return {
    valid: mismatches.length === 0,
    mismatches,
  };
}
