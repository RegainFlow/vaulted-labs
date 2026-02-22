import type { InventoryItem } from "../types/inventory";
import type { Auction, MarketplaceListing } from "../types/marketplace";

function makeItem(
  overrides: Partial<InventoryItem> &
    Pick<InventoryItem, "id" | "product" | "vaultTier" | "rarity" | "value">
): InventoryItem {
  return {
    status: "held",
    acquiredAt: Date.now() - Math.floor(Math.random() * 86400000),
    ...overrides
  };
}

export const SEED_LISTINGS: MarketplaceListing[] = [
  {
    id: "listing-1",
    item: makeItem({
      id: "li-1",
      product: "Funko Pop!",
      vaultTier: "Bronze",
      rarity: "common",
      value: 12,
      funkoId: "pop-rusty-sentinel-001",
      funkoName: "Rusty Sentinel"
    }),
    sellerName: "VaultHunter_42",
    askingPrice: 10,
    listedAt: Date.now() - 3600000
  },
  {
    id: "listing-2",
    item: makeItem({
      id: "li-2",
      product: "Funko Pop!",
      vaultTier: "Bronze",
      rarity: "common",
      value: 15,
      funkoId: "pop-scrap-bot-002",
      funkoName: "Scrap Bot"
    }),
    sellerName: "MintCondition",
    askingPrice: 12,
    listedAt: Date.now() - 7200000
  },
  {
    id: "listing-3",
    item: makeItem({
      id: "li-3",
      product: "Funko Pop!",
      vaultTier: "Silver",
      rarity: "common",
      value: 25,
      funkoId: "pop-dust-walker-003",
      funkoName: "Dust Walker"
    }),
    sellerName: "NeonTrader",
    askingPrice: 22,
    listedAt: Date.now() - 1800000
  },
  {
    id: "listing-4",
    item: makeItem({
      id: "li-4",
      product: "Funko Pop!",
      vaultTier: "Gold",
      rarity: "uncommon",
      value: 60,
      funkoId: "pop-steel-samurai-021",
      funkoName: "Steel Samurai"
    }),
    sellerName: "CryptoCollector",
    askingPrice: 55,
    listedAt: Date.now() - 5400000
  },
  {
    id: "listing-5",
    item: makeItem({
      id: "li-5",
      product: "Funko Pop!",
      vaultTier: "Platinum",
      rarity: "uncommon",
      value: 85,
      funkoId: "pop-void-scout-024",
      funkoName: "Void Scout"
    }),
    sellerName: "ShardSeeker",
    askingPrice: 80,
    listedAt: Date.now() - 9000000
  },
  {
    id: "listing-6",
    item: makeItem({
      id: "li-6",
      product: "Funko Pop!",
      vaultTier: "Obsidian",
      rarity: "rare",
      value: 140,
      funkoId: "pop-venom-empress-039",
      funkoName: "Venom Empress"
    }),
    sellerName: "ObsidianQueen",
    askingPrice: 130,
    listedAt: Date.now() - 10800000
  },
  {
    id: "listing-7",
    item: makeItem({
      id: "li-7",
      product: "Funko Pop!",
      vaultTier: "Diamond",
      rarity: "rare",
      value: 165,
      funkoId: "pop-plasma-oracle-044",
      funkoName: "Plasma Oracle"
    }),
    sellerName: "DiamondDog_99",
    askingPrice: 155,
    listedAt: Date.now() - 14400000
  },
  {
    id: "listing-8",
    item: makeItem({
      id: "li-8",
      product: "Funko Pop!",
      vaultTier: "Diamond",
      rarity: "legendary",
      value: 250,
      funkoId: "pop-celestial-dragon-047",
      funkoName: "Celestial Dragon"
    }),
    sellerName: "RareFinder",
    askingPrice: 235,
    listedAt: Date.now() - 18000000
  }
];

export const SEED_AUCTIONS: Auction[] = [
  {
    id: "auction-1",
    item: makeItem({
      id: "ai-1",
      product: "Funko Pop!",
      vaultTier: "Gold",
      rarity: "rare",
      value: 95,
      funkoId: "pop-hyper-dragon-034",
      funkoName: "Hyper Dragon"
    }),
    sellerName: "VaultHunter_42",
    startingBid: 40,
    currentBid: 62,
    currentBidder: "NeonTrader",
    endsAt: Date.now() + 23 * 60 * 1000,
    listedAt: Date.now() - 43200000
  },
  {
    id: "auction-2",
    item: makeItem({
      id: "ai-2",
      product: "Funko Pop!",
      vaultTier: "Platinum",
      rarity: "uncommon",
      value: 75,
      funkoId: "pop-void-scout-024",
      funkoName: "Void Scout"
    }),
    sellerName: "ShardSeeker",
    startingBid: 30,
    currentBid: 30,
    currentBidder: null,
    endsAt: Date.now() + 60 * 60 * 1000,
    listedAt: Date.now() - 21600000
  },
  {
    id: "auction-3",
    item: makeItem({
      id: "ai-3",
      product: "Funko Pop!",
      vaultTier: "Diamond",
      rarity: "legendary",
      value: 280,
      funkoId: "pop-celestial-dragon-047",
      funkoName: "Celestial Dragon"
    }),
    sellerName: "DiamondDog_99",
    startingBid: 100,
    currentBid: 185,
    currentBidder: "CryptoCollector",
    endsAt: Date.now() + 3 * 60 * 60 * 1000,
    listedAt: Date.now() - 36000000
  },
  {
    id: "auction-4",
    item: makeItem({
      id: "ai-4",
      product: "Funko Pop!",
      vaultTier: "Obsidian",
      rarity: "rare",
      value: 150,
      funkoId: "pop-glitch-reaper-037",
      funkoName: "Glitch Reaper"
    }),
    sellerName: "ObsidianQueen",
    startingBid: 60,
    currentBid: 98,
    currentBidder: "MintCondition",
    endsAt: Date.now() + 5 * 60 * 60 * 1000,
    listedAt: Date.now() - 28800000
  },
  {
    id: "auction-5",
    item: makeItem({
      id: "ai-5",
      product: "Funko Pop!",
      vaultTier: "Silver",
      rarity: "uncommon",
      value: 45,
      funkoId: "pop-frost-warden-017",
      funkoName: "Frost Warden"
    }),
    sellerName: "RareFinder",
    startingBid: 20,
    currentBid: 20,
    currentBidder: null,
    endsAt: Date.now() + 8 * 60 * 60 * 1000,
    listedAt: Date.now() - 14400000
  }
];
