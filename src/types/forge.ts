import type { Rarity } from "./vault";

export type ForgePhase =
  | "selecting"
  | "ready"
  | "forging"
  | "result";

export interface ForgeRecipe {
  inputRarities: [Rarity, Rarity, Rarity];
  odds: Record<Rarity, number>;
}

export interface ForgeAttempt {
  inputIds: [string, string, string];
  boostSpinsUsed: number;
  resultRarity: Rarity;
  timestamp: number;
}

export interface ForgeProps {
  onForgeComplete?: () => void;
}

export const MAX_FORGE_BOOSTS = 3;
