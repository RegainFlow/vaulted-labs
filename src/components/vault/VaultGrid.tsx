import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  VAULTS,
  RARITY_CONFIG,
  PRODUCT_TYPES,
  PREMIUM_BONUS_CHANCE,
  pickRarity,
  pickValue,
  pickProduct,
  getPrestigeOdds
} from "../../data/vaults";
import { pickFunko } from "../../data/funkos";
import { FunkoImage } from "../shared/FunkoImage";
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
import { VaultLockBonusStage } from "./VaultLockBonusStage";
import { ItemSpinner } from "./ItemSpinner";
import { LegendaryHypeOverlay } from "./LegendaryHypeOverlay";
import {
  RARITY_CELEBRATION,
  RARITY_TEXT_CONFIG,
  CELEBRATION_SPRINGS
} from "../../lib/motion-presets";

/* ─── Constants & Types ─── */

type Stage = "idle" | "spinning" | "bonus-spinning" | "result";

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
    value: number,
    funkoId?: string,
    funkoName?: string
  ) => void;
  onShip: (
    product: string,
    vaultTier: VaultTierName,
    rarity: Rarity,
    value: number,
    funkoId?: string,
    funkoName?: string
  ) => void;
  isTutorial?: boolean;
  tutorialStep?: TutorialStep | null;
  onTutorialAdvance?: (step: TutorialStep) => void;
  onTutorialPurchase?: (vaultName: string, price: number) => void;
  onTutorialSetAction?: (action: string) => void;
  prestigeLevel?: number;
  onUseFreeSpinForVault?: (vaultName: string, price: number) => boolean;
  onBonusFreeSpins?: (count: number) => void;
  freeSpins?: number;
}

interface ClaimParticle {
  id: number;
  xMid: number;
  xEnd: number;
  yStart: number;
  yMid: number;
  yEnd: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  scale: number;
  rotate: number;
}

const seededUnit = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

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

function OptionCard({ title, desc, icon, action, onClick, tierColor, tutorialActive = false, disabled = false }: { title: string; desc: string; icon: React.ReactNode; action: string; onClick: () => void; highlight?: boolean; tierColor?: string; tutorialActive?: boolean; disabled?: boolean; }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl border-2 text-left transition-all duration-300 flex flex-col h-full backdrop-blur-sm group ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:scale-[1.03] active:scale-[0.98]"} ${tutorialActive ? "scale-[1.02] animate-pulse" : ""}`}
      style={
        tutorialActive
          ? { borderColor: "#ff2d95", boxShadow: "0 0 25px rgba(255,45,149,0.4)", backgroundColor: "rgba(255,45,149,0.08)" }
          : {
              borderColor: `${tierColor}40`,
              boxShadow: `0 0 20px ${tierColor}08`,
              backgroundColor: `${tierColor}08`,
            }
      }
    >
      <div
        className="text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform origin-left w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${tierColor}15` }}
      >
        {icon}
      </div>
      <h4 className="text-xs sm:text-sm md:text-base font-black mb-1 uppercase tracking-wide" style={{ color: tierColor }}>{title}</h4>
      <p className="text-text-muted text-[10px] sm:text-xs md:text-sm leading-relaxed mb-3 sm:mb-4 flex-1">{desc}</p>
      <div className="mt-auto pt-2 sm:pt-3 border-t w-full" style={{ borderColor: `${tierColor}20` }}>
        <span className="text-[10px] sm:text-[11px] md:text-xs font-black uppercase tracking-widest" style={{ color: tierColor }}>{action} &rarr;</span>
      </div>
    </button>
  );
}

function ConfettiParticles({ color, count = 40, rarity }: { color: string; count?: number; rarity?: string }) {
  const config = rarity ? RARITY_CELEBRATION[rarity] : null;
  const effectiveCount = config?.count ?? count;
  const effectiveSpread = config?.spread ?? 400;
  const effectiveDuration = config?.duration ?? 2;
  const sizeClass = config?.size ?? "w-2 h-2";
  const colorSeed = useMemo(() => color.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0), [color]);

  const particles = useMemo<ConfettiParticle[]>(
    () =>
      Array.from({ length: effectiveCount }).map((_, i) => {
        const base = colorSeed + i * 11.73 + effectiveCount * 0.37;
        return {
          id: i,
          x: (seededUnit(base + 1) - 0.5) * effectiveSpread,
          y: (seededUnit(base + 2) - 0.5) * effectiveSpread,
          color: seededUnit(base + 3) > 0.5 ? color : "#ffffff",
          scale: seededUnit(base + 4) * 0.8 + 0.2,
          rotate: seededUnit(base + 5) * 720
        };
      }),
    [color, colorSeed, effectiveCount, effectiveSpread]
  );

  // Legendary second wave: particles that drift upward
  const legendaryWave = useMemo<ConfettiParticle[]>(() => {
    if (rarity !== "legendary") return [];
    return Array.from({ length: 40 }).map((_, i) => {
      const base = colorSeed + i * 19.41 + 700;
      return {
        id: i,
        x: (seededUnit(base + 1) - 0.5) * 500,
        y: -((seededUnit(base + 2) * 300) + 300),
        color: seededUnit(base + 3) > 0.3 ? "#FFD700" : "#ffffff",
        scale: seededUnit(base + 4) * 0.6 + 0.3,
        rotate: seededUnit(base + 5) * 540
      };
    });
  }, [colorSeed, rarity]);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.rotate, scale: p.scale }}
          transition={{ duration: effectiveDuration, ease: "easeOut" }}
          className={`absolute ${sizeClass} rounded-sm`}
          style={{ backgroundColor: p.color }}
        />
      ))}
      {legendaryWave.map((p) => (
        <motion.div
          key={`wave-${p.id}`}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], x: p.x, y: p.y, scale: p.scale, rotate: p.rotate }}
          transition={{ duration: 2.5, delay: 0.5, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

/* ─── Animated Value Counter ─── */

function AnimatedValue({ value, duration = 1.2, color }: { value: number; duration?: number; color: string }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return <span className="font-black" style={{ color }}>${display}.00</span>;
}

/* ─── Vault Overlay Internal Component ─── */

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
  prestigeLevel: overlayPrestigeLevel = 0,
  onUseFreeSpinForVault,
  onBonusFreeSpins,
  freeSpins = 0
}: VaultOverlayProps) {
  const [stage, setStage] = useState<Stage>("idle");
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [spinLanded, setSpinLanded] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isResolvingAction, setIsResolvingAction] = useState(false);
  const [claimParticles, setClaimParticles] = useState<ClaimParticle[]>([]);
  const [showBonusExplainer, setShowBonusExplainer] = useState(false);
  const [bonusTriggered, setBonusTriggered] = useState(false);
  const timeoutIdsRef = useRef<number[]>([]);

  const effectiveOdds = useMemo(() => getPrestigeOdds(tier.rarities, isTutorial ? 0 : overlayPrestigeLevel), [tier, isTutorial, overlayPrestigeLevel]);
  const wonRarity = useMemo(() => pickRarity(effectiveOdds), [effectiveOdds]);
  const product = useMemo(() => category || pickProduct(), [category]);
  const rarityConfig = RARITY_CONFIG[wonRarity as keyof typeof RARITY_CONFIG];
  const resultValue = useMemo(() => pickValue(tier.price, rarityConfig), [tier, rarityConfig]);
  const wonFunko = useMemo(() => pickFunko(tier.name as VaultTierName, wonRarity as Rarity), [tier, wonRarity]);
  const [usedFreeSpin, setUsedFreeSpin] = useState(false);

  const [landingFlash, setLandingFlash] = useState(false);
  const [purchasedBalance, setPurchasedBalance] = useState<number | null>(null);
  const preBalance = purchasedBalance ?? balance;
  const postBalance = usedFreeSpin ? preBalance + resultValue : preBalance - tier.price + resultValue;

  const resultTooltip = tutorialStep ? RESULT_TOOLTIP[tutorialStep] : null;
  const SPIN_LAND_DELAY = 5000;
  const POST_LAND_HOLD_DELAY = 2200;

  const scheduleTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(callback, delay);
    timeoutIdsRef.current.push(timeoutId);
    return timeoutId;
  }, []);

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutIdsRef.current = [];
    };
  }, []);

  const handleSpinLand = useCallback(() => {
    setSpinLanded(true);
    setLandingFlash(true);
    scheduleTimeout(() => setLandingFlash(false), 500);
  }, [scheduleTimeout]);

  useEffect(() => {
    if (stage === "result") {
      trackEvent(AnalyticsEvents.VAULT_RESULT, { vault_tier: tier.name, rarity: wonRarity, value: resultValue, vault_price: tier.price, bonus_triggered: bonusTriggered, free_spin: usedFreeSpin });
    }
  }, [stage, wonRarity, resultValue, tier.name, tier.price, bonusTriggered, usedFreeSpin]);

  const handleSpin = useCallback(() => {
    const shouldTriggerBonus = isTutorial || (Math.random() < (PREMIUM_BONUS_CHANCE[tier.name] ?? 0));
    setBonusTriggered(shouldTriggerBonus);
    setSpinLanded(false);
    setUsedFreeSpin(false);
    if (isTutorial) {
      onTutorialPurchase?.(tier.name, tier.price);
      setPurchasedBalance(balance); setPurchaseError(null);
      trackEvent(AnalyticsEvents.VAULT_OPENED, { vault_tier: tier.name, vault_price: tier.price, is_tutorial: true });
      setStage("spinning");
      scheduleTimeout(() => handleSpinLand(), SPIN_LAND_DELAY);
      scheduleTimeout(() => { setShowBonusExplainer(true); }, SPIN_LAND_DELAY + POST_LAND_HOLD_DELAY); return;
    }
    // Try free spin first
    if (onUseFreeSpinForVault?.(tier.name, tier.price)) {
      setUsedFreeSpin(true);
      setPurchasedBalance(balance); setPurchaseError(null);
      trackEvent(AnalyticsEvents.FREE_SPIN_USED, { vault_tier: tier.name, vault_price: tier.price, free_spins_before: freeSpins, free_spins_after: Math.max(freeSpins - 1, 0) });
      trackEvent(AnalyticsEvents.VAULT_OPENED, { vault_tier: tier.name, vault_price: tier.price, free_spin: true });
      setStage("spinning");
      scheduleTimeout(() => handleSpinLand(), SPIN_LAND_DELAY);
      if (shouldTriggerBonus) { trackEvent(AnalyticsEvents.BONUS_SPIN_TRIGGERED, { vault_tier: tier.name, vault_price: tier.price, first_rarity: wonRarity }); scheduleTimeout(() => setStage("bonus-spinning"), SPIN_LAND_DELAY + POST_LAND_HOLD_DELAY); }
      else { scheduleTimeout(() => setStage("result"), SPIN_LAND_DELAY + POST_LAND_HOLD_DELAY); }
      return;
    }
    if (!onPurchase(tier.name, tier.price)) { setPurchaseError(`Insufficient credits.`); return; }
    setPurchasedBalance(balance); setPurchaseError(null);
    trackEvent(AnalyticsEvents.VAULT_OPENED, { vault_tier: tier.name, vault_price: tier.price });
    setStage("spinning");
    scheduleTimeout(() => handleSpinLand(), SPIN_LAND_DELAY);
    if (shouldTriggerBonus) { trackEvent(AnalyticsEvents.BONUS_SPIN_TRIGGERED, { vault_tier: tier.name, vault_price: tier.price, first_rarity: wonRarity }); scheduleTimeout(() => setStage("bonus-spinning"), SPIN_LAND_DELAY + POST_LAND_HOLD_DELAY); }
    else { scheduleTimeout(() => setStage("result"), SPIN_LAND_DELAY + POST_LAND_HOLD_DELAY); }
  }, [SPIN_LAND_DELAY, POST_LAND_HOLD_DELAY, balance, freeSpins, handleSpinLand, isTutorial, onPurchase, onTutorialPurchase, onUseFreeSpinForVault, scheduleTimeout, tier.name, tier.price, wonRarity]);

  // Tutorial: auto-trigger spin after a short delay when step is "spin-reel"
  useEffect(() => {
    if (isTutorial && tutorialStep === "spin-reel" && stage === "idle") {
      const t = setTimeout(() => handleSpin(), 800);
      return () => clearTimeout(t);
    }
  }, [handleSpin, isTutorial, tutorialStep, stage]);

  const handleClaimLocal = () => {
    if (isResolvingAction) return;
    if (isTutorial) { onTutorialSetAction?.("cashed out"); onTutorialAdvance?.("complete"); onClose(); return; }
    setIsResolvingAction(true);
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 900;
    setClaimParticles(
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        xMid: (Math.random() - 0.5) * 280,
        xEnd: (Math.random() - 0.5) * 420,
        yStart: 220 + Math.random() * 120,
        yMid: 40 + Math.random() * 120,
        yEnd: -(viewportHeight * (0.55 + Math.random() * 0.25)),
        size: 8 + Math.floor(Math.random() * 8),
        duration: 1.25 + Math.random() * 0.35,
        delay: i * 0.018,
        rotate: (Math.random() - 0.5) * 420
      }))
    );
    trackEvent(AnalyticsEvents.ITEM_ACTION, { action: "cashout", vault_tier: tier.name, rarity: wonRarity, value: resultValue, vault_price: tier.price, free_spin: usedFreeSpin });
    setIsClaiming(true);
    onClaim(resultValue);
    scheduleTimeout(() => {
      setIsClaiming(false);
      onClose();
    }, 1800);
  };

  const handleStore = () => {
    if (isResolvingAction) return;
    if (isTutorial) { onTutorialSetAction?.("stored"); onTutorialAdvance?.("complete"); onClose(); return; }
    setIsResolvingAction(true);
    trackEvent(AnalyticsEvents.ITEM_ACTION, { action: "hold", vault_tier: tier.name, rarity: wonRarity, value: resultValue, vault_price: tier.price, free_spin: usedFreeSpin });
    onStore(product, tier.name as VaultTierName, wonRarity as Rarity, resultValue, wonFunko.id, wonFunko.name);
  };

  const handleShip = () => {
    if (isResolvingAction) return;
    if (isTutorial) { onTutorialSetAction?.("shipped"); onTutorialAdvance?.("complete"); onClose(); return; }
    setIsResolvingAction(true);
    trackEvent(AnalyticsEvents.ITEM_ACTION, { action: "ship", vault_tier: tier.name, rarity: wonRarity, value: resultValue, vault_price: tier.price, free_spin: usedFreeSpin });
    onShip(product, tier.name as VaultTierName, wonRarity as Rarity, resultValue, wonFunko.id, wonFunko.name);
  };

  const handleNextResultStep = () => {
    if (tutorialStep === "result-store") onTutorialAdvance?.("result-ship");
    else if (tutorialStep === "result-ship") onTutorialAdvance?.("result-cashout");
  };

  const handleBonusComplete = useCallback((freeSpinsAwarded: number) => {
    trackEvent(AnalyticsEvents.VAULT_LOCK_COMPLETE, { vault_tier: tier.name, free_spins_awarded: freeSpinsAwarded, awarded: freeSpinsAwarded > 0 });
    if (freeSpinsAwarded > 0) onBonusFreeSpins?.(freeSpinsAwarded);
    setStage("result");
    if (isTutorial) onTutorialAdvance?.("result-store");
  }, [isTutorial, onTutorialAdvance, onBonusFreeSpins, tier.name]);

  const storeIcon = (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-neon-cyan"><path d="M21 8V21H3V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M23 3H1V8H23V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
  const shipIcon = (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>);
  const cashoutIcon = (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-vault-gold"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5s-2 .5-2 1.5 1 1.5 2 2 2 1 2 2-1 1.5-2 1.5-2-.5-2.5-1.5M12 7v1m0 8v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>);

  const isLoss = !usedFreeSpin && resultValue < tier.price;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 overflow-hidden bg-bg/95 backdrop-blur-xl">
      <AnimatePresence>
        {isClaiming && (
          <motion.div
            key="cashout-flight"
            className="absolute inset-0 pointer-events-none z-[120] flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {claimParticles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-vault-gold border border-[#fff7c2]/60"
                style={{
                  width: particle.size,
                  height: particle.size,
                  boxShadow: "0 0 16px rgba(255, 215, 0, 0.8)"
                }}
                initial={{ x: 0, y: particle.yStart, opacity: 0, scale: 0.6, rotate: 0 }}
                animate={{
                  x: [0, particle.xMid, particle.xEnd],
                  y: [particle.yStart, particle.yMid, particle.yEnd],
                  opacity: [0, 1, 0],
                  scale: [0.6, 1.35, 0.85],
                  rotate: [0, particle.rotate]
                }}
                transition={{
                  duration: particle.duration,
                  ease: "easeOut",
                  delay: particle.delay
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Landing flash overlay */}
      <AnimatePresence>
        {landingFlash && (
          <motion.div
            key="landing-flash"
            className="fixed inset-0 z-[51] pointer-events-none"
            initial={{ opacity: RARITY_TEXT_CONFIG[wonRarity]?.flashOpacity ?? 0.08 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ backgroundColor: rarityConfig.color }}
          />
        )}
      </AnimatePresence>

      {/* Ambient vignette during result */}
      {stage === "result" && (
        <div
          className="fixed inset-0 z-[49] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 30%, ${rarityConfig.color}40 100%)`,
            opacity: (wonRarity === "rare" || wonRarity === "legendary") ? 0.15 : 0.06
          }}
        />
      )}

      <div className="h-full max-h-dvh flex items-center justify-center p-2 sm:p-4 py-4 sm:py-6 relative z-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div key="idle" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="space-y-6 w-full max-w-sm relative px-4">
              {!isTutorial && (
                <button onClick={onClose} className="absolute -top-2 md:-top-3 right-0 md:-right-2 p-2.5 rounded-xl bg-error/10 border border-error/30 text-error hover:bg-error/20 hover:border-error/50 transition-all cursor-pointer z-20">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              )}
              <div className="space-y-2 sm:space-y-3 text-center">
                {!isTutorial && freeSpins > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-green/10 border border-neon-green/40 mb-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-neon-green"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                    <span className="text-xs font-black uppercase tracking-widest text-neon-green">Free Spin!</span>
                  </motion.div>
                )}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">{tier.name} Vault</h2>
                <p className="text-text-muted max-w-lg mx-auto text-xs sm:text-sm">
                  {isTutorial ? <>Tap SPIN to reveal your collectible.</> : freeSpins > 0 ? <>Spin the reel. <span className="font-bold text-neon-green">Free!</span></> : <>Spin the reel. <span className="font-bold" style={{ color: tier.color }}>${tier.price}</span> per spin.</>}
                </p>
                {purchaseError && <p className="text-error text-sm font-bold">{purchaseError}</p>}
              </div>

              {/* Item Spinner preview (static) */}
              <ItemSpinner
                vaultTier={tier.name as VaultTierName}
                wonFunko={wonFunko}
                spinning={false}
                landed={false}
                accentColor={tier.color}
              />

              {/* SPIN button */}
              <div className="flex justify-center" data-tutorial="spin-button">
                <button
                  onClick={handleSpin}
                  className="group/spin relative rounded-2xl border-none p-0 cursor-pointer outline-none"
                  style={{ background: freeSpins > 0 && !isTutorial ? "rgba(57,255,20,0.25)" : `${tier.color}25` }}
                >
                  <span
                    className="relative block px-12 sm:px-16 py-3.5 sm:py-4 rounded-2xl text-base sm:text-lg font-black uppercase tracking-[0.2em] translate-y-[-4px] group-active/spin:translate-y-[-2px] transition-transform duration-[250ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] border-b-4"
                    style={{
                      backgroundColor: freeSpins > 0 && !isTutorial ? "rgba(57,255,20,0.15)" : `${tier.color}15`,
                      borderColor: freeSpins > 0 && !isTutorial ? "rgba(57,255,20,0.5)" : `${tier.color}50`,
                      color: freeSpins > 0 && !isTutorial ? "#39ff14" : tier.color,
                      boxShadow: `0 0 30px ${freeSpins > 0 && !isTutorial ? "rgba(57,255,20,0.2)" : `${tier.color}20`}`
                    }}
                  >
                    {freeSpins > 0 && !isTutorial ? "FREE SPIN!" : "SPIN"}
                  </span>
                </button>
              </div>
            </motion.div>
          )}

          {stage === "spinning" && (
            <motion.div key="spinning" initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -14, scale: 0.97, filter: "blur(4px)" }} transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col items-center justify-center w-full max-w-sm px-4">
              <div className="text-center mb-5 sm:mb-6">
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.28em] text-text-dim mb-2">
                  {tier.name} Vault
                </p>
                <h3 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-wider text-white">
                  {spinLanded ? "Locked In!" : "Spinning..."}
                </h3>
              </div>
              <ItemSpinner
                vaultTier={tier.name as VaultTierName}
                wonFunko={wonFunko}
                spinning={!spinLanded}
                landed={spinLanded}
                accentColor={tier.color}
              />
              <div className="mt-5 sm:mt-6 text-[10px] sm:text-xs font-mono text-text-dim uppercase tracking-[0.22em]">
                {spinLanded ? wonFunko.name : "Locking your pull..."}
              </div>
            </motion.div>
          )}

          {/* Tutorial bonus explainer — shown before VaultLockBonusStage during tutorial */}
          {showBonusExplainer && isTutorial && stage === "spinning" && (
            <motion.div
              key="bonus-explainer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20 }}
                className="bg-surface-elevated border border-neon-green/30 rounded-2xl p-8 sm:p-10 max-w-md w-full text-center shadow-[0_0_60px_rgba(57,255,20,0.12)]"
              >
                <div className="w-16 h-16 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-neon-green/30">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-green">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
                  Bonus Round!
                </h2>
                <p className="text-text-muted text-sm leading-relaxed mb-2">
                  Premium vaults can trigger a <span className="text-neon-green font-bold">Vault Lock</span> bonus round.
                </p>
                <p className="text-text-muted text-sm leading-relaxed mb-6">
                  Three spinners show vault tier icons. Press <span className="text-white font-bold">LOCK</span> to freeze each one. Match all 3 to win <span className="text-neon-green font-bold">free spins</span>! If the first two don't match, the round ends early.
                </p>
                <button
                  onClick={() => {
                    setShowBonusExplainer(false);
                    setStage("bonus-spinning");
                  }}
                  className="px-8 py-3 bg-neon-green/90 text-bg text-sm font-black uppercase tracking-widest rounded-xl border-b-[4px] border-[#2ab80f] shadow-[0_6px_16px_rgba(57,255,20,0.2)] hover:shadow-[0_4px_12px_rgba(57,255,20,0.3)] active:border-b-[2px] transition-all duration-100 cursor-pointer"
                >
                  Let's Go
                </button>
              </motion.div>
            </motion.div>
          )}

          {stage === "bonus-spinning" && (
            <VaultLockBonusStage
              purchasedTierName={tier.name as VaultTierName}
              prestigeLevel={overlayPrestigeLevel}
              onComplete={(freeSpinsAwarded) => handleBonusComplete(freeSpinsAwarded)}
            />
          )}

          {stage === "result" && (() => {
            const textConfig = RARITY_TEXT_CONFIG[wonRarity] || RARITY_TEXT_CONFIG.common;
            const spring = CELEBRATION_SPRINGS[wonRarity] || CELEBRATION_SPRINGS.common;
            const recoveryPercent = isLoss ? Math.round((resultValue / tier.price) * 100) : 0;
            const useCounter = wonRarity === "rare" || wonRarity === "legendary";
            const counterDuration = wonRarity === "legendary" ? 2 : 1.2;

            return (
            <motion.div
              key="result"
              initial={{ scale: textConfig.entranceScale, opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                type: "spring",
                damping: spring.damping,
                stiffness: spring.stiffness,
                delay: textConfig.entranceDelay
              }}
              className="space-y-5 sm:space-y-6 md:space-y-8 relative w-full max-w-[96rem] flex flex-col items-center px-2 sm:px-4 lg:px-8"
            >
              <ConfettiParticles color={rarityConfig.color} rarity={isLoss ? undefined : wonRarity} count={isLoss ? 8 : undefined} />
              <div className="z-10 text-center">
                <span className="inline-block px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-lg border-2 text-xs sm:text-sm md:text-base font-black uppercase" style={{ borderColor: `${rarityConfig.color}60`, color: rarityConfig.color }}>{wonFunko.name}</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <FunkoImage name={wonFunko.name} rarity={wonRarity as Rarity} size="lg" className="!w-32 !h-32 sm:!w-36 sm:!h-36 md:!w-40 md:!h-40" />
                <motion.h3
                  className={`mt-4 ${textConfig.titleSize} sm:${textConfig.titleSizeLg} font-black text-white uppercase tracking-tighter`}
                  initial={{ opacity: 0, scale: textConfig.entranceScale }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", damping: spring.damping, stiffness: spring.stiffness, delay: textConfig.entranceDelay + 0.1 }}
                  style={{
                    textShadow: textConfig.textShadow !== "none"
                      ? `${textConfig.textShadow} ${rarityConfig.color}`
                      : "none"
                  }}
                >
                  {rarityConfig.label}
                </motion.h3>
                {isLoss ? (
                  <p className="text-sm sm:text-xl md:text-2xl text-text-muted">
                    <span className="font-black text-neon-cyan">{recoveryPercent}% Recovery</span>
                  </p>
                ) : useCounter ? (
                  <p className="text-sm sm:text-xl md:text-2xl text-text-muted">Value: <AnimatedValue value={resultValue} duration={counterDuration} color={rarityConfig.color} /></p>
                ) : (
                  <p className="text-sm sm:text-xl md:text-2xl text-text-muted">Value: <span className="font-black" style={{ color: rarityConfig.color }}>${resultValue}.00</span></p>
                )}
              </div>

              <div className="z-10 w-full max-w-xs sm:max-w-sm md:max-w-md bg-surface/80 rounded-xl p-3 sm:p-4 md:p-5 font-mono text-[10px] sm:text-xs md:text-sm border border-white/10">
                <div className="flex justify-between py-1"><span className="text-text-dim">Credits</span><span className="text-white">${preBalance.toFixed(2)}</span></div>
                {usedFreeSpin ? (
                  <div className="flex justify-between py-1"><span className="text-text-dim">{tier.name} Vault</span><span className="text-neon-green">Free Spin!</span></div>
                ) : (
                  <div className="flex justify-between py-1"><span className="text-text-dim">{tier.name} Vault</span><span className="text-error">-${tier.price.toFixed(2)}</span></div>
                )}
                <div className="flex justify-between py-1"><span className="text-text-dim">{product} <span style={{ color: rarityConfig.color }}>({rarityConfig.label})</span></span><span style={{ color: rarityConfig.color }}>+${resultValue.toFixed(2)}</span></div>
                <div className="border-t border-white/10 mt-1 pt-2 flex justify-between font-bold"><span className="text-text-muted">Balance</span><span className="text-white">${postBalance.toFixed(2)}</span></div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 w-full max-w-md sm:max-w-2xl md:max-w-4xl z-10">
                <OptionCard title="Store" desc="To collection" icon={storeIcon} action="Save" onClick={handleStore} tierColor="#00f0ff" tutorialActive={resultTooltip?.highlight === 0} disabled={isResolvingAction} />
                <OptionCard title="Ship" desc="Get physical" icon={shipIcon} action="Mail" onClick={handleShip} tierColor={tier.color} tutorialActive={resultTooltip?.highlight === 1} disabled={isResolvingAction} />
                <OptionCard title="Cashout" desc="To credits" icon={cashoutIcon} action={isClaiming ? "Cashing Out..." : `$${resultValue}`} onClick={handleClaimLocal} tierColor="#ffd700" tutorialActive={resultTooltip?.highlight === 2} disabled={isResolvingAction} />
              </div>

              {isTutorial && resultTooltip && (
                <div className="z-10 bg-surface-elevated border border-accent/30 rounded-xl p-4 max-w-sm shadow-xl">
                  <p className="text-sm font-black text-white uppercase mb-1">{resultTooltip.title}</p>
                  <p className="text-xs text-text-muted mb-3">{resultTooltip.desc}</p>
                  {tutorialStep !== "result-cashout" && <button onClick={handleNextResultStep} className="px-4 py-2 rounded-lg text-[10px] font-black uppercase bg-accent text-white cursor-pointer">Next</button>}
                </div>
              )}
            </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Exported Main Component ─── */

export function VaultGrid({
  tutorialStep,
  onTutorialAdvance,
  onTutorialSetAction,
  onOverlayChange
}: VaultGridProps & { onOverlayChange?: (isOpen: boolean) => void }) {
  const {
    balance,
    purchaseVault,
    tutorialOpenVault,
    claimCreditsFromReveal,
    addItem,
    shipItem,
    prestigeLevel,
    freeSpins,
    grantFreeSpins,
    useFreeSpinForVault
  } = useGame();
  const navigate = useNavigate();
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [overlayKey, setOverlayKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Funko Pop!");
  const [comingSoonCategory, setComingSoonCategory] = useState<string | null>(null);
  const [legendaryHype, setLegendaryHype] = useState<{ funkoName: string; value: number } | null>(null);

  useEffect(() => {
    onOverlayChange?.(selectedVault != null);
  }, [selectedVault, onOverlayChange]);

  const isTutorialActive = tutorialStep != null;

  const handleSelect = (vault: Vault) => {
    if (tutorialStep === "open-vault") {
      if (vault.name !== "Diamond") return;
      trackEvent(AnalyticsEvents.VAULT_OVERLAY_OPENED, { vault_tier: vault.name, vault_price: vault.price });
      setOverlayKey((prev) => prev + 1); setSelectedVault(vault); onTutorialAdvance?.("spin-reel"); return;
    }
    if (balance < vault.price && freeSpins <= 0) return;
    trackEvent(AnalyticsEvents.VAULT_OVERLAY_OPENED, { vault_tier: vault.name, vault_price: vault.price });
    setOverlayKey((prev) => prev + 1); setSelectedVault(vault);
  };

  const handleCloseOverlay = () => { if (selectedVault) trackEvent(AnalyticsEvents.VAULT_OVERLAY_CLOSED, { vault_tier: selectedVault.name, vault_price: selectedVault.price }); setSelectedVault(null); };
  const handleClaim = (amount: number) => { claimCreditsFromReveal(amount); };
  const handleStore = (product: string, vaultTier: VaultTierName, rarity: Rarity, value: number, funkoId?: string, funkoName?: string) => {
    addItem(product, vaultTier, rarity, value, funkoId, funkoName);
    setSelectedVault(null);
    if (rarity === "legendary" && funkoName) {
      setLegendaryHype({ funkoName, value });
    }
  };
  const handleShip = (product: string, vaultTier: VaultTierName, rarity: Rarity, value: number, funkoId?: string, funkoName?: string) => { const item = addItem(product, vaultTier, rarity, value, funkoId, funkoName); shipItem(item.id); setSelectedVault(null); };

  const minPrice = Math.min(...VAULTS.map((v) => v.price));
  const isBroke = balance < minPrice && freeSpins <= 0 && !selectedVault && !isTutorialActive;

  return (
    <section className="relative overflow-hidden bg-bg px-4 sm:px-6 py-12 md:py-24 pt-28 md:pt-28 min-h-screen">
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">Open Your <span className="text-accent">Vault</span></h2>
          <p className="mx-auto max-w-2xl text-text-muted">Pick your tier, spin the reel, reveal your collectible.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6" data-tutorial="categories">
          {PRODUCT_TYPES.map((cat, idx) => {
            const isEnabled = cat === "Funko Pop!";
            const categoryKey = `${cat}-${idx}`;
            return (
              <button key={categoryKey} onClick={() => { if (isEnabled) { setSelectedCategory(selectedCategory === cat ? null : cat); setComingSoonCategory(null); } else { setSelectedCategory(null); setComingSoonCategory(comingSoonCategory === categoryKey ? null : categoryKey); } }}
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider border transition-all duration-300 ${!isEnabled ? (comingSoonCategory === categoryKey ? "bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan shadow-[0_0_18px_rgba(0,240,255,0.16)] cursor-pointer" : "bg-surface border-white/10 text-text-muted hover:border-neon-cyan/40 hover:text-neon-cyan cursor-pointer") : (selectedCategory === cat ? "bg-accent/20 border-accent text-accent shadow-[0_0_15px_rgba(255,45,149,0.2)]" : "bg-surface border-white/10 text-text-muted hover:border-white/20 hover:text-white cursor-pointer")}`}>
                {cat} {!isEnabled && <span className="ml-2 text-[9px] tracking-normal normal-case font-normal">(Vote)</span>}
              </button>
            );
          })}
        </div>
        <AnimatePresence>
          {comingSoonCategory && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }} className="mb-8 flex justify-center">
              <div className="w-full max-w-xl rounded-2xl border border-neon-cyan/30 bg-surface-elevated/70 backdrop-blur-xl px-5 py-6 sm:px-7 sm:py-7 text-center shadow-[0_0_40px_rgba(0,240,255,0.12)]">
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-widest text-neon-cyan">Coming Soon</h3>
                <p className="text-xs sm:text-sm text-text-muted mt-2">
                  Community vault categories are next. Join the waitlist and help vote which collection drops first.
                </p>
                <button
                  onClick={() => {
                    trackEvent(AnalyticsEvents.CTA_CLICK, { cta_name: "community_vote_waitlist", location: "play_categories" });
                    navigate("/");
                    setTimeout(() => {
                      document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 300);
                  }}
                  className="mt-4 inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] hover:bg-neon-cyan/18 transition-all cursor-pointer"
                >
                  Join Waitlist to Vote
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {selectedCategory && !comingSoonCategory && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className={`relative transition-all duration-500 ${isBroke ? "blur-xl grayscale pointer-events-none scale-[0.97] opacity-20" : ""}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 gap-y-6 sm:gap-y-8 max-w-6xl mx-auto">
                {VAULTS.map((vault, index) => (
                  <VaultCard key={vault.name} vault={vault} index={index} balance={balance} onSelect={handleSelect} disabled={isTutorialActive && vault.name !== "Diamond"} prestigeLevel={prestigeLevel} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-center text-[10px] text-text-dim mt-8 font-mono uppercase tracking-wider max-w-lg mx-auto">
          Demo only — item prices, drop odds, game mechanics, and inventory are subject to change before launch.
        </p>
        {isBroke && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full max-w-md px-4">
            <div className="bg-surface/80 backdrop-blur-xl border-2 border-error/20 p-12 rounded-3xl shadow-2xl">
              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Credits Depleted</h3>
              <p className="text-error font-mono text-sm font-bold mb-4">${balance.toFixed(2)} remaining</p>
              <button onClick={() => { navigate("/"); setTimeout(() => { document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 300); }} className="inline-block px-8 py-3 bg-accent text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg border-b-4 border-accent-hover active:border-b-0 transition-all cursor-pointer hover:bg-accent-hover">Add Credits</button>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {selectedVault && (
          <VaultOverlay key={`overlay-${overlayKey}`} tier={selectedVault} balance={balance} category={selectedCategory} onClose={handleCloseOverlay} onPurchase={purchaseVault} onClaim={handleClaim} onStore={handleStore} onShip={handleShip} isTutorial={isTutorialActive} tutorialStep={tutorialStep} onTutorialAdvance={onTutorialAdvance} onTutorialPurchase={tutorialOpenVault} onTutorialSetAction={onTutorialSetAction} prestigeLevel={prestigeLevel} onUseFreeSpinForVault={useFreeSpinForVault} onBonusFreeSpins={grantFreeSpins} freeSpins={freeSpins} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {legendaryHype && (
          <LegendaryHypeOverlay
            funkoName={legendaryHype.funkoName}
            value={legendaryHype.value}
            onDismiss={() => setLegendaryHype(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
