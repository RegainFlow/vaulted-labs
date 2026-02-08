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
  tagline: string;
  itemRange: string;
  rarities: RarityBreakdown;
}

export const VAULTS: Vault[] = [
  {
    name: "Bronze",
    price: 24,
    color: "#cd7f32",
    tagline: "Start your collection",
    itemRange: "3–5 items",
    rarities: { common: 60.5, uncommon: 18.0, rare: 19.8, legendary: 1.7 },
  },
  {
    name: "Silver",
    price: 38,
    color: "#c0c0c0",
    tagline: "Elevated essentials",
    itemRange: "4–6 items",
    rarities: { common: 59.8, uncommon: 18.8, rare: 18.3, legendary: 3.1 },
  },
  {
    name: "Gold",
    price: 54,
    color: "#ffd700",
    tagline: "Premium picks",
    itemRange: "5–7 items",
    rarities: { common: 57.9, uncommon: 29.3, rare: 8.6, legendary: 4.2 },
  },
  {
    name: "Diamond",
    price: 86,
    color: "#b9f2ff",
    tagline: "The ultimate unboxing",
    itemRange: "6–8 items",
    rarities: { common: 55.1, uncommon: 27.3, rare: 13.2, legendary: 4.4 },
  },
];

export const WAITLIST_TOTAL_SPOTS = 100;
