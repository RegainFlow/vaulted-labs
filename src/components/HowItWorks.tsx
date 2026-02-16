import { motion } from "motion/react";
import type { Step } from "../types/landing";
import {
  VaultIllustration,
  MysteryBoxIllustration,
  DecisionIllustration,
  ShopIllustration,
  LevelUpIllustration,
  CoinsIllustration,
  HexagonalIcon,
  DiamondIcon,
  CheckMarkIcon,
  BoxIcon,
  StarIcon,
  MoneyIcon
} from "../assets/step-icons";

// step data
const vaultSteps: Step[] = [
  {
    number: "01",
    title: "Pick Your Vault",
    description:
      "Choose from 6 tiers — Bronze ($24) to Diamond ($86). Every vault shows exact drop rates before you open. No hidden odds.",
    illustration: <VaultIllustration />,
    image: "1_pick_vault.png",
    iconColor: "text-accent",
    icon: <HexagonalIcon />
  },
  {
    number: "02",
    title: "Reveal Your Collectible",
    description:
      "Select a mystery box and watch the reveal. Every vault contains a real, licensed collectible — from common pulls to legendary finds.",
    illustration: <MysteryBoxIllustration />,
    image: "2_reveal_collectible.png",
    iconColor: "text-neon-cyan",
    icon: <DiamondIcon />
  },
  {
    number: "03",
    title: "Hold, Ship, or Cashout",
    description:
      "Your item, your call. Store it in your vault, ship it to your door with real tracking, or cash out instantly for credits.",
    illustration: <DecisionIllustration />,
    image: "3_hold_ship_cash.png",
    iconColor: "text-neon-green",
    icon: <CheckMarkIcon />
  }
];

const platformSteps: Step[] = [
  {
    number: "04",
    title: "Trade on the Shop",
    description:
      "Browse the marketplace to buy collectibles from other players. Bid on auctions. Build the collection you actually want.",
    illustration: <ShopIllustration />,
    image: "4_trade_shop.jpg",
    iconColor: "text-accent",
    icon: <BoxIcon />
  },
  {
    number: "05",
    title: "Level Up & Earn Rewards",
    description:
      "Earn XP with every vault and purchase. Complete quests, unlock boss fights, and climb the ranks. The more you play, the more you earn.",
    illustration: <LevelUpIllustration />,
    image: "5_level_up.jpg",
    iconColor: "text-neon-cyan",
    icon: <StarIcon />
  },
  {
    number: "06",
    title: "Credits Fuel Everything",
    description:
      "Earn credits from cashouts, quests, and rewards. Spend them on vaults, marketplace items, and bids. The loop never stops.",
    illustration: <CoinsIllustration />,
    image: "6_credits.jpg",
    iconColor: "text-vault-gold",
    icon: <MoneyIcon />
  }
];

// Step Card Component
function StepCard({ step, index }: { step: Step; index: number }) {
  return (
    <motion.div
      key={step.number}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative p-5 sm:p-6 md:p-8 rounded-2xl bg-surface border border-white/5 hover:border-white/10 transition-colors group"
    >
      <div className="absolute -top-4 left-5 sm:left-6 md:left-8 px-3 py-1 bg-accent text-white text-xs font-black rounded-lg shadow-[0_0_15px_rgba(255,45,149,0.3)]">
        {step.number}
      </div>

      {/* {step.illustration} */}
      <div className="rounded-xl overflow-hidden border border-accent/20 shadow-[0_0_5px_rgba(255,45,149,.3)] mb-5 group-hover:shadow-[0_0_5px_rgba(255,45,149,0.8)] transition-shadow">
        <img
          src={"/images/how-it-works/" + step.image}
          alt={step.title}
          className="w-full h-auto object-cover rounded-xl"
        />
      </div>

      <div className="mb-6 w-14 h-14 rounded-xl bg-surface-elevated border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
        {step.icon}
      </div>

      <h3 className="text-xl font-black text-white uppercase tracking-wide mb-3">
        {step.title}
      </h3>
      <p className="text-text-muted leading-relaxed">{step.description}</p>
    </motion.div>
  );
}

// Section Component
export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 px-4 sm:px-6 bg-bg relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-6 sm:px-10 md:px-16 py-3 md:py-4.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm sm:text-base md:text-[20px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6">
            How It Works
          </div>
        </motion.div>

        {/* Row 1: The Vault */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-4"
        >
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-text-dim mb-6 text-center">
            The Vault
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {vaultSteps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12 md:mb-16">
          <div className="flex-1 h-px bg-white/5" />
          <div className="w-2 h-2 rounded-full bg-accent/30" />
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* Row 2: The Platform */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-4"
        >
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-text-dim mb-6 text-center">
            The Platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {platformSteps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
