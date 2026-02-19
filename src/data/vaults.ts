import type { IncentiveTier } from "../types/landing";
import type { Vault, RarityBreakdown, VaultTierName } from "../types/vault";
import type { VaultLockSlot } from "../types/bonus";

export const VAULT_COLORS: Record<string, string> = {
  Bronze: "#cd7f32",
  Silver: "#e0e0e0",
  Gold: "#ffd700",
  Platinum: "#79b5db",
  Obsidian: "#6c4e85",
  Diamond: "#b9f2ff"
};

export const VAULTS: Vault[] = [
  {
    name: "Bronze",
    price: 12,
    color: "#cd7f32",
    gradient: "from-[#8B4513] to-[#cd7f32]",
    tagline: "Raw potential",
    rarities: { common: 55.0, uncommon: 25.0, rare: 17.0, legendary: 3.0 }
  },
  {
    name: "Silver",
    price: 25,
    color: "#e0e0e0",
    gradient: "from-[#757575] to-[#e0e0e0]",
    tagline: "Refined assets",
    rarities: { common: 52.0, uncommon: 26.0, rare: 17.5, legendary: 4.5 }
  },
  {
    name: "Gold",
    price: 40,
    color: "#ffd700",
    gradient: "from-[#b8860b] to-[#ffd700]",
    tagline: "Standard of value",
    rarities: { common: 48.0, uncommon: 28.0, rare: 18.0, legendary: 6.0 }
  },
  {
    name: "Platinum",
    price: 55,
    color: "#79b5db",
    gradient: "from-[#4a6d85] to-[#a2d4e8]",
    tagline: "Industrial purity",
    rarities: { common: 45.0, uncommon: 28.0, rare: 19.5, legendary: 7.5 }
  },
  {
    name: "Obsidian",
    price: 75,
    color: "#6c4e85",
    gradient: "from-[#2e2b36] to-[#6c4e85]",
    tagline: "Volcanic glass",
    rarities: { common: 42.0, uncommon: 27.0, rare: 21.0, legendary: 10.0 }
  },
  {
    name: "Diamond",
    price: 90,
    color: "#b9f2ff",
    gradient: "from-[#00bfff] to-[#b9f2ff]",
    tagline: "The ultimate unboxing",
    rarities: { common: 38.0, uncommon: 26.0, rare: 23.0, legendary: 13.0 }
  }
];

export const RARITY_CONFIG = {
  common: {
    label: "Nice Find",
    exclaim: "!",
    color: "#6B7280",
    minMult: 0.3333333333,
    maxMult: 0.75
  },
  uncommon: {
    label: "Great Pull",
    exclaim: "!",
    color: "#3B82F6",
    minMult: 0.75,
    maxMult: 1.05
  },
  rare: {
    label: "Rare Pull",
    exclaim: "!",
    color: "#a855f7",
    minMult: 1.05,
    maxMult: 1.35
  },
  legendary: {
    label: "LEGENDARY",
    exclaim: "!!!",
    color: "#FFD700",
    minMult: 1.35,
    maxMult: 1.6666666667
  }
} as const;

/** Dollar reduction applied to all value calculations */
export const VALUE_RANGE_REDUCTION = 2;

export const PRODUCT_TYPES = [
  "Funko Pop!",
  "Community Pick",
  "Community Pick"
] as const;

/**
 * Shift vault odds based on prestige level.
 * Each prestige level moves 4% from common → uncommon/rare/legendary (30%/30%/40% split).
 */
export function getPrestigeOdds(
  base: RarityBreakdown,
  prestigeLevel: number
): RarityBreakdown {
  if (prestigeLevel <= 0) return base;
  const shift = prestigeLevel * 4;
  return {
    common: base.common - shift,
    uncommon: +(base.uncommon + shift * 0.3).toFixed(1),
    rare: +(base.rare + shift * 0.4).toFixed(1),
    legendary: +(base.legendary + shift * 0.3).toFixed(1)
  };
}

export function pickRarity(rarities: RarityBreakdown): keyof RarityBreakdown {
  const rand = Math.random() * 100;
  let cumulative = 0;
  for (const [rarity, weight] of Object.entries(rarities)) {
    cumulative += weight;
    if (rand <= cumulative) return rarity as keyof RarityBreakdown;
  }
  return "common";
}

export function pickValue(
  price: number,
  config: { minMult: number; maxMult: number }
): number {
  const mult =
    config.minMult + Math.random() * (config.maxMult - config.minMult);
  return Math.max(1, Math.round(price * mult - VALUE_RANGE_REDUCTION));
}

export function pickProduct(): (typeof PRODUCT_TYPES)[number] {
  return PRODUCT_TYPES[Math.floor(Math.random() * PRODUCT_TYPES.length)];
}

export const WAITLIST_TOTAL_SPOTS = 400;

export const INCENTIVE_TIERS: IncentiveTier[] = [
  {
    label: "Founder",
    creditAmount: 100,
    spots: 25,
    startAt: 0,
    endAt: 25,
    color: "#ffd700"
  },
  {
    label: "Early Access",
    creditAmount: 75,
    spots: 25,
    startAt: 25,
    endAt: 50,
    color: "#ff2d95"
  },
  {
    label: "Beta",
    creditAmount: 50,
    spots: 25,
    startAt: 50,
    endAt: 75,
    color: "#00f0ff"
  },
  {
    label: "Early Bird",
    creditAmount: 25,
    spots: 25,
    startAt: 75,
    endAt: 100,
    color: "#39ff14"
  }
];

export const PREMIUM_BONUS_CHANCE: Record<string, number> = {
  Platinum: 0.2,
  Obsidian: 0.3,
  Diamond: 0.4
};

/* ─── Vault Lock Bonus Mini-Game ─── */

export const VAULT_TIER_SLOTS: VaultLockSlot[] = [
  { tier: "Bronze" as VaultTierName, color: "#cd7f32" },
  { tier: "Silver" as VaultTierName, color: "#e0e0e0" },
  { tier: "Gold" as VaultTierName, color: "#ffd700" },
  { tier: "Platinum" as VaultTierName, color: "#79b5db" },
  { tier: "Obsidian" as VaultTierName, color: "#6c4e85" },
  { tier: "Diamond" as VaultTierName, color: "#b9f2ff" }
];

export function generateVaultLockStrip(purchasedTier: VaultTierName): VaultLockSlot[] {
  // 12 base slots: each tier x2
  const slots: VaultLockSlot[] = [];
  for (const slot of VAULT_TIER_SLOTS) {
    slots.push({ ...slot });
    slots.push({ ...slot });
  }
  // Purchased tier gets 1-2 extra appearances (replace random other tier slots)
  const extraCount = Math.random() < 0.5 ? 1 : 2;
  for (let i = 0; i < extraCount; i++) {
    const otherIndices = slots
      .map((s, idx) => ({ tier: s.tier, idx }))
      .filter((s) => s.tier !== purchasedTier);
    if (otherIndices.length === 0) break;
    const pick = otherIndices[Math.floor(Math.random() * otherIndices.length)];
    const purchasedSlot = VAULT_TIER_SLOTS.find((s) => s.tier === purchasedTier)!;
    slots[pick.idx] = { ...purchasedSlot };
  }
  // Fisher-Yates shuffle
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  return slots;
}

export function pickVaultLockLanding(strip: VaultLockSlot[]): {
  index: number;
  tier: VaultTierName;
  color: string;
} {
  const index = Math.floor(Math.random() * strip.length);
  return { index, tier: strip[index].tier, color: strip[index].color };
}

export function getActiveTierInfo(count: number) {
  for (let i = 0; i < INCENTIVE_TIERS.length; i++) {
    const tier = INCENTIVE_TIERS[i];
    if (count < tier.endAt) {
      return {
        activeTier: tier,
        activeTierRemaining: tier.endAt - count,
        completedTiers: i
      };
    }
  }
  return {
    activeTier: null,
    activeTierRemaining: 0,
    completedTiers: INCENTIVE_TIERS.length
  };
}
