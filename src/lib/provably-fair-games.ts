import { FUNKO_CATALOG, getVaultItemsByRarity } from "../data/funkos";
import {
  PRODUCT_TYPES,
  RARITY_CONFIG,
  SHARD_REWARDS,
  VAULTS,
  getPrestigeOdds,
} from "../data/vaults";
import { getForgeOdds, applyForgeBoost } from "../data/forge";
import {
  BATTLES,
  SHARD_CONFIG,
  getPrestigeBattleStats,
} from "../data/gamification";
import { generateItemStats } from "../data/item-stats";
import type { FunkoItem } from "../types/funko";
import type { VaultLockSlot } from "../types/bonus";
import type { ItemStats } from "../types/collectible";
import type { CombatExchange, CombatResult, SquadStats } from "../types/gamification";
import type { Rarity, RarityBreakdown, VaultTierName } from "../types/vault";

const TIER_ORDER: VaultTierName[] = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Obsidian",
  "Diamond",
];

function clampUnit(unit: number): number {
  if (!Number.isFinite(unit)) return 0;
  return Math.min(Math.max(unit, 0), 0.999999999999);
}

function pickByWeight<T extends string>(
  weighted: Record<T, number>,
  unit: number
): T {
  const scaled = clampUnit(unit) * 100;
  let cumulative = 0;
  for (const [key, value] of Object.entries(weighted) as Array<[T, number]>) {
    cumulative += value;
    if (scaled <= cumulative) {
      return key;
    }
  }

  return Object.keys(weighted)[0] as T;
}

function pickFromArray<T>(items: T[], unit: number): T {
  const index = Math.min(
    items.length - 1,
    Math.floor(clampUnit(unit) * items.length)
  );
  return items[index];
}

function pickRarityFromUnit(
  rarities: RarityBreakdown,
  unit: number
): Rarity {
  return pickByWeight(rarities as Record<Rarity, number>, unit);
}

function pickValueFromUnit(
  price: number,
  config: { minMult: number; maxMult: number },
  unit: number
): number {
  const mult = config.minMult + clampUnit(unit) * (config.maxMult - config.minMult);
  return Math.max(1, Math.round(price * mult));
}

function pickProductFromUnit(unit: number): (typeof PRODUCT_TYPES)[number] {
  return pickFromArray([...PRODUCT_TYPES], unit);
}

function pickFunkoFromUnit(
  vaultTier: VaultTierName,
  rarity: Rarity,
  unit: number
): FunkoItem {
  const candidates = getVaultItemsByRarity(vaultTier, rarity);
  if (candidates.length > 0) {
    return pickFromArray(candidates, unit);
  }
  return pickFromArray(
    FUNKO_CATALOG.filter((item) => item.rarity === rarity),
    unit
  );
}

function generateItemStatsFromUnits(
  rarity: Rarity,
  vaultTier: VaultTierName,
  units?: [number, number, number]
): ItemStats {
  if (!units) return generateItemStats(rarity, vaultTier);

  const rangeByRarity: Record<Rarity, { min: number; max: number }> = {
    common: { min: 5, max: 12 },
    uncommon: { min: 10, max: 20 },
    rare: { min: 18, max: 30 },
    legendary: { min: 28, max: 42 },
  };
  const multByTier: Record<VaultTierName, number> = {
    Bronze: 1.0,
    Silver: 1.03,
    Gold: 1.06,
    Platinum: 1.09,
    Obsidian: 1.12,
    Diamond: 1.15,
  };
  const range = rangeByRarity[rarity];
  const mult = multByTier[vaultTier];
  const roll = (unit: number) =>
    Math.round((range.min + Math.floor(clampUnit(unit) * (range.max - range.min + 1))) * mult);

  return {
    atk: roll(units[0]),
    def: roll(units[1]),
    agi: roll(units[2]),
  };
}

export function resolveVaultOpenFromUnits({
  vaultName,
  price,
  prestigeLevel,
  categoryKey,
  units,
}: {
  vaultName: VaultTierName;
  price: number;
  prestigeLevel: number;
  categoryKey?: string | null;
  units: number[];
}) {
  const vault = VAULTS.find((entry) => entry.name === vaultName);
  if (!vault) {
    throw new Error(`Unknown vault: ${vaultName}`);
  }

  const odds = getPrestigeOdds(vault.rarities, prestigeLevel);
  const rarity = pickRarityFromUnit(odds, units[0]);
  const funko = pickFunkoFromUnit(vaultName, rarity, units[1]);
  const product = categoryKey || pickProductFromUnit(units[2]);
  const value = pickValueFromUnit(price, RARITY_CONFIG[rarity], units[3]);
  const stats = generateItemStatsFromUnits(rarity, vaultName, [
    units[4],
    units[5],
    units[6],
  ]);
  const bonusChance =
    vaultName === "Platinum"
      ? 0.45
      : vaultName === "Obsidian"
        ? 0.55
        : vaultName === "Diamond"
          ? 0.65
          : 0;
  const bonusTriggered = clampUnit(units[7]) < bonusChance;

  return {
    rarity,
    funkoId: funko.id,
    funkoName: funko.name,
    imagePath: funko.imagePath,
    product,
    value,
    stats,
    bonusTriggered,
  };
}

function slotColorForTier(tier: VaultTierName): string {
  return (
    {
      Bronze: "#cd7f32",
      Silver: "#e0e0e0",
      Gold: "#ffd700",
      Platinum: "#79b5db",
      Obsidian: "#6c4e85",
      Diamond: "#b9f2ff",
    } satisfies Record<VaultTierName, string>
  )[tier];
}

function slotImageForTier(tier: VaultTierName): string {
  return `/images/vaults/bonus-spinner/${tier.toLowerCase()}_bonus.png`;
}

export function resolveBonusLockFromUnits({
  purchasedTierName,
  units,
}: {
  purchasedTierName: VaultTierName;
  units: number[];
}) {
  const tiers = [...TIER_ORDER];
  const firstTier = pickFromArray(tiers, units[0]);
  const secondTier = pickFromArray(tiers, units[1]);
  const thirdTier =
    firstTier === secondTier ? pickFromArray(tiers, units[2]) : pickFromArray(tiers, units[3]);

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
  const baseOdds = getForgeOdds(inputRarities[0], inputRarities[1], inputRarities[2]);
  const boostedOdds = applyForgeBoost(baseOdds, spinsUsed);
  const rarity = pickByWeight(boostedOdds, units[0]);
  const highestTier = inputVaultTiers.reduce((best, tier) =>
    TIER_ORDER.indexOf(tier) > TIER_ORDER.indexOf(best) ? tier : best
  );
  const avgPrice = (inputValues[0] + inputValues[1] + inputValues[2]) / 3;
  const product = pickProductFromUnit(units[1]);
  const value = pickValueFromUnit(avgPrice, RARITY_CONFIG[rarity], units[2]);
  const stats = generateItemStatsFromUnits(rarity, highestTier, [
    units[3],
    units[4],
    units[5],
  ]);

  return {
    rarity,
    product,
    vaultTier: highestTier,
    value,
    stats,
    oddsSnapshot: boostedOdds,
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
  const battle = BATTLES.find((entry) => entry.id === battleId);
  if (!battle) {
    throw new Error(`Unknown battle: ${battleId}`);
  }

  const scaled = getPrestigeBattleStats(battle, rankLevel);
  const exchanges: CombatExchange[] = [];
  const squadMaxHp = 120;
  let squadHp = squadMaxHp;
  let bossHp = scaled.hp;
  let cursor = 0;

  for (let round = 1; round <= 20 && squadHp > 0 && bossHp > 0; round += 1) {
    const squadVariance = varianceFromUnit(units[cursor++] ?? 0.5);
    const bossVariance = varianceFromUnit(units[cursor++] ?? 0.5);
    const agiBonus = squadStats.totalAgi > (scaled.agi ?? 10) ? 1.1 : 1.0;
    const squadDamage = Math.round(
      Math.max(1, squadStats.totalAtk * squadVariance * agiBonus - scaled.def * 0.4)
    );
    const bossDamage = Math.round(
      Math.max(1, scaled.atk * bossVariance - squadStats.totalDef * 0.4)
    );

    bossHp = Math.max(0, bossHp - squadDamage);
    squadHp = Math.max(0, squadHp - bossDamage);

    const quality: CombatExchange["quality"] =
      squadDamage >= scaled.atk * 1.5
        ? "critical"
        : squadDamage >= scaled.atk
          ? "strong"
          : squadDamage < scaled.def * 0.5
            ? "weak"
            : "normal";

    const exchange: CombatExchange = {
      round,
      squadDamage,
      bossDamage,
      squadHpAfter: squadHp,
      bossHpAfter: bossHp,
      quality,
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
  let shardsEarned = 0;
  if (victory) {
    shardsEarned = rewardRoll(
      SHARD_CONFIG.winShards.min,
      SHARD_CONFIG.winShards.max,
      units[cursor++] ?? 0.5
    );
  } else if (bossHp <= scaled.hp * 0.25) {
    shardsEarned = SHARD_CONFIG.closeLossShards;
  } else {
    shardsEarned = rewardRoll(
      SHARD_CONFIG.lossShards.min,
      SHARD_CONFIG.lossShards.max,
      units[cursor++] ?? 0.5
    );
  }

  return {
    victory,
    exchanges,
    shardsEarned,
    xpEarned: victory ? battle.xpReward : Math.round(battle.xpReward * 0.25),
    finalSquadHp: squadHp,
    finalBossHp: bossHp,
  };
}
