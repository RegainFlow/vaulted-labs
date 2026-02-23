import type { Rarity } from "../../types/vault";

const RARITY_COLORS: Record<Rarity, { bg: string; border: string; glow: string; silhouette: string }> = {
  common: {
    bg: "from-[#3a3a42] to-[#24242b]",
    border: "rgba(107,114,128,0.5)",
    glow: "0 0 10px rgba(107,114,128,0.3)",
    silhouette: "rgba(107,114,128,0.25)"
  },
  uncommon: {
    bg: "from-[#1a2a4a] to-[#0f1a30]",
    border: "rgba(59,130,246,0.5)",
    glow: "0 0 15px rgba(59,130,246,0.35)",
    silhouette: "rgba(59,130,246,0.2)"
  },
  rare: {
    bg: "from-[#2a1a3a] to-[#1a0f28]",
    border: "rgba(168,85,247,0.5)",
    glow: "0 0 20px rgba(168,85,247,0.4)",
    silhouette: "rgba(168,85,247,0.2)"
  },
  legendary: {
    bg: "from-[#3a2a0a] to-[#28200a]",
    border: "rgba(255,215,0,0.5)",
    glow: "0 0 25px rgba(255,215,0,0.45), 0 0 50px rgba(255,215,0,0.15)",
    silhouette: "rgba(255,215,0,0.2)"
  }
};

const SIZE_CONFIG = {
  xs: { outer: "w-8 h-8", icon: 12, text: "text-[6px]", radius: "rounded-md" },
  sm: { outer: "w-10 h-10", icon: 16, text: "text-[7px]", radius: "rounded-lg" },
  md: { outer: "w-20 h-20", icon: 32, text: "text-[9px]", radius: "rounded-xl" },
  lg: { outer: "w-32 h-32", icon: 52, text: "text-[11px]", radius: "rounded-2xl" }
};

interface FunkoImageProps {
  name: string;
  rarity: Rarity;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function FunkoImage({ name, rarity, size = "md", className = "" }: FunkoImageProps) {
  const colors = RARITY_COLORS[rarity];
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <div
      className={`relative ${sizeConfig.outer} ${sizeConfig.radius} bg-gradient-to-b ${colors.bg} border overflow-hidden flex flex-col items-center justify-center ${className}`}
      style={{
        borderColor: colors.border,
        boxShadow: colors.glow
      }}
    >
      {/* Silhouette icon */}
      <svg
        width={sizeConfig.icon}
        height={sizeConfig.icon}
        viewBox="0 0 48 48"
        fill="none"
        className="shrink-0"
      >
        {/* Box/figure silhouette */}
        <rect x="14" y="4" width="20" height="6" rx="2" fill={colors.silhouette} />
        <circle cx="24" cy="18" r="6" fill={colors.silhouette} />
        <path d="M14 26 C14 24 16 22 24 22 C32 22 34 24 34 26 L34 40 C34 42 32 44 30 44 L18 44 C16 44 14 42 14 40 Z" fill={colors.silhouette} />
      </svg>

      {/* Name badge */}
      {size !== "xs" && size !== "sm" && (
        <span
          className={`${sizeConfig.text} font-bold uppercase tracking-wider text-center leading-tight mt-1 px-1 truncate w-full`}
          style={{ color: colors.border }}
        >
          {name}
        </span>
      )}
    </div>
  );
}
