import type { Transition } from "motion/react";

export const CYBER_TRANSITIONS: Record<string, Transition> = {
  default: { type: "spring", damping: 25, stiffness: 120 },
  heavy: { type: "spring", damping: 20, stiffness: 80 },
  smooth: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
  bounce: { type: "spring", damping: 12, stiffness: 200 },
  linear: { duration: 0.4, ease: "linear" }
};

export const CYBER_GLOWS = {
  magenta: "0 0 20px rgba(255, 45, 149, 0.4)",
  cyan: "0 0 20px rgba(0, 240, 255, 0.4)",
  gold: "0 0 20px rgba(255, 215, 0, 0.4)",
  white: "0 0 20px rgba(255, 255, 255, 0.2)"
};

export const CYBER_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 }
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }
};

/* ─── Rarity Glow Maps ─── */

type GlowIntensity = { soft: string; medium: string; intense: string };

export const RARITY_GLOWS: Record<string, GlowIntensity> = {
  common: {
    soft: "0 0 10px rgba(107,114,128,0.2)",
    medium: "0 0 15px rgba(107,114,128,0.3)",
    intense: "0 0 20px rgba(107,114,128,0.4)"
  },
  uncommon: {
    soft: "0 0 15px rgba(59,130,246,0.25), 0 0 30px rgba(59,130,246,0.1)",
    medium: "0 0 20px rgba(59,130,246,0.35), 0 0 45px rgba(59,130,246,0.12)",
    intense: "0 0 30px rgba(59,130,246,0.5), 0 0 60px rgba(59,130,246,0.18)"
  },
  rare: {
    soft: "0 0 20px rgba(168,85,247,0.3), 0 0 40px rgba(168,85,247,0.1), 0 0 80px rgba(168,85,247,0.05)",
    medium: "0 0 25px rgba(168,85,247,0.4), 0 0 50px rgba(168,85,247,0.15), 0 0 100px rgba(168,85,247,0.08)",
    intense: "0 0 30px rgba(168,85,247,0.6), 0 0 60px rgba(168,85,247,0.25), 0 0 150px rgba(168,85,247,0.12)"
  },
  legendary: {
    soft: "0 0 40px rgba(255,215,0,0.35), 0 0 80px rgba(255,215,0,0.12), 0 0 140px rgba(255,215,0,0.06)",
    medium: "0 0 50px rgba(255,215,0,0.5), 0 0 100px rgba(255,215,0,0.2), 0 0 180px rgba(255,215,0,0.1)",
    intense: "0 0 60px rgba(255,215,0,0.7), 0 0 120px rgba(255,215,0,0.35), 0 0 200px rgba(255,215,0,0.15)"
  }
};

/* ─── Spin Phase Transitions ─── */

export const SPIN_PHASES = {
  blitz: { duration: 0.15, ease: "linear" as const },
  cruise: { duration: 0.28, ease: "linear" as const },
  tension: { duration: 0.55, ease: "linear" as const },
  land: { duration: 2.2, ease: [0.05, 0.88, 0.15, 1.02] as [number, number, number, number] },
  bossLand: { duration: 1.1, ease: [0.12, 0.85, 0.2, 1.01] as [number, number, number, number] }
};

/* ─── Celebration Springs (per-rarity) ─── */

export const CELEBRATION_SPRINGS: Record<string, { damping: number; stiffness: number }> = {
  common: { damping: 25, stiffness: 120 },
  uncommon: { damping: 22, stiffness: 140 },
  rare: { damping: 18, stiffness: 160 },
  legendary: { damping: 12, stiffness: 200 }
};

/* ─── Rarity Celebration Config (confetti) ─── */

export const RARITY_CELEBRATION: Record<string, {
  count: number;
  spread: number;
  duration: number;
  size: string;
}> = {
  common: { count: 12, spread: 200, duration: 1.5, size: "w-1.5 h-1.5" },
  uncommon: { count: 30, spread: 300, duration: 1.8, size: "w-2 h-2" },
  rare: { count: 60, spread: 450, duration: 2.2, size: "w-2.5 h-2.5" },
  legendary: { count: 150, spread: 700, duration: 3.0, size: "w-3 h-3" }
};

/* ─── Rarity Result Text Config ─── */

export const RARITY_TEXT_CONFIG: Record<string, {
  titleSize: string;
  titleSizeLg: string;
  textShadow: string;
  entranceScale: number;
  entranceDelay: number;
  flashOpacity: number;
}> = {
  common: {
    titleSize: "text-2xl",
    titleSizeLg: "text-3xl",
    textShadow: "none",
    entranceScale: 0.95,
    entranceDelay: 0,
    flashOpacity: 0.08
  },
  uncommon: {
    titleSize: "text-3xl",
    titleSizeLg: "text-4xl",
    textShadow: "0 0 10px",
    entranceScale: 0.92,
    entranceDelay: 0.1,
    flashOpacity: 0.15
  },
  rare: {
    titleSize: "text-4xl",
    titleSizeLg: "text-6xl",
    textShadow: "0 0 20px",
    entranceScale: 0.85,
    entranceDelay: 0.2,
    flashOpacity: 0.3
  },
  legendary: {
    titleSize: "text-4xl",
    titleSizeLg: "text-6xl",
    textShadow: "0 0 40px",
    entranceScale: 0.7,
    entranceDelay: 0.35,
    flashOpacity: 0.6
  }
};

/* ─── Jackpot Celebration Config ─── */

export const JACKPOT_CELEBRATION = {
  particleCount: 100,
  spread: 600,
  shockwaveCount: 2,
  shockwaveStagger: 0.15,
  flashDuration: 0.6,
  textSpring: { damping: 10, stiffness: 200 },
  particleColors: ["#ffd700", "#ffffff", "#ff2d95", "#00f0ff"]
};

/* ─── Forge Animation Config ─── */

export const FORGE_ANIMATION = {
  dissolveDuration: 1000,
  crucibleDuration: 1000,
  materializeDuration: 500,
  sparkCount: 10,
  emberCount: 30,
  emberColors: ["#ff6b35", "#ff4500", "#ffa500", "#ffd700"],
  crucibleGradient: "radial-gradient(ellipse at center, rgba(255,107,53,0.6) 0%, rgba(255,69,0,0.3) 40%, transparent 70%)"
};

/* ─── Battle Animation Config ─── */

export const BATTLE_ANIMATION = {
  hitFlashDuration: 0.15,
  damageNumberDuration: 1,
  damageNumberDistance: 60,
  slashDuration: 0.3,
  impactDuration: 0.3,
  hpGreenThreshold: 60,
  hpGoldThreshold: 30
};
