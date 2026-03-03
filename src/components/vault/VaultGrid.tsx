import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  VAULTS,
  RARITY_CONFIG,
  PREMIUM_BONUS_CHANCE,
  pickRarity,
  pickValue,
  pickProduct,
  getPrestigeOdds,
} from "../../data/vaults";
import { getVaultItemsByRarity, pickFunko } from "../../data/funkos";
import { FunkoImage } from "../shared/FunkoImage";
import { VaultCard } from "./VaultCard";
import { useGame } from "../../context/GameContext";
import { trackEvent, AnalyticsEvents } from "../../lib/analytics";
import {
  OPEN_TUTORIAL_BONUS_SHOWN_EVENT,
  OPEN_TUTORIAL_RESULT_CHOSEN_EVENT,
  OPEN_TUTORIAL_REVEAL_READY_EVENT,
  OPEN_TUTORIAL_SPIN_STARTED_EVENT,
  OPEN_TUTORIAL_VAULT_SELECTED_EVENT,
} from "../../lib/tutorial-events";
import {
  FEATURE_UNLOCK_LABEL,
  FEATURE_UNLOCK_XP,
  getRemainingXP,
  isFeatureUnlocked,
  type UnlockFeatureKey,
} from "../../lib/unlocks";
import type {
  Rarity,
  Vault,
  VaultGridProps,
  VaultTierName,
} from "../../types/vault";
import { VaultLockBonusStage } from "./VaultLockBonusStage";
import { VaultOverrideTrack } from "./VaultOverrideTrack";
import { LegendaryHypeOverlay } from "./LegendaryHypeOverlay";
import { playSfx } from "../../lib/audio";
import {
  RARITY_CELEBRATION,
  RARITY_TEXT_CONFIG,
  CELEBRATION_SPRINGS,
} from "../../lib/motion-presets";
import type { ItemAcquisitionMeta } from "../../types/collectible";
import { InlineStatusNotice } from "../shared/InlineStatusNotice";
import { ArcadeButton } from "../shared/ArcadeButton";
import { ProvablyFairReceiptModal } from "../shared/ProvablyFairReceiptModal";
import { useOverlayScrollLock } from "../../hooks/useOverlayScrollLock";
import {
  clearPendingVaultReveal,
  savePendingVaultReveal,
  type PendingVaultReveal,
} from "../../lib/pending-vault-reveal";

/* â”€â”€â”€ Constants & Types â”€â”€â”€ */

type Stage = "idle" | "spinning" | "bonus-spinning" | "result";
type SpinRequestState = "idle" | "requesting" | "spinning";
const ACTION_XP_REWARD = 10;

interface VaultOverlayProps {
  tier: Vault;
  balance: number;
  category: string | null;
  onClose: () => void;
  onPurchase: (
    vaultName: string,
    price: number,
    options?: { receiptId?: string; transactionId?: string }
  ) => { acquisitionMeta: ItemAcquisitionMeta; transactionId: string } | null;
  onClaim: (amount: number, receiptId?: string) => void;
  onEquip: (
    product: string,
    vaultTier: VaultTierName,
    rarity: Rarity,
    value: number,
    funkoId?: string,
    funkoName?: string,
    acquisitionMeta?: ItemAcquisitionMeta,
    receiptId?: string
  ) => void;
  onStore: (
    product: string,
    vaultTier: VaultTierName,
    rarity: Rarity,
    value: number,
    funkoId?: string,
    funkoName?: string,
    acquisitionMeta?: ItemAcquisitionMeta,
    receiptId?: string
  ) => void;
  onShip: (
    product: string,
    vaultTier: VaultTierName,
    rarity: Rarity,
    value: number,
    funkoId?: string,
    funkoName?: string,
    acquisitionMeta?: ItemAcquisitionMeta,
    receiptId?: string
  ) => boolean;
  prestigeLevel?: number;
  onUseFreeSpinForVault?: (
    vaultName: string,
    price: number,
    options?: { receiptId?: string; transactionId?: string }
  ) => { acquisitionMeta: ItemAcquisitionMeta; transactionId: string } | null;
  onBonusShards?: (count: number) => void;
  freeSpins?: number;
  microTutorialActive?: boolean;
  tutorialMode?: "demo" | null;
  onTutorialResultAction?: () => void;
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

interface SpinOutcome {
  rarity: Rarity;
  product: string;
  value: number;
  funko: ReturnType<typeof pickFunko>;
}

const seededUnit = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function ResultActionButton({
  label,
  onClick,
  accentColor,
  tutorialId,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  accentColor: string;
  tutorialId?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      {...(tutorialId ? { "data-tutorial": tutorialId } : {})}
      className={`system-rail min-w-[110px] px-4 py-3 text-center text-[10px] font-black uppercase tracking-[0.24em] transition-all duration-200 sm:min-w-[132px] sm:px-5 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:-translate-y-0.5 hover:text-white"}`}
      style={{
        borderColor: `${accentColor}36`,
        color: disabled ? "rgba(149,167,187,0.8)" : accentColor,
        background: disabled
          ? "linear-gradient(180deg, rgba(14,22,31,0.96) 0%, rgba(10,16,24,0.98) 100%)"
          : `linear-gradient(180deg, ${accentColor}12 0%, rgba(10,16,24,0.96) 100%)`,
        boxShadow: disabled ? undefined : `0 0 18px ${accentColor}14`,
      }}
    >
      {label}
    </button>
  );
}

function ConfettiParticles({
  color,
  count = 40,
  rarity,
}: {
  color: string;
  count?: number;
  rarity?: string;
}) {
  const config = rarity ? RARITY_CELEBRATION[rarity] : null;
  const effectiveCount = config?.count ?? count;
  const effectiveSpread = config?.spread ?? 400;
  const effectiveDuration = config?.duration ?? 2;
  const sizeClass = config?.size ?? "w-2 h-2";
  const colorSeed = useMemo(
    () => color.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0),
    [color]
  );

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
          rotate: seededUnit(base + 5) * 720,
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
        y: -(seededUnit(base + 2) * 300 + 300),
        color: seededUnit(base + 3) > 0.3 ? "#FFD700" : "#ffffff",
        scale: seededUnit(base + 4) * 0.6 + 0.3,
        rotate: seededUnit(base + 5) * 540,
      };
    });
  }, [colorSeed, rarity]);

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
            rotate: p.rotate,
            scale: p.scale,
          }}
          transition={{ duration: effectiveDuration, ease: "easeOut" }}
          className={`absolute ${sizeClass} rounded-sm`}
          style={{ backgroundColor: p.color }}
        />
      ))}
      {legendaryWave.map((p) => (
        <motion.div
          key={`wave-${p.id}`}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            x: p.x,
            y: p.y,
            scale: p.scale,
            rotate: p.rotate,
          }}
          transition={{ duration: 2.5, delay: 0.5, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

/* â”€â”€â”€ Animated Value Counter â”€â”€â”€ */

function AnimatedValue({
  value,
  duration = 1.2,
  color,
}: {
  value: number;
  duration?: number;
  color: string;
}) {
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

  return (
    <span className="font-black" style={{ color }}>
      ${display}.00
    </span>
  );
}

/* â”€â”€â”€ Vault Overlay Internal Component â”€â”€â”€ */

function VaultOverlay({
  tier,
  balance,
  category,
  onClose,
  onPurchase,
  onClaim,
  onEquip,
  onStore,
  onShip,
  prestigeLevel: overlayPrestigeLevel = 0,
  onUseFreeSpinForVault,
  onBonusShards,
  freeSpins = 0,
  microTutorialActive: isMicroTutorial = false,
  tutorialMode = null,
  onTutorialResultAction,
}: VaultOverlayProps) {
  useOverlayScrollLock(true);
  const navigate = useNavigate();
  const {
    fairnessClientSeed,
    provablyFairCommit,
    ensureProvablyFairSession,
    resolveVaultOpenFairly,
    resolveBonusLockFairly,
    getProvablyFairReceipt,
  } = useGame();
  const isTutorialDemo = tutorialMode === "demo";
  const [stage, setStage] = useState<Stage>("idle");
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [fairnessError, setFairnessError] = useState<string | null>(null);
  const [spinLanded, setSpinLanded] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isResolvingAction, setIsResolvingAction] = useState(false);
  const [cashoutComplete, setCashoutComplete] = useState(false);
  const [claimParticles, setClaimParticles] = useState<ClaimParticle[]>([]);
  const [bonusTriggered, setBonusTriggered] = useState(false);
  const [acquisitionMeta, setAcquisitionMeta] =
    useState<ItemAcquisitionMeta | null>(null);
  const timeoutIdsRef = useRef<number[]>([]);
  const lastOutcomeRef = useRef<SpinOutcome | null>(null);
  const effectiveOdds = useMemo(
    () => getPrestigeOdds(tier.rarities, overlayPrestigeLevel),
    [tier, overlayPrestigeLevel]
  );
  const buildOutcome = useCallback((): SpinOutcome => {
    const rarity = pickRarity(effectiveOdds) as Rarity;
    return {
      rarity,
      product: category || pickProduct(),
      value: pickValue(
        tier.price,
        RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG]
      ),
      funko: pickFunko(tier.name as VaultTierName, rarity),
    };
  }, [category, effectiveOdds, tier.name, tier.price]);

  const rollOutcome = useCallback((): SpinOutcome => {
    let next = buildOutcome();
    const previous = lastOutcomeRef.current;

    // Avoid immediate duplicate pulls to keep spin feedback feeling fair.
    if (previous) {
      for (let attempts = 0; attempts < 4; attempts += 1) {
        const isDuplicate =
          next.rarity === previous.rarity &&
          next.funko.id === previous.funko.id;

        if (!isDuplicate) break;
        next = buildOutcome();
      }
    }

    lastOutcomeRef.current = next;
    return next;
  }, [buildOutcome]);
  const [outcome, setOutcome] = useState<SpinOutcome>(() => buildOutcome());

  useEffect(() => {
    lastOutcomeRef.current = outcome;
  }, [outcome]);
  const wonRarity = outcome.rarity;
  const product = outcome.product;
  const resultValue = outcome.value;
  const wonFunko = outcome.funko;
  const rarityConfig = RARITY_CONFIG[wonRarity as keyof typeof RARITY_CONFIG];
  const [usedFreeSpin, setUsedFreeSpin] = useState(false);
  const resultAcquisitionMeta =
    acquisitionMeta ??
    (usedFreeSpin
      ? {
          fundingSource: "free_spin" as const,
          shippingEligible: false,
          shippingLockReason:
            "Free Spin prizes can be held, equipped, listed, or cashed out, but cannot be shipped yet.",
        }
      : {
          fundingSource: "earned" as const,
          shippingEligible: true,
        });
  const shippingLocked =
    !isTutorialDemo && !resultAcquisitionMeta.shippingEligible;

  const [landingFlash, setLandingFlash] = useState(false);
  const [purchasedBalance, setPurchasedBalance] = useState<number | null>(null);
  const [vaultReceiptId, setVaultReceiptId] = useState<string | null>(null);
  const [bonusReceiptId, setBonusReceiptId] = useState<string | null>(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [spinRequestState, setSpinRequestState] =
    useState<SpinRequestState>("idle");
  const [resolvedBonusChannels, setResolvedBonusChannels] = useState<
    { tier: VaultTierName; color: string; imagePath: string }[] | null
  >(null);
  const revealResolvedRef = useRef(false);
  const revealFallbackSavedRef = useRef(false);
  const preBalance = purchasedBalance ?? balance;
  const postBalance = usedFreeSpin
    ? preBalance + resultValue
    : preBalance - tier.price + resultValue;
  const OVERRIDE_SPIN_DURATION_MS = 9600;
  const POST_LAND_HOLD_DELAY = 900;

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

  const buildPendingReveal = useCallback((): PendingVaultReveal | null => {
    if (stage !== "result" || cashoutComplete || isTutorialDemo) return null;

    return {
      product,
      vaultTier: tier.name as VaultTierName,
      rarity: wonRarity as Rarity,
      value: resultValue,
      funkoId: wonFunko.id,
      funkoName: wonFunko.name,
      acquisitionMeta: resultAcquisitionMeta,
      receiptId: vaultReceiptId ?? undefined,
      createdAt: Date.now(),
    };
  }, [
    cashoutComplete,
    isTutorialDemo,
    product,
    resultAcquisitionMeta,
    resultValue,
    stage,
    tier.name,
    vaultReceiptId,
    wonFunko.id,
    wonFunko.name,
    wonRarity,
  ]);

  const markRevealResolved = useCallback(() => {
    revealResolvedRef.current = true;
    revealFallbackSavedRef.current = true;
    clearPendingVaultReveal();
  }, []);

  const persistRevealFallback = useCallback(
    (mode: "store" | "stash") => {
      if (revealResolvedRef.current || revealFallbackSavedRef.current) return;

      const payload = buildPendingReveal();
      if (!payload) return;

      revealFallbackSavedRef.current = true;

      if (mode === "store") {
        onStore(
          payload.product,
          payload.vaultTier,
          payload.rarity,
          payload.value,
          payload.funkoId,
          payload.funkoName,
          payload.acquisitionMeta,
          payload.receiptId
        );
        revealResolvedRef.current = true;
        clearPendingVaultReveal();
        trackEvent(AnalyticsEvents.ITEM_ACTION, {
          action: "auto_hold",
          vault_tier: tier.name,
          rarity: wonRarity,
          value: resultValue,
          vault_price: tier.price,
          free_spin: usedFreeSpin,
        });
        return;
      }

      savePendingVaultReveal(payload);
    },
    [
      buildPendingReveal,
      onStore,
      resultValue,
      tier.name,
      tier.price,
      usedFreeSpin,
      wonRarity,
    ]
  );

  useEffect(() => {
    if (stage !== "idle") return;
    void ensureProvablyFairSession();
  }, [ensureProvablyFairSession, stage]);

  useEffect(() => {
    const handlePersist = () => persistRevealFallback("stash");
    window.addEventListener("pagehide", handlePersist);
    window.addEventListener("beforeunload", handlePersist);
    return () => {
      handlePersist();
      window.removeEventListener("pagehide", handlePersist);
      window.removeEventListener("beforeunload", handlePersist);
    };
  }, [persistRevealFallback]);

  const handleSpinLand = useCallback(() => {
    setSpinLanded(true);
    setLandingFlash(true);
    playSfx("vault_lock");
    scheduleTimeout(() => setLandingFlash(false), 500);
  }, [scheduleTimeout]);

  useEffect(() => {
    if (stage === "bonus-spinning") {
      playSfx("bonus_round_enter");
      window.dispatchEvent(new CustomEvent(OPEN_TUTORIAL_BONUS_SHOWN_EVENT));
    }
    if (stage === "result") {
      playSfx(
        wonRarity === "legendary"
          ? "vault_win_legendary"
          : wonRarity === "rare"
            ? "vault_win_rare"
            : wonRarity === "uncommon"
              ? "vault_win_uncommon"
              : "vault_win_common"
      );
      trackEvent(AnalyticsEvents.VAULT_RESULT, {
        vault_tier: tier.name,
        rarity: wonRarity,
        value: resultValue,
        vault_price: tier.price,
        bonus_triggered: bonusTriggered,
        free_spin: usedFreeSpin,
      });
      trackEvent(AnalyticsEvents.REVEAL_SHOWN, {
        vault_tier: tier.name,
        rarity: wonRarity,
        value: resultValue,
        vault_price: tier.price,
      });
      window.dispatchEvent(new CustomEvent(OPEN_TUTORIAL_REVEAL_READY_EVENT));
    }
  }, [
    stage,
    wonRarity,
    resultValue,
    tier.name,
    tier.price,
    bonusTriggered,
    usedFreeSpin,
  ]);

  const resetForNextSpin = useCallback(() => {
    markRevealResolved();
    setStage("idle");
    setSpinLanded(false);
    setIsClaiming(false);
    setIsResolvingAction(false);
    setCashoutComplete(false);
    setClaimParticles([]);
    setPurchaseError(null);
    setFairnessError(null);
    setSpinRequestState("idle");
    setPurchasedBalance(null);
    setBonusTriggered(false);
    setUsedFreeSpin(false);
    setAcquisitionMeta(null);
    setVaultReceiptId(null);
    setBonusReceiptId(null);
    setResolvedBonusChannels(null);
  }, [markRevealResolved]);

  const handleSpin = useCallback(async () => {
    if (spinRequestState !== "idle") return;
    revealResolvedRef.current = false;
    revealFallbackSavedRef.current = false;
    clearPendingVaultReveal();
    const usesFreeSpin = !isTutorialDemo && freeSpins > 0;
    setPurchaseError(null);
    setFairnessError(null);
    setSpinRequestState("requesting");
    const fairResponse = !isTutorialDemo
      ? await resolveVaultOpenFairly({
          vaultName: tier.name,
          price: tier.price,
          prestigeLevel: overlayPrestigeLevel,
          categoryKey: category,
          fundingSource: usesFreeSpin ? "free_spin" : "credits",
          funkoPools: {
            common: getVaultItemsByRarity(tier.name as VaultTierName, "common").map((item) => ({
              id: item.id,
              name: item.name,
              imagePath: item.imagePath,
            })),
            uncommon: getVaultItemsByRarity(
              tier.name as VaultTierName,
              "uncommon"
            ).map((item) => ({
              id: item.id,
              name: item.name,
              imagePath: item.imagePath,
            })),
            rare: getVaultItemsByRarity(tier.name as VaultTierName, "rare").map((item) => ({
              id: item.id,
              name: item.name,
              imagePath: item.imagePath,
            })),
            legendary: getVaultItemsByRarity(
              tier.name as VaultTierName,
              "legendary"
            ).map((item) => ({
              id: item.id,
              name: item.name,
              imagePath: item.imagePath,
            })),
          },
        })
      : null;

    if (!isTutorialDemo && !fairResponse) {
      setSpinRequestState("idle");
      setFairnessError(
        "The fairness backend did not return a verifiable receipt. Spin is blocked until proof is available."
      );
      return;
    }

    const nextOutcome =
      fairResponse
        ? {
            rarity: fairResponse.resultPayload.rarity as Rarity,
            product: fairResponse.resultPayload.product as string,
            value: Number(fairResponse.resultPayload.value),
            funko: {
              id: fairResponse.resultPayload.funkoId as string,
              name: fairResponse.resultPayload.funkoName as string,
              imagePath: fairResponse.resultPayload.imagePath as string,
              rarity: fairResponse.resultPayload.rarity as Rarity,
              vaultTiers: [tier.name as VaultTierName],
              baseValue: Number(fairResponse.resultPayload.value),
            },
          }
        : rollOutcome();
    const nextWonRarity = nextOutcome.rarity;
    const shouldTriggerBonus =
      isMicroTutorial ||
      (fairResponse
        ? Boolean(fairResponse.resultPayload.bonusTriggered)
        : Math.random() < (PREMIUM_BONUS_CHANCE[tier.name] ?? 0));

    let nextBonusChannels: { tier: VaultTierName; color: string; imagePath: string }[] | null =
      null;
    let nextBonusReceiptId: string | null = null;
    if (shouldTriggerBonus && fairResponse?.receipt.id && !isTutorialDemo) {
      const bonusResponse = await resolveBonusLockFairly({
        vaultName: tier.name,
        parentVaultReceiptId: fairResponse.receipt.id,
        prestigeLevel: overlayPrestigeLevel,
      });
      if (!bonusResponse) {
        setSpinRequestState("idle");
        setFairnessError(
          "The bonus lock receipt could not be prepared. Spin is blocked until proof is available."
        );
        setResolvedBonusChannels(null);
        setBonusReceiptId(null);
        return;
      }
      nextBonusReceiptId = bonusResponse.receipt.id;
      nextBonusChannels = bonusResponse.resultPayload.channels as {
        tier: VaultTierName;
        color: string;
        imagePath: string;
      }[];
    }

    playSfx("vault_scan_start");
    trackEvent(AnalyticsEvents.SPIN_STARTED, {
      vault_tier: tier.name,
      vault_price: tier.price,
      free_spins_available: freeSpins,
      interaction: "vault_override",
    });
    window.dispatchEvent(new CustomEvent(OPEN_TUTORIAL_SPIN_STARTED_EVENT));
    setOutcome(nextOutcome);
    setBonusTriggered(shouldTriggerBonus);
    setVaultReceiptId(fairResponse?.receipt.id ?? null);
    setBonusReceiptId(nextBonusReceiptId);
    setSpinLanded(false);
    setUsedFreeSpin(false);
    setIsResolvingAction(false);
    setCashoutComplete(false);
    setClaimParticles([]);
    setResolvedBonusChannels(nextBonusChannels);

    const freeSpinMeta = isTutorialDemo
      ? null
      : (onUseFreeSpinForVault?.(tier.name, tier.price, {
          receiptId: fairResponse?.receipt.id,
          transactionId: `tx-vault-${Date.now()}`,
        }) ?? null);
    if (freeSpinMeta) {
      setUsedFreeSpin(true);
      setPurchasedBalance(balance);
      setAcquisitionMeta(freeSpinMeta.acquisitionMeta);
      setPurchaseError(null);
      trackEvent(AnalyticsEvents.FREE_SPIN_USED, {
        vault_tier: tier.name,
        vault_price: tier.price,
        free_spins_before: freeSpins,
        free_spins_after: Math.max(freeSpins - 1, 0),
      });
      trackEvent(AnalyticsEvents.VAULT_OPENED, {
        vault_tier: tier.name,
        vault_price: tier.price,
        free_spin: true,
      });
      setSpinRequestState("spinning");
      setStage("spinning");
      scheduleTimeout(() => handleSpinLand(), OVERRIDE_SPIN_DURATION_MS);
      if (shouldTriggerBonus) {
        trackEvent(AnalyticsEvents.BONUS_SPIN_TRIGGERED, {
          vault_tier: tier.name,
          vault_price: tier.price,
          first_rarity: nextWonRarity,
        });
        scheduleTimeout(
          () => setStage("bonus-spinning"),
          OVERRIDE_SPIN_DURATION_MS + POST_LAND_HOLD_DELAY
        );
      } else {
        scheduleTimeout(
          () => setStage("result"),
          OVERRIDE_SPIN_DURATION_MS + POST_LAND_HOLD_DELAY
        );
      }
      return;
    }
    if (isTutorialDemo) {
      setPurchasedBalance(balance);
      setAcquisitionMeta({
        fundingSource: "earned",
        shippingEligible: true,
      });
    } else {
      const purchaseResult = onPurchase(tier.name, tier.price, {
        receiptId: fairResponse?.receipt.id,
        transactionId: `tx-vault-${Date.now()}`,
      });
      if (!purchaseResult) {
        setSpinRequestState("idle");
        setPurchaseError(`Insufficient credits.`);
        return;
      }
      setPurchasedBalance(balance);
      setAcquisitionMeta(purchaseResult.acquisitionMeta);
    }
    setPurchaseError(null);
    trackEvent(AnalyticsEvents.VAULT_OPENED, {
      vault_tier: tier.name,
      vault_price: tier.price,
    });
    setSpinRequestState("spinning");
    setStage("spinning");
    scheduleTimeout(() => handleSpinLand(), OVERRIDE_SPIN_DURATION_MS);
    if (shouldTriggerBonus) {
      trackEvent(AnalyticsEvents.BONUS_SPIN_TRIGGERED, {
        vault_tier: tier.name,
        vault_price: tier.price,
        first_rarity: nextWonRarity,
      });
      scheduleTimeout(
        () => setStage("bonus-spinning"),
        OVERRIDE_SPIN_DURATION_MS + POST_LAND_HOLD_DELAY
      );
    } else {
      scheduleTimeout(
        () => setStage("result"),
        OVERRIDE_SPIN_DURATION_MS + POST_LAND_HOLD_DELAY
      );
    }
  }, [
    OVERRIDE_SPIN_DURATION_MS,
    POST_LAND_HOLD_DELAY,
    balance,
    category,
    freeSpins,
    handleSpinLand,
    isMicroTutorial,
    isTutorialDemo,
    onPurchase,
    onUseFreeSpinForVault,
    overlayPrestigeLevel,
    resolveBonusLockFairly,
    resolveVaultOpenFairly,
    rollOutcome,
    scheduleTimeout,
    spinRequestState,
    tier.name,
    tier.price,
  ]);

  const isLoss = !usedFreeSpin && resultValue < tier.price;
  const canSpinAgain = isTutorialDemo || freeSpins > 0 || balance >= tier.price;
  const canStartSpin =
    (isTutorialDemo || freeSpins > 0 || balance >= tier.price) &&
    stage === "idle" &&
    spinRequestState === "idle";

  const handleClaimLocal = () => {
    if (isResolvingAction || cashoutComplete) return;
    markRevealResolved();
    onTutorialResultAction?.();
    setIsResolvingAction(true);
    const viewportHeight =
      typeof window !== "undefined" ? window.innerHeight : 900;
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
        rotate: (Math.random() - 0.5) * 420,
      }))
    );
    trackEvent(AnalyticsEvents.ITEM_ACTION, {
      action: "cashout",
      vault_tier: tier.name,
      rarity: wonRarity,
      value: resultValue,
      vault_price: tier.price,
      free_spin: usedFreeSpin,
    });
    trackEvent(AnalyticsEvents.ACTION_CASHOUT, {
      vault_tier: tier.name,
      rarity: wonRarity,
      value: resultValue,
      vault_price: tier.price,
      free_spin: usedFreeSpin,
    });
    setIsClaiming(true);
    playSfx("cashout");
    onClaim(resultValue, vaultReceiptId ?? undefined);
    scheduleTimeout(() => {
      setIsClaiming(false);
      setCashoutComplete(true);
      setIsResolvingAction(false);
    }, 1250);
  };

  const handleEquip = () => {
    if (isResolvingAction) return;
    markRevealResolved();
    onTutorialResultAction?.();
    setIsResolvingAction(true);
    trackEvent(AnalyticsEvents.ITEM_ACTION, {
      action: "equip",
      vault_tier: tier.name,
      rarity: wonRarity,
      value: resultValue,
      vault_price: tier.price,
      free_spin: usedFreeSpin,
    });
    trackEvent(AnalyticsEvents.ACTION_EQUIP, {
      vault_tier: tier.name,
      rarity: wonRarity,
      value: resultValue,
      vault_price: tier.price,
      free_spin: usedFreeSpin,
    });
    onEquip(
      product,
      tier.name as VaultTierName,
      wonRarity as Rarity,
      resultValue,
      wonFunko.id,
      wonFunko.name,
      resultAcquisitionMeta,
      vaultReceiptId ?? undefined
    );
  };

  const handleShip = () => {
    if (isResolvingAction || shippingLocked) {
      if (shippingLocked) playSfx("ui_locked");
      return;
    }
    markRevealResolved();
    onTutorialResultAction?.();
    setIsResolvingAction(true);
    trackEvent(AnalyticsEvents.ITEM_ACTION, {
      action: "ship",
      vault_tier: tier.name,
      rarity: wonRarity,
      value: resultValue,
      vault_price: tier.price,
      free_spin: usedFreeSpin,
    });
    trackEvent(AnalyticsEvents.ACTION_SHIP, {
      vault_tier: tier.name,
      rarity: wonRarity,
      value: resultValue,
      vault_price: tier.price,
      free_spin: usedFreeSpin,
    });
    const shipped = onShip(
      product,
      tier.name as VaultTierName,
      wonRarity as Rarity,
      resultValue,
      wonFunko.id,
      wonFunko.name,
      resultAcquisitionMeta,
      vaultReceiptId ?? undefined
    );
    if (!shipped) {
      revealResolvedRef.current = false;
      revealFallbackSavedRef.current = false;
      setIsResolvingAction(false);
    }
  };

  const handleBonusComplete = useCallback(
    (shardsAwarded: number) => {
      trackEvent(AnalyticsEvents.VAULT_LOCK_COMPLETE, {
        vault_tier: tier.name,
        shards_awarded: shardsAwarded,
        awarded: shardsAwarded > 0,
      });
      if (!isMicroTutorial && shardsAwarded > 0) onBonusShards?.(shardsAwarded);
      if (shardsAwarded > 0) playSfx("bonus_round_win");
      setStage("result");
    },
    [isMicroTutorial, onBonusShards, tier.name]
  );

  const handleSpinAgain = () => {
    if (freeSpins <= 0 && balance < tier.price) {
      setPurchaseError("Insufficient credits.");
      return;
    }
    resetForNextSpin();
    playSfx("ui_select");
    scheduleTimeout(() => handleSpin(), 50);
  };

  const handleCloseRequest = useCallback(() => {
    persistRevealFallback("store");
    onClose();
  }, [onClose, persistRevealFallback]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden bg-bg/95 backdrop-blur-xl"
    >
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
                  boxShadow: "0 0 16px rgba(255, 215, 0, 0.8)",
                }}
                initial={{
                  x: 0,
                  y: particle.yStart,
                  opacity: 0,
                  scale: 0.6,
                  rotate: 0,
                }}
                animate={{
                  x: [0, particle.xMid, particle.xEnd],
                  y: [particle.yStart, particle.yMid, particle.yEnd],
                  opacity: [0, 1, 0],
                  scale: [0.6, 1.35, 0.85],
                  rotate: [0, particle.rotate],
                }}
                transition={{
                  duration: particle.duration,
                  ease: "easeOut",
                  delay: particle.delay,
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
            initial={{
              opacity: RARITY_TEXT_CONFIG[wonRarity]?.flashOpacity ?? 0.08,
            }}
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
            opacity:
              wonRarity === "rare" || wonRarity === "legendary" ? 0.15 : 0.06,
          }}
        />
      )}

      <div className="h-full max-h-dvh flex items-start justify-center p-2 sm:p-4 py-4 sm:py-6 relative z-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div
              key="idle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="relative my-auto w-full max-w-[88rem] px-2 pt-14 sm:px-4 sm:pt-6 lg:px-5"
            >
              <button
                onClick={handleCloseRequest}
                type="button"
                aria-label="Close"
                className="system-close"
                style={{
                  position: "fixed",
                  top: 18,
                  right: 18,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex flex-col gap-3 pr-14 sm:pr-16 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    {freeSpins > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-green/40 bg-neon-green/10 px-3 py-1.5"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="text-neon-green"
                        >
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-neon-green">
                          Free Spin Ready
                        </span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {purchaseError && (
                  <InlineStatusNotice
                    title="Insufficient Credits"
                    tone="danger"
                    body={purchaseError}
                  />
                )}
                {fairnessError && (
                  <InlineStatusNotice
                    title="Proof Unavailable"
                    tone="danger"
                    body={fairnessError}
                  />
                )}

                <div data-tutorial="override-stage" className="space-y-5">
                  <div className="mx-auto w-full max-w-3xl">
                    <div className="module-card flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="grid gap-3 text-left text-xs sm:grid-cols-3 sm:gap-5">
                          <div>
                            <p className="system-label">Server Hash</p>
                            <p className="mt-1 font-mono text-[11px] text-white">
                              {provablyFairCommit
                                ? `${provablyFairCommit.serverSeedHash.slice(0, 14)}...${provablyFairCommit.serverSeedHash.slice(-10)}`
                                : "Unavailable"}
                            </p>
                          </div>
                          <div>
                            <p className="system-label">Client Seed</p>
                            <p className="mt-1 font-mono text-[11px] text-white">
                              {`${fairnessClientSeed.slice(0, 10)}...${fairnessClientSeed.slice(-6)}`}
                            </p>
                          </div>
                          <div>
                            <p className="system-label">Next Nonce</p>
                            <p className="mt-1 font-mono text-[11px] text-white">
                              {provablyFairCommit?.nextNonce ?? "--"}
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim">
                          {spinRequestState === "requesting"
                            ? "Locking receipt..."
                            : "Nonce increments after each verified outcome"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {vaultReceiptId ? (
                          <button
                            type="button"
                            onClick={() => {
                              trackEvent(AnalyticsEvents.PROVABLY_FAIR_RECEIPT_OPENED, {
                                source: "vault_overlay",
                                receipt_id: vaultReceiptId,
                              });
                              setShowProofModal(true);
                            }}
                            className="system-rail px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white"
                          >
                            View Proof
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => {
                            trackEvent(AnalyticsEvents.PROVABLY_FAIR_DOC_OPENED, {
                              source: "vault_overlay",
                              vault_tier: tier.name,
                            });
                            navigate("/provably-fair");
                          }}
                          className="system-rail px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white"
                        >
                          Open Fairness Doc
                        </button>
                      </div>
                    </div>
                  </div>

                  <VaultOverrideTrack
                    vaultTier={tier.name as VaultTierName}
                    wonFunko={wonFunko}
                    extracting={false}
                    locked={false}
                    spinDurationMs={OVERRIDE_SPIN_DURATION_MS}
                  />

                  <div className="mx-auto w-full max-w-[36rem] px-2 sm:px-0">
                    <ArcadeButton
                      onClick={handleSpin}
                      disabled={!canStartSpin}
                      loading={spinRequestState === "requesting"}
                      loadingLabel="Preparing Spin"
                      tutorialId="spin-button"
                      tone="accent"
                      size="primary"
                      fillMode="center"
                      fullWidth
                      className="mx-auto"
                    >
                      SPIN
                    </ArcadeButton>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {stage === "spinning" && (
            <motion.div
              key="spinning"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.97, filter: "blur(4px)" }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="my-auto flex w-full max-w-[88rem] flex-col justify-center px-2 sm:px-4 lg:px-5"
            >
              <div className="mb-4 text-center sm:mb-5">
                <h3 className="text-lg font-black uppercase tracking-[0.22em] text-white sm:text-xl md:text-2xl">
                  {spinLanded ? "Funko Acquired" : "Spin In Progress"}
                </h3>
              </div>
              <VaultOverrideTrack
                vaultTier={tier.name as VaultTierName}
                wonFunko={wonFunko}
                extracting={!spinLanded}
                locked={spinLanded}
                spinDurationMs={OVERRIDE_SPIN_DURATION_MS}
              />
            </motion.div>
          )}

          {stage === "bonus-spinning" && (
            <div className="w-full my-auto flex items-center justify-center">
              <VaultLockBonusStage
                purchasedTierName={tier.name as VaultTierName}
                prestigeLevel={overlayPrestigeLevel}
                onComplete={(shardsAwarded) =>
                  handleBonusComplete(shardsAwarded)
                }
                forcedLandings={isMicroTutorial ? "jackpot" : undefined}
                resolvedChannels={resolvedBonusChannels}
              />
            </div>
          )}

          {stage === "result" &&
            (() => {
              const textConfig =
                RARITY_TEXT_CONFIG[wonRarity] || RARITY_TEXT_CONFIG.common;
              const spring =
                CELEBRATION_SPRINGS[wonRarity] || CELEBRATION_SPRINGS.common;
              const recoveryPercent = isLoss
                ? Math.round((resultValue / tier.price) * 100)
                : 0;
              const useCounter =
                wonRarity === "rare" || wonRarity === "legendary";
              const counterDuration = wonRarity === "legendary" ? 2 : 1.2;

              return (
                <motion.div
                  key="result"
                  initial={{
                    scale: textConfig.entranceScale,
                    opacity: 0,
                    y: 16,
                    filter: "blur(6px)",
                  }}
                  animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    type: "spring",
                    damping: spring.damping,
                    stiffness: spring.stiffness,
                    delay: textConfig.entranceDelay,
                  }}
                  className="relative my-auto flex w-full max-w-[96rem] flex-col items-center space-y-4 px-2 sm:px-4 sm:space-y-5 md:space-y-6 lg:px-8"
                >
                  <ConfettiParticles
                    color={rarityConfig.color}
                    rarity={isLoss ? undefined : wonRarity}
                    count={isLoss ? 8 : undefined}
                  />
                  <div className="system-shell relative z-10 w-full max-w-3xl px-4 py-4 sm:px-6 sm:py-6">
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at 50% 24%, ${rarityConfig.color}22 0%, transparent 54%)`,
                      }}
                    />
                    <div className="relative z-10 text-center">
                      <div className="flex items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.78, y: 18 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            type: "spring",
                            damping: spring.damping,
                            stiffness: spring.stiffness,
                            delay: textConfig.entranceDelay + 0.2,
                          }}
                          className="specimen-frame relative w-full max-w-[188px] p-3 sm:max-w-[214px]"
                          style={{
                            borderColor: `${rarityConfig.color}55`,
                            background: `linear-gradient(180deg, ${rarityConfig.color}12 0%, rgba(8,12,20,0.92) 100%)`,
                            boxShadow: `0 0 34px ${rarityConfig.color}28`,
                          }}
                        >
                          <div className="relative z-10">
                            <FunkoImage
                              name={wonFunko.name}
                              imagePath={wonFunko.imagePath}
                              rarity={wonRarity as Rarity}
                              size="lg"
                              showLabel={false}
                              className="!h-[160px] !w-full sm:!h-[188px]"
                            />
                          </div>
                        </motion.div>
                      </div>
                      <motion.h3
                        className="mx-auto mt-4 max-w-[16ch] text-center text-xl font-black uppercase tracking-tight text-white sm:text-2xl"
                        initial={{
                          opacity: 0,
                          scale: textConfig.entranceScale,
                        }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          type: "spring",
                          damping: spring.damping,
                          stiffness: spring.stiffness,
                          delay: textConfig.entranceDelay + 0.08,
                        }}
                      >
                        {wonFunko.name}
                      </motion.h3>
                    </div>
                    <motion.p
                      className="mt-3 text-center text-[11px] font-mono uppercase tracking-[0.3em]"
                      initial={{ opacity: 0, scale: textConfig.entranceScale }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        type: "spring",
                        damping: spring.damping,
                        stiffness: spring.stiffness,
                        delay: textConfig.entranceDelay + 0.12,
                      }}
                      style={{ color: rarityConfig.color }}
                    >
                      {rarityConfig.label}
                    </motion.p>
                    <p className="mt-2 text-center text-xs font-mono uppercase tracking-[0.28em] text-white/45 sm:text-sm">
                      Prize Acquired
                    </p>
                    {isLoss ? (
                      <p className="mt-2 text-center text-sm sm:text-xl md:text-2xl text-text-muted">
                        <span className="font-black text-accent">
                          {recoveryPercent}% Recovery
                        </span>
                      </p>
                    ) : useCounter ? (
                      <p className="mt-2 text-center text-sm sm:text-xl md:text-2xl text-text-muted">
                        Value:{" "}
                        <AnimatedValue
                          value={resultValue}
                          duration={counterDuration}
                          color={rarityConfig.color}
                        />
                      </p>
                    ) : (
                      <p className="mt-2 text-center text-sm sm:text-xl md:text-2xl text-text-muted">
                        Value:{" "}
                        <span
                          className="font-black"
                          style={{ color: rarityConfig.color }}
                        >
                          ${resultValue}.00
                        </span>
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                      <div className="system-readout px-3 py-2 text-center">
                        <p className="system-label">Vault</p>
                        <p className="mt-1 text-[11px] font-black uppercase tracking-[0.18em] text-white">
                          {usedFreeSpin ? "Free" : `$${tier.price}`}
                        </p>
                      </div>
                      <div className="system-readout px-3 py-2 text-center">
                        <p className="system-label">Value</p>
                        <p
                          className="mt-1 text-[11px] font-black uppercase tracking-[0.18em]"
                          style={{ color: rarityConfig.color }}
                        >
                          ${resultValue}
                        </p>
                      </div>
                      <div className="system-readout px-3 py-2 text-center">
                        <p className="system-label">Balance</p>
                        <p className="mt-1 text-[11px] font-black uppercase tracking-[0.18em] text-white">
                          ${postBalance.toFixed(0)}
                        </p>
                      </div>
                    </div>
                    {vaultReceiptId && (
                      <div className="mt-4 flex justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            trackEvent(AnalyticsEvents.PROVABLY_FAIR_RECEIPT_OPENED, {
                              source: "vault_result",
                              receipt_id: bonusReceiptId ?? vaultReceiptId,
                            });
                            setShowProofModal(true);
                          }}
                          className="system-rail px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white"
                        >
                          View Proof
                        </button>
                      </div>
                    )}
                  </div>

                  {!cashoutComplete && (
                    <div
                      data-tutorial="reveal-actions"
                      className="z-10 flex w-full max-w-2xl flex-wrap items-center justify-center gap-2 sm:gap-3"
                    >
                      <ResultActionButton
                        label={isClaiming ? "Processing" : "Cashout"}
                        onClick={handleClaimLocal}
                        accentColor="#ffd700"
                        tutorialId="reveal-cashout"
                        disabled={isResolvingAction}
                      />
                      <ResultActionButton
                        label="Equip"
                        onClick={handleEquip}
                        accentColor="#ff2d95"
                        tutorialId="reveal-equip"
                        disabled={isResolvingAction}
                      />
                      <ResultActionButton
                        label="Ship"
                        onClick={handleShip}
                        accentColor={tier.color}
                        tutorialId="reveal-ship"
                        disabled={isResolvingAction || shippingLocked}
                      />
                    </div>
                  )}

                  {!cashoutComplete && shippingLocked && !isTutorialDemo && (
                    <div className="module-card z-10 w-full max-w-2xl px-4 py-3 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-neon-green">
                        Shipping Locked
                      </p>
                      <p className="mt-2 text-xs text-text-muted">
                        {resultAcquisitionMeta.shippingLockReason ||
                          "This collectible can be held, equipped, listed, or cashed out, but it cannot ship yet."}
                      </p>
                    </div>
                  )}

                  {cashoutComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="module-card z-10 w-full max-w-md p-4 text-center sm:p-5"
                      style={{ borderColor: "rgba(255,215,0,0.35)" }}
                    >
                      <p className="text-sm sm:text-base font-black uppercase tracking-wide text-white">
                        Sale complete
                      </p>
                      <p className="text-xs sm:text-sm text-text-muted mt-2">
                        Credits added and +{ACTION_XP_REWARD} XP awarded.
                      </p>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          onClick={handleCloseRequest}
                          className="system-rail px-4 py-2.5 text-white text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
                        >
                          Return to Vaults
                        </button>
                        <button
                          onClick={handleSpinAgain}
                          disabled={!canSpinAgain}
                          className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                            canSpinAgain
                              ? "system-rail text-white hover:text-accent cursor-pointer"
                              : "system-rail text-text-dim cursor-not-allowed"
                          }`}
                        >
                          Spin Again
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })()}
        </AnimatePresence>
      </div>
      <ProvablyFairReceiptModal
        receipt={
          showProofModal
            ? getProvablyFairReceipt(bonusReceiptId ?? vaultReceiptId ?? "")
            : null
        }
        onClose={() => setShowProofModal(false)}
      />
    </motion.div>
  );
}

/* â”€â”€â”€ Exported Main Component â”€â”€â”€ */

export function VaultGrid({
  onOverlayChange,
  microTutorialActive = false,
  tutorialStepId = null,
  tutorialMode = null,
}: VaultGridProps & { onOverlayChange?: (isOpen: boolean) => void }) {
  const isTutorialDemo = tutorialMode === "demo";
  const {
    balance,
    xp,
    purchaseVault,
    claimCreditsFromReveal,
    addItem,
    addAndEquipItem,
    addAndShipItem,
    awardXP,
    prestigeLevel,
    freeSpins,
    grantBonusShards,
    useFreeSpinForVault,
  } = useGame();
  const navigate = useNavigate();
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [overlayKey, setOverlayKey] = useState(0);
  const [legendaryHype, setLegendaryHype] = useState<{
    funkoName: string;
    value: number;
  } | null>(null);
  const [equipLockedNotice, setEquipLockedNotice] = useState<string | null>(
    null
  );
  const [unlockNoticeFeatures, setUnlockNoticeFeatures] = useState<
    UnlockFeatureKey[] | null
  >(null);
  useOverlayScrollLock(Boolean(equipLockedNotice || unlockNoticeFeatures));

  useEffect(() => {
    onOverlayChange?.(selectedVault != null);
  }, [selectedVault, onOverlayChange]);
  const selectedCategory = "Funko";

  const handleSelect = (vault: Vault) => {
    if (microTutorialActive && tutorialStepId !== "vault-open") {
      return;
    }
    if (!isTutorialDemo && balance < vault.price && freeSpins <= 0) return;
    window.dispatchEvent(new CustomEvent(OPEN_TUTORIAL_VAULT_SELECTED_EVENT));
    playSfx("vault_open");
    trackEvent(AnalyticsEvents.VAULT_OPEN_STARTED, {
      vault_tier: vault.name,
      vault_price: vault.price,
    });
    trackEvent(AnalyticsEvents.VAULT_OVERLAY_OPENED, {
      vault_tier: vault.name,
      vault_price: vault.price,
    });
    setOverlayKey((prev) => prev + 1);
    setSelectedVault(vault);
  };

  const handleCloseOverlay = () => {
    playSfx("ui_close");
    if (selectedVault)
      trackEvent(AnalyticsEvents.VAULT_OVERLAY_CLOSED, {
        vault_tier: selectedVault.name,
        vault_price: selectedVault.price,
      });
    setSelectedVault(null);
  };
  const handleClaim = (amount: number, receiptId?: string) => {
    claimCreditsFromReveal(amount, receiptId);
    awardXP(ACTION_XP_REWARD, "vault_cashout");
  };
  const handleStore = (
    product: string,
    vaultTier: VaultTierName,
    rarity: Rarity,
    value: number,
    funkoId?: string,
    funkoName?: string,
    acquisitionMeta?: ItemAcquisitionMeta,
    receiptId?: string
  ) => {
    addItem(
      product,
      vaultTier,
      rarity,
      value,
      funkoId,
      funkoName,
      acquisitionMeta,
      receiptId
    );
    setSelectedVault(null);
  };
  const handleEquip = (
    product: string,
    vaultTier: VaultTierName,
    rarity: Rarity,
    value: number,
    funkoId?: string,
    funkoName?: string,
    acquisitionMeta?: ItemAcquisitionMeta,
    receiptId?: string
  ) => {
    addAndEquipItem(
      product,
      vaultTier,
      rarity,
      value,
      funkoId,
      funkoName,
      acquisitionMeta,
      receiptId
    );
    awardXP(ACTION_XP_REWARD, "vault_equip");
    setSelectedVault(null);

    const xpAfterReward = xp + ACTION_XP_REWARD;
    const newlyUnlocked = (
      Object.keys(FEATURE_UNLOCK_XP) as UnlockFeatureKey[]
    ).filter(
      (featureKey) =>
        xp < FEATURE_UNLOCK_XP[featureKey] &&
        xpAfterReward >= FEATURE_UNLOCK_XP[featureKey]
    );

    if (newlyUnlocked.length > 0) {
      setUnlockNoticeFeatures(newlyUnlocked);
      return;
    }

    if (!isFeatureUnlocked("arena", xpAfterReward)) {
      const remainingXP = getRemainingXP("arena", xpAfterReward);
      setEquipLockedNotice(
        `Saved to Labs. Earn ${remainingXP} XP to unlock Arena.`
      );
    }
  };
  const handleShip = (
    product: string,
    vaultTier: VaultTierName,
    rarity: Rarity,
    value: number,
    funkoId?: string,
    funkoName?: string,
    acquisitionMeta?: ItemAcquisitionMeta,
    receiptId?: string
  ) => {
    const item = addAndShipItem(
      product,
      vaultTier,
      rarity,
      value,
      funkoId,
      funkoName,
      acquisitionMeta,
      receiptId
    );
    if (!item) {
      setEquipLockedNotice(
        acquisitionMeta?.shippingLockReason ||
          "This collectible can be held, equipped, listed, or cashed out, but it cannot ship yet."
      );
      return false;
    }
    awardXP(ACTION_XP_REWARD, "vault_ship");
    setEquipLockedNotice("Shipment request recorded.");
    setSelectedVault(null);
    return true;
  };

  const minPrice = Math.min(...VAULTS.map((v) => v.price));
  const isBroke = !isTutorialDemo && balance < minPrice && freeSpins <= 0 && !selectedVault;

  const unlockDestination = useMemo(() => {
    const features = unlockNoticeFeatures ?? [];
    if (features.includes("arena") || features.includes("battles")) {
      return { path: "/locker/arena", label: "Go to Arena" };
    }
    if (features.includes("market")) {
      return { path: "/locker/market", label: "Go to Market" };
    }
    return { path: "/locker/inventory", label: "Go to Labs" };
  }, [unlockNoticeFeatures]);

  return (
    <section className="relative overflow-hidden bg-bg px-4 sm:px-6 py-12 md:py-20 pt-44 md:pt-28 pb-28 md:pb-24 min-h-screen">
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            Open Your <span className="text-accent">Vault</span>
          </h2>
          <p className="mx-auto max-w-2xl text-text-muted">
            Pick your tier, press spin, and extract your collectible.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-8"
        >
          <div
            className={`relative transition-all duration-300 ${isBroke ? "blur-xl grayscale pointer-events-none scale-[0.97] opacity-20" : ""}`}
          >
            <div data-tutorial="vault-grid" className="mx-auto max-w-6xl">
              <div className="scrollbar-none -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-1 pb-3 md:hidden [overscroll-behavior-x:contain]">
                {VAULTS.map((vault, index) => (
                  <div
                    key={vault.name}
                    className="w-[min(84vw,340px)] max-w-[340px] min-w-[280px] flex-none snap-center"
                  >
                    <VaultCard
                      vault={vault}
                      index={index}
                      balance={balance}
                      onSelect={handleSelect}
                      prestigeLevel={prestigeLevel}
                      tutorialStepId={tutorialStepId}
                      tutorialMode={tutorialMode}
                    />
                  </div>
                ))}
              </div>
              <div className="hidden gap-4 gap-y-6 md:grid md:grid-cols-2 md:gap-6 md:gap-y-8 lg:grid-cols-3">
                {VAULTS.map((vault, index) => (
                  <VaultCard
                    key={vault.name}
                    vault={vault}
                    index={index}
                    balance={balance}
                    onSelect={handleSelect}
                    prestigeLevel={prestigeLevel}
                    tutorialStepId={tutorialStepId}
                    tutorialMode={tutorialMode}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        <p className="text-center text-[10px] text-text-dim mt-8 font-mono uppercase tracking-wider max-w-lg mx-auto">
          Demo only - item prices, drop odds, game mechanics, and inventory are
          subject to change before launch.
        </p>
        {isBroke && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full max-w-md px-4">
            <div className="bg-surface/80 backdrop-blur-xl border-2 border-error/20 p-12 rounded-3xl shadow-2xl">
              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">
                Credits Depleted
              </h3>
              <p className="text-error font-mono text-sm font-bold mb-4">
                ${balance.toFixed(2)} remaining
              </p>
              <button
                onClick={() =>
                  navigate("/", { state: { scrollToWaitlist: true } })
                }
                className="inline-block px-8 py-3 bg-accent text-white text-sm font-black uppercase tracking-widest rounded-xl shadow-lg border-b-4 border-accent-hover active:border-b-0 transition-all cursor-pointer hover:bg-accent-hover"
              >
                Add Credits
              </button>
            </div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {selectedVault && (
          <VaultOverlay
            key={`overlay-${overlayKey}`}
            tier={selectedVault}
            balance={balance}
            category={selectedCategory}
            onClose={handleCloseOverlay}
            onPurchase={purchaseVault}
            onClaim={handleClaim}
            onEquip={handleEquip}
            onStore={handleStore}
            onShip={handleShip}
            prestigeLevel={prestigeLevel}
            onUseFreeSpinForVault={useFreeSpinForVault}
            onBonusShards={grantBonusShards}
            freeSpins={freeSpins}
            microTutorialActive={microTutorialActive}
            tutorialMode={tutorialMode}
            onTutorialResultAction={() => {
              if (microTutorialActive && tutorialStepId === "vault-reveal") {
                window.dispatchEvent(
                  new CustomEvent(OPEN_TUTORIAL_RESULT_CHOSEN_EVENT)
                );
              }
            }}
          />
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
      <AnimatePresence>
        {equipLockedNotice && (
          <motion.div
            key="equip-locked-notice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[190] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-surface-elevated border border-neon-green/30 rounded-2xl p-8 sm:p-10 max-w-md w-full text-center shadow-[0_0_60px_rgba(57,255,20,0.1)]"
            >
              <div className="w-16 h-16 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-neon-green/30">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-neon-green"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
                Saved to Labs
              </h2>
              <p className="text-text-muted text-sm leading-relaxed mb-8">
                {equipLockedNotice}
              </p>
              <button
                onClick={() => setEquipLockedNotice(null)}
                className="px-8 py-3 bg-neon-green/90 text-bg text-sm font-black uppercase tracking-widest rounded-xl border-b-[4px] border-[#2ab80f] shadow-[0_6px_16px_rgba(57,255,20,0.2)] hover:shadow-[0_4px_12px_rgba(57,255,20,0.3)] active:border-b-[2px] transition-all duration-100 cursor-pointer"
              >
                Got It
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {unlockNoticeFeatures && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[190] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-surface-elevated border border-neon-green/30 rounded-2xl p-8 sm:p-10 max-w-md w-full text-center shadow-[0_0_60px_rgba(57,255,20,0.1)]"
            >
              <div className="w-16 h-16 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-neon-green/30">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-neon-green"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
                New Feature Unlocked
              </h3>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                Your equip action unlocked:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                {unlockNoticeFeatures.map((featureKey) => (
                  <span
                    key={featureKey}
                    className="px-3 py-1.5 rounded-lg border border-neon-green/45 bg-neon-green/10 text-neon-green text-xs font-bold uppercase tracking-wider"
                  >
                    {FEATURE_UNLOCK_LABEL[featureKey]}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    trackEvent(AnalyticsEvents.CTA_CLICK, {
                      cta_name: "unlock_modal_stay",
                      location: "vaults",
                    });
                    setUnlockNoticeFeatures(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-surface border border-white/20 text-white text-[10px] font-black uppercase tracking-widest hover:border-white/35 transition-colors cursor-pointer"
                >
                  Stay Here
                </button>
                <button
                  onClick={() => {
                    trackEvent(AnalyticsEvents.CTA_CLICK, {
                      cta_name: "unlock_modal_go",
                      location: "vaults",
                      destination: unlockDestination.path,
                    });
                    setUnlockNoticeFeatures(null);
                    navigate(unlockDestination.path);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-neon-green/20 border border-neon-green/45 text-neon-green text-[10px] font-black uppercase tracking-widest hover:bg-neon-green/28 transition-colors cursor-pointer"
                >
                  {unlockDestination.label}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
