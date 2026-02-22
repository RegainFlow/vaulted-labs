import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { FunkoImage } from "../shared/FunkoImage";
import { getVaultItemsByRarity } from "../../data/funkos";
import { RARITY_CONFIG, getPrestigeOdds, VALUE_RANGE_REDUCTION } from "../../data/vaults";
import type { Vault, VaultTierName } from "../../types/vault";
import type { Rarity } from "../../types/vault";

interface VaultContentsModalProps {
  vault: Vault;
  prestigeLevel: number;
  onClose: () => void;
}

const RARITY_ORDER: Rarity[] = ["legendary", "rare", "uncommon", "common"];

export function VaultContentsModal({ vault, prestigeLevel, onClose }: VaultContentsModalProps) {
  const odds = getPrestigeOdds(vault.rarities, prestigeLevel);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-bg/95 backdrop-blur-xl overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="max-w-4xl mx-auto px-4 py-8 sm:py-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              {vault.name} <span style={{ color: vault.color }}>Vault</span>
            </h2>
            <p className="text-sm text-text-muted mt-1">
              <span className="font-mono font-bold" style={{ color: vault.color }}>${vault.price}</span> per open
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-error/10 border border-error/30 text-error hover:bg-error/20 transition-all cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Rarity sections */}
        {RARITY_ORDER.map((rarity) => {
          const items = getVaultItemsByRarity(vault.name as VaultTierName, rarity);
          if (items.length === 0) return null;

          const config = RARITY_CONFIG[rarity];
          const chance = odds[rarity];
          const minVal = Math.max(1, Math.round(vault.price * config.minMult - VALUE_RANGE_REDUCTION));
          const maxVal = Math.round(vault.price * config.maxMult - VALUE_RANGE_REDUCTION);

          return (
            <div key={rarity} className="mb-8">
              {/* Section header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: `${config.color}30` }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: config.color, boxShadow: `0 0 10px ${config.color}50` }}
                  />
                  <h3 className="text-lg font-black uppercase tracking-wider" style={{ color: config.color }}>
                    {rarity}
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="font-mono font-bold" style={{ color: config.color }}>{chance}%</span>
                  <span className="text-text-dim font-mono">${minVal} - ${maxVal}</span>
                </div>
              </div>

              {/* Items grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {items.map((funko) => (
                  <div
                    key={funko.id}
                    className="flex flex-col items-center gap-2 p-2 rounded-xl border bg-surface/50 transition-all hover:bg-surface-elevated/50"
                    style={{ borderColor: `${config.color}15` }}
                  >
                    <FunkoImage name={funko.name} rarity={funko.rarity} size="md" />
                    <p className="text-[10px] font-bold text-text-muted text-center truncate w-full">
                      {funko.name}
                    </p>
                    <p className="text-[9px] font-mono font-bold" style={{ color: config.color }}>
                      ~${funko.baseValue}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>,
    document.body
  );
}
