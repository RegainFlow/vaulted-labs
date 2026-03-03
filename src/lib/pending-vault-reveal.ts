import type { ItemAcquisitionMeta, Rarity, VaultTierName } from "../types/game";

export const PENDING_VAULT_REVEAL_KEY = "vaultedlabs-pending-vault-reveal";

export interface PendingVaultReveal {
  product: string;
  vaultTier: VaultTierName;
  rarity: Rarity;
  value: number;
  funkoId?: string;
  funkoName?: string;
  acquisitionMeta: ItemAcquisitionMeta;
  receiptId?: string;
  createdAt: number;
}

export function savePendingVaultReveal(payload: PendingVaultReveal) {
  try {
    localStorage.setItem(PENDING_VAULT_REVEAL_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage errors; reveal fallback should still attempt normal in-app persistence.
  }
}

export function loadPendingVaultReveal(): PendingVaultReveal | null {
  try {
    const raw = localStorage.getItem(PENDING_VAULT_REVEAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingVaultReveal;
  } catch {
    return null;
  }
}

export function clearPendingVaultReveal() {
  try {
    localStorage.removeItem(PENDING_VAULT_REVEAL_KEY);
  } catch {
    // Ignore storage errors.
  }
}
