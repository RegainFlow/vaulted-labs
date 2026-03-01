export type VaultTierName =
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Obsidian"
  | "Diamond";

export type Rarity = "common" | "uncommon" | "rare" | "legendary";

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
  rarities: RarityBreakdown;
}

export interface VaultCardProps {
  vault: Vault;
  index: number;
  balance: number;
  onSelect: (vault: Vault) => void;
  disabled?: boolean;
}

export interface VaultGridProps {
  microTutorialActive?: boolean;
  tutorialStepId?: string | null;
  tutorialMode?: "demo" | null;
}

export interface VaultIconProps {
  name: string;
  color: string;
}
