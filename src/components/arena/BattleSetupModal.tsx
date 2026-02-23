import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Battle } from "../../types/gamification";
import type { Collectible } from "../../types/collectible";
import { useGame } from "../../context/GameContext";
import { CollectionModal } from "../shared/CollectionModal";
import { FunkoImage } from "../shared/FunkoImage";
import { RARITY_CONFIG } from "../../data/vaults";
import { getPrestigeBattleStats } from "../../data/gamification";
import { BossIcon } from "../../assets/boss-icons";

interface BattleSetupModalProps {
  battle: Battle;
  isOpen: boolean;
  onClose: () => void;
  onStartBattle: (selectedItems: Collectible[]) => void;
}

export function BattleSetupModal({
  battle,
  isOpen,
  onClose,
  onStartBattle
}: BattleSetupModalProps) {
  const { inventory, prestigeLevel } = useGame();
  const [selectedItems, setSelectedItems] = useState<Collectible[]>([]);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);

  const scaled = getPrestigeBattleStats(battle, prestigeLevel);
  const selectedIds = selectedItems.map((i) => i.id);

  const squadStats = selectedItems.reduce(
    (acc, item) => ({
      totalAtk: acc.totalAtk + item.stats.atk,
      totalDef: acc.totalDef + item.stats.def,
      totalAgi: acc.totalAgi + item.stats.agi
    }),
    { totalAtk: 0, totalDef: 0, totalAgi: 0 }
  );

  const handleAddUnit = (item: Collectible) => {
    if (selectedItems.length >= 3) return;
    setSelectedItems((prev) => [...prev, item]);
    setCollectionModalOpen(false);
  };

  const handleRemoveUnit = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-surface-elevated border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface border border-white/10 flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6">
                  <BossIcon bossId={battle.id} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">
                    vs. {battle.name}
                  </h3>
                  <p className="text-[10px] text-text-dim">{battle.description}</p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-auto p-2 rounded-lg bg-error/10 border border-error/30 text-error hover:bg-error/20 transition-colors cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Boss Stats */}
              <div className="flex gap-3 mt-3">
                <span className="text-[10px] font-mono text-text-dim">HP <span className="text-white font-bold">{scaled.hp}</span></span>
                <span className="text-[10px] font-mono text-text-dim">ATK <span className="text-error font-bold">{scaled.atk}</span></span>
                <span className="text-[10px] font-mono text-text-dim">DEF <span className="text-neon-cyan font-bold">{scaled.def}</span></span>
                <span className="text-[10px] font-mono text-text-dim">Energy <span className="text-neon-green font-bold">{battle.energyCost}</span></span>
              </div>
            </div>

            {/* Squad Selection */}
            <div className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-dim mb-3">
                Select Your Squad (up to 3)
              </p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {[0, 1, 2].map((index) => {
                  const item = selectedItems[index];
                  if (item) {
                    const rarityConfig = RARITY_CONFIG[item.rarity];
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleRemoveUnit(index)}
                        className="rounded-xl border bg-surface/50 p-3 text-center transition-all hover:border-error/40 cursor-pointer group"
                        style={{ borderColor: `${rarityConfig.color}40` }}
                      >
                        <FunkoImage name={item.funkoName || item.product} rarity={item.rarity} size="xs" className="mx-auto mb-1" />
                        <p className="text-[9px] font-bold text-white truncate">{item.funkoName || item.product}</p>
                        <div className="flex justify-center gap-1 text-[8px] font-mono mt-1">
                          <span className="text-error">{item.stats.atk}</span>
                          <span className="text-neon-cyan">{item.stats.def}</span>
                          <span className="text-neon-green">{item.stats.agi}</span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 text-[8px] text-error font-bold mt-1 transition-opacity">
                          Remove
                        </div>
                      </button>
                    );
                  }
                  return (
                    <button
                      key={`empty-${index}`}
                      onClick={() => setCollectionModalOpen(true)}
                      className="rounded-xl border-2 border-dashed border-white/15 bg-surface/30 p-4 flex flex-col items-center justify-center gap-1 hover:border-accent/40 transition-all cursor-pointer"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-text-dim">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <span className="text-[8px] font-bold uppercase text-text-dim">Add</span>
                    </button>
                  );
                })}
              </div>

              {/* Stats Comparison */}
              {selectedItems.length > 0 && (
                <div className="bg-surface/50 border border-white/10 rounded-xl p-3 mb-4">
                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    <div>
                      <p className="font-bold text-text-dim uppercase mb-1">Your Squad</p>
                      <p className="text-error font-mono">ATK {squadStats.totalAtk}</p>
                      <p className="text-neon-cyan font-mono">DEF {squadStats.totalDef}</p>
                      <p className="text-neon-green font-mono">AGI {squadStats.totalAgi}</p>
                    </div>
                    <div>
                      <p className="font-bold text-text-dim uppercase mb-1">{battle.name}</p>
                      <p className="text-error font-mono">ATK {scaled.atk}</p>
                      <p className="text-neon-cyan font-mono">DEF {scaled.def}</p>
                      <p className="text-neon-green font-mono">AGI {scaled.agi ?? "—"}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => selectedItems.length > 0 && onStartBattle(selectedItems)}
                disabled={selectedItems.length === 0}
                className={`w-full px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                  selectedItems.length > 0
                    ? "bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 cursor-pointer"
                    : "bg-white/5 border-white/10 text-text-dim cursor-not-allowed"
                }`}
              >
                Start Battle
              </button>
            </div>

            <CollectionModal
              isOpen={collectionModalOpen}
              onClose={() => setCollectionModalOpen(false)}
              onSelect={handleAddUnit}
              items={inventory}
              excludeIds={selectedIds}
              title="Select Unit"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
