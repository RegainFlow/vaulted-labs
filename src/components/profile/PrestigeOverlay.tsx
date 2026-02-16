import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

const PRESTIGE_COLORS: Record<number, { primary: string; secondary: string; label: string }> = {
  1: { primary: "#ff8c00", secondary: "#ffd700", label: "Gold" },
  2: { primary: "#9945ff", secondary: "#c77dff", label: "Violet" },
  3: { primary: "#ff2d95", secondary: "#00e5ff", label: "Prismatic" }
};

interface PrestigeOverlayProps {
  prestigeLevel: number;
  onClose: () => void;
}

export function PrestigeOverlay({ prestigeLevel, onClose }: PrestigeOverlayProps) {
  const [phase, setPhase] = useState<"flash" | "shockwave" | "confetti" | "text">("flash");
  const colors = PRESTIGE_COLORS[prestigeLevel] ?? PRESTIGE_COLORS[1];

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("shockwave"), 300),
      setTimeout(() => setPhase("confetti"), 800),
      setTimeout(() => setPhase("text"), 1200),
      setTimeout(() => onClose(), 5000)
    ];
    return () => timers.forEach(clearTimeout);
  }, [onClose]);

  const particles = useMemo(
    () =>
      Array.from({ length: 120 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 800,
        color: Math.random() > 0.5 ? colors.primary : colors.secondary,
        scale: Math.random() * 1.2 + 0.3,
        rotation: Math.random() * 720
      })),
    [colors]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center cursor-pointer"
      style={{ backgroundColor: "rgba(0,0,0,0.95)" }}
    >
      {/* White flash */}
      <AnimatePresence>
        {phase === "flash" && (
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Shockwave ring */}
      {(phase === "shockwave" || phase === "confetti" || phase === "text") && (
        <motion.div
          className="absolute rounded-full border-2"
          style={{ borderColor: colors.primary }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 1200, height: 1200, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      )}

      {/* Confetti */}
      {(phase === "confetti" || phase === "text") && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: p.color }}
              initial={{ opacity: 1, x: 0, y: 0, scale: 0, rotate: 0 }}
              animate={{
                opacity: 0,
                x: p.x,
                y: p.y,
                scale: p.scale,
                rotate: p.rotation
              }}
              transition={{ duration: 2.5, ease: "easeOut" }}
            />
          ))}
        </div>
      )}

      {/* Text */}
      {phase === "text" && (
        <motion.div
          className="relative z-10 text-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12 }}
        >
          <motion.h1
            className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight mb-4"
            style={{
              color: colors.primary,
              textShadow: `0 0 40px ${colors.primary}90, 0 0 80px ${colors.primary}50, 0 0 120px ${colors.primary}30`
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Prestige {prestigeLevel}
          </motion.h1>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3">
              <div
                className="px-4 py-2 rounded-xl border text-sm font-black uppercase tracking-widest"
                style={{
                  borderColor: `${colors.primary}60`,
                  backgroundColor: `${colors.primary}15`,
                  color: colors.primary
                }}
              >
                Odds Improved
              </div>
              <div
                className="px-4 py-2 rounded-xl border text-sm font-black uppercase tracking-widest"
                style={{
                  borderColor: `${colors.secondary}60`,
                  backgroundColor: `${colors.secondary}15`,
                  color: colors.secondary
                }}
              >
                New Color Scheme
              </div>
            </div>
            <p className="text-text-muted text-xs mt-4">Tap anywhere to continue</p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
