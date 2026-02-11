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
    price: 24,
    color: "#cd7f32",
    gradient: "from-[#8B4513] to-[#cd7f32]",
    tagline: "Raw potential",
    rarities: { common: 60.5, uncommon: 18, rare: 19.8, legendary: 1.7 },
  },
  {
    name: "Silver",
    price: 38,
    color: "#e0e0e0",
    gradient: "from-[#757575] to-[#e0e0e0]",
    tagline: "Refined assets",
    rarities: { common: 59.8, uncommon: 18.8, rare: 18.3, legendary: 3.1 },
  },
  {
    name: "Gold",
    price: 54,
    color: "#ffd700",
    gradient: "from-[#b8860b] to-[#ffd700]",
    tagline: "Standard of value",
    rarities: { common: 57.9, uncommon: 29.3, rare: 8.6, legendary: 4.2 },
  },
  {
    name: "Platinum",
    price: 68,
    color: "#79b5db",
    gradient: "from-[#4a6d85] to-[#a2d4e8]",
    tagline: "Industrial purity",
    rarities: { common: 56.5, uncommon: 28.3, rare: 10.9, legendary: 4.3 },
  },
  {
    name: "Obsidian",
    price: 78,
    color: "#6c4e85",
    gradient: "from-[#2e2b36] to-[#6c4e85]",
    tagline: "Volcanic glass",
    rarities: { common: 55.8, uncommon: 27.8, rare: 12.0, legendary: 4.4 },
  },
  {
    name: "Diamond",
    price: 86,
    color: "#b9f2ff",
    gradient: "from-[#00bfff] to-[#b9f2ff]",
    tagline: "The ultimate unboxing",
    rarities: { common: 55.1, uncommon: 27.3, rare: 13.2, legendary: 4.4 },
  },
];

export const RARITY_CONFIG = {
  common:    { label: "Nice Find",      exclaim: "!",  color: "#9a9ab0", minMult: 0.40, maxMult: 0.85 },
  uncommon:  { label: "Great Pull",     exclaim: "!",  color: "#00f0ff", minMult: 0.85, maxMult: 1.40 },
  rare:      { label: "Rare Pull",      exclaim: "!",  color: "#a855f7", minMult: 1.40, maxMult: 2.20 },
  legendary: { label: "Legendary Pull", exclaim: "!!", color: "#ff2d95", minMult: 2.20, maxMult: 3.50 },
} as const;

export const PRODUCT_TYPES = [
  "Funko Pop!",
  "Sonny Angel",
  "Sports Card",
  "Anime Figure",
  "Mini Brand",
] as const;

export function pickRarity(rarities: RarityBreakdown): keyof RarityBreakdown {
  const rand = Math.random() * 100;
  let cumulative = 0;
  for (const [rarity, weight] of Object.entries(rarities)) {
    cumulative += weight;
    if (rand <= cumulative) return rarity as keyof RarityBreakdown;
  }
  return "common";
}

export function pickValue(price: number, config: { minMult: number; maxMult: number }): number {
  const mult = config.minMult + Math.random() * (config.maxMult - config.minMult);
  return Math.round(price * mult);
}

export function pickProduct(): (typeof PRODUCT_TYPES)[number] {
  return PRODUCT_TYPES[Math.floor(Math.random() * PRODUCT_TYPES.length)];
}

export const WAITLIST_TOTAL_SPOTS = 100;