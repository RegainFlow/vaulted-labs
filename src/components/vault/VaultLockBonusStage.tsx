import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { generateVaultLockStrip, pickVaultLockLanding } from "../../data/vaults";
import { playSfx } from "../../lib/audio";
import { OPEN_TUTORIAL_BONUS_JACKPOT_EVENT } from "../../lib/tutorial-events";
import { JACKPOT_CELEBRATION } from "../../lib/motion-presets";
import { SHARD_REWARDS, type VaultLockBonusStageProps, type VaultLockPhase, type VaultLockSlot } from "../../types/bonus";
import type { VaultTierName } from "../../types/vault";
import { ArcadeButton } from "../shared/ArcadeButton";

const PRESTIGE_THEMES: Record<number, { primary: string; secondary: string }> = {
  0: { primary: "#ff2d95", secondary: "#79b5db" },
  1: { primary: "#ff8c00", secondary: "#ffd700" },
  2: { primary: "#9945ff", secondary: "#c77dff" },
  3: { primary: "#ff2d95", secondary: "#b9f2ff" },
};

const ACTIVE_SPIN_DURATIONS = [1.6, 1.35, 1.15];
const LOCK_LAND_DURATIONS = [0.85, 0.9, 0.98];
const CENTER_LOCK_COLOR = "#ff2d95";

interface SpinnerResult {
  tier: VaultTierName;
  color: string;
  imagePath: string;
  index: number;
}

interface BurstParticle {
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

interface VaultLockSpinnerProps {
  strip: VaultLockSlot[];
  isActive: boolean;
  isLocked: boolean;
  lockedResult: SpinnerResult | null;
  escalation: number;
  spinnerIndex: number;
}

function BonusSlotCard({
  slot,
  isLanded,
  slotHeight,
}: {
  slot: VaultLockSlot;
  isLanded: boolean;
  slotHeight: number;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center px-2 sm:px-3"
      style={{ height: `${slotHeight}px` }}
    >
      <motion.div
        animate={isLanded ? { scale: [1, 1.04, 1.01], y: [0, -3, 0] } : undefined}
        transition={isLanded ? { duration: 0.34, ease: "easeOut" } : undefined}
        className="flex w-full items-center justify-center"
      >
        <div
          className="relative flex aspect-square w-[74%] max-w-[142px] items-center justify-center"
          style={{
            boxShadow: isLanded
              ? `drop-shadow(0 0 28px ${slot.color}28)`
              : `drop-shadow(0 0 14px ${slot.color}18)`,
          }}
        >
          <img
            src={slot.imagePath}
            alt={`${slot.tier} bonus tier`}
            draggable={false}
            className="h-full w-full object-contain"
          />
          <div
            className="pointer-events-none absolute inset-[14%]"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${slot.color}16 0%, transparent 66%)`,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

function CenterLockFrame({
  active,
  locked,
  lockedColor,
  slotHeight,
}: {
  active: boolean;
  locked: boolean;
  lockedColor?: string;
  slotHeight: number;
}) {
  const frameColor = locked && lockedColor ? lockedColor : CENTER_LOCK_COLOR;
  const bracketLength = slotHeight < 140 ? 24 : 28;
  const bracketOffset = slotHeight < 140 ? 7 : 9;
  const bracketThickness = 3;
  const frameHeight = slotHeight < 140 ? 98 : 116;
  const frameWidth = slotHeight < 140 ? 98 : 116;

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
        filter: active || locked ? `drop-shadow(0 0 12px ${frameColor})` : "none",
      }}
    >
      <div
        className="absolute inset-[10px] rounded-full"
        style={{
          boxShadow:
            active || locked
              ? `0 0 18px ${frameColor}18, inset 0 0 14px ${frameColor}10`
              : "none",
        }}
      />
      {[
        {
          position: "left-0 top-0",
          horizontal: "left-0 top-0",
          vertical: "left-0 top-0",
          transform: `translate(-${bracketOffset}px, -${bracketOffset}px)`,
        },
        {
          position: "right-0 top-0",
          horizontal: "right-0 top-0",
          vertical: "right-0 top-0",
          transform: `translate(${bracketOffset}px, -${bracketOffset}px)`,
        },
        {
          position: "left-0 bottom-0",
          horizontal: "left-0 bottom-0",
          vertical: "left-0 bottom-0",
          transform: `translate(-${bracketOffset}px, ${bracketOffset}px)`,
        },
        {
          position: "right-0 bottom-0",
          horizontal: "right-0 bottom-0",
          vertical: "right-0 bottom-0",
          transform: `translate(${bracketOffset}px, ${bracketOffset}px)`,
        },
      ].map((position, index) => (
        <span
          key={index}
          className={`absolute ${position.position}`}
          style={{
            width: `${bracketLength}px`,
            height: `${bracketLength}px`,
            opacity: active || locked ? 1 : 0.5,
            transform: position.transform,
          }}
        >
          <span
            className={`absolute ${position.horizontal}`}
            style={{
              width: `${bracketLength}px`,
              height: `${bracketThickness}px`,
              backgroundColor: frameColor,
              boxShadow: `0 0 12px ${frameColor}`,
            }}
          />
          <span
            className={`absolute ${position.vertical}`}
            style={{
              width: `${bracketThickness}px`,
              height: `${bracketLength}px`,
              backgroundColor: frameColor,
              boxShadow: `0 0 12px ${frameColor}`,
            }}
          />
        </span>
      ))}
    </div>
  );
}

function VaultLockSpinnerInner({
  strip,
  isActive,
  isLocked,
  lockedResult,
  escalation,
  spinnerIndex,
}: VaultLockSpinnerProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const slotHeight = isMobile ? 132 : 156;
  const visibleSlots = 3;
  const reelHeight = slotHeight * visibleSlots;
  const loopDistance = strip.length * slotHeight;
  const displayStrip = [...strip, ...strip, ...strip];
  const landedIndex = lockedResult ? strip.length + lockedResult.index : strip.length + 1;
  const landedOffset = reelHeight / 2 - (landedIndex + 0.5) * slotHeight;
  const accentColor = isLocked && lockedResult ? lockedResult.color : CENTER_LOCK_COLOR;
  const rootBorder = isLocked
    ? `${accentColor}40`
    : isActive
      ? `${CENTER_LOCK_COLOR}36`
      : "rgba(255,255,255,0.09)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: spinnerIndex * 0.09, type: "spring", damping: 20, stiffness: 160 }}
      className="relative overflow-hidden rounded-[32px] border p-3"
      style={{
        width: isMobile ? "clamp(148px, 29vw, 180px)" : "clamp(180px, 24vw, 220px)",
        borderColor: rootBorder,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(10,16,24,0.96) 16%, rgba(7,11,18,0.98) 100%)",
        boxShadow: isLocked
          ? `0 24px 40px rgba(0,0,0,0.3), 0 0 26px ${accentColor}20`
          : isActive
            ? "0 22px 38px rgba(0,0,0,0.28), 0 0 22px rgba(255,45,149,0.16)"
            : "0 18px 28px rgba(0,0,0,0.2)",
        opacity: !isActive && !isLocked ? 0.84 : 1,
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${accentColor} 50%, transparent 100%)`,
          opacity: isActive || isLocked ? 0.9 : 0.35,
        }}
      />
      <p className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.22em] text-white/42">
        Channel {spinnerIndex + 1}
      </p>

      <div
        className="relative overflow-hidden rounded-[26px] border border-white/6 bg-black/12"
        style={{ height: `${reelHeight}px` }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-bg via-bg/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-bg via-bg/80 to-transparent" />
        <CenterLockFrame
          active={isActive}
          locked={isLocked}
          lockedColor={lockedResult?.color}
          slotHeight={slotHeight}
        />

        <motion.div
          className="relative z-10 flex flex-col"
          animate={
            isLocked && lockedResult
              ? { y: landedOffset }
              : isActive && !prefersReducedMotion
                ? { y: [0, -loopDistance] }
                : isActive
                  ? { y: landedOffset }
                  : { y: 0 }
          }
          transition={
            isLocked
              ? {
                  duration: LOCK_LAND_DURATIONS[Math.min(spinnerIndex, LOCK_LAND_DURATIONS.length - 1)],
                  ease: [0.12, 0.84, 0.18, 1],
                }
              : isActive && !prefersReducedMotion
                ? {
                    duration: ACTIVE_SPIN_DURATIONS[Math.min(escalation, ACTIVE_SPIN_DURATIONS.length - 1)],
                    repeat: Infinity,
                    ease: "linear",
                  }
                : isActive
                  ? { duration: 0.5, ease: "easeOut" }
                  : undefined
          }
        >
          {displayStrip.map((slot, index) => (
            <BonusSlotCard
              key={`${slot.tier}-${index}`}
              slot={slot}
              slotHeight={slotHeight}
              isLanded={isLocked && index === landedIndex}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

const VaultLockSpinner = memo(VaultLockSpinnerInner);

function ChannelBridge({ color, fromIndex }: { color: string; fromIndex: number }) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: prefersReducedMotion ? 0.78 : [0.45, 0.82, 0.45] }}
      transition={
        prefersReducedMotion
          ? undefined
          : { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
      }
      className="pointer-events-none absolute top-1/2 z-20 -translate-y-1/2"
      style={{
        left: `${(fromIndex + 1) * 33.333 - (isMobile ? 4.1 : 4.35)}%`,
        width: isMobile ? "8.2%" : "7.8%",
        height: isMobile ? "24px" : "28px",
      }}
    >
      <div
        className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color} 18%, ${color} 82%, transparent 100%)`,
          boxShadow: `0 0 10px ${color}`,
          opacity: 0.85,
        }}
      />
      <div
        className="absolute left-[10%] right-[10%] top-1/2 h-[7px] -translate-y-1/2 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${color}22 16%, ${color}22 84%, transparent 100%)`,
        }}
      />
      <div
        className="absolute left-[8%] top-1/2 h-[10px] w-[2px] -translate-y-1/2 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
      />
      <div
        className="absolute right-[8%] top-1/2 h-[10px] w-[2px] -translate-y-1/2 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
      />
      {!prefersReducedMotion ? (
        <motion.div
          className="absolute top-1/2 h-[8px] w-[8px] -translate-y-1/2 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 14px ${color}`,
          }}
          animate={{ x: ["12%", "78%", "12%"], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
    </motion.div>
  );
}

export function VaultLockBonusStage({
  purchasedTierName,
  prestigeLevel = 0,
  onComplete,
  forcedLandings,
  resolvedChannels,
}: VaultLockBonusStageProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<VaultLockPhase>("announce");
  const [lockedResults, setLockedResults] = useState<(SpinnerResult | null)[]>([null, null, null]);
  const [escalation, setEscalation] = useState(0);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const prestigeTheme =
    PRESTIGE_THEMES[prestigeLevel as keyof typeof PRESTIGE_THEMES] || PRESTIGE_THEMES[0];

  const strips = useMemo(
    () => [
      generateVaultLockStrip(purchasedTierName),
      generateVaultLockStrip(purchasedTierName),
      generateVaultLockStrip(purchasedTierName),
    ],
    [purchasedTierName]
  );

  const landings = useMemo(() => {
    if (resolvedChannels?.length === 3) {
      return resolvedChannels.map((slot, index) => ({
        tier: slot.tier,
        color: slot.color,
        imagePath: slot.imagePath,
        index:
          strips[index].findIndex((entry) => entry.tier === slot.tier) >= 0
            ? strips[index].findIndex((entry) => entry.tier === slot.tier)
            : 0,
      }));
    }

    if (forcedLandings === "jackpot") {
      return strips.map((strip) => {
        const matchIndex = strip.findIndex((slot) => slot.tier === purchasedTierName);
        const index = matchIndex >= 0 ? matchIndex : 0;
        return {
          tier: strip[index].tier,
          color: strip[index].color,
          imagePath: strip[index].imagePath,
          index,
        };
      });
    }

    return strips.map((strip) => {
      const landing = pickVaultLockLanding(strip);
      return {
        tier: landing.tier,
        color: landing.color,
        imagePath: landing.imagePath,
        index: landing.index,
      };
    });
  }, [forcedLandings, purchasedTierName, resolvedChannels, strips]);

  const clearTimers = useCallback(() => {
    for (const timer of timersRef.current) clearTimeout(timer);
    timersRef.current = [];
  }, []);

  const schedule = useCallback((action: () => void, delayMs: number) => {
    const timer = setTimeout(action, delayMs);
    timersRef.current.push(timer);
  }, []);

  const getMatchCount = useCallback(() => {
    const tiers = lockedResults.filter(Boolean).map((entry) => entry!.tier);
    if (tiers.length < 3) return 0;
    if (tiers[0] === tiers[1] && tiers[1] === tiers[2]) return 3;
    if (tiers[0] === tiers[1] || tiers[1] === tiers[2] || tiers[0] === tiers[2]) return 2;
    return 1;
  }, [lockedResults]);

  useEffect(() => {
    if (phase === "announce") {
      schedule(() => setPhase("materialize"), 1700);
    } else if (phase === "materialize") {
      schedule(() => setPhase("spin-1"), 1000);
    } else if (phase === "lock-1") {
      schedule(() => {
        setEscalation(1);
        setPhase("spin-2");
      }, 1250);
    } else if (phase === "lock-2") {
      const firstTwoMatch = landings[0].tier === landings[1].tier;
      if (!firstTwoMatch) {
        schedule(() => setPhase("evaluate"), 1250);
      } else {
        schedule(() => {
          setEscalation(2);
          setPhase("spin-3");
        }, 1250);
      }
    } else if (phase === "lock-3") {
      schedule(() => setPhase("evaluate"), 800);
    } else if (phase === "evaluate") {
      const matchCount = getMatchCount();
      if (matchCount === 3) {
        window.dispatchEvent(new Event(OPEN_TUTORIAL_BONUS_JACKPOT_EVENT));
      }
      schedule(() => setPhase("done"), matchCount === 3 ? 3200 : 2200);
    } else if (phase === "done") {
      schedule(() => {
        const matchCount = getMatchCount();
        let shardsWon = 0;
        if (matchCount === 3 && lockedResults[0]) {
          shardsWon = SHARD_REWARDS[lockedResults[0].tier];
        }
        onComplete(shardsWon);
      }, 400);
    }

    return () => clearTimers();
  }, [clearTimers, getMatchCount, landings, lockedResults, onComplete, phase, schedule]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const handleLock = useCallback(() => {
    playSfx("bonus_round_tick");
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
  }, [landings, phase]);

  const isSpinPhase = phase === "spin-1" || phase === "spin-2" || phase === "spin-3";
  const showSpinners = phase !== "announce";
  const matchCount = getMatchCount();

  const spinnerStates = [
    {
      isActive: phase === "spin-1",
      isLocked: lockedResults[0] !== null,
      lockedResult: lockedResults[0],
    },
    {
      isActive: phase === "spin-2",
      isLocked: lockedResults[1] !== null,
      lockedResult: lockedResults[1],
    },
    {
      isActive: phase === "spin-3",
      isLocked: lockedResults[2] !== null,
      lockedResult: lockedResults[2],
    },
  ];

  const arcs: { from: number; color: string }[] = [];
  if (lockedResults[0] && lockedResults[1] && lockedResults[0].tier === lockedResults[1].tier) {
    arcs.push({ from: 0, color: lockedResults[0].color });
  }
  if (lockedResults[1] && lockedResults[2] && lockedResults[1].tier === lockedResults[2].tier) {
    arcs.push({ from: 1, color: lockedResults[1].color });
  }

  const activeMessage =
    phase === "materialize"
      ? "Bonus channels online."
      : phase === "spin-1"
        ? "Lock the first channel."
        : phase === "spin-2"
          ? "Lock the second channel."
          : phase === "spin-3"
            ? "Final channel. Lock it in."
            : phase === "evaluate"
              ? "Resolving bonus outcome."
              : "Match 3 channels to win shards.";

  return (
    <motion.div
      key="vault-lock-bonus"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
      className={`flex w-full max-w-[98rem] flex-col items-center justify-center px-2 sm:px-4 lg:px-8 ${
        phase === "evaluate" && matchCount === 3 ? "animate-jackpot-radial-pulse" : ""
      }`}
    >
      {phase === "announce" && (
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="system-shell relative w-full max-w-4xl px-8 py-10 text-center sm:px-10 sm:py-12"
        >
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[30px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.7 }}
            style={{
              background: `radial-gradient(circle at 50% 50%, ${prestigeTheme.primary}26 0%, transparent 62%)`,
            }}
          />
          <p className="text-[10px] font-black uppercase tracking-[0.38em] text-accent">
            Bonus Lock
          </p>
          <h2
            className="mt-3 text-4xl font-black uppercase tracking-[0.06em] text-white sm:text-6xl md:text-7xl"
            style={{ textShadow: `0 0 30px ${prestigeTheme.secondary}35` }}
          >
            3 Channels
          </h2>
          <p className="mt-4 text-sm uppercase tracking-[0.28em] text-text-muted sm:text-base">
            Match tiers. Win shards.
          </p>
        </motion.div>
      )}

      {showSpinners && (
        <div className="system-shell relative flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 md:px-8 md:py-10">
          <div
            className="pointer-events-none absolute inset-x-12 top-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,45,149,0.6) 50%, transparent 100%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
              Bonus Lock
            </p>
            <h3 className="mt-2 text-xl font-black uppercase tracking-[0.08em] text-white sm:text-2xl md:text-3xl">
              Match 3 Channels to Win Shards
            </h3>
            <p className="mt-2 text-[11px] font-mono uppercase tracking-[0.24em] text-text-muted sm:text-xs">
              {activeMessage}
            </p>
          </motion.div>

          <div
            data-tutorial="bonus-round"
            className="relative flex w-full items-center justify-center gap-2 sm:gap-4 md:gap-6"
          >
            {strips.map((strip, index) => (
              <VaultLockSpinner
                key={index}
                strip={strip}
                isActive={spinnerStates[index].isActive}
                isLocked={spinnerStates[index].isLocked}
                lockedResult={spinnerStates[index].lockedResult}
                escalation={escalation}
                spinnerIndex={index}
              />
            ))}

            {arcs.map((arc) => (
              <ChannelBridge key={`bridge-${arc.from}`} color={arc.color} fromIndex={arc.from} />
            ))}
          </div>

          {isSpinPhase && (
            <motion.div
              key={`lock-${phase}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{
                opacity: 1,
                scale:
                  escalation >= 2 && !prefersReducedMotion
                    ? [1, 1.04, 1]
                    : 1,
              }}
              transition={
                escalation >= 2 && !prefersReducedMotion
                  ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                  : { type: "spring", damping: 18, stiffness: 180 }
              }
            >
              <ArcadeButton
                tutorialId="bonus-lock"
                onClick={handleLock}
                tone="accent"
                size="primary"
                fillMode="center"
                className="min-w-[220px] sm:min-w-[300px]"
              >
                LOCK
              </ArcadeButton>
            </motion.div>
          )}

          <AnimatePresence>
            {phase === "evaluate" && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="relative w-full max-w-3xl"
              >
                {matchCount === 3 && lockedResults[0] ? (
                  <div
                    className="system-shell-strong relative overflow-hidden border px-6 py-6 text-center sm:px-8 sm:py-7"
                    style={{
                      borderColor: `${lockedResults[0].color}38`,
                      boxShadow: `0 0 34px ${lockedResults[0].color}18`,
                    }}
                  >
                    <JackpotCelebration color={lockedResults[0].color} reduced={!!prefersReducedMotion} />
                    <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.34em] text-white/60">
                      Bonus Lock
                    </p>
                    <motion.h3
                      className="relative z-10 mt-3 text-4xl font-black uppercase tracking-[0.02em] sm:text-6xl"
                      style={{
                        color: lockedResults[0].color,
                        textShadow: `0 0 30px ${lockedResults[0].color}`,
                      }}
                      initial={{ scale: 0.88, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        damping: JACKPOT_CELEBRATION.textSpring.damping,
                        stiffness: JACKPOT_CELEBRATION.textSpring.stiffness,
                      }}
                    >
                      Jackpot
                    </motion.h3>
                    <p className="relative z-10 mt-3 text-lg font-black uppercase tracking-[0.18em] text-white sm:text-2xl">
                      +{SHARD_REWARDS[lockedResults[0].tier]} Shards
                    </p>
                    <p className="relative z-10 mt-2 text-[10px] font-mono uppercase tracking-[0.28em] text-text-muted">
                      3x {lockedResults[0].tier} match
                    </p>
                  </div>
                ) : matchCount === 2 ? (
                  <div className="module-card px-6 py-6 text-center sm:px-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.34em] text-vault-gold">
                      Bonus Lock
                    </p>
                    <h3 className="mt-3 text-3xl font-black uppercase tracking-[0.06em] text-white sm:text-4xl">
                      So Close
                    </h3>
                    <p className="mt-2 text-[11px] font-mono uppercase tracking-[0.24em] text-text-muted">
                      2 channels matched
                    </p>
                  </div>
                ) : (
                  <div className="module-card px-6 py-6 text-center sm:px-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.34em] text-white/56">
                      Bonus Lock
                    </p>
                    <h3 className="mt-3 text-2xl font-black uppercase tracking-[0.08em] text-white sm:text-3xl">
                      No Match
                    </h3>
                    <p className="mt-2 text-[11px] font-mono uppercase tracking-[0.24em] text-text-muted">
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

function JackpotCelebration({ color, reduced }: { color: string; reduced: boolean }) {
  const colorSeed = useMemo(
    () => color.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0),
    [color]
  );
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const particleCount = reduced ? 0 : isMobile ? 32 : 54;

  const particles = useMemo<BurstParticle[]>(
    () =>
      Array.from({ length: particleCount }).map((_, index) => {
        const base = colorSeed + index * 17.41;
        return {
          id: index,
          x: (seededUnit(base + 1) - 0.5) * (isMobile ? 320 : 420),
          y: (seededUnit(base + 2) - 0.5) * (isMobile ? 240 : 320),
          color:
            seededUnit(base + 3) > 0.48
              ? color
              : JACKPOT_CELEBRATION.particleColors[
                  Math.floor(seededUnit(base + 4) * JACKPOT_CELEBRATION.particleColors.length)
                ],
          scale: seededUnit(base + 5) * 0.8 + 0.3,
          rotate: seededUnit(base + 6) * 540,
        };
      }),
    [color, colorSeed, isMobile, particleCount]
  );

  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
      {Array.from({ length: 2 }).map((_, index) => (
        <motion.div
          key={`shockwave-${index}`}
          className="absolute rounded-full border"
          style={{ borderColor: `${color}55`, width: 40, height: 40 }}
          initial={{ scale: 0, opacity: 0.7 }}
          animate={{ scale: isMobile ? 4 : 5, opacity: 0 }}
          transition={{ duration: 1, delay: index * 0.14, ease: "easeOut" }}
        />
      ))}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-sm"
          style={{
            width: `${Math.max(5, particle.scale * 9)}px`,
            height: `${Math.max(5, particle.scale * 9)}px`,
            backgroundColor: particle.color,
          }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{
            opacity: 0,
            x: particle.x,
            y: particle.y,
            rotate: particle.rotate,
            scale: particle.scale,
          }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
