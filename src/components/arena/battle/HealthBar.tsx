import { motion } from "motion/react";

type HealthBarTone = "cyan" | "magenta";
type HealthBarAlign = "left" | "right";

const TONE_STYLES: Record<HealthBarTone, { bar: string; glow: string; trail: string }> = {
  cyan: {
    bar: "linear-gradient(90deg, rgba(0,234,255,0.95) 0%, rgba(104,255,255,0.88) 100%)",
    glow: "0 0 18px rgba(0,234,255,0.28)",
    trail: "rgba(0,234,255,0.18)",
  },
  magenta: {
    bar: "linear-gradient(90deg, rgba(255,43,214,0.96) 0%, rgba(255,92,130,0.88) 100%)",
    glow: "0 0 18px rgba(255,43,214,0.28)",
    trail: "rgba(255,43,214,0.18)",
  },
};

interface HealthBarProps {
  label: string;
  current: number;
  max: number;
  tone: HealthBarTone;
  align?: HealthBarAlign;
  kicker?: string;
}

export function HealthBar({
  label,
  current,
  max,
  tone,
  align = "left",
  kicker,
}: HealthBarProps) {
  const progress = Math.max(0, Math.min(100, (current / Math.max(1, max)) * 100));
  const toneStyle = TONE_STYLES[tone];

  return (
    <div className={`space-y-1.5 ${align === "right" ? "text-right" : "text-left"}`}>
      <div className="flex items-center justify-between gap-3 text-[9px] font-black uppercase tracking-[0.24em] text-white/68">
        <span>{label}</span>
        <span className="font-mono text-white/90">
          {current} / {max}
        </span>
      </div>
      {kicker ? (
        <div className={`text-[8px] uppercase tracking-[0.2em] text-white/36 ${align === "right" ? "text-right" : ""}`}>
          {kicker}
        </div>
      ) : null}
      <div className="relative h-2 overflow-hidden rounded-full border border-white/10 bg-white/[0.06]">
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: `linear-gradient(90deg, transparent 0%, ${toneStyle.trail} 100%)` }}
        />
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: toneStyle.bar,
            boxShadow: toneStyle.glow,
          }}
        />
      </div>
    </div>
  );
}
