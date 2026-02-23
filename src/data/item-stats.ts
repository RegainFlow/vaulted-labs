import type { Rarity, VaultTierName } from "../types/vault";
import type { ItemStats } from "../types/collectible";

/* ─── Rarity base stat ranges ─── */
const RARITY_STAT_RANGES: Record<Rarity, { min: number; max: number }> = {
  common:    { min: 5,  max: 12 },
  uncommon:  { min: 10, max: 20 },
  rare:      { min: 18, max: 30 },
  legendary: { min: 28, max: 42 }
};

/* ─── Vault tier stat multipliers ─── */
const VAULT_TIER_MULTIPLIERS: Record<VaultTierName, number> = {
  Bronze:   1.00,
  Silver:   1.03,
  Gold:     1.06,
  Platinum: 1.09,
  Obsidian: 1.12,
  Diamond:  1.15
};

function randomInRange(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

/**
 * Generate combat stats for a collectible based on its rarity and vault tier.
 * Each stat (atk, def, agi) is independently rolled within the rarity range,
 * then multiplied by the vault tier multiplier.
 */
export function generateItemStats(rarity: Rarity, vaultTier: VaultTierName): ItemStats {
  const range = RARITY_STAT_RANGES[rarity];
  const mult = VAULT_TIER_MULTIPLIERS[vaultTier];

  return {
    atk: Math.round(randomInRange(range.min, range.max) * mult),
    def: Math.round(randomInRange(range.min, range.max) * mult),
    agi: Math.round(randomInRange(range.min, range.max) * mult)
  };
}
