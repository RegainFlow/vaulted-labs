import {
  VaultIllustration,
  MysteryBoxIllustration,
  DecisionIllustration,
  ShopIllustration,
  LevelUpIllustration,
  CoinsIllustration
} from "../assets/step-icons";
import type { Step } from "../types/game";

// step data
export const vaultSteps: Step[] = [
  {
    number: "01",
    title: "Pick Your Vault",
    description:
      "Choose from 6 tiers — Bronze ($24) to Diamond ($86). Every vault shows exact drop rates before you open. No hidden odds.",
    illustration: <VaultIllustration />,
    image: "1_pick_vault.png",
    iconColor: "text-accent",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-accent"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    )
  },
  {
    number: "02",
    title: "Reveal Your Collectible",
    description:
      "Select a mystery box and watch the reveal. Every vault contains a real, licensed collectible — from common pulls to legendary finds.",
    illustration: <MysteryBoxIllustration />,
    image: "2_reveal_collectible.png",
    iconColor: "text-neon-cyan",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-neon-cyan"
      >
        <path d="M6 3h12l4 6-10 13L2 9z" />
      </svg>
    )
  },
  {
    number: "03",
    title: "Hold, Ship, or Cashout",
    description:
      "Your item, your call. Store it in your vault, ship it to your door with real tracking, or cash out instantly for credits.",
    illustration: <DecisionIllustration />,
    image: "3_hold_ship_cash.png",
    iconColor: "text-neon-green",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-neon-green"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  }
];

export const platformSteps: Step[] = [
  {
    number: "04",
    title: "Trade on the Shop",
    description:
      "Browse the marketplace to buy collectibles from other players. Bid on auctions. Build the collection you actually want.",
    illustration: <ShopIllustration />,
    image: "4_trade_shop.jpg",
    iconColor: "text-accent",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-accent"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    )
  },
  {
    number: "05",
    title: "Level Up & Earn Rewards",
    description:
      "Earn XP with every vault and purchase. Complete quests, unlock boss fights, and climb the ranks. The more you play, the more you earn.",
    illustration: <LevelUpIllustration />,
    image: "5_level_up.jpg",
    iconColor: "text-neon-cyan",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-neon-cyan"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  },
  {
    number: "06",
    title: "Credits Fuel Everything",
    description:
      "Earn credits from cashouts, quests, and rewards. Spend them on vaults, marketplace items, and bids. The loop never stops.",
    illustration: <CoinsIllustration />,
    image: "6_credits.jpg",
    iconColor: "text-vault-gold",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-vault-gold"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    )
  }
];
