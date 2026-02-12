export type Rarity = "common" | "uncommon" | "rare" | "legendary";
export type VaultTierName = "Bronze" | "Silver" | "Gold" | "Platinum" | "Obsidian" | "Diamond";
export type ItemStatus = "held" | "listed" | "shipped" | "cashed_out";
export type CreditType = "incentive" | "earned" | "spent";

export interface InventoryItem {
  id: string;
  product: string;
  vaultTier: VaultTierName;
  rarity: Rarity;
  value: number;
  status: ItemStatus;
  acquiredAt: number;
}

export interface CreditTransaction {
  id: string;
  type: CreditType;
  amount: number;
  description: string;
  timestamp: number;
}

export interface MarketplaceListing {
  id: string;
  item: InventoryItem;
  sellerName: string;
  askingPrice: number;
  listedAt: number;
}

export interface Auction {
  id: string;
  item: InventoryItem;
  sellerName: string;
  startingBid: number;
  currentBid: number;
  currentBidder: string | null;
  endsAt: number;
  listedAt: number;
}

export interface BossFight {
  id: string;
  name: string;
  description: string;
  requiredLevel: number;
  rewardDescription: string;
}

export interface LevelInfo {
  level: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
}
