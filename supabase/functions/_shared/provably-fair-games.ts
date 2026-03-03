type VaultTierName =
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Obsidian"
  | "Diamond";
type Rarity = "common" | "uncommon" | "rare" | "legendary";

interface VaultLockSlot {
  tier: VaultTierName;
  color: string;
  imagePath: string;
}

interface SquadStats {
  totalAtk: number;
  totalDef: number;
  totalAgi: number;
  memberCount: number;
}

interface CombatExchange {
  round: number;
  squadDamage: number;
  bossDamage: number;
  squadHpAfter: number;
  bossHpAfter: number;
  quality: "critical" | "strong" | "normal" | "weak";
  bossHeal?: number;
}

interface CombatResult {
  victory: boolean;
  exchanges: CombatExchange[];
  shardsEarned: number;
  xpEarned: number;
  finalSquadHp: number;
  finalBossHp: number;
}

const TIER_ORDER: VaultTierName[] = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Obsidian",
  "Diamond",
];

const PRODUCT_TYPES = ["Funko Pop!", "Community Pick", "Community Pick"] as const;

const VAULTS = {
  Bronze: { common: 50, uncommon: 27, rare: 19, legendary: 4 },
  Silver: { common: 47, uncommon: 28, rare: 19.5, legendary: 5.5 },
  Gold: { common: 43, uncommon: 30, rare: 20, legendary: 7 },
  Platinum: { common: 40, uncommon: 30, rare: 21.5, legendary: 8.5 },
  Obsidian: { common: 37, uncommon: 29, rare: 23, legendary: 11 },
  Diamond: { common: 33, uncommon: 28, rare: 25, legendary: 14 },
} as const;

const RARITY_CONFIG = {
  common: { minMult: 0.4, maxMult: 0.85 },
  uncommon: { minMult: 0.85, maxMult: 1.4 },
  rare: { minMult: 1.4, maxMult: 2.2 },
  legendary: { minMult: 2.2, maxMult: 3.5 },
} as const;

const FORGE_ODDS_TABLE: Record<string, [number, number, number, number]> = {
  common_common_common: [70, 25, 4, 1],
  uncommon_uncommon_uncommon: [30, 45, 20, 5],
  rare_rare_rare: [5, 20, 55, 20],
  legendary_legendary_legendary: [0, 5, 25, 70],
  common_common_uncommon: [55, 35, 8, 2],
  common_common_rare: [45, 35, 16, 4],
  common_common_legendary: [35, 35, 22, 8],
  common_uncommon_uncommon: [40, 40, 15, 5],
  uncommon_uncommon_rare: [15, 40, 35, 10],
  uncommon_uncommon_legendary: [10, 30, 40, 20],
  common_rare_rare: [15, 30, 40, 15],
  rare_rare_legendary: [2, 13, 45, 40],
  legendary_legendary_rare: [0, 8, 32, 60],
  legendary_legendary_uncommon: [0, 10, 35, 55],
  legendary_legendary_common: [2, 13, 40, 45],
  common_rare_uncommon: [30, 35, 25, 10],
  common_legendary_uncommon: [20, 30, 30, 20],
  common_legendary_rare: [12, 25, 35, 28],
  legendary_rare_uncommon: [5, 20, 40, 35],
};

const BATTLES = {
  "boss-1": { hp: 120, atk: 14, def: 10, agi: 8, xpReward: 100, mechanics: "" },
  "boss-2": { hp: 136, atk: 18, def: 14, agi: 12, xpReward: 200, mechanics: "" },
  "boss-3": {
    hp: 160,
    atk: 24,
    def: 18,
    agi: 16,
    xpReward: 400,
    mechanics: "Regenerates 5 HP per round",
  },
  "boss-4": { hp: 192, atk: 32, def: 26, agi: 10, xpReward: 1000, mechanics: "" },
} as const;

const SHARD_REWARDS: Record<VaultTierName, number> = {
  Bronze: 1,
  Silver: 1,
  Gold: 2,
  Platinum: 2,
  Obsidian: 3,
  Diamond: 3,
};

function clampUnit(unit: number): number {
  if (!Number.isFinite(unit)) return 0;
  return Math.min(Math.max(unit, 0), 0.999999999999);
}

function pickByWeight<T extends string>(weighted: Record<T, number>, unit: number): T {
  const scaled = clampUnit(unit) * 100;
  let cumulative = 0;
  for (const [key, value] of Object.entries(weighted) as Array<[T, number]>) {
    cumulative += value;
    if (scaled <= cumulative) return key;
  }
  return Object.keys(weighted)[0] as T;
}

function pickFromArray<T>(items: T[], unit: number): T {
  const index = Math.min(items.length - 1, Math.floor(clampUnit(unit) * items.length));
  return items[index];
}

function pickValueFromUnit(
  price: number,
  config: { minMult: number; maxMult: number },
  unit: number
) {
  const mult = config.minMult + clampUnit(unit) * (config.maxMult - config.minMult);
  return Math.max(1, Math.round(price * mult));
}

function generateItemStatsFromUnits(
  rarity: Rarity,
  vaultTier: VaultTierName,
  units: [number, number, number]
) {
  const ranges: Record<Rarity, { min: number; max: number }> = {
    common: { min: 5, max: 12 },
    uncommon: { min: 10, max: 20 },
    rare: { min: 18, max: 30 },
    legendary: { min: 28, max: 42 },
  };
  const multipliers: Record<VaultTierName, number> = {
    Bronze: 1,
    Silver: 1.03,
    Gold: 1.06,
    Platinum: 1.09,
    Obsidian: 1.12,
    Diamond: 1.15,
  };
  const range = ranges[rarity];
  const mult = multipliers[vaultTier];
  const roll = (unit: number) =>
    Math.round((range.min + Math.floor(clampUnit(unit) * (range.max - range.min + 1))) * mult);
  return { atk: roll(units[0]), def: roll(units[1]), agi: roll(units[2]) };
}

function getPrestigeOdds(
  base: { common: number; uncommon: number; rare: number; legendary: number },
  prestigeLevel: number
) {
  if (prestigeLevel <= 0) return base;
  const shift = prestigeLevel * 4;
  return {
    common: base.common - shift,
    uncommon: +(base.uncommon + shift * 0.3).toFixed(1),
    rare: +(base.rare + shift * 0.4).toFixed(1),
    legendary: +(base.legendary + shift * 0.3).toFixed(1),
  };
}

function slotColorForTier(tier: VaultTierName) {
  return {
    Bronze: "#cd7f32",
    Silver: "#e0e0e0",
    Gold: "#ffd700",
    Platinum: "#79b5db",
    Obsidian: "#6c4e85",
    Diamond: "#b9f2ff",
  }[tier];
}

function slotImageForTier(tier: VaultTierName) {
  return `/images/vaults/bonus-spinner/${tier.toLowerCase()}_bonus.png`;
}

export function resolveVaultOpenFromUnits({
  vaultName,
  price,
  prestigeLevel,
  categoryKey,
  funkoPools,
  units,
}: {
  vaultName: VaultTierName;
  price: number;
  prestigeLevel: number;
  categoryKey?: string | null;
  funkoPools?: Partial<Record<Rarity, Array<Record<string, unknown>>>>;
  units: number[];
}) {
  const odds = getPrestigeOdds(VAULTS[vaultName], prestigeLevel);
  const rarity = pickByWeight(odds as Record<Rarity, number>, units[0]);
  const candidates = (funkoPools?.[rarity] ?? []) as Array<{
    id: string;
    name: string;
    imagePath: string;
  }>;
  if (candidates.length === 0) {
    throw new Error(`No fair candidate pool provided for ${vaultName} ${rarity}.`);
  }

  const funko = pickFromArray(candidates, units[1]);
  const product = categoryKey || pickFromArray([...PRODUCT_TYPES], units[2]);
  const value = pickValueFromUnit(price, RARITY_CONFIG[rarity], units[3]);
  const stats = generateItemStatsFromUnits(rarity, vaultName, [
    units[4],
    units[5],
    units[6],
  ]);
  const bonusChance =
    vaultName === "Platinum" ? 0.45 : vaultName === "Obsidian" ? 0.55 : vaultName === "Diamond" ? 0.65 : 0;

  return {
    rarity,
    funkoId: funko.id,
    funkoName: funko.name,
    imagePath: funko.imagePath,
    product,
    value,
    stats,
    bonusTriggered: clampUnit(units[7]) < bonusChance,
  };
}

export function resolveBonusLockFromUnits({
  purchasedTierName,
  units,
}: {
  purchasedTierName: VaultTierName;
  units: number[];
}) {
  const firstTier = pickFromArray([...TIER_ORDER], units[0]);
  const secondTier = pickFromArray([...TIER_ORDER], units[1]);
  const thirdTier =
    firstTier === secondTier ? pickFromArray([...TIER_ORDER], units[2]) : pickFromArray([...TIER_ORDER], units[3]);

  const channels: VaultLockSlot[] = [firstTier, secondTier, thirdTier].map((tier) => ({
    tier,
    color: slotColorForTier(tier),
    imagePath: slotImageForTier(tier),
  }));
  const matchCount =
    firstTier === secondTier && secondTier === thirdTier
      ? 3
      : firstTier === secondTier || secondTier === thirdTier || firstTier === thirdTier
        ? 2
        : 1;

  return {
    channels,
    matchCount,
    shardsAwarded: matchCount === 3 ? SHARD_REWARDS[firstTier] : 0,
    purchasedTierName,
  };
}

export function resolveForgeRollFromUnits({
  inputRarities,
  inputVaultTiers,
  inputValues,
  spinsUsed,
  units,
}: {
  inputRarities: [Rarity, Rarity, Rarity];
  inputVaultTiers: [VaultTierName, VaultTierName, VaultTierName];
  inputValues: [number, number, number];
  spinsUsed: number;
  units: number[];
}) {
  const key = [...inputRarities].sort().join("_");
  const base = FORGE_ODDS_TABLE[key] ?? [40, 30, 20, 10];
  const commonReduction = Math.min(base[0], 8 * spinsUsed);
  const odds = {
    common: base[0] - commonReduction,
    uncommon: base[1],
    rare: base[2] + Math.round(commonReduction * 0.625),
    legendary: base[3] + Math.round(commonReduction * 0.375),
  };
  const rarity = pickByWeight(odds as Record<Rarity, number>, units[0]);
  const highestTier = inputVaultTiers.reduce((best, tier) =>
    TIER_ORDER.indexOf(tier) > TIER_ORDER.indexOf(best) ? tier : best
  );
  const avgPrice = (inputValues[0] + inputValues[1] + inputValues[2]) / 3;
  return {
    rarity,
    product: pickFromArray([...PRODUCT_TYPES], units[1]),
    vaultTier: highestTier,
    value: pickValueFromUnit(avgPrice, RARITY_CONFIG[rarity], units[2]),
    stats: generateItemStatsFromUnits(rarity, highestTier, [
      units[3],
      units[4],
      units[5],
    ]),
    oddsSnapshot: odds,
  };
}

function varianceFromUnit(unit: number) {
  return 0.85 + clampUnit(unit) * 0.3;
}

function rewardRoll(min: number, max: number, unit: number) {
  return Math.floor(min + clampUnit(unit) * (max - min + 1));
}

export function resolveBattleFromUnits({
  battleId,
  squadStats,
  rankLevel,
  units,
}: {
  battleId: string;
  squadStats: SquadStats;
  rankLevel: number;
  units: number[];
}): CombatResult {
  const battle = BATTLES[battleId as keyof typeof BATTLES];
  if (!battle) throw new Error(`Unknown battle: ${battleId}`);
  const scale = rankLevel > 0 ? 1 + 0.15 * rankLevel : 1;
  const scaled = {
    hp: Math.round(battle.hp * scale),
    atk: Math.round(battle.atk * scale),
    def: Math.round(battle.def * scale),
    agi: Math.round((battle.agi ?? 10) * scale),
    xpReward: battle.xpReward,
    mechanics: battle.mechanics,
  };

  const exchanges: CombatExchange[] = [];
  let squadHp = 120;
  let bossHp = scaled.hp;
  let cursor = 0;

  for (let round = 1; round <= 20 && squadHp > 0 && bossHp > 0; round += 1) {
    const squadDamage = Math.round(
      Math.max(
        1,
        squadStats.totalAtk *
          varianceFromUnit(units[cursor++] ?? 0.5) *
          (squadStats.totalAgi > (scaled.agi ?? 10) ? 1.1 : 1) -
          scaled.def * 0.4
      )
    );
    const bossDamage = Math.round(
      Math.max(
        1,
        scaled.atk * varianceFromUnit(units[cursor++] ?? 0.5) -
          squadStats.totalDef * 0.4
      )
    );
    bossHp = Math.max(0, bossHp - squadDamage);
    squadHp = Math.max(0, squadHp - bossDamage);
    const exchange: CombatExchange = {
      round,
      squadDamage,
      bossDamage,
      squadHpAfter: squadHp,
      bossHpAfter: bossHp,
      quality:
        squadDamage >= scaled.atk * 1.5
          ? "critical"
          : squadDamage >= scaled.atk
            ? "strong"
            : squadDamage < scaled.def * 0.5
              ? "weak"
              : "normal",
    };
    if (scaled.mechanics?.includes("Regenerates") && bossHp > 0) {
      const healAmount = Math.min(5, scaled.hp - bossHp);
      if (healAmount > 0) {
        bossHp += healAmount;
        exchange.bossHeal = healAmount;
        exchange.bossHpAfter = bossHp;
      }
    }
    exchanges.push(exchange);
  }

  const victory = bossHp <= 0;
  const shardsEarned = victory
    ? rewardRoll(2, 4, units[cursor++] ?? 0.5)
    : bossHp <= scaled.hp * 0.25
      ? 1
      : rewardRoll(0, 2, units[cursor++] ?? 0.5);
  return {
    victory,
    exchanges,
    shardsEarned,
    xpEarned: victory ? battle.xpReward : Math.round(battle.xpReward * 0.25),
    finalSquadHp: squadHp,
    finalBossHp: bossHp,
  };
}
