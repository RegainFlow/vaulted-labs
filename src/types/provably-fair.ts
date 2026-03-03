export type ProvablyFairGameType =
  | "vault_open"
  | "bonus_lock"
  | "forge_roll"
  | "battle_sim";

export type ProvablyFairRevealStatus = "pending_reveal" | "revealed";

export interface ProvablyFairCommitState {
  commitId: string;
  serverSeedHash: string;
  algorithmVersion: string;
  nextNonce: number;
  rotationThreshold: number;
  createdAt: string;
}

export interface ProvablyFairRollTrace {
  cursor: number;
  label: string;
  digest: string;
  unit: number;
  derivedValue: string | number | boolean | null;
}

export interface ProvablyFairReceipt {
  id: string;
  walletId: string;
  gameType: ProvablyFairGameType;
  algorithmVersion: string;
  commitId: string;
  serverSeedHash: string;
  serverSeed?: string;
  revealStatus: ProvablyFairRevealStatus;
  clientSeed: string;
  nonce: number;
  payloadHash: string;
  requestPayload: Record<string, unknown>;
  resultPayload: Record<string, unknown>;
  rollTrace: ProvablyFairRollTrace[];
  linkedTransactionId?: string;
  linkedItemId?: string;
  linkedParentReceiptId?: string;
  createdAt: string;
}

export interface ProvablyFairSessionResponse {
  activeCommit: ProvablyFairCommitState;
  revealedCommit?: {
    commitId: string;
    serverSeedHash: string;
    serverSeed: string;
    revealedAt: string;
  };
}

export interface ProvablyFairRollRequest {
  walletId: string;
  clientSeed: string;
  gameType: ProvablyFairGameType;
  requestPayload: Record<string, unknown>;
  linkedTransactionId?: string;
  linkedItemId?: string;
  linkedParentReceiptId?: string;
}

export interface ProvablyFairRollResponse {
  resultPayload: Record<string, unknown>;
  receipt: ProvablyFairReceipt;
  activeCommit: ProvablyFairCommitState;
  revealedCommit?: {
    commitId: string;
    serverSeedHash: string;
    serverSeed: string;
    revealedAt: string;
  };
}

export interface ProvablyFairVerificationResult {
  valid: boolean;
  mismatches: string[];
}
