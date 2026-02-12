import type { BossFight, LevelInfo } from "../types/game";

/**
 * XP threshold for a given level: 50L² + 50L
 * Level 0 → 0, Level 1 → 100, Level 2 → 300, Level 3 → 600, etc.
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
  const progressPercent = xpNeeded > 0 ? Math.min(100, (xpIntoLevel / xpNeeded) * 100) : 0;

  return {
    level,
    currentXP: xp,
    xpForCurrentLevel,
    xpForNextLevel,
    progressPercent,
  };
}

export const BOSS_FIGHTS: BossFight[] = [
  {
    id: "boss-1",
    name: "The Vault Keeper",
    description: "Guardian of the first seal. Defeat to prove your worth.",
    requiredLevel: 3,
    rewardDescription: "Badge + 50 bonus credits",
  },
  {
    id: "boss-2",
    name: "Chrono Shard",
    description: "A temporal anomaly that warps vault contents across timelines.",
    requiredLevel: 5,
    rewardDescription: "Limited Edition item + 100 credits",
  },
  {
    id: "boss-3",
    name: "Neon Hydra",
    description: "A multi-headed construct of pure neon energy.",
    requiredLevel: 8,
    rewardDescription: "Trophy + 200 credits",
  },
  {
    id: "boss-4",
    name: "Diamond Golem",
    description: "The ultimate guardian forged from compressed vault fragments.",
    requiredLevel: 12,
    rewardDescription: "Artifact + 500 credits",
  },
];
