import { useState } from "react";
import { motion } from "motion/react";
import { useGame } from "../../context/GameContext";
import { CollectionModal } from "../shared/CollectionModal";
import { FunkoImage } from "../shared/FunkoImage";
import { RARITY_CONFIG } from "../../data/vaults";

export function SquadPanel() {
  const { equippedItems, equipItem, unequipItem, inventory, squadStats } = useGame();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmUnequip, setConfirmUnequip] = useState<string | null>(null);

  const slots = [0, 1, 2];
  const equippedIds = equippedItems.map((i) => i.id);

  const handleSlotClick = (index: number) => {
    const item = equippedItems[index];
    if (item) {
      setConfirmUnequip(item.id);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <div className="mb-6 sm:mb-8">
      <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">
        Your Squad
      </h3>
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
        {slots.map((index) => {
          const item = equippedItems[index];
          if (item) {
            const rarityConfig = RARITY_CONFIG[item.rarity];
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-xl border-2 bg-surface-elevated/50 p-3 sm:p-4 text-left transition-all hover:border-error/40 cursor-pointer group"
                style={{ borderColor: `${rarityConfig.color}40` }}
                onClick={() => handleSlotClick(index)}
              >
                <div className="flex flex-col items-center gap-2">
                  <FunkoImage name={item.funkoName || item.product} rarity={item.rarity} size="sm" />
                  <p className="text-[10px] font-bold text-white text-center truncate w-full">
                    {item.funkoName || item.product}
                  </p>
                  <span
                    className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider"
                    style={{ color: rarityConfig.color }}
                  >
                    {item.rarity}
                  </span>
                  <div className="flex gap-2 text-[8px] font-mono text-text-dim">
                    <span className="text-error">{item.stats.atk}</span>
                    <span className="text-neon-cyan">{item.stats.def}</span>
                    <span className="text-neon-green">{item.stats.agi}</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-error/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center">
                  <span className="text-[9px] font-black uppercase text-error">Remove</span>
                </div>
              </motion.button>
            );
          }

          return (
            <button
              key={`empty-${index}`}
              onClick={() => handleSlotClick(index)}
              className="rounded-xl border-2 border-dashed border-white/15 bg-surface/30 p-6 sm:p-8 flex flex-col items-center justify-center gap-2 hover:border-accent/40 hover:bg-accent/5 transition-all cursor-pointer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-text-dim">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-[9px] font-bold uppercase tracking-wider text-text-dim">
                Add Unit
              </span>
            </button>
          );
        })}
      </div>

      {/* Squad Stats Summary */}
      {squadStats.memberCount > 0 && (
        <div className="flex items-center gap-4 bg-surface/50 border border-white/10 rounded-xl px-4 py-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-dim">Squad Total:</span>
          <span className="text-xs font-mono font-bold text-error">ATK {squadStats.totalAtk}</span>
          <span className="text-xs font-mono font-bold text-neon-cyan">DEF {squadStats.totalDef}</span>
          <span className="text-xs font-mono font-bold text-neon-green">AGI {squadStats.totalAgi}</span>
        </div>
      )}

      {/* Unequip confirmation */}
      {confirmUnequip && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setConfirmUnequip(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-surface-elevated border border-white/10 rounded-xl p-6 max-w-xs text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-bold text-white mb-4">Remove from squad?</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  unequipItem(confirmUnequip);
                  setConfirmUnequip(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase bg-error/10 border border-error/30 text-error hover:bg-error/20 transition-colors cursor-pointer"
              >
                Remove
              </button>
              <button
                onClick={() => setConfirmUnequip(null)}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase bg-surface border border-white/10 text-text-muted hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <CollectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(item) => {
          equipItem(item.id);
          setModalOpen(false);
        }}
        items={inventory}
        excludeIds={equippedIds}
        title="Select Unit"
      />
    </div>
  );
}
