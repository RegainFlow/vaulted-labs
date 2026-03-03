import { motion } from "motion/react";
import type { Collectible } from "../../../types/collectible";
import { FunkoImage } from "../../shared/FunkoImage";

interface CharacterAvatarProps {
  item: Collectible;
  imagePath?: string;
  hpCurrent: number;
  hpMax: number;
  active: boolean;
}

export function CharacterAvatar({
  item,
  imagePath,
  hpCurrent,
  hpMax,
  active,
}: CharacterAvatarProps) {
  const ratio = Math.max(0, Math.min(100, (hpCurrent / Math.max(1, hpMax)) * 100));

  return (
    <motion.div
      animate={{
        y: active ? -4 : 0,
        scale: active ? 1.015 : 0.985,
      }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[150px] sm:max-w-[210px]"
    >
      <div
        className="module-card relative overflow-hidden px-3 py-3"
        style={{
          borderColor: active ? "rgba(0,234,255,0.34)" : "rgba(255,255,255,0.08)",
          boxShadow: active
            ? "0 18px 40px rgba(0,0,0,0.34), 0 0 26px rgba(0,234,255,0.12)"
            : "0 14px 28px rgba(0,0,0,0.24)",
        }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(0,234,255,0.78)_50%,transparent_100%)]" />
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[9px] font-black uppercase tracking-[0.24em] text-cyan-200/75">
              {active ? "Active Unit" : "Standby"}
            </div>
            <div className="mt-1 truncate text-sm font-black uppercase tracking-[0.08em] text-white">
              {item.funkoName || item.product}
            </div>
          </div>
          <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-1 text-[8px] font-black uppercase tracking-[0.22em] text-cyan-200">
            {active ? "Live" : "Ready"}
          </span>
        </div>

        <div className="mt-2.5 rounded-[18px] border border-white/10 bg-black/25 p-2 sm:p-2.5">
          <div className="mx-auto h-[78px] w-full max-w-[100px] sm:h-[132px] sm:max-w-[150px]">
            <FunkoImage
              name={item.funkoName || item.product}
              rarity={item.rarity}
              imagePath={imagePath}
              size="hero"
              showLabel={false}
            />
          </div>
        </div>

        <div className="mt-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em] text-white/55">
            <span>Integrity</span>
            <span className="font-mono text-white/90">
              {hpCurrent}/{hpMax}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full border border-white/10 bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full"
              animate={{ width: `${ratio}%` }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,234,255,0.95) 0%, rgba(124,255,247,0.82) 100%)",
                boxShadow: "0 0 10px rgba(0,234,255,0.24)",
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
