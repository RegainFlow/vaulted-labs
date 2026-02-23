import { motion } from "motion/react";
import { RARITY_CONFIG, VAULT_COLORS } from "../../data/vaults";
import { getFunkoById } from "../../data/funkos";
import type { InventoryItemCardProps } from "../../types/inventory";
import { FunkoImage } from "../shared/FunkoImage";
import { CYBER_TRANSITIONS } from "../../lib/motion-presets";

export function InventoryItemCard({
  item,
  onCashout,
  onShip,
  onList,
  isFirst = false
}: InventoryItemCardProps & { isFirst?: boolean }) {
  const rarityConfig = RARITY_CONFIG[item.rarity];
  const vaultColor = VAULT_COLORS[item.vaultTier] || "#ffffff";
  const isInactive = item.status !== "held";
  const funko = item.funkoId ? getFunkoById(item.funkoId) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={CYBER_TRANSITIONS.default}
      className={`relative rounded-2xl border bg-surface-elevated/50 backdrop-blur-sm overflow-hidden transition-all duration-300 ${
        isInactive
          ? "opacity-50 grayscale"
          : "hover:-translate-y-1 hover:shadow-xl hover:border-white/20"
      }`}
      style={{
        borderColor: isInactive ? "rgba(255,255,255,0.05)" : `${vaultColor}30`
      }}
      {...(isFirst ? { "data-tutorial": "collection-item" } : {})}
    >
      {/* Status badge */}
      {item.status !== "held" && (
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
              item.status === "shipped"
                ? "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan"
                : item.status === "cashed_out"
                  ? "bg-vault-gold/10 border-vault-gold/30 text-vault-gold"
                  : "bg-accent/10 border-accent/30 text-accent"
            }`}
          >
            {item.status === "cashed_out"
              ? "Cashed Out"
              : item.status === "shipped"
                ? "Shipped"
                : "Listed"}
          </span>
        </div>
      )}

      {/* Header gradient */}
      <div
        className="h-2 w-full"
        style={{
          background: `linear-gradient(90deg, ${vaultColor}40, ${vaultColor}10)`
        }}
      />

      <div className="p-3 sm:p-4">
        {/* Icon + info */}
        <div className="flex items-center gap-2.5 sm:gap-3 mb-3">
          <FunkoImage name={item.funkoName || item.product} rarity={item.rarity} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-bold text-white truncate">
              {item.funkoName || item.product}
            </p>
            <p
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: vaultColor }}
            >
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
              backgroundColor: `${rarityConfig.color}10`
            }}
          >
            {item.rarity}
          </span>
          <div className="text-right">
            <span className="text-sm font-mono font-bold text-white">
              ${item.value}
            </span>
            {funko && (
              <p className="text-[9px] font-mono text-text-dim">
                Mkt ~${funko.baseValue}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {item.status === "held" && (
          <div
            className="grid grid-cols-3 gap-2"
            {...(isFirst ? { "data-tutorial": "collection-actions" } : {})}
          >
            <button
              onClick={() => onShip(item.id)}
              className="px-2 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20 transition-colors cursor-pointer"
              {...(isFirst ? { "data-tutorial": "inventory-ship" } : {})}
            >
              Ship
            </button>
            <button
              onClick={() => onCashout(item.id)}
              className="px-2 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-vault-gold/10 border border-vault-gold/30 text-vault-gold hover:bg-vault-gold/20 transition-colors cursor-pointer"
              {...(isFirst ? { "data-tutorial": "inventory-cashout" } : {})}
            >
              Cashout
            </button>
            <button
              onClick={() => onList(item.id)}
              className="px-2 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-colors cursor-pointer"
              {...(isFirst ? { "data-tutorial": "inventory-list" } : {})}
            >
              List
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
