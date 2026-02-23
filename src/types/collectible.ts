import type { VaultTierName, Rarity } from "./vault";

export type ItemStatus = "held" | "listed" | "shipped" | "cashed_out";

export interface ItemStats {
  atk: number;
  def: number;
  agi: number;
  ability?: string;
}

export interface Collectible {
  id: string;
  product: string;
  vaultTier: VaultTierName;
  rarity: Rarity;
  value: number;
  status: ItemStatus;
  acquiredAt: number;
  funkoId?: string;
  funkoName?: string;
  stats: ItemStats;
  isEquipped: boolean;
}

/** @deprecated Use Collectible instead */
export type InventoryItem = Collectible;

export interface CollectibleCardProps {
  item: Collectible;
  onCashout: (itemId: string) => void;
  onShip: (itemId: string) => void;
  onList: (itemId: string) => void;
}

/** @deprecated Use CollectibleCardProps instead */
export type InventoryItemCardProps = CollectibleCardProps;
