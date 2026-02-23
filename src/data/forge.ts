import type { Rarity } from "../types/vault";

/* ─── Forge Probability Tables ─── */

/**
 * Base forge odds keyed by sorted rarity triple.
 * Format: "rarity_rarity_rarity" (sorted alphabetically)
 * Values: [common%, uncommon%, rare%, legendary%]
 */
const FORGE_ODDS_TABLE: Record<string, [number, number, number, number]> = {
  // All same rarity
  "common_common_common":       [70, 25, 4, 1],
  "uncommon_uncommon_uncommon": [30, 45, 20, 5],
  "rare_rare_rare":             [5, 20, 55, 20],
  "legendary_legendary_legendary": [0, 5, 25, 70],

  // Two same + one different
  "common_common_uncommon":     [55, 35, 8, 2],
  "common_common_rare":         [45, 35, 16, 4],
  "common_common_legendary":    [35, 35, 22, 8],
  "common_uncommon_uncommon":   [40, 40, 15, 5],
  "uncommon_uncommon_rare":     [15, 40, 35, 10],
  "uncommon_uncommon_legendary": [10, 30, 40, 20],
  "common_rare_rare":           [15, 30, 40, 15],
  "rare_rare_legendary":        [2, 13, 45, 40],
  "legendary_legendary_rare":   [0, 8, 32, 60],
  "legendary_legendary_uncommon": [0, 10, 35, 55],
  "legendary_legendary_common": [2, 13, 40, 45],

  // All different
  "common_rare_uncommon":       [30, 35, 25, 10],
  "common_legendary_uncommon":  [20, 30, 30, 20],
  "common_legendary_rare":      [12, 25, 35, 28],
  "legendary_rare_uncommon":    [5, 20, 40, 35],
};

function sortedKey(r1: Rarity, r2: Rarity, r3: Rarity): string {
  return [r1, r2, r3].sort().join("_");
}

/**
 * Get forge odds for a given triple of input rarities.
 */
export function getForgeOdds(r1: Rarity, r2: Rarity, r3: Rarity): Record<Rarity, number> {
  const key = sortedKey(r1, r2, r3);
  const odds = FORGE_ODDS_TABLE[key] ?? [40, 30, 20, 10]; // fallback
  return {
    common: odds[0],
    uncommon: odds[1],
    rare: odds[2],
    legendary: odds[3]
  };
}

/**
 * Apply free spin boost to forge odds.
 * Each spin used: -8% common, +5% rare, +3% legendary (clamped).
 */
export function applyForgeBoost(
  baseOdds: Record<Rarity, number>,
  spinsUsed: number
): Record<Rarity, number> {
  if (spinsUsed <= 0) return baseOdds;
  const commonReduction = Math.min(baseOdds.common, 8 * spinsUsed);
  return {
    common: baseOdds.common - commonReduction,
    uncommon: baseOdds.uncommon,
    rare: baseOdds.rare + Math.round(commonReduction * 0.625),
    legendary: baseOdds.legendary + Math.round(commonReduction * 0.375)
  };
}

/**
 * Roll a forge result based on odds.
 */
export function rollForgeResult(odds: Record<Rarity, number>): Rarity {
  const rand = Math.random() * 100;
  let cumulative = 0;
  for (const [rarity, weight] of Object.entries(odds)) {
    cumulative += weight;
    if (rand <= cumulative) return rarity as Rarity;
  }
  return "common";
}
