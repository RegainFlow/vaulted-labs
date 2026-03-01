import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FunkoImage } from "../shared/FunkoImage";
import { trackEvent, AnalyticsEvents } from "../../lib/analytics";

interface LegendaryHypeOverlayProps {
  funkoName: string;
  value: number;
  onDismiss: () => void;
}

const seededUnit = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export function LegendaryHypeOverlay({ funkoName, value, onDismiss }: LegendaryHypeOverlayProps) {
  const prefersReducedMotion = useReducedMotion();

  const particles = useMemo(() => {
    if (prefersReducedMotion) return [];
    const nameSeed = funkoName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: (seededUnit(nameSeed + i * 17.3 + 1) - 0.5) * 300,
      startY: seededUnit(nameSeed + i * 17.3 + 2) * 200 + 100,
      endY: -((seededUnit(nameSeed + i * 17.3 + 3) * 400) + 200),
      delay: seededUnit(nameSeed + i * 17.3 + 4) * 2,
      duration: 3 + seededUnit(nameSeed + i * 17.3 + 5) * 2,
      size: seededUnit(nameSeed + i * 17.3 + 6) * 4 + 2,
      color: seededUnit(nameSeed + i * 17.3 + 7) > 0.5
        ? "#FFD700"
        : seededUnit(nameSeed + i * 17.3 + 8) > 0.5
          ? "#ffffff"
          : "#ff8c00"
    }));
  }, [funkoName, prefersReducedMotion]);

  const handleShare = () => {
    trackEvent(AnalyticsEvents.CTA_CLICK, {
      cta_name: "legendary_share",
      funko_name: funkoName,
      value
    });

    // Copy share text to clipboard
    const shareText = `I just acquired a LEGENDARY ${funkoName} worth $${value} on VaultedLabs!`;
    navigator.clipboard?.writeText(shareText).catch(() => {});
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[55] bg-black/90 backdrop-blur-xl flex items-center justify-center px-4"
    >
      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: `calc(50% + ${p.x}px)`
          }}
          initial={{ y: p.startY, opacity: 0 }}
          animate={{
            y: [p.startY, p.endY],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="relative flex flex-col items-center text-center max-w-sm z-10"
      >
        {/* Heading */}
        <motion.h2
          className="text-5xl sm:text-6xl font-black uppercase tracking-tighter text-rarity-legendary animate-legendary-breathe mb-6"
          style={{
            textShadow: "0 0 40px rgba(255,215,0,0.6), 0 0 80px rgba(255,215,0,0.3)"
          }}
          animate={prefersReducedMotion ? undefined : { scale: [1, 1.02, 1] }}
          transition={prefersReducedMotion ? undefined : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          LEGENDARY!
        </motion.h2>

        {/* Item display */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FunkoImage
            name={funkoName}
            rarity="legendary"
            size="lg"
            className="!w-36 !h-36 sm:!w-40 sm:!h-40"
          />
        </motion.div>

        {/* Item info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4"
        >
          <p className="text-xl font-black text-white uppercase tracking-wider">
            {funkoName}
          </p>
          <p className="text-lg font-mono font-bold text-rarity-legendary mt-1">
            ${value}.00
          </p>
        </motion.div>

        {/* Share button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={handleShare}
          className="mt-8 px-8 py-3 rounded-xl bg-rarity-legendary/15 border-2 border-rarity-legendary/50 text-rarity-legendary text-sm font-black uppercase tracking-widest hover:bg-rarity-legendary/25 transition-all cursor-pointer"
          style={{ boxShadow: "0 0 30px rgba(255,215,0,0.2)" }}
        >
          Share Acquisition
        </motion.button>

        {/* Continue link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={onDismiss}
          className="mt-4 text-xs text-text-dim hover:text-text-muted uppercase tracking-widest transition-colors cursor-pointer"
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
