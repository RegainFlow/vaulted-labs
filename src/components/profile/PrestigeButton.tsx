import { motion } from "motion/react";

const PRESTIGE_GRADIENT: Record<number, string> = {
  1: "from-[#ff8c00] via-[#ffd700] to-[#ff8c00]",
  2: "from-[#9945ff] via-[#c77dff] to-[#9945ff]",
  3: "from-[#ff2d95] via-[#00e5ff] to-[#ff2d95]"
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
    ? "from-[#3a3a3a] via-[#555] to-[#3a3a3a]"
    : (PRESTIGE_GRADIENT[nextPrestigeLevel] ?? PRESTIGE_GRADIENT[1]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4"
      whileHover={disabled ? {} : { y: -2 }}
      whileTap={disabled ? {} : { y: 0 }}
    >
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`pushable w-full group ${disabled ? "opacity-40 pointer-events-none" : ""}`}
      >
        <span className="pushable-shadow" />
        <span
          className="pushable-edge"
          style={{
            background: `linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.1) 8%, rgba(0,0,0,0.1) 92%, rgba(0,0,0,0.3) 100%)`
          }}
        />
        <span
          className={`pushable-front w-full bg-gradient-to-r ${gradient} ${disabled ? "" : "animate-gradient"} bg-300% !flex items-center gap-2 !py-4 sm:!py-5`}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
            className="shrink-0"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="leading-none flex-1 text-center">
            Prestige {nextPrestigeLevel}
          </span>
        </span>
      </button>
      <p className="text-[10px] text-text-muted text-center mt-2">
        {disabled
          ? `Reach Level 10 to prestige (currently Level ${currentLevel})`
          : "Reset XP to 0, improve vault odds, unlock new color scheme"}
      </p>
    </motion.div>
  );
}
