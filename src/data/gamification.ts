import type { BossFight, LevelInfo } from "../types/game";
import type { RarityBreakdown } from "../types/vault";

/*
 -  XP threshold for a given level: 50L² + 50L
 -  Level 0 → 0, Level 1 → 100, Level 2 → 300, Level 3 → 600, etc.
 */
export function xpForLevel(level: number): number {
  return 50 * level * level + 50 * level;
}

export function getLevelFromXP(xp: number): number {
  let level = 0;
  while (xpForLevel(level + 1) <= xp) {
    level++;
  }
  return level;
}

export function getLevelInfo(xp: number): LevelInfo {
  const level = getLevelFromXP(xp);
  const xpForCurrentLevel = xpForLevel(level);
  const xpForNextLevel = xpForLevel(level + 1);
  const xpIntoLevel = xp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const progressPercent =
    xpNeeded > 0 ? Math.min(100, (xpIntoLevel / xpNeeded) * 100) : 0;

  return {
    level,
    currentXP: xp,
    xpForCurrentLevel,
    xpForNextLevel,
    progressPercent
  };
}

/** Player reel odds for boss fights (constant across all bosses) */
export const BOSS_PLAYER_ODDS: RarityBreakdown = {
  common: 30,
  uncommon: 35,
  rare: 25,
  legendary: 10
};

/** Shift 5% per prestige level from common to legendary, making bosses harder */
export function getScaledBossOdds(baseOdds: RarityBreakdown, prestigeLevel: number): RarityBreakdown {
  if (prestigeLevel <= 0) return baseOdds;
  const shift = 5 * prestigeLevel;
  return {
    common: Math.max(5, baseOdds.common - shift),
    uncommon: baseOdds.uncommon,
    rare: baseOdds.rare,
    legendary: baseOdds.legendary + shift
  };
}

export const BOSS_FIGHTS: BossFight[] = [
  {
    id: "boss-1",
    name: "The Vault Keeper",
    description: "Guardian of the first seal. Defeat to prove your worth.",
    requiredLevel: 3,
    rewardDescription: "Keeper's Badge + 50 credits",
    creditReward: 50,
    xpReward: 100,
    specialItem: { product: "Keeper's Badge", rarity: "rare", value: 30 },
    odds: { common: 25, uncommon: 30, rare: 30, legendary: 15 }
  },
  {
    id: "boss-2",
    name: "Chrono Shard",
    description:
      "A temporal anomaly that warps vault contents across timelines.",
    requiredLevel: 5,
    rewardDescription: "Time Fragment + 100 credits",
    creditReward: 100,
    xpReward: 200,
    specialItem: { product: "Time Fragment", rarity: "rare", value: 50 },
    odds: { common: 20, uncommon: 28, rare: 32, legendary: 20 }
  },
  {
    id: "boss-3",
    name: "Neon Hydra",
    description: "A multi-headed construct of pure neon energy.",
    requiredLevel: 8,
    rewardDescription: "Hydra Scale + 200 credits",
    creditReward: 200,
    xpReward: 400,
    specialItem: { product: "Hydra Scale", rarity: "legendary", value: 100 },
    odds: { common: 15, uncommon: 25, rare: 35, legendary: 25 }
  },
  {
    id: "boss-4",
    name: "Diamond Golem",
    description:
      "The ultimate guardian forged from compressed vault fragments.",
    requiredLevel: 12,
    rewardDescription: "Diamond Core + 500 credits",
    creditReward: 500,
    xpReward: 1000,
    specialItem: { product: "Diamond Core", rarity: "legendary", value: 250 },
    odds: { common: 10, uncommon: 20, rare: 35, legendary: 35 }
  }
];
