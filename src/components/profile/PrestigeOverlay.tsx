import { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

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
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<"ignition" | "expansion" | "manifestation" | "text">("ignition");
  const colors = PRESTIGE_COLORS[prestigeLevel] ?? PRESTIGE_COLORS[1];

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("expansion"), 400),
      setTimeout(() => setPhase("manifestation"), 1000),
      setTimeout(() => setPhase("text"), 1800)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 150 }).map((_, i) => ({
        id: i,
        angle: Math.random() * Math.PI * 2,
        radius: 100 + Math.random() * 600,
        color: Math.random() > 0.5 ? colors.primary : colors.secondary,
        scale: Math.random() * 0.8 + 0.2,
        speed: 0.5 + Math.random() * 1.5
      })),
    [colors]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "brightness(2) blur(20px)" }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center cursor-pointer bg-bg/95 backdrop-blur-2xl"
    >
      {/* 1. Ignition point */}
      {phase === "ignition" && (
        <motion.div 
          className="w-1 h-1 rounded-full bg-white shadow-[0_0_50px_#fff]"
          initial={{ scale: 0 }}
          animate={prefersReducedMotion ? { scale: [0, 18, 0] } : { scale: [0, 32, 0] }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* 2. Expansion rings */}
      {(phase === "expansion" || phase === "manifestation" || phase === "text") && (
        <>
          <motion.div
            className="absolute rounded-full border-[1px]"
            style={{ borderColor: colors.primary }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 2000, height: 2000, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.div
            className="absolute rounded-full border-[1px]"
            style={{ borderColor: colors.secondary }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 1500, height: 1500, opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeOut", delay: 0.1 }}
          />
        </>
      )}

      {/* 3. Magnetic Particle Field */}
      {(phase === "manifestation" || phase === "text") && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: p.color, boxShadow: `0 0 10px ${p.color}` }}
              initial={{ 
                x: Math.cos(p.angle) * p.radius, 
                y: Math.sin(p.angle) * p.radius,
                opacity: 0,
                scale: 0 
              }}
              animate={{
                x: 0,
                y: 0,
                opacity: [0, 1, 0],
                scale: p.scale
              }}
              transition={{ 
                duration: prefersReducedMotion ? 1.2 : 2 / p.speed,
                ease: "easeOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      )}

      {/* 4. Ascension Text */}
      {phase === "text" && (
        <motion.div
          className="relative z-10 text-center px-4"
          initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ type: "spring", damping: 15 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xs font-black uppercase tracking-[0.8em] text-white/40 mb-6"
          >
            Ascension Complete
          </motion.div>

          <motion.h1
            className="text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter mb-8 italic text-white"
            style={{
              textShadow: `0 0 30px ${colors.primary}, 0 0 60px ${colors.primary}80`
            }}
          >
            PRESTIGE {prestigeLevel}
          </motion.h1>

          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex flex-wrap items-center justify-center gap-4">
              <BenefitBadge label="Permanent Buff" desc="+4% Rare Chance" color={colors.primary} delay={1} />
              <BenefitBadge label="Exclusive UI" desc={`${colors.label} Theme`} color={colors.secondary} delay={1.3} />
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              className="text-text-muted text-[10px] uppercase tracking-[0.4em] mt-8"
            >
              Tap to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

function BenefitBadge({ label, desc, color, delay }: { label: string; desc: string; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="bg-white/5 backdrop-blur-xl border-l-4 p-4 rounded-r-xl text-left min-w-[180px]"
      style={{ borderColor: color }}
    >
      <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color }}>{label}</div>
      <div className="text-sm font-bold text-white uppercase">{desc}</div>
    </motion.div>
  );
}
