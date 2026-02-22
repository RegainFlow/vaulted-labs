import type { Rarity, VaultTierName } from "./vault";

export interface FunkoItem {
  id: string;
  name: string;
  rarity: Rarity;
  vaultTiers: VaultTierName[];
  imagePath: string;
  baseValue: number;
}
