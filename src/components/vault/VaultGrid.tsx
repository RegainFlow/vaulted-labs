import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  VAULTS,
  RARITY_CONFIG,
  PRODUCT_TYPES,
  pickRarity,
  pickValue,
  pickProduct,
  getPrestigeOdds
} from "../../data/vaults";
import { VaultCard } from "./VaultCard";
import { useGame } from "../../context/GameContext";
import { trackEvent, AnalyticsEvents } from "../../lib/analytics";
import type {
  Rarity,
  Vault,
  VaultGridProps,
  VaultTierName
} from "../../types/vault";
import type { TutorialStep } from "../../types/tutorial";
import { VaultIcon } from "./VaultIcons";

export function VaultGrid({
  tutorialStep,
  onTutorialAdvance,
  onTutorialSetAction
}: VaultGridProps) {
  const {
    balance,
    purchaseVault,
    tutorialOpenVault,
    claimCreditsFromReveal,
    addItem,
    shipItem,
    prestigeLevel
  } = useGame();
  const navigate = useNavigate();
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const overlayKeyRef = useRef(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "Funko Pop!"
  );
  const [comingSoonCategory, setComingSoonCategory] = useState<string | null>(
    null
  );

  const isTutorialActive = tutorialStep != null;

  const handleSelect = (vault: Vault) => {
    if (tutorialStep === "open-vault") {
      if (vault.name !== "Bronze") return;
      trackEvent(AnalyticsEvents.VAULT_OVERLAY_OPENED, {
        vault_tier: vault.name,
        vault_price: vault.price
      });
      overlayKeyRef.current += 1;
      setSelectedVault(vault);
      onTutorialAdvance?.("pick-box");
      return;
    }

    if (balance < vault.price) return;
    trackEvent(AnalyticsEvents.VAULT_OVERLAY_OPENED, {
      vault_tier: vault.name,
      vault_price: vault.price
    });
    overlayKeyRef.current += 1;
    setSelectedVault(vault);
  };

  const handleCloseOverlay = () => {
    if (selectedVault) {
      trackEvent(AnalyticsEvents.VAULT_OVERLAY_CLOSED, {
        vault_tier: selectedVault.name,
        vault_price: selectedVault.price
      });
    }
    setSelectedVault(null);
  };

  const handleClaim = (amount: number) => {
    trackEvent(AnalyticsEvents.ITEM_ACTION, {
      action: "cashout",
      vault_tier: selectedVault?.name,
      rarity: null,
      value: amount
    });
    claimCreditsFromReveal(amount);
    setSelectedVault(null);
  };

  const handleStore = (
    product: string,
    vaultTier: VaultTierName,
    rarity: Rarity,
    value: number
  ) => {
    trackEvent(AnalyticsEvents.ITEM_ACTION, {
      action: "hold",
      vault_tier: vaultTier,
      rarity,
      value
    });
    addItem(product, vaultTier, rarity, value);
    setSelectedVault(null);
  };

  const handleShip = (
    product: string,
    vaultTier: VaultTierName,
    rarity: Rarity,
    value: number
  ) => {
    trackEvent(AnalyticsEvents.ITEM_ACTION, {
      action: "ship",
      vault_tier: vaultTier,
      rarity,
      value
    });
    const item = addItem(product, vaultTier, rarity, value);
    shipItem(item.id);
    setSelectedVault(null);
  };

  const minPrice = Math.min(...VAULTS.map((v) => v.price));
  const isBroke = balance < minPrice && !selectedVault && !isTutorialActive;

  return (
    <section className="relative overflow-hidden bg-bg px-4 sm:px-6 py-12 md:py-24 pt-28 md:pt-28 min-h-screen">
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
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            Open Your <span className="text-accent">Vault</span>
          </h2>
          <p className="mx-auto max-w-2xl text-text-muted">
            Pick your tier, choose a box, reveal your collectible.
          </p>
        </motion.div>

        <div
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6"
          data-tutorial="categories"
        >
          {PRODUCT_TYPES.map((cat, idx) => {
            const isEnabled = cat === "Funko Pop!";
            return (
              <button
                key={`${cat}-${idx}`}
                onClick={() => {
                  if (isEnabled) {
                    setSelectedCategory(selectedCategory === cat ? null : cat);
                    setComingSoonCategory(null);
                  } else {
                    setSelectedCategory(null);
                    setComingSoonCategory(
                      comingSoonCategory === `${cat}-${idx}`
                        ? null
                        : `${cat}-${idx}`
                    );
                  }
                }}
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider border transition-all duration-300 ${
                  !isEnabled
                    ? comingSoonCategory === `${cat}-${idx}`
                      ? "bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                      : "bg-surface border-white/10 text-text-muted hover:border-neon-cyan/30 hover:text-neon-cyan cursor-pointer"
                    : selectedCategory === cat
                      ? "bg-accent/20 border-accent text-accent shadow-[0_0_15px_rgba(255,45,149,0.2)] cursor-pointer"
                      : "bg-surface border-white/10 text-text-muted hover:border-white/20 hover:text-white cursor-pointer"
                }`}
              >
                {cat}
                {!isEnabled && (
                  <span className="ml-2 text-[9px] tracking-normal normal-case font-normal">
                    (Vote)
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Category Explanation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8 max-w-lg mx-auto"
        >
          <p className="text-xs text-text-muted leading-relaxed">
            We're launching with{" "}
            <span className="font-bold text-accent">Funko Pop!</span>{" "}
            collectibles. More categories will be unlocked based on user
            adoption and community votes.
          </p>
        </motion.div>

        {/* Coming Soon Card */}
        <AnimatePresence>
          {comingSoonCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center py-20"
            >
              <div className="inline-flex flex-col items-center gap-4 bg-surface-elevated/50 backdrop-blur-sm border border-neon-cyan/20 rounded-2xl p-8 sm:p-12 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-neon-cyan/5 border border-neon-cyan/20 flex items-center justify-center">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-neon-cyan"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-wider">
                  Coming Soon
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  This category is coming soon! Join the waitlist to vote on
                  which categories launch next.
                </p>
                <button
                  onClick={() => {
                    navigate("/");
                    setTimeout(() => {
                      document
                        .getElementById("waitlist-form")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="px-6 py-2.5 bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan text-xs font-black uppercase tracking-widest rounded-xl hover:bg-neon-cyan/20 transition-colors cursor-pointer"
                >
                  Join Waitlist to Vote
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vault Grid */}
        <AnimatePresence>
          {selectedCategory && !comingSoonCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`relative transition-all duration-500 ${isBroke ? "blur-xl grayscale pointer-events-none scale-[0.97] opacity-20" : ""}`}
            >
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 gap-y-6 sm:gap-y-8 max-w-6xl mx-auto"
                data-tutorial="vaults"
              >
                {VAULTS.map((vault, index) => (
                  <VaultCard
                    key={vault.name}
                    vault={vault}
                    index={index}
                    balance={balance}
                    onSelect={handleSelect}
                    disabled={isTutorialActive && vault.name !== "Bronze"}
                    prestigeLevel={prestigeLevel}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Odds & Pricing Disclaimer */}
        <div className="mt-8 max-w-xl mx-auto border-l-2 border-error/40 pl-3 text-left">
          <p className="text-xs text-text-muted leading-relaxed">
            <span className="font-bold text-error">Disclaimer:</span> All odds,
            pricing, and item values shown are for demonstration purposes only.
            Actual odds and pricing will be finalized in the official release
            and are subject to change.
          </p>
        </div>

        {isBroke && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full max-w-md px-4"
          >
            <div className="bg-surface/80 backdrop-blur-xl border-2 border-error/20 p-12 rounded-3xl shadow-[0_0_100px_rgba(255,59,92,0.1)]">
              <div className="w-20 h-20 bg-error/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-error/20">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-error"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8l-8 8M8 8l8 8" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">
                Credits Depleted
              </h3>
              <p className="text-error font-mono text-sm font-bold mb-4">
                ${balance.toFixed(2)} remaining
              </p>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                You need at least ${minPrice} to open a vault.
              </p>
              <button
                onClick={() => {
                  navigate("/");
                  setTimeout(() => {
                    document
                      .getElementById("waitlist-form")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="inline-block px-8 py-3 bg-accent text-white text-sm font-black uppercase tracking-widest rounded-xl border-b-[4px] border-[#a01d5e] shadow-[0_6px_16px_rgba(255,45,149,0.3)] hover:shadow-[0_4px_12px_rgba(255,45,149,0.4)] active:border-b-[2px] transition-all duration-100 cursor-pointer"
              >
                Add Credits
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedVault && (
          <VaultOverlay
            key={`overlay-${overlayKeyRef.current}`}
            tier={selectedVault}
            balance={balance}
            category={selectedCategory}
            onClose={handleCloseOverlay}
            onPurchase={purchaseVault}
            onClaim={handleClaim}
            onStore={handleStore}
            onShip={handleShip}
            isTutorial={isTutorialActive}
            tutorialStep={tutorialStep}
            onTutorialAdvance={onTutorialAdvance}
            onTutorialPurchase={tutorialOpenVault}
            onTutorialSetAction={onTutorialSetAction}
            prestigeLevel={prestigeLevel}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── Full-screen overlay with 4-stage flow ─── */

type Stage = "picking" | "revealing" | "spinning" | "bonus-spinning" | "result";

type BonusSpinPhase = "announce" | "split" | "appear" | "spinning" | "comparing" | "done";

const PREMIUM_BONUS_CHANCE: Record<string, number> = {
  Platinum: 0.2,
  Obsidian: 0.3,
  Diamond: 0.4
};

const RARITY_RANK: Record<Rarity, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  legendary: 3
};

interface ReelItem {
  rarity: Rarity;
  color: string;
  label: string;
}

function generateReelItems(wonRarity: Rarity): ReelItem[] {
  const rarities: Rarity[] = ["common", "uncommon", "rare", "legendary"];
  const weights = [50, 30, 15, 5];

  function weightedRandom(): Rarity {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < rarities.length; i++) {
      r -= weights[i];
      if (r <= 0) return rarities[i];
    }
    return "common";
  }

  const items: ReelItem[] = [];

  // Positions 0-7: random weighted mix
  for (let i = 0; i < 8; i++) {
    const r = weightedRandom();
    items.push({
      rarity: r,
      color: RARITY_CONFIG[r].color,
      label: r.charAt(0).toUpperCase() + r.slice(1)
    });
  }

  // Position 8: always legendary (the "near miss")
  items.push({
    rarity: "legendary",
    color: RARITY_CONFIG.legendary.color,
    label: "Legendary"
  });

  // Position 9: buffer between near-miss and result
  const bufferRarity = weightedRandom();
  items.push({
    rarity: bufferRarity,
    color: RARITY_CONFIG[bufferRarity].color,
    label: bufferRarity.charAt(0).toUpperCase() + bufferRarity.slice(1)
  });

  // Position 10: the actual result
  items.push({
    rarity: wonRarity,
    color: RARITY_CONFIG[wonRarity].color,
    label: wonRarity.charAt(0).toUpperCase() + wonRarity.slice(1)
  });

  // Position 11: buffer after landing
  const tailRarity = weightedRandom();
  items.push({
    rarity: tailRarity,
    color: RARITY_CONFIG[tailRarity].color,
    label: tailRarity.charAt(0).toUpperCase() + tailRarity.slice(1)
  });

  return items;
}

function generateBonusReelItems(bonusRarity: Rarity): ReelItem[] {
  const rarities: Rarity[] = ["common", "uncommon", "rare", "legendary"];
  const weights = [70, 18, 9, 3];

  function weightedRandom(): Rarity {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < rarities.length; i++) {
      r -= weights[i];
      if (r <= 0) return rarities[i];
    }
    return "common";
  }

  const items: ReelItem[] = [];
  for (let i = 0; i < 8; i++) {
    const r = weightedRandom();
    items.push({ rarity: r, color: RARITY_CONFIG[r].color, label: r.charAt(0).toUpperCase() + r.slice(1) });
  }
  items.push({ rarity: "legendary", color: RARITY_CONFIG.legendary.color, label: "Legendary" });
  const bufferRarity = weightedRandom();
  items.push({ rarity: bufferRarity, color: RARITY_CONFIG[bufferRarity].color, label: bufferRarity.charAt(0).toUpperCase() + bufferRarity.slice(1) });
  items.push({ rarity: bonusRarity, color: RARITY_CONFIG[bonusRarity].color, label: bonusRarity.charAt(0).toUpperCase() + bonusRarity.slice(1) });
  const tailRarity = weightedRandom();
  items.push({ rarity: tailRarity, color: RARITY_CONFIG[tailRarity].color, label: tailRarity.charAt(0).toUpperCase() + tailRarity.slice(1) });
  return items;
}

/* Tutorial result sub-step configs */
const RESULT_TOOLTIP: Record<
  string,
  { title: string; desc: string; highlight: number }
> = {
  "result-store": {
    title: "Store to Vault",
    desc: "Keep this collectible safe in your digital vault. Build your collection and watch its value grow.",
    highlight: 0
  },
  "result-ship": {
    title: "Ship to Home",
    desc: "Want the real thing? We'll ship the physical item straight to your door — worldwide.",
    highlight: 1
  },
  "result-cashout": {
    title: "Claim Credits",
    desc: "Instantly convert your item into platform credits. Use them to open more vaults.",
    highlight: 2
  }
};

interface VaultOverlayProps {
  tier: Vault;
  balance: number;
  category: string | null;
  onClose: () => void;
  onPurchase: (vaultName: string, price: number) => boolean;
  onClaim: (amount: number) => void;
  onStore: (
    product: string,
    vaultTier: VaultTierName,
    rarity: Rarity,
    value: number
  ) => void;
  onShip: (
    product: string,
    vaultTier: VaultTierName,
    rarity: Rarity,
    value: number
  ) => void;
  isTutorial?: boolean;
  tutorialStep?: TutorialStep | null;
  onTutorialAdvance?: (step: TutorialStep) => void;
  onTutorialPurchase?: (vaultName: string, price: number) => void;
  onTutorialSetAction?: (action: string) => void;
  prestigeLevel?: number;
}

function VaultOverlay({
  tier,
  balance,
  category,
  onClose,
  onPurchase,
  onClaim,
  onStore,
  onShip,
  isTutorial = false,
  tutorialStep,
  onTutorialAdvance,
  onTutorialPurchase,
  onTutorialSetAction,
  prestigeLevel: overlayPrestigeLevel = 0
}: VaultOverlayProps) {
  const [stage, setStage] = useState<Stage>("picking");
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [boxState, setBoxState] = useState<"closed" | "opening" | "open">(
    "closed"
  );
  const [spinLanded, setSpinLanded] = useState(false);

  const effectiveOdds = useMemo(
    () => getPrestigeOdds(tier.rarities, isTutorial ? 0 : overlayPrestigeLevel),
    [tier, isTutorial, overlayPrestigeLevel]
  );
  const wonRarity = useMemo(() => pickRarity(effectiveOdds), [effectiveOdds]);
  const product = useMemo(() => category || pickProduct(), [tier, category]);
  const rarityConfig = RARITY_CONFIG[wonRarity];
  const resultValue = useMemo(
    () => pickValue(tier.price, rarityConfig),
    [tier, rarityConfig]
  );
  const reelItems = useMemo(
    () => generateReelItems(wonRarity as Rarity),
    [wonRarity]
  );

  // Bonus spin state
  const bonusTriggered = useMemo(() => {
    if (isTutorial) return false;
    const chance = PREMIUM_BONUS_CHANCE[tier.name] ?? 0;
    return Math.random() < chance;
  }, [tier, isTutorial]);
  const bonusRarity = useMemo<Rarity | null>(
    () => (bonusTriggered ? pickRarity(tier.rarities) : null),
    [bonusTriggered, tier]
  );
  const bonusReelItems = useMemo(
    () => (bonusRarity ? generateBonusReelItems(bonusRarity) : []),
    [bonusRarity]
  );
  const finalRarity = useMemo<Rarity>(() => {
    if (!bonusRarity) return wonRarity as Rarity;
    return RARITY_RANK[bonusRarity] > RARITY_RANK[wonRarity as Rarity] ? bonusRarity : (wonRarity as Rarity);
  }, [wonRarity, bonusRarity]);
  const finalRarityConfig = RARITY_CONFIG[finalRarity];
  const finalResultValue = useMemo(
    () => (finalRarity === wonRarity ? resultValue : pickValue(tier.price, finalRarityConfig)),
    [finalRarity, wonRarity, resultValue, tier, finalRarityConfig]
  );
  const bonusResultValue = useMemo(
    () => (bonusRarity ? pickValue(tier.price, RARITY_CONFIG[bonusRarity]) : 0),
    [bonusRarity, tier]
  );
  const totalRevealValue = bonusTriggered ? resultValue + bonusResultValue : resultValue;
  const [bonusSpinPhase, setBonusSpinPhase] = useState<BonusSpinPhase>("announce");
  const [bonusSpinLanded, setBonusSpinLanded] = useState(false);
  const bonusUpgraded = bonusRarity !== null && RARITY_RANK[bonusRarity] > RARITY_RANK[wonRarity as Rarity];

  const isLoss = totalRevealValue < tier.price;
  const net = totalRevealValue - tier.price;
  const [purchasedBalance, setPurchasedBalance] = useState<number | null>(null);
  const preBalance = purchasedBalance ?? balance;
  const postBalance = preBalance - tier.price + totalRevealValue;

  // Highlighted box index for tutorial (center box)
  const tutorialBoxIndex = 4;

  // Current tutorial result tooltip
  const resultTooltip = tutorialStep ? RESULT_TOOLTIP[tutorialStep] : null;

  useEffect(() => {
    if (stage === "result") {
      trackEvent(AnalyticsEvents.VAULT_RESULT, {
        vault_tier: tier.name,
        rarity: finalRarity,
        value: finalResultValue,
        vault_price: tier.price,
        bonus_triggered: bonusTriggered,
        bonus_upgraded: bonusUpgraded,
        bonus_item_rarity: bonusRarity,
        bonus_item_value: bonusResultValue,
        total_value: totalRevealValue
      });
    }
  }, [stage]);

  const pickBox = () => {
    if (isTutorial) {
      onTutorialPurchase?.(tier.name, tier.price);
      setPurchasedBalance(balance);
      setPurchaseError(null);
      trackEvent(AnalyticsEvents.VAULT_OPENED, {
        vault_tier: tier.name,
        vault_price: tier.price,
        is_tutorial: true
      });
      setStage("revealing");
      onTutorialAdvance?.("revealing");
      setTimeout(() => setBoxState("opening"), 2200);
      setTimeout(() => setBoxState("open"), 2700);
      setTimeout(() => setStage("spinning"), 3500);
      setTimeout(() => setSpinLanded(true), 8000);
      setTimeout(() => {
        setStage("result");
        onTutorialAdvance?.("result-store");
      }, 8500);
      return;
    }

    if (!onPurchase(tier.name, tier.price)) {
      setPurchaseError(
        `Insufficient credits. You need $${tier.price} but have $${balance.toFixed(2)}.`
      );
      return;
    }
    setPurchasedBalance(balance);
    setPurchaseError(null);
    trackEvent(AnalyticsEvents.VAULT_OPENED, {
      vault_tier: tier.name,
      vault_price: tier.price
    });
    setStage("revealing");
    setTimeout(() => setBoxState("opening"), 2200);
    setTimeout(() => setBoxState("open"), 2700);
    setTimeout(() => setStage("spinning"), 3500);
    setTimeout(() => setSpinLanded(true), 8000);
    if (bonusTriggered) {
      trackEvent(AnalyticsEvents.BONUS_SPIN_TRIGGERED, {
        vault_tier: tier.name,
        vault_price: tier.price,
        first_rarity: wonRarity
      });
      setTimeout(() => setStage("bonus-spinning"), 8800);
    } else {
      setTimeout(() => setStage("result"), 8500);
    }
  };

  const handleClaim = () => {
    if (isTutorial) {
      onClaim(finalResultValue);
      onTutorialSetAction?.("cashed out");
      onTutorialAdvance?.("complete");
      return;
    }
    onClaim(totalRevealValue);
  };

  const handleStore = () => {
    if (isTutorial) {
      onStore(
        product,
        tier.name as VaultTierName,
        finalRarity,
        finalResultValue
      );
      onTutorialSetAction?.("stored");
      onTutorialAdvance?.("complete");
      return;
    }
    onStore(
      product,
      tier.name as VaultTierName,
      wonRarity as Rarity,
      resultValue
    );
    if (bonusTriggered && bonusRarity) {
      onStore(
        product,
        tier.name as VaultTierName,
        bonusRarity,
        bonusResultValue
      );
    }
  };

  const handleShip = () => {
    if (isTutorial) {
      onShip(
        product,
        tier.name as VaultTierName,
        finalRarity,
        finalResultValue
      );
      onTutorialSetAction?.("shipped");
      onTutorialAdvance?.("complete");
      return;
    }
    onShip(
      product,
      tier.name as VaultTierName,
      wonRarity as Rarity,
      resultValue
    );
    if (bonusTriggered && bonusRarity) {
      onShip(
        product,
        tier.name as VaultTierName,
        bonusRarity,
        bonusResultValue
      );
    }
  };

  const handleNextResultStep = () => {
    if (tutorialStep === "result-store") onTutorialAdvance?.("result-ship");
    else if (tutorialStep === "result-ship")
      onTutorialAdvance?.("result-cashout");
  };

  /* ── HUD-matching icons ── */
  const storeIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="text-neon-cyan"
    >
      <path
        d="M21 8V21H3V8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 3H1V8H23V3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12H14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const shipIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );

  const cashoutIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="text-vault-gold"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5s-2 .5-2 1.5 1 1.5 2 2 2 1 2 2-1 1.5-2 1.5-2-.5-2.5-1.5M12 7v1m0 8v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-bg/95 backdrop-blur-xl"
    >
      <div className="min-h-full flex items-center justify-center p-2 sm:p-4 py-4 sm:py-6">
        <AnimatePresence mode="wait">
          {/* STAGE 1: PICKING */}
          {stage === "picking" && (
            <motion.div
              key="picking"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="space-y-8 w-full max-w-lg relative"
            >
              {/* Close button */}
              {!isTutorial && (
                <button
                  onClick={onClose}
                  className="absolute -top-2 md:-top-3 right-0 md:-right-2 p-2.5 rounded-xl bg-error/10 border border-error/30 text-error hover:bg-error/20 hover:border-error/50 transition-all cursor-pointer z-20"
                  aria-label="Close vault"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}

              <div className="space-y-2 sm:space-y-3 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                  Crack the Vault
                </h2>
                <p className="text-text-muted max-w-lg mx-auto text-xs sm:text-sm md:text-base">
                  {isTutorial ? (
                    <>This one's on us — tap the glowing vault!</>
                  ) : (
                    <>
                      Nine sealed chambers. Your collectible is hiding in one.{" "}
                      <span className="font-bold" style={{ color: tier.color }}>
                        ${tier.price}
                      </span>{" "}
                      to crack it open.
                    </>
                  )}
                </p>
                {purchaseError && (
                  <p className="text-error text-sm font-bold">
                    {purchaseError}
                  </p>
                )}
              </div>

              {/* Tutorial tooltip for pick-box step */}
              {isTutorial && tutorialStep === "pick-box" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface-elevated border border-accent/40 rounded-xl p-3 sm:p-4 max-w-[260px] sm:max-w-xs mx-auto shadow-[0_0_30px_rgba(255,45,149,0.25)]"
                >
                  <p className="text-xs sm:text-sm font-black text-white uppercase tracking-tight mb-1">
                    Tap to Reveal
                  </p>
                  <p className="text-[10px] sm:text-xs text-text-muted leading-relaxed">
                    Tap the glowing vault to reveal your first collectible!
                  </p>
                </motion.div>
              )}

              <div className="grid grid-cols-3 gap-3 md:gap-4 perspective-[1000px]">
                {Array.from({ length: 9 }).map((_, i) => {
                  const isTutorialHighlighted =
                    isTutorial &&
                    tutorialStep === "pick-box" &&
                    i === tutorialBoxIndex;
                  const isTutorialDimmed =
                    isTutorial &&
                    tutorialStep === "pick-box" &&
                    i !== tutorialBoxIndex;

                  return (
                    <motion.button
                      key={i}
                      whileHover={
                        !isTutorialDimmed
                          ? {
                              scale: 1.05,
                              translateZ: 20,
                              borderColor: tier.color,
                              boxShadow: `0 0 20px ${tier.color}30`
                            }
                          : {}
                      }
                      whileTap={!isTutorialDimmed ? { scale: 0.95 } : {}}
                      onClick={() => !isTutorialDimmed && pickBox()}
                      className={`aspect-square relative rounded-xl border flex items-center justify-center shadow-lg group overflow-hidden transition-all duration-300 ${
                        isTutorialDimmed
                          ? "opacity-20 pointer-events-none"
                          : "cursor-pointer"
                      }`}
                      style={{
                        borderColor: isTutorialHighlighted
                          ? tier.color
                          : `${tier.color}40`,
                        backgroundColor: `${tier.color}08`,
                        boxShadow: isTutorialHighlighted
                          ? `0 0 25px ${tier.color}40, inset 0 0 15px ${tier.color}10`
                          : `0 0 10px ${tier.color}10`
                      }}
                    >
                      <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {/* Vault tier icon instead of generic box */}
                      <div className="scale-[0.45] md:scale-[0.5]">
                        <VaultIcon name={tier.name} color={tier.color} />
                      </div>
                      {isTutorialHighlighted && (
                        <div
                          className="absolute inset-0 rounded-xl border-2 animate-pulse pointer-events-none"
                          style={{ borderColor: tier.color }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STAGE 2: REVEALING */}
          {stage === "revealing" && (
            <motion.div
              key="revealing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="relative mb-12">
                <AnimatePresence mode="wait">
                  {boxState === "closed" && (
                    <motion.div
                      key="closed"
                      animate={{
                        rotate: [0, -2, 2, -3, 3, -6, 6, -10, 10, -12, 12, 0],
                        scale: [1, 1.02, 1.03, 1.05, 1.08, 1.1, 1.08, 1.12, 1.15, 1.12, 1.18, 1]
                      }}
                      transition={{
                        duration: 2.0,
                        repeat: Infinity,
                        times: [0, 0.08, 0.16, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.82, 0.9, 1]
                      }}
                      className="filter"
                      style={{
                        filter: `drop-shadow(0 0 50px ${tier.color}40)`
                      }}
                    >
                      {/* Vault tier icon for closed state */}
                      <div className="w-[100px] h-[100px] md:w-[128px] md:h-[128px] flex items-center justify-center">
                        <div className="scale-[1.25] md:scale-[1.6]">
                          <VaultIcon name={tier.name} color={tier.color} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {(boxState === "opening" || boxState === "open") && (
                    <motion.div
                      key="open"
                      initial={{ scale: 0.8, opacity: 0, y: 20 }}
                      animate={{ scale: 1.2, opacity: 1, y: 0 }}
                      transition={{ type: "spring", damping: 12 }}
                      style={{
                        filter: `drop-shadow(0 0 80px ${tier.color}60)`
                      }}
                    >
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, type: "spring" }}
                        >
                          <VaultIcon name={tier.name} color={tier.color} />
                        </motion.div>
                        <div className="absolute inset-0 animate-spin-slow">
                          <svg width="100%" height="100%" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              stroke={tier.color}
                              strokeWidth="1"
                              strokeDasharray="4 8"
                              opacity="0.5"
                            />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div
                className="text-xl md:text-3xl font-black tracking-[0.3em] uppercase animate-pulse text-center break-words max-w-xs"
                style={{
                  color: tier.color,
                  textShadow: boxState === "closed" ? `0 0 20px ${tier.color}80, 0 0 40px ${tier.color}40` : "none"
                }}
              >
                {boxState === "closed" ? "Cracking..." : "Item Reveal"}
              </div>
            </motion.div>
          )}

          {/* STAGE 2.5: SPINNING REEL */}
          {stage === "spinning" && (
            <motion.div
              key="spinning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="text-sm md:text-base font-black uppercase tracking-[0.2em] text-text-muted mb-6">
                Scanning Rarity...
              </div>

              {/* Reel container */}
              <div className="relative w-64 h-48 overflow-hidden rounded-2xl border border-white/10 bg-surface/80 backdrop-blur-xl">
                {/* Top/bottom gradient masks */}
                <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-bg via-transparent to-bg" />

                {/* Center payline */}
                <div
                  className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 z-10 pointer-events-none border-y transition-all duration-500"
                  style={{
                    borderColor: spinLanded
                      ? `${rarityConfig.color}60`
                      : "rgba(255,255,255,0.15)",
                    boxShadow: spinLanded
                      ? `0 0 30px ${rarityConfig.color}30, inset 0 0 20px ${rarityConfig.color}10`
                      : "0 0 15px rgba(255,255,255,0.05)"
                  }}
                />

                {/* Scrolling reel */}
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: -(10 * 48 + 24) + 96 }}
                  transition={{
                    duration: 4.5,
                    ease: [0.12, 0.8, 0.2, 1]
                  }}
                  className="flex flex-col"
                >
                  {reelItems.map((item, i) => (
                    <div
                      key={i}
                      className="h-12 flex items-center gap-3 px-4 shrink-0"
                    >
                      <div
                        className="w-1 h-6 rounded-full shrink-0"
                        style={{
                          backgroundColor: item.color,
                          boxShadow: `0 0 8px ${item.color}60`
                        }}
                      />
                      <span
                        className="text-sm font-black uppercase tracking-wider"
                        style={{ color: item.color }}
                      >
                        {item.label}
                      </span>
                      {item.rarity === "legendary" && (
                        <span className="text-xs" style={{ color: item.color }}>
                          &#9733;
                        </span>
                      )}
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5 }}
                className="mt-6 text-xs font-mono text-text-dim uppercase tracking-widest"
              >
                Locking in...
              </motion.div>
            </motion.div>
          )}

          {/* STAGE 2.75: BONUS SPIN */}
          {stage === "bonus-spinning" && (
            <BonusSpinStage
              tier={tier}
              wonRarity={wonRarity as Rarity}
              bonusRarity={bonusRarity!}
              reelItems={reelItems}
              bonusReelItems={bonusReelItems}
              bonusUpgraded={bonusUpgraded}
              bonusSpinPhase={bonusSpinPhase}
              setBonusSpinPhase={setBonusSpinPhase}
              bonusSpinLanded={bonusSpinLanded}
              setBonusSpinLanded={setBonusSpinLanded}
              onComplete={() => setStage("result")}
            />
          )}

          {/* STAGE 3: RESULT & OPTIONS */}
          {stage === "result" && (
            <motion.div
              key="result"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 20 }}
              className="space-y-2 sm:space-y-3 md:space-y-4 relative w-full max-w-4xl flex flex-col items-center"
            >
              <ConfettiParticles
                color={finalRarityConfig.color}
                count={isLoss ? 12 : 40}
              />

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="z-10"
              >
                <span
                  className="inline-block px-5 py-2 rounded-lg border-2 text-sm md:text-base font-black uppercase tracking-widest"
                  style={{
                    borderColor: `${finalRarityConfig.color}60`,
                    backgroundColor: `${finalRarityConfig.color}15`,
                    color: finalRarityConfig.color,
                    textShadow: `0 0 12px ${finalRarityConfig.color}40`
                  }}
                >
                  {product}
                </span>
              </motion.div>

              {/* Dual item display for bonus spins */}
              {bonusTriggered && bonusRarity ? (
                <>
                  <div className="flex flex-row items-stretch justify-center gap-3 sm:gap-6 z-10 w-full px-2">
                    {/* First spin item */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="flex flex-col items-center gap-1.5 sm:gap-2 flex-1 min-w-0 max-w-[180px] sm:max-w-[200px]"
                    >
                      <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-text-dim">
                        First Spin
                      </div>
                      <div
                        className={`relative flex items-center justify-center bg-surface-elevated rounded-xl sm:rounded-2xl w-20 h-20 sm:w-32 sm:h-32 ${wonRarity === "legendary" ? "animate-pulse" : ""}`}
                        style={{
                          borderWidth: wonRarity === "legendary" ? 3 : 2,
                          borderStyle: "solid",
                          borderColor: rarityConfig.color,
                          boxShadow: `0 0 30px ${rarityConfig.color}30`
                        }}
                      >
                        <div className="transform scale-75 sm:scale-90 filter drop-shadow-xl">
                          <VaultIcon name={tier.name} color={rarityConfig.color} />
                        </div>
                      </div>
                      <div className="text-center">
                        <p
                          className="text-xs sm:text-base font-black uppercase tracking-tight"
                          style={{ color: rarityConfig.color }}
                        >
                          {rarityConfig.label}
                        </p>
                        <p className="text-[10px] sm:text-xs text-text-muted">
                          <span className="font-bold" style={{ color: rarityConfig.color }}>
                            ${resultValue}.00
                          </span>
                        </p>
                      </div>
                    </motion.div>

                    {/* Bonus spin item */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col items-center gap-1.5 sm:gap-2 flex-1 min-w-0 max-w-[180px] sm:max-w-[200px] relative"
                    >
                      <div
                        className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                        style={{ color: tier.color }}
                      >
                        <span className="hidden sm:inline">Bonus Spin</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[7px] sm:text-[8px] font-black uppercase tracking-widest border"
                          style={{
                            borderColor: `${tier.color}60`,
                            backgroundColor: `${tier.color}15`,
                            color: tier.color
                          }}
                        >
                          Bonus
                        </span>
                      </div>
                      <div
                        className={`relative flex items-center justify-center bg-surface-elevated rounded-xl sm:rounded-2xl w-20 h-20 sm:w-32 sm:h-32 ${bonusRarity === "legendary" ? "animate-pulse" : ""}`}
                        style={{
                          borderWidth: bonusRarity === "legendary" ? 3 : 2,
                          borderStyle: "solid",
                          borderColor: RARITY_CONFIG[bonusRarity].color,
                          boxShadow: `0 0 30px ${RARITY_CONFIG[bonusRarity].color}30`
                        }}
                      >
                        <div className="transform scale-75 sm:scale-90 filter drop-shadow-xl">
                          <VaultIcon name={tier.name} color={RARITY_CONFIG[bonusRarity].color} />
                        </div>
                      </div>
                      <div className="text-center">
                        <p
                          className="text-xs sm:text-base font-black uppercase tracking-tight"
                          style={{ color: RARITY_CONFIG[bonusRarity].color }}
                        >
                          {RARITY_CONFIG[bonusRarity].label}
                        </p>
                        <p className="text-[10px] sm:text-xs text-text-muted">
                          <span className="font-bold" style={{ color: RARITY_CONFIG[bonusRarity].color }}>
                            ${bonusResultValue}.00
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Combined value */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="z-10 text-center"
                  >
                    <p className="text-xs sm:text-sm md:text-base text-text-muted">
                      Combined Value:{" "}
                      <span className="font-black text-accent text-sm sm:text-base md:text-lg">
                        ${totalRevealValue}.00
                      </span>
                    </p>
                  </motion.div>
                </>
              ) : (
                <>
                  <div className="relative inline-block group z-10">
                    <div
                      className="absolute inset-0 blur-[100px] animate-pulse transition-colors opacity-40"
                      style={{ backgroundColor: finalRarityConfig.color }}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`relative flex items-center justify-center bg-surface-elevated rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.5)] w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 mx-auto ${finalRarity === "legendary" ? "animate-pulse" : ""}`}
                        style={{
                          borderWidth:
                            finalRarity === "legendary"
                              ? 4
                              : finalRarity === "rare"
                                ? 3
                                : 2,
                          borderStyle: "solid",
                          borderColor: finalRarityConfig.color,
                          boxShadow:
                            finalRarity === "legendary"
                              ? `0 0 80px rgba(255,215,0,0.6), 0 0 120px rgba(255,215,0,0.3)`
                              : finalRarity === "rare"
                                ? `0 0 50px rgba(168,85,247,0.5)`
                                : finalRarity === "uncommon"
                                  ? `0 0 40px rgba(59,130,246,0.4)`
                                  : `0 0 30px rgba(107,114,128,0.3)`
                        }}
                      >
                        <div className="transform scale-110 filter drop-shadow-2xl">
                          <VaultIcon name={tier.name} color={finalRarityConfig.color} />
                        </div>
                        {/* Mint Condition — inside on desktop, hidden on mobile */}
                        <div className="absolute bottom-3 left-0 w-full text-center hidden sm:block">
                          <span
                            className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                            style={{
                              backgroundColor: `${finalRarityConfig.color}10`,
                              borderColor: `${finalRarityConfig.color}40`,
                              color: finalRarityConfig.color
                            }}
                          >
                            Mint Condition
                          </span>
                        </div>
                      </div>
                      {/* Mint Condition — below on mobile */}
                      <span
                        className="inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border sm:hidden"
                        style={{
                          backgroundColor: `${finalRarityConfig.color}10`,
                          borderColor: `${finalRarityConfig.color}40`,
                          color: finalRarityConfig.color
                        }}
                      >
                        Mint Condition
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 z-10 relative text-center">
                    <h3 className="text-xl sm:text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">
                      {finalRarityConfig.label}
                      {finalRarityConfig.exclaim}
                    </h3>
                    <p className="text-sm md:text-base text-text-muted">
                      Estimated Market Value:{" "}
                      <span
                        className="font-black"
                        style={{ color: finalRarityConfig.color }}
                      >
                        ${finalResultValue}.00
                      </span>
                    </p>
                  </div>
                </>
              )}

              {/* Balance Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="z-10 w-full max-w-sm px-2 sm:px-4"
              >
                <div className="bg-surface/80 backdrop-blur-xl rounded-xl border border-white/10 p-3 font-mono text-xs">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-text-dim text-[10px] uppercase tracking-wider">
                      Credits
                    </span>
                    <span className="text-white font-bold">
                      ${preBalance.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-text-dim text-[10px] uppercase tracking-wider">
                      {tier.name} Vault
                    </span>
                    {isTutorial ? (
                      <span className="text-neon-green font-black">FREE</span>
                    ) : (
                      <span className="text-error font-bold">
                        -${tier.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {bonusTriggered && bonusRarity ? (
                    <>
                      <div className="flex items-center justify-between py-1 gap-2">
                        <span className="text-text-dim text-[9px] sm:text-[10px] uppercase tracking-wider truncate">
                          Item 1 ({rarityConfig.label})
                        </span>
                        <span
                          className="font-bold shrink-0"
                          style={{ color: rarityConfig.color }}
                        >
                          +${resultValue.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1 gap-2">
                        <span className="text-text-dim text-[9px] sm:text-[10px] uppercase tracking-wider flex items-center gap-1 min-w-0">
                          <span className="truncate">Item 2 ({RARITY_CONFIG[bonusRarity].label})</span>
                          <span
                            className="px-1 py-0.5 rounded text-[6px] sm:text-[7px] font-black uppercase shrink-0"
                            style={{
                              backgroundColor: `${tier.color}15`,
                              color: tier.color
                            }}
                          >
                            Bonus
                          </span>
                        </span>
                        <span
                          className="font-bold shrink-0"
                          style={{ color: RARITY_CONFIG[bonusRarity].color }}
                        >
                          +${bonusResultValue.toFixed(2)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between py-1">
                      <span className="text-text-dim text-[10px] uppercase tracking-wider">
                        Item Value
                      </span>
                      <span
                        className="font-bold"
                        style={{ color: finalRarityConfig.color }}
                      >
                        +${finalResultValue.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-white/10 mt-1 pt-2 flex items-center justify-between">
                    <span className="text-text-muted text-[10px] uppercase tracking-wider font-bold">
                      New Balance
                    </span>
                    <div className="flex items-center gap-2">
                      {isTutorial ? (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-neon-green/10 text-neon-green">
                          +{finalResultValue.toFixed(2)}
                        </span>
                      ) : (
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded ${isLoss ? "bg-error/10 text-error" : "bg-neon-green/10 text-neon-green"}`}
                        >
                          {net >= 0 ? "+" : ""}
                          {net.toFixed(2)}
                        </span>
                      )}
                      <span className="text-white font-black text-sm">
                        $
                        {isTutorial
                          ? (preBalance + finalResultValue).toFixed(2)
                          : postBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div
                className="grid grid-cols-3 gap-2 sm:gap-3 w-full px-2 sm:px-4 z-10 relative"
                data-tutorial="result-actions"
              >
                <OptionCard
                  title="Store to Vault"
                  desc="Keep it secure in your digital portfolio."
                  icon={storeIcon}
                  action="Build Collection"
                  onClick={handleStore}
                  highlight
                  tierColor="#00f0ff"
                  tutorialActive={resultTooltip?.highlight === 0}
                />
                <OptionCard
                  title="Ship to Home"
                  desc="We'll mail the physical item to you globally."
                  icon={shipIcon}
                  action="Get It Shipped"
                  onClick={handleShip}
                  tierColor={tier.color}
                  tutorialActive={resultTooltip?.highlight === 1}
                />
                <OptionCard
                  title="Claim Credits"
                  desc="Instant sellback for platform credits."
                  icon={cashoutIcon}
                  action={`Get $${totalRevealValue} Credits`}
                  onClick={handleClaim}
                  tierColor="#ffd700"
                  tutorialActive={resultTooltip?.highlight === 2}
                />
              </div>

              {/* Tutorial result walkthrough tooltip — below the option cards */}
              {isTutorial && resultTooltip && (
                <motion.div
                  key={tutorialStep}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="z-10 bg-surface-elevated border border-accent/30 rounded-xl p-4 sm:p-5 max-w-sm w-full mx-auto shadow-[0_0_30px_rgba(255,45,149,0.3)]"
                >
                  <p className="text-sm font-black text-white uppercase tracking-tight mb-1">
                    {resultTooltip.title}
                  </p>
                  <p className="text-xs text-text-muted leading-relaxed mb-3">
                    {resultTooltip.desc}
                  </p>
                  {tutorialStep !== "result-cashout" ? (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-text-dim">
                        Click it, or...
                      </span>
                      <button
                        onClick={handleNextResultStep}
                        className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer shadow-[0_0_15px_rgba(255,45,149,0.3)]"
                      >
                        Next Option
                      </button>
                    </div>
                  ) : (
                    <p className="text-[10px] text-accent font-bold">
                      Pick any option above to continue!
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Supporting components ─── */

/* ─── Bonus Spin Stage ─── */

interface BonusSpinStageProps {
  tier: Vault;
  wonRarity: Rarity;
  bonusRarity: Rarity;
  reelItems: ReelItem[];
  bonusReelItems: ReelItem[];
  bonusUpgraded: boolean;
  bonusSpinPhase: BonusSpinPhase;
  setBonusSpinPhase: (phase: BonusSpinPhase) => void;
  bonusSpinLanded: boolean;
  setBonusSpinLanded: (landed: boolean) => void;
  onComplete: () => void;
}

function LightningBolt({ color, className, delay = 0 }: { color: string; className?: string; delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 40 80"
      fill="none"
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 0.8], scale: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
    >
      <motion.path
        d="M22 2L8 38h12L14 78l20-44H22L30 2H22z"
        stroke={color}
        strokeWidth="2"
        fill={`${color}30`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 0.8, ease: "easeOut" }}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      />
    </motion.svg>
  );
}

function BonusSpinStage({
  tier,
  wonRarity,
  bonusRarity,
  reelItems,
  bonusReelItems,
  bonusUpgraded,
  bonusSpinPhase,
  setBonusSpinPhase,
  bonusSpinLanded,
  setBonusSpinLanded,
  onComplete
}: BonusSpinStageProps) {
  const wonConfig = RARITY_CONFIG[wonRarity];
  const bonusConfig = RARITY_CONFIG[bonusRarity];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    // announce: 0–1800ms (extended for lightning + text drama)
    timers.push(setTimeout(() => setBonusSpinPhase("split"), 1800));
    // split: 1800–2600ms
    timers.push(setTimeout(() => setBonusSpinPhase("appear"), 2600));
    // appear: 2600–3100ms
    timers.push(setTimeout(() => setBonusSpinPhase("spinning"), 3100));
    // spinning: 3100–7100ms (4s spin)
    timers.push(setTimeout(() => setBonusSpinLanded(true), 7100));
    timers.push(setTimeout(() => setBonusSpinPhase("comparing"), 7100));
    // comparing: 7100–8100ms
    timers.push(setTimeout(() => setBonusSpinPhase("done"), 8100));
    // done → result: 8100–8600ms
    timers.push(setTimeout(() => onComplete(), 8600));
    return () => timers.forEach(clearTimeout);
  }, []);

  const showFirstReel = bonusSpinPhase !== "announce";
  const showBonusReel = bonusSpinPhase === "appear" || bonusSpinPhase === "spinning" || bonusSpinPhase === "comparing" || bonusSpinPhase === "done";
  const isSpinning = bonusSpinPhase === "spinning";
  const isComparing = bonusSpinPhase === "comparing" || bonusSpinPhase === "done";

  return (
    <motion.div
      key="bonus-spinning"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center w-full"
    >
      {/* Announce phase */}
      {bonusSpinPhase === "announce" && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 10 }}
          className="text-center relative"
        >
          {/* Bright screen flash */}
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.6 }}
            style={{ backgroundColor: tier.color }}
          />

          {/* Radial gradient burst behind text */}
          <motion.div
            className="absolute inset-0 -inset-x-32 -inset-y-20 pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.5, 0.3], scale: 1.2 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              background: `radial-gradient(ellipse at center, ${tier.color}40 0%, ${tier.color}10 40%, transparent 70%)`
            }}
          />

          {/* Lightning bolts */}
          <LightningBolt
            color={tier.color}
            className="absolute -top-8 -left-10 w-10 h-16 sm:w-12 sm:h-20 -rotate-12"
            delay={0.1}
          />
          <LightningBolt
            color={tier.color}
            className="absolute -top-6 -right-10 w-10 h-16 sm:w-12 sm:h-20 rotate-12 scale-x-[-1]"
            delay={0.25}
          />
          <LightningBolt
            color={tier.color}
            className="absolute -bottom-6 -left-8 w-8 h-14 sm:w-10 sm:h-16 rotate-[20deg]"
            delay={0.4}
          />
          <LightningBolt
            color={tier.color}
            className="absolute -bottom-4 -right-8 w-8 h-14 sm:w-10 sm:h-16 -rotate-[20deg] scale-x-[-1]"
            delay={0.5}
          />

          {/* Pulsing scale text */}
          <motion.h2
            className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight relative z-10"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              color: tier.color,
              textShadow: `0 0 40px ${tier.color}90, 0 0 80px ${tier.color}60, 0 0 120px ${tier.color}30, 0 0 160px ${tier.color}15`
            }}
          >
            Bonus Spin!
          </motion.h2>
          <motion.p
            className="text-text-muted text-sm mt-3 uppercase tracking-widest relative z-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Premium vault activated
          </motion.p>
        </motion.div>
      )}

      {/* Dual reel layout */}
      {showFirstReel && (
        <div className={`flex items-center justify-center gap-4 sm:gap-8 ${showBonusReel ? "flex-col sm:flex-row" : ""}`}>
          {/* First reel */}
          <motion.div
            initial={{ x: 0, scale: 1 }}
            animate={{
              x: showBonusReel ? (typeof window !== "undefined" && window.innerWidth < 640 ? 0 : -60) : 0,
              y: showBonusReel ? (typeof window !== "undefined" && window.innerWidth < 640 ? -20 : 0) : 0,
              scale: showBonusReel ? 0.85 : 1,
              opacity: isComparing ? (bonusUpgraded ? 0.3 : 1) : (showBonusReel ? 0.7 : 1)
            }}
            transition={{ type: "spring", damping: 20 }}
            className="flex flex-col items-center"
          >
            <div className="text-[10px] font-black uppercase tracking-widest text-text-dim mb-2">
              First Spin
            </div>
            <div className="relative w-48 sm:w-56 md:w-64 h-48 overflow-hidden rounded-2xl border border-white/10 bg-surface/80 backdrop-blur-xl">
              <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-bg via-transparent to-bg" />
              <div
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 z-10 pointer-events-none border-y"
                style={{
                  borderColor: `${wonConfig.color}60`,
                  boxShadow: `0 0 30px ${wonConfig.color}30, inset 0 0 20px ${wonConfig.color}10`
                }}
              />
              {/* Static — already landed on position 10 */}
              <div className="flex flex-col" style={{ transform: `translateY(${-(10 * 48 + 24) + 96}px)` }}>
                {reelItems.map((item, i) => (
                  <div key={i} className="h-12 flex items-center gap-3 px-4 shrink-0">
                    <div className="w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}60` }} />
                    <span className="text-sm font-black uppercase tracking-wider" style={{ color: item.color }}>{item.label}</span>
                    {item.rarity === "legendary" && <span className="text-xs" style={{ color: item.color }}>&#9733;</span>}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bonus reel */}
          {showBonusReel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isComparing ? (bonusUpgraded ? 1 : 0.3) : 1,
                scale: isComparing && bonusUpgraded ? 1.05 : 1,
                x: isComparing && bonusUpgraded ? (typeof window !== "undefined" && window.innerWidth < 640 ? 0 : 60) : 0
              }}
              transition={{ type: "spring", damping: 15 }}
              className="flex flex-col items-center"
            >
              <div
                className="text-[10px] font-black uppercase tracking-widest mb-2 animate-hud-shimmer"
                style={{ color: tier.color }}
              >
                Bonus Spin
              </div>
              <motion.div
                className="relative w-48 sm:w-56 md:w-64 h-48 overflow-hidden rounded-2xl border-2 bg-surface-elevated/60 backdrop-blur-xl"
                animate={{
                  boxShadow: [
                    `0 0 40px ${tier.color}30, inset 0 0 20px ${tier.color}08`,
                    `0 0 60px ${tier.color}50, inset 0 0 30px ${tier.color}12`,
                    `0 0 40px ${tier.color}30, inset 0 0 20px ${tier.color}08`
                  ]
                }}
                transition={{
                  duration: isSpinning ? 0.5 : 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  borderColor: `${tier.color}80`
                }}
              >
                {/* Tier-color shimmer overlay */}
                <motion.div
                  className="absolute inset-0 z-30 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isSpinning ? [0, 0.08, 0] : 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    background: `linear-gradient(135deg, transparent 30%, ${tier.color}20 50%, transparent 70%)`,
                    backgroundSize: "200% 200%"
                  }}
                />
                <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-bg via-transparent to-bg" />
                <div
                  className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-12 z-10 pointer-events-none border-y transition-all duration-500"
                  style={{
                    borderColor: bonusSpinLanded ? `${bonusConfig.color}60` : "rgba(255,255,255,0.15)",
                    boxShadow: bonusSpinLanded ? `0 0 30px ${bonusConfig.color}30, inset 0 0 20px ${bonusConfig.color}10` : "0 0 15px rgba(255,255,255,0.05)"
                  }}
                />
                {/* Spinning reel */}
                <motion.div
                  initial={{ y: 0 }}
                  animate={isSpinning || isComparing ? {
                    y: -(10 * 48 + 24) + 96
                  } : { y: 0 }}
                  transition={{
                    duration: 4.0,
                    ease: [0.12, 0.8, 0.2, 1]
                  }}
                  className="flex flex-col"
                >
                  {bonusReelItems.map((item, i) => (
                    <div key={i} className="h-12 flex items-center gap-3 px-4 shrink-0">
                      <div className="w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}60` }} />
                      <span className="text-sm font-black uppercase tracking-wider" style={{ color: item.color }}>{item.label}</span>
                      {item.rarity === "legendary" && <span className="text-xs" style={{ color: item.color }}>&#9733;</span>}
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </div>
      )}

      {/* Comparison result text */}
      {isComparing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center relative"
        >
          {bonusUpgraded ? (
            <div>
              {/* Confetti burst on upgrade */}
              <ConfettiParticles color={bonusConfig.color} count={60} />
              <motion.h3
                className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  color: bonusConfig.color,
                  textShadow: `0 0 30px ${bonusConfig.color}80, 0 0 60px ${bonusConfig.color}40`
                }}
              >
                Upgraded!
              </motion.h3>
              <p className="text-xs text-text-muted mt-1">
                {wonConfig.label} &rarr; <span style={{ color: bonusConfig.color }} className="font-black">{bonusConfig.label}</span>
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-text-muted">
                Original Holds!
              </h3>
              <p className="text-xs text-text-dim mt-1">
                Your <span style={{ color: wonConfig.color }} className="font-black">{wonConfig.label}</span> stands
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

interface OptionCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  action: string;
  onClick: () => void;
  highlight?: boolean;
  tierColor?: string;
  tutorialActive?: boolean;
}

function OptionCard({
  title,
  desc,
  icon,
  action,
  onClick,
  highlight = false,
  tierColor,
  tutorialActive = false
}: OptionCardProps) {
  const isEmphasized = highlight || tutorialActive;
  return (
    <button
      onClick={onClick}
      className={`p-2.5 sm:p-3 md:p-5 rounded-xl sm:rounded-2xl border-2 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col h-full bg-surface-elevated/50 backdrop-blur-sm group ${
        isEmphasized ? "" : "border-white/5 hover:border-white/20"
      } ${tutorialActive ? "scale-[1.02] animate-pulse" : ""}`}
      style={
        tutorialActive
          ? {
              borderColor: "#ff2d95",
              boxShadow:
                "0 0 25px rgba(255,45,149,0.4), inset 0 0 15px rgba(255,45,149,0.08)"
            }
          : isEmphasized
            ? { borderColor: tierColor, boxShadow: `0 0 20px ${tierColor}10` }
            : {}
      }
    >
      <div className="text-base sm:text-xl md:text-2xl mb-1.5 sm:mb-2 md:mb-3 group-hover:scale-110 transition-transform origin-left">
        {icon}
      </div>
      <h4 className="text-[10px] sm:text-sm md:text-base font-black text-white mb-0.5 sm:mb-1 uppercase tracking-wide leading-tight">
        {title}
      </h4>
      <p className="text-text-muted text-[8px] sm:text-[10px] leading-relaxed mb-1.5 sm:mb-3 flex-1 hidden sm:block">
        {desc}
      </p>
      <div className="mt-auto pt-1.5 sm:pt-2 md:pt-3 border-t border-white/5 w-full">
        <span
          className="text-[7px] sm:text-[9px] md:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] flex items-center gap-1 sm:gap-2"
          style={
            tutorialActive
              ? { color: "#ff2d95" }
              : isEmphasized
                ? { color: tierColor }
                : { color: "white" }
          }
        >
          {action} <span>&rarr;</span>
        </span>
      </div>
    </button>
  );
}

function ConfettiParticles({
  color,
  count = 40
}: {
  color: string;
  count?: number;
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 400 - 200,
        y: Math.random() * 400 - 200,
        color: Math.random() > 0.5 ? color : "#ffffff",
        scale: Math.random() * 0.8 + 0.2
      })),
    [color, count]
  );

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: 0,
            x: p.x,
            y: p.y,
            rotate: Math.random() * 720,
            scale: p.scale
          }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}
