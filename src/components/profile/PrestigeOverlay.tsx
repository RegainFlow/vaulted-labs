import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PrestigeShieldIcon } from "../../assets/prestige-icons";
import { getPrestigeShiftBreakdown } from "../../data/vaults";
import { ArcadeButton } from "../shared/ArcadeButton";
import { useOverlayScrollLock } from "../../hooks/useOverlayScrollLock";

const RANK_THEMES: Record<
  number,
  { primary: string; secondary: string; title: string; themeLabel: string }
> = {
  1: {
    primary: "#ff8c00",
    secondary: "#ffd700",
    title: "Amber",
    themeLabel: "Amber theme unlocked",
  },
  2: {
    primary: "#9945ff",
    secondary: "#c77dff",
    title: "Violet",
    themeLabel: "Violet theme unlocked",
  },
  3: {
    primary: "#ff2d95",
    secondary: "#00e5ff",
    title: "Prismatic",
    themeLabel: "Prismatic theme unlocked",
  },
};

interface PrestigeOverlayProps {
  prestigeLevel: number;
  onClose: () => void;
}

type Phase = "ignition" | "expansion" | "manifestation" | "text";

const seededUnit = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function BenefitBadge({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16, filter: "blur(8px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ delay, duration: 0.32, ease: "easeOut" }}
      className="min-w-[220px] rounded-r-xl border-l-4 bg-white/6 px-4 py-4 text-left backdrop-blur-xl"
      style={{ borderColor: color }}
    >
      <p
        className="mb-1 text-[10px] font-black uppercase tracking-[0.22em]"
        style={{ color }}
      >
        {label}
      </p>
      <p className="text-sm font-black uppercase tracking-[0.08em] text-white">
        {value}
      </p>
    </motion.div>
  );
}

export function PrestigeOverlay({
  prestigeLevel,
  onClose,
}: PrestigeOverlayProps) {
  useOverlayScrollLock(true);
  const prefersReducedMotion = useReducedMotion();
  const displayPrestigeLevel = Math.min(Math.max(prestigeLevel, 1), 3);
  const theme = RANK_THEMES[displayPrestigeLevel] ?? RANK_THEMES[1];
  const oddsShift = getPrestigeShiftBreakdown(displayPrestigeLevel);
  const [phase, setPhase] = useState<Phase>(
    prefersReducedMotion ? "text" : "ignition"
  );
  const isDismissible = prefersReducedMotion || phase === "text";

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timers = [
      window.setTimeout(() => setPhase("expansion"), 400),
      window.setTimeout(() => setPhase("manifestation"), 1000),
      window.setTimeout(() => setPhase("text"), 1800),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [prefersReducedMotion]);

  const particles = useMemo(
    () =>
      Array.from({ length: 150 }).map((_, index) => ({
        id: index,
        angle:
          seededUnit(displayPrestigeLevel * 1000 + index * 17 + 1) *
          Math.PI *
          2,
        radius:
          100 +
          seededUnit(displayPrestigeLevel * 1000 + index * 17 + 2) * 600,
        color:
          seededUnit(displayPrestigeLevel * 1000 + index * 17 + 3) > 0.5
            ? theme.primary
            : theme.secondary,
        scale:
          seededUnit(displayPrestigeLevel * 1000 + index * 17 + 4) * 0.8 +
          0.2,
        speed:
          0.5 +
          seededUnit(displayPrestigeLevel * 1000 + index * 17 + 5) * 1.5,
        delay:
          seededUnit(displayPrestigeLevel * 1000 + index * 17 + 6) * 2,
      })),
    [displayPrestigeLevel, theme.primary, theme.secondary]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "brightness(2) blur(20px)" }}
      className={`fixed inset-0 z-[220] flex items-center justify-center bg-bg/95 px-4 backdrop-blur-2xl ${
        isDismissible ? "cursor-pointer" : "cursor-default"
      }`}
      onClick={(event) => {
        if (isDismissible && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {phase === "ignition" && (
        <motion.div
          className="h-1 w-1 rounded-full bg-white shadow-[0_0_50px_#fff]"
          initial={{ scale: 0 }}
          animate={
            prefersReducedMotion
              ? { scale: [0, 18, 0] }
              : { scale: [0, 32, 0] }
          }
          transition={{ duration: 0.4 }}
        />
      )}

      {(phase === "expansion" ||
        phase === "manifestation" ||
        phase === "text") && (
        <>
          <motion.div
            className="absolute rounded-full border"
            style={{ borderColor: theme.primary }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 2000, height: 2000, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.div
            className="absolute rounded-full border"
            style={{ borderColor: theme.secondary }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 1500, height: 1500, opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeOut", delay: 0.1 }}
          />
        </>
      )}

      {(phase === "manifestation" || phase === "text") && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: particle.color,
                boxShadow: `0 0 10px ${particle.color}`,
              }}
              initial={{
                x: Math.cos(particle.angle) * particle.radius,
                y: Math.sin(particle.angle) * particle.radius,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x: 0,
                y: 0,
                opacity: [0, 1, 0],
                scale: particle.scale,
              }}
              transition={{
                duration: prefersReducedMotion ? 1.2 : 2 / particle.speed,
                ease: "easeOut",
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      )}

      {phase === "text" && (
        <motion.div
          className="relative z-10 px-4 text-center"
          initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ type: "spring", damping: 15 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 text-xs font-black uppercase tracking-[0.8em] text-white/40"
          >
            Prestige Complete
          </motion.div>

          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.82, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", damping: 16 }}
          >
            <div
              className="rounded-[32px] border border-white/10 bg-black/22 p-5 shadow-[0_0_40px_rgba(255,255,255,0.08)]"
              style={{
                boxShadow: `0 0 40px ${theme.primary}28, inset 0 1px 0 rgba(255,255,255,0.08)`,
              }}
            >
              <PrestigeShieldIcon
                level={displayPrestigeLevel as 1 | 2 | 3}
                size={68}
              />
            </div>
          </motion.div>

          <motion.h1
            className="mb-3 text-5xl font-black uppercase tracking-tighter text-white italic sm:text-7xl md:text-8xl"
            style={{
              textShadow: `0 0 30px ${theme.primary}, 0 0 60px ${theme.primary}80`,
            }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, type: "spring", damping: 14 }}
          >
            Prestige {displayPrestigeLevel}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.72 }}
            className="text-[11px] font-mono uppercase tracking-[0.28em] text-white/68 sm:text-xs"
          >
            {theme.title} boost online
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.82 }}
          >
            <BenefitBadge
              label="Permanent Odds"
              value={`Common ${oddsShift.common}% | Uncommon +${oddsShift.uncommon}% | Rare +${oddsShift.rare}% | Legendary +${oddsShift.legendary}%`}
              color={theme.primary}
              delay={0.95}
            />
            <BenefitBadge
              label="Theme Unlocked"
              value={theme.themeLabel}
              color={theme.secondary}
              delay={1.15}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35 }}
            className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed text-text-muted"
          >
            Your level reset, but your shards, energy, and prestige vault bonus
            stay with you.
          </motion.p>

          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <ArcadeButton
              onClick={onClose}
              tone="accent"
              size="primary"
              fillMode="center"
              className="min-w-[220px]"
            >
              Continue
            </ArcadeButton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.75 }}
            className="mt-6 text-[10px] uppercase tracking-[0.35em] text-text-dim"
          >
            Tap anywhere to continue
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
}
