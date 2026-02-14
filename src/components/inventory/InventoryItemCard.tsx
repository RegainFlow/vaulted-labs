import { motion } from "motion/react";
import { useState } from "react";
import type { InventoryItem } from "../../types/game";
import { RARITY_CONFIG } from "../../data/vaults";
import { VaultIcon } from "../VaultIcons";

interface InventoryItemCardProps {
  item: InventoryItem;
  onCashout: (itemId: string) => void;
  onShip: (itemId: string) => void;
}

const VAULT_COLORS: Record<string, string> = {
  Bronze: "#cd7f32",
  Silver: "#e0e0e0",
  Gold: "#ffd700",
  Platinum: "#79b5db",
  Obsidian: "#6c4e85",
  Diamond: "#b9f2ff",
};

export function InventoryItemCard({ item, onCashout, onShip }: InventoryItemCardProps) {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const rarityConfig = RARITY_CONFIG[item.rarity];
  const vaultColor = VAULT_COLORS[item.vaultTier] || "#ffffff";
  const isInactive = item.status !== "held";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border bg-surface-elevated/50 backdrop-blur-sm overflow-hidden transition-all duration-300 ${
        isInactive ? "opacity-50 grayscale" : "hover:-translate-y-1 hover:shadow-xl"
      }`}
      style={{ borderColor: isInactive ? "rgba(255,255,255,0.05)" : `${vaultColor}30` }}
    >
      {/* Status badge */}
      {item.status !== "held" && (
        <div className="absolute top-3 right-3 z-10">
          <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
            item.status === "shipped" ? "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan" :
            item.status === "cashed_out" ? "bg-vault-gold/10 border-vault-gold/30 text-vault-gold" :
            "bg-accent/10 border-accent/30 text-accent"
          }`}>
            {item.status === "cashed_out" ? "Cashed Out" : item.status === "shipped" ? "Shipped" : "Listed"}
          </span>
        </div>
      )}

      {/* Header gradient */}
      <div
        className="h-2 w-full"
        style={{ background: `linear-gradient(90deg, ${vaultColor}40, ${vaultColor}10)` }}
      />

      <div className="p-3 sm:p-4">
        {/* Icon + info */}
        <div className="flex items-center gap-2.5 sm:gap-3 mb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center border shrink-0" style={{ borderColor: `${vaultColor}30`, backgroundColor: `${vaultColor}08` }}>
            <VaultIcon name={item.vaultTier} color={vaultColor} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-bold text-white truncate">{item.product}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: vaultColor }}>
              {item.vaultTier} Vault
            </p>
          </div>
        </div>

        {/* Rarity + value */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border"
            style={{
              color: rarityConfig.color,
              borderColor: `${rarityConfig.color}40`,
              backgroundColor: `${rarityConfig.color}10`,
            }}
          >
            {item.rarity}
          </span>
          <span className="text-sm font-mono font-bold text-white">${item.value}</span>
        </div>

        {/* Actions */}
        {item.status === "held" && (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onShip(item.id)}
              className="px-2 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20 transition-colors cursor-pointer"
            >
              Ship
            </button>
            <button
              onClick={() => onCashout(item.id)}
              className="px-2 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-vault-gold/10 border border-vault-gold/30 text-vault-gold hover:bg-vault-gold/20 transition-colors cursor-pointer"
            >
              Cashout
            </button>
            <div className="relative">
              <button
                onClick={() => setShowComingSoon(true)}
                onMouseLeave={() => setShowComingSoon(false)}
                className="w-full px-2 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-text-dim hover:bg-white/10 transition-colors cursor-pointer"
              >
                List
              </button>
              {showComingSoon && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-surface border border-white/10 text-[10px] text-text-muted whitespace-nowrap shadow-xl z-10">
                  Coming Soon
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
