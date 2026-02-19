import { useState } from "react";
import { motion } from "motion/react";
import type { VaultCardProps } from "../../types/vault";
import { VaultIcon } from "./VaultIcons";
import {
  RARITY_CONFIG,
  PREMIUM_BONUS_CHANCE,
  VALUE_RANGE_REDUCTION,
  getPrestigeOdds,
} from "../../data/vaults";
import { CYBER_TRANSITIONS } from "../../lib/motion-presets";

const PRESTIGE_COLORS: Record<number, string> = {
  1: "#ff8c00",
  2: "#9945ff",
  3: "#ff2d95"
};

export function VaultCard({
  vault,
  index,
  balance,
  onSelect,
  disabled = false,
  prestigeLevel = 0,
}: VaultCardProps & { prestigeLevel?: number }) {
  const [showOdds, setShowOdds] = useState(false);
  const canAfford = !disabled && balance >= vault.price;
  const minPull = Math.max(1, Math.round(vault.price * RARITY_CONFIG.common.minMult - VALUE_RANGE_REDUCTION));
  const maxPull = Math.round(vault.price * RARITY_CONFIG.legendary.maxMult - VALUE_RANGE_REDUCTION);
  const bonusChance = PREMIUM_BONUS_CHANCE[vault.name];

  const handleSelect = () => {
    if (!canAfford) return;
    onSelect(vault);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...CYBER_TRANSITIONS.default, delay: index * 0.05 }}
      whileHover={canAfford ? { y: -8, scale: 1.02 } : {}}
      onClick={handleSelect}
      className={`group relative h-full ${!canAfford ? "cursor-not-allowed" : "cursor-pointer"}`}
      {...(vault.name === "Diamond"
        ? { "data-tutorial": "vault-diamond" }
        : {})}
    >
      {/* Main Vault Structure */}
      <div
        className={`relative bg-[#0d0d12] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/5 h-full flex flex-col transition-all duration-500 ${!canAfford ? "opacity-40 grayscale" : "hover:border-opacity-100 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]"}`}
        style={{ borderColor: `${vault.color}40` }}
      >
        {/* Metallic Header */}
        <div
          className={`relative h-40 sm:h-44 md:h-48 bg-linear-to-br ${vault.gradient} flex flex-col items-center justify-center border-b-8 border-black/40 overflow-hidden`}
        >
          {/* Industrial Rivets */}
          <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-black/30 shadow-inner" />
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-black/30 shadow-inner" />

          {/* Price Tag in Header */}
          <div className="absolute top-4 right-8 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 z-10">
            <span className="font-black italic text-xl text-white">
              ${vault.price}
            </span>
          </div>

          {/* Sequence Number */}
          <div className="absolute top-4 left-8 text-[10px] font-black uppercase tracking-[0.2em] text-black/50 z-10">
            VAULT - 0{index + 1}
          </div>

          {/* Bonus Spin Badge */}
          {bonusChance && (
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  `0 0 10px #ff2d9520`,
                  `0 0 20px #ff2d9550`,
                  `0 0 10px #ff2d9520`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 left-8 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-black/60 backdrop-blur-xl border-2 z-10 flex flex-col items-center gap-0"
              style={{ borderColor: `#ff2d9580` }}
            >
              <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap">
                Bonus Spin
              </span>
              <span
                className="text-[10px] sm:text-[12px] font-mono font-black"
                style={{ color: "#ff2d95" }}
              >
                {Math.round(bonusChance * 100)}%
              </span>
            </motion.div>
          )}

          {/* Ore Icon Container */}
          <div
            className={`relative z-10 -mt-3 sm:mt-0 transform transition-transform duration-500 ${canAfford ? "group-hover:scale-110" : ""}`}
          >
            <div className="drop-shadow-2xl filter scale-75 sm:scale-100">
              <VaultIcon name={vault.name} color={vault.color} />
            </div>
          </div>

          {/* Pull Range Badge */}
          <div className="absolute bottom-1.5 sm:bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg border border-white/10 z-10 flex flex-col items-center gap-0">
            <span className="text-[7px] sm:text-[7px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] text-white/40 leading-tight">
              Value Range
            </span>
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white/90 whitespace-nowrap leading-tight">
              ${minPull} — ${maxPull}
            </span>
          </div>

          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,black_1px,transparent_0)] bg-[length:10px_10px]" />
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 md:p-6 bg-gradient-to-b from-white/5 to-transparent flex-1 flex flex-col">
          {/* Title Section */}
          <div className="text-center mb-6">
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">
              {vault.name}
            </h3>
            <p className="text-xs font-mono text-text-muted uppercase tracking-[0.3em]">
              {vault.tagline}
            </p>
          </div>

          {/* 3D Pushable "Show Odds" button (Josh Comeau pattern) */}
          <div className="flex justify-center mb-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOdds(!showOdds);
              }}
              className="group/odds relative rounded-xl border-none p-0 cursor-pointer outline-none"
              style={{
                background: showOdds
                  ? "rgba(255,45,149,0.35)"
                  : "rgba(255,255,255,0.08)",
              }}
            >
              <span
                className={`relative block px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest translate-y-[-4px] group-active/odds:translate-y-[-2px] transition-transform duration-[250ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] backdrop-blur-md ${
                  showOdds
                    ? "bg-accent/20 border border-accent/40 text-accent"
                    : "bg-white/10 border border-white/20 text-text-muted"
                }`}
              >
                {showOdds ? "Hide Odds" : "Show Odds"}
              </span>
            </button>
          </div>

          {/* Stats Section — visible only when showOdds is true */}
          {showOdds && (
            <div className="pt-6 space-y-4 border-t border-white/5">
              {(
                Object.entries(
                  getPrestigeOdds(vault.rarities, prestigeLevel)
                ) as [string, number][]
              ).map(([rarity, chance]) => {
                const rarityColor = getRarityColor(rarity);
                const cfg = RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG];
                const baseChance = vault.rarities[rarity as keyof typeof vault.rarities];
                const delta = +(chance - baseChance).toFixed(1);
                return (
                  <div key={rarity} className="space-y-1">
                    <div className="flex items-center justify-between text-[14px] uppercase font-bold tracking-wider">
                      <span style={{ color: rarityColor }}>{rarity}</span>
                      <span className="text-white">
                        {baseChance}%
                        {prestigeLevel > 0 && delta !== 0 && (
                          <span className="ml-1 text-xs font-black" style={{ color: PRESTIGE_COLORS[prestigeLevel] }}>
                            {delta > 0 ? "+" : ""}{delta}%
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[13px] font-mono text-text-dim">
                        ${Math.max(1, Math.round(vault.price * cfg.minMult - VALUE_RANGE_REDUCTION))} - $
                        {Math.round(vault.price * cfg.maxMult - VALUE_RANGE_REDUCTION)}
                      </span>
                    </div>
                    <div className="h-4 w-full bg-black/60 rounded-sm overflow-hidden border border-white/5 relative">
                      <div
                        className="absolute inset-0 z-20 pointer-events-none opacity-20"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(90deg, transparent, transparent 19%, #000 19%, #000 20%)",
                        }}
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${chance}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full relative"
                        style={{
                          backgroundColor: rarityColor,
                          boxShadow: `0 0 10px ${rarityColor}40`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center">
            <span
              className="text-[10px] font-mono uppercase tracking-widest animate-pulse"
              style={{ color: !canAfford ? "var(--color-error)" : vault.color }}
            >
              {!canAfford ? "Insufficient Credits" : "Click to Initialize"}
            </span>
          </div>
        </div>

        {/* Caution Stripes at bottom */}
        <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#000,#000_10px,transparent_10px,transparent_20px)] opacity-20" />

        {/* Unaffordable hazard stripe overlay */}
        {!canAfford && (
          <div
            className="absolute inset-0 z-10 rounded-2xl pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(45deg, transparent, transparent 18px, rgba(255,59,92,0.08) 18px, rgba(255,59,92,0.08) 20px)",
            }}
          />
        )}
      </div>

      {/* Selection Glow */}
      {canAfford && (
        <div
          className="absolute inset-0 -z-10 rounded-2xl blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700"
          style={{ backgroundColor: vault.color }}
        />
      )}
    </motion.div>
  );
}

function getRarityColor(rarity: string) {
  switch (rarity) {
    case "common":
      return "#6B7280";
    case "uncommon":
      return "#3B82F6";
    case "rare":
      return "#a855f7";
    case "legendary":
      return "#FFD700";
    default:
      return "white";
  }
}
