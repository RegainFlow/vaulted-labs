import { useEffect, useMemo, useState } from "react";
import { getFunkoByName } from "../../data/funkos";
import type { Rarity } from "../../types/vault";

const RARITY_COLORS: Record<
  Rarity,
  { bg: string; border: string; glow: string }
> = {
  common: {
    bg: "from-[#3a3a42] to-[#24242b]",
    border: "rgba(107,114,128,0.5)",
    glow: "0 0 10px rgba(107,114,128,0.3)",
  },
  uncommon: {
    bg: "from-[#1a2a4a] to-[#0f1a30]",
    border: "rgba(59,130,246,0.5)",
    glow: "0 0 15px rgba(59,130,246,0.35)",
  },
  rare: {
    bg: "from-[#2a1a3a] to-[#1a0f28]",
    border: "rgba(168,85,247,0.5)",
    glow: "0 0 20px rgba(168,85,247,0.4)",
  },
  legendary: {
    bg: "from-[#3a2a0a] to-[#28200a]",
    border: "rgba(255,215,0,0.5)",
    glow: "0 0 25px rgba(255,215,0,0.45), 0 0 50px rgba(255,215,0,0.15)",
  },
};

const SIZE_CONFIG = {
  xs: { outer: "w-8 h-8", icon: 12, text: "text-[6px]", radius: "rounded-md" },
  sm: { outer: "w-10 h-10", icon: 16, text: "text-[7px]", radius: "rounded-lg" },
  md: { outer: "w-20 h-20", icon: 32, text: "text-[9px]", radius: "rounded-xl" },
  lg: { outer: "w-32 h-32", icon: 52, text: "text-[11px]", radius: "rounded-2xl" },
  hero: {
    outer: "h-full w-full",
    icon: 72,
    text: "text-[11px]",
    radius: "rounded-[28px]",
  },
};

interface FunkoImageProps {
  name: string;
  rarity: Rarity;
  size?: "xs" | "sm" | "md" | "lg" | "hero";
  imagePath?: string;
  showLabel?: boolean;
  className?: string;
}

export function FunkoImage({
  name,
  rarity,
  size = "md",
  imagePath,
  showLabel = true,
  className = "",
}: FunkoImageProps) {
  const colors = RARITY_COLORS[rarity];
  const sizeConfig = SIZE_CONFIG[size];
  const catalogImagePath = useMemo(() => getFunkoByName(name)?.imagePath, [name]);
  const resolvedImagePath = imagePath || catalogImagePath;
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [resolvedImagePath]);

  const showImage = Boolean(resolvedImagePath) && !imageFailed;

  return (
    <div
      className={`relative ${sizeConfig.outer} ${sizeConfig.radius} overflow-hidden border bg-gradient-to-b ${colors.bg} ${className}`}
      style={{
        borderColor: colors.border,
        boxShadow: colors.glow,
      }}
    >
      {showImage ? (
        <>
          <img
            src={resolvedImagePath}
            alt={name}
            className="absolute inset-0 h-full w-full object-contain p-1.5"
            onError={() => setImageFailed(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/18 via-transparent to-black/40" />
          <div
            className="absolute inset-0 opacity-45"
            style={{
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, transparent 28%, transparent 70%, rgba(255,255,255,0.1) 100%)",
            }}
          />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 50% 36%, rgba(255,255,255,0.08) 0%, transparent 26%),
                linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 24%, rgba(0,0,0,0.28) 100%)
              `,
            }}
          />
          <div
            className="absolute inset-x-[18%] top-1/2 h-px -translate-y-1/2"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${colors.border} 50%, transparent 100%)`,
              opacity: 0.5,
            }}
          />
          <div className="absolute inset-0 opacity-[0.12]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(180deg, rgba(255,255,255,0.6) 0px, transparent 2px, transparent 7px)",
              }}
            />
          </div>
        </>
      )}

      {showLabel && size !== "xs" && size !== "sm" && size !== "hero" && (
        <div className="absolute inset-x-1 bottom-1 z-10 rounded-lg border border-white/10 bg-black/55 px-1.5 py-1 backdrop-blur-sm">
          <span
            className={`${sizeConfig.text} block w-full truncate text-center font-bold uppercase tracking-wider`}
            style={{ color: colors.border }}
          >
            {name}
          </span>
        </div>
      )}
    </div>
  );
}
