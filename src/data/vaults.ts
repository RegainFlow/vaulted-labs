export interface RarityBreakdown {
  common: number;
  uncommon: number;
  rare: number;
  legendary: number;
}

export interface Vault {
  name: string;
  price: number;
  color: string;
  gradient: string;
  tagline: string;
  rarities: RarityBreakdown;
}

export const VAULTS: Vault[] = [
  {
    name: "Bronze",
    price: 19.99,
    color: "#cd7f32",
    gradient: "from-[#8B4513] to-[#cd7f32]",
    tagline: "Raw potential",
    rarities: { common: 55.0, uncommon: 25.0, rare: 17.0, legendary: 3.0 }
  },
  {
    name: "Silver",
    price: 29.99,
    color: "#e0e0e0",
    gradient: "from-[#757575] to-[#e0e0e0]",
    tagline: "Refined assets",
    rarities: { common: 52.0, uncommon: 26.0, rare: 17.5, legendary: 4.5 }
  },
  {
    name: "Gold",
    price: 44.99,
    color: "#ffd700",
    gradient: "from-[#b8860b] to-[#ffd700]",
    tagline: "Standard of value",
    rarities: { common: 48.0, uncommon: 28.0, rare: 18.0, legendary: 6.0 }
  },
  {
    name: "Platinum",
    price: 59.99,
    color: "#79b5db",
    gradient: "from-[#4a6d85] to-[#a2d4e8]",
    tagline: "Industrial purity",
    rarities: { common: 45.0, uncommon: 28.0, rare: 19.5, legendary: 7.5 }
  },
  {
    name: "Obsidian",
    price: 74.99,
    color: "#6c4e85",
    gradient: "from-[#2e2b36] to-[#6c4e85]",
    tagline: "Volcanic glass",
    rarities: { common: 42.0, uncommon: 27.0, rare: 21.0, legendary: 10.0 }
  },
  {
    name: "Diamond",
    price: 89.99,
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
    minMult: 0.4,
    maxMult: 0.85
  },
  uncommon: {
    label: "Great Pull",
    exclaim: "!",
    color: "#3B82F6",
    minMult: 0.85,
    maxMult: 1.4
  },
  rare: {
    label: "Rare Pull",
    exclaim: "!",
    color: "#a855f7",
    minMult: 1.4,
    maxMult: 2.2
  },
  legendary: {
    label: "LEGENDARY",
    exclaim: "!!!",
    color: "#FFD700",
    minMult: 2.2,
    maxMult: 3.5
  }
} as const;

export const PRODUCT_TYPES = ["Funko Pop!", "Community Pick", "Community Pick"] as const;

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
  return Math.round(price * mult);
}

export function pickProduct(): (typeof PRODUCT_TYPES)[number] {
  return PRODUCT_TYPES[Math.floor(Math.random() * PRODUCT_TYPES.length)];
}

export const WAITLIST_TOTAL_SPOTS = 450;

export interface IncentiveTier {
  label: string;
  creditAmount: number;
  spots: number;
  startAt: number;
  endAt: number;
  color: string;
}

export const INCENTIVE_TIERS: IncentiveTier[] = [
  { label: "Founder",      creditAmount: 200, spots: 50,  startAt: 1,   endAt: 50,  color: "#ffd700" },
  { label: "Early Access",  creditAmount: 100, spots: 100, startAt: 51,  endAt: 150, color: "#ff2d95" },
  { label: "Beta",          creditAmount: 50,  spots: 200, startAt: 151, endAt: 350, color: "#00f0ff" },
  { label: "Early Bird",    creditAmount: 25,  spots: 100, startAt: 351, endAt: 450, color: "#39ff14" },
];

export function getActiveTierInfo(count: number) {
  for (let i = 0; i < INCENTIVE_TIERS.length; i++) {
    const tier = INCENTIVE_TIERS[i];
    if (count < tier.endAt) {
      return { activeTier: tier, activeTierRemaining: tier.endAt - count, completedTiers: i };
    }
  }
  return { activeTier: null, activeTierRemaining: 0, completedTiers: INCENTIVE_TIERS.length };
}
