import { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { VaultLockBonusStageProps, VaultLockPhase, VaultLockSlot } from "../../types/bonus";
import type { VaultTierName } from "../../types/vault";
import { FREE_SPIN_REWARDS } from "../../types/bonus";
import {
  generateVaultLockStrip,
  pickVaultLockLanding
} from "../../data/vaults";
import { VaultIcon } from "./VaultIcons";

const PRESTIGE_THEMES: Record<number, { primary: string; secondary: string }> = {
  0: { primary: "#ff2d95", secondary: "#00f0ff" },
  1: { primary: "#ff8c00", secondary: "#ffd700" },
  2: { primary: "#9945ff", secondary: "#c77dff" },
  3: { primary: "#ff2d95", secondary: "#00e5ff" }
};

const ESCALATION_COLORS = ["#ff2d95", "#00f0ff", "#39ff14"];

interface SpinnerResult {
  tier: VaultTierName;
  color: string;
  index: number;
}

interface VaultLockSpinnerProps {
  strip: VaultLockSlot[];
  isActive: boolean;
  isLocked: boolean;
  lockedResult: SpinnerResult | null;
  escalation: number;
  spinnerIndex: number;
}

function VaultLockSpinnerInner({
  strip,
  isActive,
  isLocked,
  lockedResult,
  escalation,
  spinnerIndex
}: VaultLockSpinnerProps) {
  const prefersReducedMotion = useReducedMotion();
  const slotHeight = 72;
  const visibleSlots = 5;
  const reelHeight = slotHeight * visibleSlots;
  const displayStrip = [...strip, ...strip, ...strip];
  const landedIndex = lockedResult ? strip.length + lockedResult.index : 0;
  const landedOffset = reelHeight / 2 - (landedIndex + 0.5) * slotHeight;
  const [lockFlash, setLockFlash] = useState(false);

  useEffect(() => {
    if (isLocked && lockedResult) {
      setLockFlash(true);
      const t = setTimeout(() => setLockFlash(false), 500);
      return () => clearTimeout(t);
    }
  }, [isLocked, lockedResult]);

  const borderColor = isLocked && lockedResult
    ? `${lockedResult.color}90`
    : isActive
      ? ESCALATION_COLORS[Math.min(escalation, 2)]
      : "rgba(255,255,255,0.08)";

  const glowIntensity = isActive ? (escalation + 1) * 15 : isLocked ? 20 : 0;
  const accentColor = ESCALATION_COLORS[Math.min(escalation, 2)];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: spinnerIndex * 0.15, type: "spring", damping: 18 }}
      className={`relative overflow-hidden rounded-2xl border-2 bg-surface/50 backdrop-blur-md ${escalation >= 2 && isActive ? "animate-rainbow-border" : ""}`}
      style={{
        width: "clamp(100px, 28vw, 160px)",
        height: `${reelHeight}px`,
        borderColor: escalation >= 2 && isActive ? undefined : borderColor,
        boxShadow: isLocked && lockedResult
          ? `0 0 ${glowIntensity + 10}px ${lockedResult.color}40, inset 0 0 15px ${lockedResult.color}15`
          : isActive
            ? `0 0 ${glowIntensity}px ${accentColor}30`
            : "none"
      }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${accentColor} 0px, transparent 1px, transparent 4px)`,
          backgroundSize: "100% 4px"
        }}
      />

      {/* Top/bottom fade */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-linear-to-b from-bg via-transparent to-bg" />

      {/* Center line */}
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] z-30 pointer-events-none"
        style={{
          backgroundColor: isLocked && lockedResult ? lockedResult.color : accentColor,
          boxShadow: `0 0 10px ${isLocked && lockedResult ? lockedResult.color : accentColor}`,
          opacity: isActive || isLocked ? 1 : 0.3
        }}
      />

      {/* Lock flash */}
      <AnimatePresence>
        {lockFlash && lockedResult && (
          <motion.div
            key="lock-flash"
            className="absolute inset-0 z-40 pointer-events-none rounded-2xl"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ backgroundColor: lockedResult.color }}
          />
        )}
      </AnimatePresence>

      {/* Reel content */}
      <motion.div
        className="flex flex-col relative z-10"
        animate={
          isLocked && lockedResult
            ? { y: landedOffset }
            : isActive && !prefersReducedMotion
              ? { y: [0, -(strip.length * slotHeight)] }
              : prefersReducedMotion && isActive && lockedResult
                ? { y: landedOffset }
                : { y: 0 }
        }
        transition={
          isLocked
            ? { duration: 1.1, ease: [0.05, 0.88, 0.15, 1.02] }
            : isActive && !prefersReducedMotion
              ? { duration: 0.35, repeat: Infinity, ease: "linear" }
              : prefersReducedMotion && isActive
                ? { duration: 0.6, ease: "easeOut" }
                : undefined
        }
      >
        {displayStrip.map((slot, i) => {
          const isLandedSlot = isLocked && i === landedIndex;
          return (
            <div
              key={i}
              className="flex items-center justify-center shrink-0"
              style={{ height: `${slotHeight}px` }}
            >
              <motion.div
                animate={
                  isLandedSlot
                    ? { scale: [1, 1.15, 1] }
                    : undefined
                }
                transition={isLandedSlot ? { duration: 0.4 } : undefined}
                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                style={{
                  filter: isLandedSlot
                    ? `drop-shadow(0 0 8px ${slot.color})`
                    : undefined
                }}
              >
                <VaultIcon name={slot.tier} color={slot.color} />
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

const VaultLockSpinner = memo(VaultLockSpinnerInner);

function ElectricArc({ color, fromIndex }: { color: string; fromIndex: number; toIndex: number }) {
  const prefersReducedMotion = useReducedMotion();
  // Draw a simple lightning arc between adjacent spinners
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: prefersReducedMotion ? 0.6 : [0.4, 1, 0.4] }}
      transition={prefersReducedMotion ? undefined : { duration: 0.3, repeat: Infinity }}
      className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-30"
      style={{
        left: `${(fromIndex + 1) * 33.33 - 5}%`,
        width: "10%",
        height: "60px"
      }}
      viewBox="0 0 40 60"
      fill="none"
    >
      <motion.path
        d="M5 5L20 25L10 30L35 55"
        stroke={color}
        strokeWidth="2"
        fill="none"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4 }}
      />
    </motion.svg>
  );
}

export function VaultLockBonusStage({
  purchasedTierName,
  prestigeLevel = 0,
  onComplete
}: VaultLockBonusStageProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<VaultLockPhase>("announce");
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const prestigeTheme = PRESTIGE_THEMES[prestigeLevel as keyof typeof PRESTIGE_THEMES] || PRESTIGE_THEMES[0];

  // Generate 3 independent reel strips
  const strips = useMemo(() => [
    generateVaultLockStrip(purchasedTierName),
    generateVaultLockStrip(purchasedTierName),
    generateVaultLockStrip(purchasedTierName)
  ], [purchasedTierName]);

  // Pre-determine landing results for each spinner
  const landings = useMemo(() => strips.map((strip) => {
    const landing = pickVaultLockLanding(strip);
    return { tier: landing.tier, color: landing.color, index: landing.index };
  }), [strips]);

  const [lockedResults, setLockedResults] = useState<(SpinnerResult | null)[]>([null, null, null]);
  const [escalation, setEscalation] = useState(0);

  const clearTimers = useCallback(() => {
    for (const timer of timersRef.current) clearTimeout(timer);
    timersRef.current = [];
  }, []);

  const schedule = useCallback((action: () => void, delayMs: number) => {
    const timer = setTimeout(action, delayMs);
    timersRef.current.push(timer);
  }, []);

  // Auto-advance for non-interactive phases
  useEffect(() => {
    if (phase === "announce") {
      schedule(() => setPhase("materialize"), 1800);
    } else if (phase === "materialize") {
      schedule(() => setPhase("spin-1"), 1200);
    } else if (phase === "lock-1") {
      schedule(() => {
        setEscalation(1);
        setPhase("spin-2");
      }, 1400);
    } else if (phase === "lock-2") {
      // Check if first two spinners match — if not, skip to evaluate (no 3rd spin)
      const firstTwo = [landings[0].tier, landings[1].tier];
      if (firstTwo[0] !== firstTwo[1]) {
        // No match — show brief pause then evaluate
        schedule(() => setPhase("evaluate"), 1400);
      } else {
        schedule(() => {
          setEscalation(2);
          setPhase("spin-3");
        }, 1400);
      }
    } else if (phase === "lock-3") {
      schedule(() => setPhase("evaluate"), 800);
    } else if (phase === "evaluate") {
      const matchCount = getMatchCount();
      const delay = matchCount === 3 ? 3500 : 2500;
      schedule(() => setPhase("done"), delay);
    } else if (phase === "done") {
      schedule(() => {
        const matchCount = getMatchCount();
        let freeSpins = 0;
        if (matchCount === 3) {
          const matchedTier = lockedResults[0]!.tier;
          freeSpins = FREE_SPIN_REWARDS[matchedTier];
        }
        onComplete(freeSpins);
      }, 400);
    }
    return () => clearTimers();
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => clearTimers(), [clearTimers]);

  const handleLock = useCallback(() => {
    if (phase === "spin-1") {
      setLockedResults((prev) => [landings[0], prev[1], prev[2]]);
      setPhase("lock-1");
    } else if (phase === "spin-2") {
      setLockedResults((prev) => [prev[0], landings[1], prev[2]]);
      setPhase("lock-2");
    } else if (phase === "spin-3") {
      setLockedResults((prev) => [prev[0], prev[1], landings[2]]);
      setPhase("lock-3");
    }
  }, [phase, landings]);

  const getMatchCount = () => {
    const tiers = lockedResults.filter(Boolean).map((r) => r!.tier);
    if (tiers.length < 3) return 0;
    if (tiers[0] === tiers[1] && tiers[1] === tiers[2]) return 3;
    if (tiers[0] === tiers[1] || tiers[1] === tiers[2] || tiers[0] === tiers[2]) return 2;
    return 1;
  };

  const isSpinPhase = phase === "spin-1" || phase === "spin-2" || phase === "spin-3";
  const showSpinners = phase !== "announce";
  const matchCount = getMatchCount();

  // Determine which spinners are active/locked
  const spinnerStates = [
    {
      isActive: phase === "spin-1",
      isLocked: lockedResults[0] !== null,
      lockedResult: lockedResults[0]
    },
    {
      isActive: phase === "spin-2",
      isLocked: lockedResults[1] !== null,
      lockedResult: lockedResults[1]
    },
    {
      isActive: phase === "spin-3",
      isLocked: lockedResults[2] !== null,
      lockedResult: lockedResults[2]
    }
  ];

  // Electric arcs between matching adjacent locked spinners
  const arcs: { from: number; to: number; color: string }[] = [];
  if (lockedResults[0] && lockedResults[1] && lockedResults[0].tier === lockedResults[1].tier) {
    arcs.push({ from: 0, to: 1, color: lockedResults[0].color });
  }
  if (lockedResults[1] && lockedResults[2] && lockedResults[1].tier === lockedResults[2].tier) {
    arcs.push({ from: 1, to: 2, color: lockedResults[1].color });
  }

  // LOCK button styling based on escalation
  const lockButtonColor = ESCALATION_COLORS[Math.min(escalation, 2)];

  return (
    <motion.div
      key="vault-lock-bonus"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      className={`flex flex-col items-center justify-center w-full max-w-[96rem] px-2 sm:px-4 lg:px-8 ${phase === "evaluate" && matchCount === 3 ? "animate-edge-lightning" : ""}`}
    >
      {/* Announce phase */}
      {phase === "announce" && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center relative"
        >
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.5 }}
            style={{ backgroundColor: prestigeTheme.primary }}
          />
          <h2
            className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter italic text-white"
            style={{ textShadow: `0 0 30px ${prestigeTheme.secondary}` }}
          >
            Bonus Round!
          </h2>
          <p className="text-text-muted uppercase tracking-[0.35em] sm:tracking-[0.5em] text-[10px] sm:text-xs mt-2">
            Vault Lock
          </p>
        </motion.div>
      )}

      {/* Spinners */}
      {showSpinners && (
        <div className="flex flex-col items-center gap-6 sm:gap-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.28em] text-text-dim mb-1">
              Vault Lock
            </p>
            <h3 className="text-base sm:text-lg md:text-xl font-black uppercase tracking-wider text-white">
              Match 3 to Win Free Spins
            </h3>
          </motion.div>

          {/* 3 spinners side by side */}
          <div className="relative flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
            {strips.map((strip, i) => (
              <VaultLockSpinner
                key={i}
                strip={strip}
                isActive={spinnerStates[i].isActive}
                isLocked={spinnerStates[i].isLocked}
                lockedResult={spinnerStates[i].lockedResult}
                escalation={escalation}
                spinnerIndex={i}
              />
            ))}

            {/* Electric arcs */}
            {arcs.map((arc, i) => (
              <ElectricArc key={i} color={arc.color} fromIndex={arc.from} toIndex={arc.to} />
            ))}
          </div>

          {/* LOCK button */}
          {isSpinPhase && (
            <motion.button
              key={`lock-${phase}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: escalation >= 2
                  ? prefersReducedMotion ? 1 : [1, 1.05, 1]
                  : 1
              }}
              transition={
                escalation >= 2
                  ? { scale: { duration: 0.6, repeat: Infinity } }
                  : { type: "spring", damping: 15 }
              }
              onClick={handleLock}
              className="px-10 sm:px-14 py-3 sm:py-4 rounded-2xl text-sm sm:text-base font-black uppercase tracking-[0.25em] border-2 transition-all cursor-pointer"
              style={{
                borderColor: `${lockButtonColor}70`,
                color: lockButtonColor,
                backgroundColor: `${lockButtonColor}15`,
                boxShadow: `0 0 ${(escalation + 1) * 12}px ${lockButtonColor}30`
              }}
            >
              Lock
            </motion.button>
          )}

          {/* Evaluate phase */}
          <AnimatePresence>
            {phase === "evaluate" && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="text-center mt-4"
              >
                {matchCount === 3 ? (
                  <div className="relative">
                    {/* Confetti for jackpot */}
                    <JackpotConfetti color={lockedResults[0]!.color} />
                    <motion.h3
                      className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter italic"
                      style={{
                        color: lockedResults[0]!.color,
                        textShadow: `0 0 40px ${lockedResults[0]!.color}`,
                        filter: `drop-shadow(0 0 30px ${lockedResults[0]!.color})`
                      }}
                      animate={prefersReducedMotion ? undefined : { scale: [1, 1.05, 1] }}
                      transition={prefersReducedMotion ? undefined : { duration: 1, repeat: Infinity }}
                    >
                      Jackpot!
                    </motion.h3>
                    <p className="text-lg sm:text-xl font-black text-white mt-3">
                      <span style={{ color: lockedResults[0]!.color }}>
                        +{FREE_SPIN_REWARDS[lockedResults[0]!.tier]}
                      </span>{" "}
                      Free Spin{FREE_SPIN_REWARDS[lockedResults[0]!.tier] > 1 ? "s" : ""}!
                    </p>
                    <p className="text-[10px] text-text-dim uppercase tracking-[0.3em] mt-1">
                      3x {lockedResults[0]!.tier} Match
                    </p>
                  </div>
                ) : matchCount === 2 ? (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-5 rounded-3xl">
                    <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-vault-gold">
                      So Close!
                    </h3>
                    <p className="text-xs text-text-dim mt-2 uppercase tracking-[0.3em]">
                      2 of 3 matched
                    </p>
                  </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-5 rounded-3xl">
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-text-muted">
                      No Match
                    </h3>
                    <p className="text-xs text-text-dim mt-2 uppercase tracking-[0.3em]">
                      Better luck next time
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

function JackpotConfetti({ color }: { color: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 600,
        color: Math.random() > 0.4 ? color : Math.random() > 0.5 ? "#ffffff" : "#ffd700",
        scale: Math.random() * 0.8 + 0.2
      })),
    [color]
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
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}
