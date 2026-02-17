import type { Rarity, RarityBreakdown } from "./vault";

export type PrestigeLevel = 0 | 1 | 2 | 3;

export interface LevelInfo {
  level: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
}

export interface BossFight {
  id: string;
  name: string;
  description: string;
  requiredLevel: number;
  rewardDescription: string;
  creditReward: number;
  xpReward: number;
  specialItem?: { product: string; rarity: Rarity; value: number };
  odds: RarityBreakdown;
}

export interface BossFightCardProps {
  boss: BossFight;
  playerLevel: number;
  isDefeated: boolean;
  onFight: (boss: BossFight) => void;
}

export type AttackQuality = "perfect" | "good" | "miss";

export interface DamageResult {
  rarity: Rarity;
  quality: AttackQuality;
  damage: number;
}
