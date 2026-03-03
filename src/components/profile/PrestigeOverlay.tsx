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

function BenefitModule({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-black/20 px-4 py-4 text-left">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-text-dim">
        {label}
      </p>
      <p className={`mt-2 text-sm font-black uppercase tracking-[0.08em] ${tone}`}>
        {value}
      </p>
    </div>
  );
}

export function PrestigeOverlay({
  prestigeLevel,
  onClose,
}: PrestigeOverlayProps) {
  useOverlayScrollLock(true);
  const prefersReducedMotion = useReducedMotion();
  const theme = RANK_THEMES[prestigeLevel] ?? RANK_THEMES[1];
  const oddsShift = getPrestigeShiftBreakdown(prestigeLevel);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-bg/92 px-4 backdrop-blur-xl"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={
          prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 24, scale: 0.98 }
        }
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        exit={
          prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 16, scale: 0.98 }
        }
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="system-shell-strong relative w-full max-w-3xl overflow-hidden rounded-[30px] px-6 py-7 sm:px-8 sm:py-8"
        style={{
          boxShadow: `0 28px 90px rgba(0,0,0,0.46), 0 0 48px ${theme.primary}1e`,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(circle at 50% 18%, ${theme.primary}22 0%, transparent 42%), radial-gradient(circle at 50% 100%, ${theme.secondary}18 0%, transparent 48%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-10 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
          }}
        />

        <div className="relative z-10 text-center">
          <p className="system-kicker mb-4 text-white/55">Rank Up Complete</p>

          <div className="mx-auto flex w-fit items-center gap-4 rounded-[24px] border border-white/8 bg-black/18 px-5 py-4">
            <PrestigeShieldIcon level={(prestigeLevel as 1 | 2 | 3) || 1} size={52} />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-text-dim">
                New Rank
              </p>
              <h2
                className="mt-1 text-3xl font-black uppercase tracking-[0.08em] sm:text-4xl"
                style={{ color: theme.primary }}
              >
                Rank {prestigeLevel}
              </h2>
              <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.18em] text-white/70">
                {theme.title} boost online
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <BenefitModule
              label="Vault Odds Bonus"
              value={`Common ${oddsShift.common}% | Uncommon +${oddsShift.uncommon}% | Rare +${oddsShift.rare}% | Legendary +${oddsShift.legendary}%`}
              tone="text-accent"
            />
            <BenefitModule
              label="Theme Updated"
              value={theme.themeLabel}
              tone="text-white"
            />
          </div>

          <p className="mt-5 text-xs leading-relaxed text-text-muted sm:text-sm">
            Your level has reset, but your shards, energy, and vault odds bonus stay with you.
          </p>

          <div className="mt-6 flex justify-center">
            <ArcadeButton
              onClick={onClose}
              tone="accent"
              size="primary"
              fillMode="center"
              className="min-w-[220px]"
            >
              Continue
            </ArcadeButton>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
