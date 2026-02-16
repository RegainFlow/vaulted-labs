import type { TutorialStep } from "./tutorial";

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
  tagline: string;
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
  tutorialStep?: TutorialStep | null;
  onTutorialAdvance?: (step: TutorialStep) => void;
  onTutorialSetAction?: (action: string) => void;
}

export interface VaultIconProps {
  name: string;
  color: string;
}
