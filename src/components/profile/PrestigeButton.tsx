import { motion } from "motion/react";

const PRESTIGE_GRADIENT: Record<number, string> = {
  1: "linear-gradient(90deg, #ff8c00 0%, #ffd700 50%, #ff8c00 100%)",
  2: "linear-gradient(90deg, #9945ff 0%, #c77dff 50%, #9945ff 100%)",
  3: "linear-gradient(90deg, #ff2d95 0%, #00e5ff 50%, #ff2d95 100%)"
};

interface PrestigeButtonProps {
  nextPrestigeLevel: number;
  onClick: () => void;
  disabled?: boolean;
  currentLevel?: number;
}

export function PrestigeButton({
  nextPrestigeLevel,
  onClick,
  disabled = false,
  currentLevel = 0
}: PrestigeButtonProps) {
  const gradient = disabled
    ? "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(11,16,24,0.98) 100%)"
    : (PRESTIGE_GRADIENT[nextPrestigeLevel] ?? PRESTIGE_GRADIENT[1]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4"
      whileHover={disabled ? {} : { y: -2 }}
      whileTap={disabled ? {} : { y: 0 }}
    >
      <div className="system-shell px-4 py-4 sm:px-5 sm:py-5">
        <div className="relative z-10">
          <p className="system-kicker mb-3 text-center">Prestige Protocol</p>
          <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`command-button w-full px-5 py-4 text-sm font-black uppercase tracking-[0.2em] ${disabled ? "pointer-events-none opacity-40" : ""}`}
            style={{
              background: gradient,
            }}
            data-variant={disabled ? "neutral" : undefined}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
              className="shrink-0"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="leading-none flex-1 text-center">
              Rank Up {nextPrestigeLevel}
            </span>
          </button>
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] text-text-muted">
        {disabled
          ? `Reach Level 10 to rank up (currently Level ${currentLevel})`
          : "Reset XP, improve vault odds, unlock new theme"}
      </p>
    </motion.div>
  );
}
