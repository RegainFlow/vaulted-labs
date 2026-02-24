import type { Rarity } from "./vault";

export type PrestigeLevel = 0 | 1 | 2 | 3;

export interface LevelInfo {
  level: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
}

/* ─── Battle (stat-based, replaces reel-based BossFight) ─── */

export interface Battle {
  id: string;
  name: string;
  description: string;
  requiredLevel: number;
  hp: number;
  atk: number;
  def: number;
  agi?: number;
  mechanics?: string;
  shardReward: { min: number; max: number };
  xpReward: number;
  energyCost: number;
}

/** @deprecated Use Battle instead */
export type BossFight = Battle;

export interface BattleCardProps {
  battle: Battle;
  playerLevel: number;
  isDefeated: boolean;
  energyCost: number;
  currentEnergy: number;
  onFight: (battle: Battle) => void;
}

/** @deprecated Use BattleCardProps instead */
export type BossFightCardProps = BattleCardProps;

/* ─── Boss Energy ─── */

export interface BossEnergyConfig {
  maxEnergy: number;
  regenIntervalMs: number;
  costPerFight: number;
  grantPerVaultOpen: number;
}

/* ─── Squad ─── */

export interface SquadStats {
  totalAtk: number;
  totalDef: number;
  totalAgi: number;
  memberCount: number;
}

/* ─── Combat ─── */

export interface CombatExchange {
  round: number;
  squadDamage: number;
  bossDamage: number;
  squadHpAfter: number;
  bossHpAfter: number;
  quality: "critical" | "strong" | "normal" | "weak";
  bossHeal?: number;
}

export interface CombatResult {
  victory: boolean;
  exchanges: CombatExchange[];
  shardsEarned: number;
  xpEarned: number;
  finalSquadHp: number;
  finalBossHp: number;
}

/* ─── Shard Config ─── */

export interface ShardConfig {
  freeSpinConversionCost: number;
  winShards: { min: number; max: number };
  closeLossShards: number;
  lossShards: { min: number; max: number };
}

/* ─── Legacy exports (kept for backwards compat) ─── */

/** @deprecated Reel-based types removed in favor of stat-based combat */
export type AttackQuality = "critical" | "strong" | "normal" | "weak";

/** @deprecated Use CombatExchange instead */
export interface DamageResult {
  rarity: Rarity;
  quality: AttackQuality;
  damage: number;
}
