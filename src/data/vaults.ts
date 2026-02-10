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
  itemRange: string;
  rarities: RarityBreakdown;
}

export const VAULTS: Vault[] = [
  {
    name: "Bronze",
    price: 24,
    color: "#cd7f32",
    gradient: "from-[#8B4513] to-[#cd7f32]",
    tagline: "Start your collection",
    itemRange: "3–5 items",
    rarities: { common: 60, uncommon: 30, rare: 8.3, legendary: 1.7 },
  },
  {
    name: "Silver",
    price: 38,
    color: "#d8d8d8",
    gradient: "from-[#747474] to-[#d8d8d8]",
    tagline: "Elevated essentials",
    itemRange: "4–6 items",
    rarities: { common: 40, uncommon: 40, rare: 16.9, legendary: 3.1 },
  },
  {
    name: "Gold",
    price: 54,
    color: "#ffd700",
    gradient: "from-[#bd8a13] to-[#ffd700]",
    tagline: "Premium picks",
    itemRange: "5–7 items",
    rarities: { common: 20, uncommon: 45, rare: 30.8, legendary: 4.2 },
  },
  {
    name: "Diamond",
    price: 86,
    color: "#b9f2ff",
    gradient: "from-[#49bee4] to-[#b9f2ff]",
    tagline: "The ultimate unboxing",
    itemRange: "6–8 items",
    rarities: { common: 5, uncommon: 30, rare: 60.6, legendary: 4.4 },
  },
];

export const WAITLIST_TOTAL_SPOTS = 100;