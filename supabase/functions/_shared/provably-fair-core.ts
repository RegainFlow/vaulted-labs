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
