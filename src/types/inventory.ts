import type { VaultTierName, Rarity } from "./vault";

export type ItemStatus = "held" | "listed" | "shipped" | "cashed_out";

export interface InventoryItem {
  id: string;
  product: string;
  vaultTier: VaultTierName;
  rarity: Rarity;
  value: number;
  status: ItemStatus;
  acquiredAt: number;
  funkoId?: string;
  funkoName?: string;
}

export interface InventoryItemCardProps {
  item: InventoryItem;
  onCashout: (itemId: string) => void;
  onShip: (itemId: string) => void;
  onList: (itemId: string) => void;
}
