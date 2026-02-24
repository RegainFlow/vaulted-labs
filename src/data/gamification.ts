import type { Battle, LevelInfo, BossEnergyConfig, ShardConfig, SquadStats, CombatExchange, CombatResult } from "../types/gamification";

/* ─── XP / Level Curve ─── */

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

/* ─── Boss Energy ─── */

export const BOSS_ENERGY_CONFIG: BossEnergyConfig = {
  maxEnergy: 5,
  regenIntervalMs: 600_000, // 10 minutes
  costPerFight: 1,
  grantPerVaultOpen: 1
};

/* ─── Shard Economy ─── */

export const SHARD_CONFIG: ShardConfig = {
  freeSpinConversionCost: 7,
  winShards: { min: 2, max: 3 },
  closeLossShards: 1,
  lossShards: { min: 0, max: 1 }
};

/* ─── Battles (stat-based, replaces reel-based BOSS_FIGHTS) ─── */

export const BATTLES: Battle[] = [
  {
    id: "boss-1",
    name: "The Vault Keeper",
    description: "Guardian of the first seal. Defeat to prove your worth.",
    requiredLevel: 3,
    hp: 120,
    atk: 14,
    def: 10,
    agi: 8,
    shardReward: { min: 2, max: 3 },
    xpReward: 100,
    energyCost: 1
  },
  {
    id: "boss-2",
    name: "Chrono Shard",
    description: "A temporal anomaly that warps vault contents across timelines.",
    requiredLevel: 5,
    hp: 136,
    atk: 18,
    def: 14,
    agi: 12,
    shardReward: { min: 2, max: 3 },
    xpReward: 200,
    energyCost: 1
  },
  {
    id: "boss-3",
    name: "Neon Hydra",
    description: "A multi-headed construct of pure neon energy.",
    requiredLevel: 8,
    hp: 160,
    atk: 24,
    def: 18,
    agi: 16,
    mechanics: "Regenerates 5 HP per round",
    shardReward: { min: 2, max: 3 },
    xpReward: 400,
    energyCost: 2
  },
  {
    id: "boss-4",
    name: "Diamond Golem",
    description: "The ultimate guardian forged from compressed vault fragments.",
    requiredLevel: 12,
    hp: 192,
    atk: 32,
    def: 26,
    agi: 10,
    mechanics: "High DEF, low AGI — reward patience",
    shardReward: { min: 3, max: 4 },
    xpReward: 1000,
    energyCost: 3
  }
];

/** @deprecated Use BATTLES instead */
export const BOSS_FIGHTS = BATTLES;

/* ─── Prestige Battle Scaling ─── */

/**
 * Scale battle stats by rank (prestige) level.
 * +15% hp/atk/def per rank level.
 */
export function getPrestigeBattleStats(battle: Battle, rankLevel: number): Battle {
  if (rankLevel <= 0) return battle;
  const scale = 1 + 0.15 * rankLevel;
  return {
    ...battle,
    hp: Math.round(battle.hp * scale),
    atk: Math.round(battle.atk * scale),
    def: Math.round(battle.def * scale),
    agi: battle.agi ? Math.round(battle.agi * scale) : undefined
  };
}

/* ─── Stat-Based Combat Engine ─── */

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Resolve a single combat exchange between squad and boss.
 */
export function resolveExchange(
  squad: SquadStats,
  bossAtk: number,
  bossDef: number,
  bossAgi: number | undefined,
  round: number,
  currentSquadHp: number,
  currentBossHp: number
): CombatExchange {
  // Squad attacks boss
  const atkVariance = randomInRange(0.85, 1.15);
  const agiBonus = squad.totalAgi > (bossAgi ?? 10) ? 1.1 : 1.0;
  const rawSquadDmg = Math.max(1, (squad.totalAtk * atkVariance * agiBonus) - bossDef * 0.4);
  const squadDamage = Math.round(rawSquadDmg);

  // Boss attacks squad
  const bossVariance = randomInRange(0.85, 1.15);
  const rawBossDmg = Math.max(1, (bossAtk * bossVariance) - squad.totalDef * 0.4);
  const bossDamage = Math.round(rawBossDmg);

  const bossHpAfter = Math.max(0, currentBossHp - squadDamage);
  const squadHpAfter = Math.max(0, currentSquadHp - bossDamage);

  let quality: CombatExchange["quality"] = "normal";
  if (squadDamage >= bossAtk * 1.5) quality = "critical";
  else if (squadDamage >= bossAtk) quality = "strong";
  else if (squadDamage < bossDef * 0.5) quality = "weak";

  return {
    round,
    squadDamage,
    bossDamage,
    squadHpAfter,
    bossHpAfter,
    quality
  };
}

/**
 * Simulate full combat between a player's squad and a battle boss.
 * Auto-resolves exchanges until one side's HP reaches 0, max 20 rounds.
 */
export function simulateCombat(
  squadStats: SquadStats,
  battle: Battle,
  rankLevel: number
): CombatResult {
  const scaled = getPrestigeBattleStats(battle, rankLevel);
  const squadMaxHp = 120;
  let squadHp = squadMaxHp;
  let bossHp = scaled.hp;
  const exchanges: CombatExchange[] = [];

  for (let round = 1; round <= 20 && squadHp > 0 && bossHp > 0; round++) {
    const exchange = resolveExchange(
      squadStats,
      scaled.atk,
      scaled.def,
      scaled.agi,
      round,
      squadHp,
      bossHp
    );
    squadHp = exchange.squadHpAfter;
    bossHp = exchange.bossHpAfter;

    // Neon Hydra mechanic: boss regens 5 HP per round
    if (scaled.mechanics?.includes("Regenerates") && bossHp > 0) {
      const healAmount = Math.min(5, scaled.hp - bossHp);
      if (healAmount > 0) {
        bossHp = bossHp + healAmount;
        exchange.bossHeal = healAmount;
        exchange.bossHpAfter = bossHp;
      }
    }

    exchanges.push(exchange);
  }

  const victory = bossHp <= 0;

  // Calculate shard reward
  let shardsEarned = 0;
  if (victory) {
    shardsEarned = Math.floor(randomInRange(
      SHARD_CONFIG.winShards.min,
      SHARD_CONFIG.winShards.max + 1
    ));
  } else if (bossHp <= scaled.hp * 0.25) {
    // Close loss — boss below 25% HP
    shardsEarned = SHARD_CONFIG.closeLossShards;
  } else {
    shardsEarned = Math.floor(randomInRange(
      SHARD_CONFIG.lossShards.min,
      SHARD_CONFIG.lossShards.max + 1
    ));
  }

  return {
    victory,
    exchanges,
    shardsEarned,
    xpEarned: victory ? battle.xpReward : Math.round(battle.xpReward * 0.25),
    finalSquadHp: squadHp,
    finalBossHp: bossHp
  };
}
