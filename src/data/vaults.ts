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
    rarities: { common: 60, uncommon: 30, rare: 8.3, legendary: 1.7 },
  },
  {
    name: "Silver",
    price: 38,
    color: "#e0e0e0",
    gradient: "from-[#757575] to-[#e0e0e0]",
    tagline: "Refined assets",
    rarities: { common: 40, uncommon: 40, rare: 16.9, legendary: 3.1 },
  },
  {
    name: "Gold",
    price: 54,
    color: "#ffd700",
    gradient: "from-[#b8860b] to-[#ffd700]",
    tagline: "Standard of value",
    rarities: { common: 20, uncommon: 45, rare: 30.8, legendary: 4.2 },
  },
  {
    name: "Platinum",
    price: 75,
    color: "#79b5db",
    gradient: "from-[#4a6d85] to-[#a2d4e8]",
    tagline: "Industrial purity",
    rarities: { common: 15, uncommon: 35, rare: 45.0, legendary: 5.0 },
  },
  {
    name: "Obsidian",
    price: 95,
    color: "#6c4e85",
    gradient: "from-[#2e2b36] to-[#6c4e85]",
    tagline: "Volcanic glass",
    rarities: { common: 10, uncommon: 25, rare: 58.0, legendary: 7.0 },
  },
  {
    name: "Diamond",
    price: 120,
    color: "#b9f2ff",
    gradient: "from-[#00bfff] to-[#b9f2ff]",
    tagline: "The ultimate unboxing",
    rarities: { common: 5, uncommon: 20, rare: 65.0, legendary: 10.0 },
  },
];

export const WAITLIST_TOTAL_SPOTS = 100;