import { motion, AnimatePresence } from "motion/react";
import { RARITY_CONFIG, VAULT_COLORS } from "../../data/vaults";
import { FunkoImage } from "./FunkoImage";
import type { Collectible } from "../../types/collectible";

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: Collectible) => void;
  items: Collectible[];
  excludeIds?: string[];
  title?: string;
}

export function CollectionModal({
  isOpen,
  onClose,
  onSelect,
  items,
  excludeIds = [],
  title = "Select Collectible"
}: CollectionModalProps) {
  const excludeSet = new Set(excludeIds);
  const available = items.filter(
    (item) => item.status === "held" && !excludeSet.has(item.id)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-surface-elevated border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h3 className="text-sm font-black uppercase tracking-widest text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-error/10 border border-error/30 text-error hover:bg-error/20 transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-64px)]">
              {available.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-text-muted text-sm font-bold mb-1">No items available</p>
                  <p className="text-text-dim text-xs">
                    Open vaults to get collectibles for your squad or forge.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {available.map((item) => {
                    const rarityConfig = RARITY_CONFIG[item.rarity];
                    const vaultColor = VAULT_COLORS[item.vaultTier] || "#ffffff";

                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className="group relative rounded-xl border bg-surface/50 p-3 text-left transition-all duration-200 hover:scale-[1.02] hover:border-accent/40 hover:shadow-lg cursor-pointer"
                        style={{ borderColor: `${vaultColor}30` }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <FunkoImage name={item.funkoName || item.product} rarity={item.rarity} size="xs" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-white truncate">
                              {item.funkoName || item.product}
                            </p>
                            <p className="text-[9px] uppercase tracking-wider" style={{ color: vaultColor }}>
                              {item.vaultTier}
                            </p>
                          </div>
                        </div>

                        {/* Rarity badge */}
                        <span
                          className="inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border mb-2"
                          style={{
                            color: rarityConfig.color,
                            borderColor: `${rarityConfig.color}40`,
                            backgroundColor: `${rarityConfig.color}10`
                          }}
                        >
                          {item.rarity}
                        </span>

                        {/* Stats */}
                        <div className="flex gap-2 text-[9px] font-mono text-text-dim">
                          <span className="text-error">ATK {item.stats.atk}</span>
                          <span className="text-neon-cyan">DEF {item.stats.def}</span>
                          <span className="text-neon-green">AGI {item.stats.agi}</span>
                        </div>

                        {/* Equipped indicator */}
                        {item.isEquipped && (
                          <div className="absolute top-1.5 right-1.5">
                            <span className="px-1.5 py-0.5 rounded text-[7px] font-black uppercase bg-accent/20 border border-accent/40 text-accent">
                              Equipped
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
