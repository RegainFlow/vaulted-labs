import type { TutorialStep, PageTutorialStepConfig } from "../types/tutorial";

function getHudSelector(): string {
  const isMobile = window.innerWidth < 768;
  return isMobile ? '[data-tutorial="hud"]' : '[data-tutorial="hud-desktop"]';
}

export const LINEAR_FLOW: Record<string, TutorialStep> = {
  welcome: "hud",
  hud: "categories",
  categories: "open-vault",
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
      "This is your dashboard. Credits, loot, and level — always visible.",
    position: "bottom"
  },
  categories: {
    selector: '[data-tutorial="categories"]',
    title: "Categories",
    description:
      "Categories filter what you're hunting for. Funko Pop! is selected.",
    position: "bottom"
  }
};

// Steps that Tutorial.tsx should NOT render (handled inside VaultOverlay)
export const OVERLAY_STEPS = new Set<string>([
  "pick-box",
  "revealing",
  "result-store",
  "result-ship",
  "result-cashout"
]);

/* ─── Page Tutorial Step Configs ─── */

export const WALLET_TUTORIAL_STEPS: PageTutorialStepConfig[] = [
  {
    id: "wallet-welcome",
    type: "welcome",
    title: "Your Wallet",
    description: "Track credits, view transactions, and understand your balance."
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
    description: "Earned (from cashouts/reveals), Incentive (from waitlist), Spent (on vaults/shop).",
    position: "bottom"
  },
  {
    id: "wallet-actions",
    type: "spotlight",
    selector: '[data-tutorial="wallet-actions"]',
    title: "Quick Actions",
    description: "Add credits by joining the waitlist, or cashout to external.",
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
    description: "Every credit movement logged here — vault purchases, quest rewards, cashouts.",
    position: "top"
  },
  {
    id: "wallet-complete",
    type: "complete",
    title: "Wallet Unlocked!",
    description: "You're ready to manage your credits."
  }
];

export const PROFILE_TUTORIAL_STEPS: PageTutorialStepConfig[] = [
  {
    id: "profile-welcome",
    type: "welcome",
    title: "Player Profile",
    description: "Your progression hub: XP, quests, boss fights, and prestige."
  },
  {
    id: "profile-level",
    type: "spotlight",
    selector: '[data-tutorial="profile-level"]',
    title: "Level & XP",
    description: "Earn XP from opening vaults and marketplace purchases. Level up to unlock new quests and boss fights.",
    position: "bottom"
  },
  {
    id: "profile-prestige",
    type: "spotlight",
    selector: '[data-tutorial="profile-prestige"]',
    title: "Prestige System",
    description: "At Level 10, prestige to reset XP, improve vault odds, and unlock a new color scheme. Up to 3 prestige levels.",
    position: "bottom"
  },
  {
    id: "profile-stats",
    type: "spotlight",
    selector: '[data-tutorial="profile-stats"]',
    title: "Your Stats",
    description: "Track your items collected, vaults opened, and credits earned.",
    position: "bottom"
  },
  {
    id: "profile-bosses",
    type: "spotlight",
    selector: '[data-tutorial="profile-bosses"]',
    title: "Boss Fights",
    description: "Unlock boss encounters as you level up. Defeat them for credit and XP rewards in a best-of-5 reel battle.",
    position: "bottom"
  },
  {
    id: "profile-quests",
    type: "spotlight",
    selector: '[data-tutorial="profile-quests"]',
    title: "Quests",
    description: "Complete quests for XP and credit rewards. New quests unlock as you level up.",
    position: "top"
  },
  {
    id: "profile-reset",
    type: "spotlight",
    selector: '[data-tutorial="profile-reset"]',
    title: "Reset Demo",
    description: "Start fresh: clears all progress, inventory, and credits.",
    position: "top"
  },
  {
    id: "profile-complete",
    type: "complete",
    title: "Profile Mastered!",
    description: "Level up, complete quests, and challenge bosses."
  }
];

export const INVENTORY_TUTORIAL_STEPS: PageTutorialStepConfig[] = [
  {
    id: "inventory-welcome",
    type: "welcome",
    title: "Your Loot",
    description: "Manage your collection of vault reveals."
  },
  {
    id: "inventory-filters",
    type: "spotlight",
    selector: '[data-tutorial="inventory-filters"]',
    title: "Filter Items",
    description: "Filter by status: All, Held, Shipped, Cashed Out.",
    position: "bottom"
  },
  {
    id: "inventory-item",
    type: "spotlight",
    selector: '[data-tutorial="inventory-item"]',
    title: "Item Card",
    description: "Each item shows its vault tier, rarity, and estimated value.",
    position: "bottom"
  },
  {
    id: "inventory-ship",
    type: "spotlight",
    selector: '[data-tutorial="inventory-ship"]',
    title: "Ship to Home",
    description: "Get the physical item delivered to your door (shipping costs apply).",
    position: "top"
  },
  {
    id: "inventory-cashout",
    type: "spotlight",
    selector: '[data-tutorial="inventory-cashout"]',
    title: "Cashout",
    description: "Convert to platform credits instantly at full item value.",
    position: "top"
  },
  {
    id: "inventory-list",
    type: "spotlight",
    selector: '[data-tutorial="inventory-list"]',
    title: "List on Marketplace",
    description: "Coming soon! List items for other players to buy.",
    position: "top"
  },
  {
    id: "inventory-complete",
    type: "complete",
    title: "Loot Manager Ready!",
    description: "Hold, ship, or cashout — it's your call."
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
    description: "Marketplace for fixed-price listings, Auctions for competitive bidding.",
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
    description: "When under 5 minutes, the timer pulses red — act fast!",
    position: "bottom"
  },
  {
    id: "shop-bid",
    type: "spotlight",
    selector: '[data-tutorial="shop-bid"]',
    title: "Place a Bid",
    description: "Enter your bid amount (must beat current bid) and submit.",
    position: "top"
  },
  {
    id: "shop-complete",
    type: "complete",
    title: "Shop Pro!",
    description: "Buy, bid, and build your collection."
  }
];
