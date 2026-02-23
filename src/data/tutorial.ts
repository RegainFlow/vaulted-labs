import type { PageTutorialStepConfig, TutorialStep } from "../types/tutorial";

function getHudSelector(): string {
  const isMobile = window.innerWidth < 768;
  return isMobile ? '[data-tutorial="hud"]' : '[data-tutorial="hud-desktop"]';
}

export const LINEAR_FLOW: Record<string, TutorialStep> = {
  welcome: "hud",
  hud: "categories",
  categories: "odds",
  odds: "contents",
  contents: "open-vault",
  "result-store": "result-ship",
  "result-ship": "result-cashout"
};

export const TOOLTIP_STEPS: Record<
  string,
  {
    selector: string | (() => string);
    title: string;
    description: string;
    position: "top" | "bottom";
  }
> = {
  hud: {
    selector: getHudSelector,
    title: "Your Dashboard",
    description:
      "Track credits, energy, shards, and level here while you play.",
    position: "bottom"
  },
  categories: {
    selector: '[data-tutorial="categories"]',
    title: "Category Filter",
    description:
      "Choose what collectible category you want to hunt before opening.",
    position: "bottom"
  },
  odds: {
    selector: '[data-tutorial="vault-odds"]',
    title: "Check Odds",
    description:
      "Tap Odds to view rarity chances. Higher rank lowers common chance and boosts higher rarities.",
    position: "bottom"
  },
  contents: {
    selector: '[data-tutorial="vault-contents"]',
    title: "Check Contents",
    description:
      "Tap Contents to preview what can drop from this vault tier.",
    position: "bottom"
  }
};

// Steps that Tutorial.tsx should NOT render (handled inside VaultOverlay)
export const OVERLAY_STEPS = new Set<string>([
  "spin-reel",
  "result-store",
  "result-ship",
  "result-cashout"
]);

/* --- Page Tutorial Step Configs --- */

export const WALLET_TUTORIAL_STEPS: PageTutorialStepConfig[] = [
  {
    id: "wallet-welcome",
    type: "welcome",
    title: "Your Wallet",
    description:
      "Track credits, view transactions, and understand your balance."
  },
  {
    id: "wallet-balance",
    type: "spotlight",
    selector: '[data-tutorial="wallet-balance"]',
    title: "Available Balance",
    description: "Your total spendable credits shown here.",
    position: "bottom"
  },
  {
    id: "wallet-breakdown",
    type: "spotlight",
    selector: '[data-tutorial="wallet-breakdown"]',
    title: "Credit Breakdown",
    description:
      "Earned (cashouts, quests, boss rewards), Incentive (promo grants), and Spent (vaults and market buys).",
    position: "bottom"
  },
  {
    id: "wallet-actions",
    type: "spotlight",
    selector: '[data-tutorial="wallet-actions"]',
    title: "Quick Actions",
    description:
      "Add credits from the landing page, or select credits to cash out for money.",
    position: "bottom"
  },
  {
    id: "wallet-filters",
    type: "spotlight",
    selector: '[data-tutorial="wallet-filters"]',
    title: "Filter Transactions",
    description: "Filter by type: All, Earned, Incentive, Spent.",
    position: "bottom"
  },
  {
    id: "wallet-transactions",
    type: "spotlight",
    selector: '[data-tutorial="wallet-transactions"]',
    title: "Transaction History",
    description:
      "Every credit movement appears here: vault purchases, rewards, and cashouts.",
    position: "top"
  },
  {
    id: "wallet-complete",
    type: "complete",
    title: "Wallet Unlocked!",
    description: "You are ready to manage your credits."
  }
];

/** @deprecated Use ARENA_TUTORIAL_STEPS instead */
export const PROFILE_TUTORIAL_STEPS: PageTutorialStepConfig[] = [];

export const ARENA_TUTORIAL_STEPS: PageTutorialStepConfig[] = [
  {
    id: "arena-welcome",
    type: "welcome",
    title: "The Arena",
    description: "Battle bosses, forge upgrades, and complete quests to rank up faster."
  },
  {
    id: "arena-resources",
    type: "spotlight",
    selector: '[data-tutorial="arena-resources"]',
    title: "Energy and Shards",
    description:
      "Energy powers boss fights. Win battles to earn shards, then convert shards into free spins.",
    position: "bottom"
  },
  {
    id: "arena-tabs",
    type: "spotlight",
    selector: '[data-tutorial="arena-tabs"]',
    title: "Arena Sections",
    description:
      "Use these tabs to move between Battles, Forge, and Quests.",
    position: "bottom"
  },
  {
    id: "arena-battles",
    type: "spotlight",
    selector: '[data-tutorial="arena-battles"]',
    title: "Battles",
    description:
      "Pick a boss, choose your squad, and auto-battle for shard and XP rewards.",
    position: "bottom"
  },
  {
    id: "arena-tab-forge",
    type: "spotlight",
    selector: '[data-tutorial="arena-tab-forge"]',
    title: "Forge Tab",
    description:
      "Switch to Forge when you want to combine 3 collectibles into one result.",
    position: "bottom"
  },
  {
    id: "arena-forge",
    type: "spotlight",
    selector: '[data-tutorial="arena-forge"]',
    title: "Forge",
    description:
      "Combine 3 collectibles into a new one. Better inputs improve your odds.",
    position: "bottom"
  },
  {
    id: "arena-tab-quests",
    type: "spotlight",
    selector: '[data-tutorial="arena-tab-quests"]',
    title: "Quests Tab",
    description:
      "Switch to Quests to track milestones and collect progression XP.",
    position: "bottom"
  },
  {
    id: "arena-quests",
    type: "spotlight",
    selector: '[data-tutorial="arena-quests"]',
    title: "Quests",
    description:
      "Complete quests for extra XP and progression milestones.",
    position: "top"
  },
  {
    id: "arena-rankup",
    type: "spotlight",
    selector: '[data-tutorial="arena-rankup"]',
    title: "Rank Up",
    description:
      "XP raises your level. At higher levels you can prestige to improve rarity odds.",
    position: "top"
  },
  {
    id: "arena-complete",
    type: "complete",
    title: "Arena Ready!",
    description: "Use energy wisely, collect shards, and climb the ranks."
  }
];

/** @deprecated Use COLLECTION_TUTORIAL_STEPS instead */
export const INVENTORY_TUTORIAL_STEPS: PageTutorialStepConfig[] = [];

export const COLLECTION_TUTORIAL_STEPS: PageTutorialStepConfig[] = [
  {
    id: "collection-welcome",
    type: "welcome",
    title: "Your Collection",
    description: "Manage items, buy from Market, and bid in Auctions from one place."
  },
  {
    id: "collection-tabs",
    type: "spotlight",
    selector: '[data-tutorial="collection-tabs"]',
    title: "Dashboard Tabs",
    description: "Switch between My Collection, Market, and Auctions.",
    position: "bottom"
  },
  {
    id: "collection-item",
    type: "spotlight",
    selector: '[data-tutorial="collection-item"]',
    title: "Collectible Card",
    description: "Each item shows rarity, value, and combat stats.",
    position: "bottom"
  },
  {
    id: "collection-actions",
    type: "spotlight",
    selector: '[data-tutorial="collection-actions"]',
    title: "Item Actions",
    description: "Keep, Ship, Cashout, or List your held collectible.",
    position: "top"
  },
  {
    id: "collection-market-tab",
    type: "spotlight",
    selector: '[data-tutorial="collection-market-tab"]',
    title: "Market",
    description: "Move to fixed-price listings and buy instantly with credits.",
    position: "bottom"
  },
  {
    id: "collection-listing",
    type: "spotlight",
    selector: '[data-tutorial="shop-listing"]',
    title: "Market Listing",
    description: "Browse player listings and compare rarity and price.",
    position: "bottom"
  },
  {
    id: "collection-auction-tab",
    type: "spotlight",
    selector: '[data-tutorial="collection-auction-tab"]',
    title: "Auctions",
    description: "Switch to auctions to compete before the timer ends.",
    position: "bottom"
  },
  {
    id: "collection-auction",
    type: "spotlight",
    selector: '[data-tutorial="shop-auction"]',
    title: "Auction Card",
    description: "Watch countdowns and place bids to win high-demand items.",
    position: "bottom"
  },
  {
    id: "collection-complete",
    type: "complete",
    title: "Collection Ready!",
    description: "You can now manage, trade, and route collectibles into Arena progression."
  }
];

export const BOSS_FIGHT_TUTORIAL_STEPS: PageTutorialStepConfig[] = [
  {
    id: "boss-welcome",
    type: "welcome",
    title: "Boss Battle!",
    description:
      "Your squad stats auto-resolve against the boss. Stronger ATK/DEF/AGI improves win odds."
  },
  {
    id: "boss-squad-hp",
    type: "spotlight",
    selector: '[data-tutorial="boss-squad-hp"]',
    title: "Squad HP",
    description:
      "Your squad health pool. If it hits zero, the battle is lost.",
    position: "bottom"
  },
  {
    id: "boss-enemy-hp",
    type: "spotlight",
    selector: '[data-tutorial="boss-enemy-hp"]',
    title: "Boss HP",
    description: "Reduce boss health to zero to win and collect shards.",
    position: "bottom"
  },
  {
    id: "boss-exchanges",
    type: "spotlight",
    selector: '[data-tutorial="boss-exchanges"]',
    title: "Combat Exchanges",
    description:
      "Each round both sides trade damage based on stats and modifiers.",
    position: "bottom"
  },
  {
    id: "boss-complete",
    type: "complete",
    title: "Ready to Fight!",
    description: "Build a stronger squad and keep farming shards."
  }
];

export const SHOP_TUTORIAL_STEPS: PageTutorialStepConfig[] = [
  {
    id: "shop-welcome",
    type: "welcome",
    title: "The Shop",
    description: "Buy collectibles and bid on auctions from other players."
  },
  {
    id: "shop-tabs",
    type: "spotlight",
    selector: '[data-tutorial="shop-tabs"]',
    title: "Two Sections",
    description:
      "Marketplace for fixed-price listings, Auctions for competitive bidding.",
    position: "bottom"
  },
  {
    id: "shop-listing",
    type: "spotlight",
    selector: '[data-tutorial="shop-listing"]',
    title: "Marketplace Listing",
    description: "Browse items listed by other players at fixed prices.",
    position: "bottom"
  },
  {
    id: "shop-buy",
    type: "spotlight",
    selector: '[data-tutorial="shop-buy"]',
    title: "Buy Now",
    description: "Purchase instantly if you have enough credits.",
    position: "top"
  },
  {
    id: "shop-auction-tab",
    type: "spotlight",
    selector: '[data-tutorial="shop-auction-tab"]',
    title: "Auctions",
    description: "Switch to auctions to bid on items before time runs out.",
    position: "bottom"
  },
  {
    id: "shop-auction",
    type: "spotlight",
    selector: '[data-tutorial="shop-auction"]',
    title: "Auction Item",
    description: "Bid on items before time runs out. Highest bidder wins.",
    position: "bottom"
  },
  {
    id: "shop-timer",
    type: "spotlight",
    selector: '[data-tutorial="shop-timer"]',
    title: "Countdown Timer",
    description: "When under 5 minutes, the timer pulses red.",
    position: "bottom"
  },
  {
    id: "shop-bid",
    type: "spotlight",
    selector: '[data-tutorial="shop-bid"]',
    title: "Place a Bid",
    description: "Enter a bid above current price and submit.",
    position: "top"
  },
  {
    id: "shop-complete",
    type: "complete",
    title: "Shop Pro!",
    description: "Buy, bid, and build your collection."
  }
];
