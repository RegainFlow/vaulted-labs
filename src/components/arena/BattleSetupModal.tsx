import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Battle } from "../../types/gamification";
import type { Collectible } from "../../types/collectible";
import { useGame } from "../../context/GameContext";
import { getFunkoById } from "../../data/funkos";
import { CollectionModal } from "../shared/CollectionModal";
import { CollectibleDisplayCard } from "../shared/CollectibleDisplayCard";
import { getPrestigeBattleStats } from "../../data/gamification";
import { BossIcon } from "../../assets/boss-icons";
import { ArcadeButton } from "../shared/ArcadeButton";
import { useOverlayScrollLock } from "../../hooks/useOverlayScrollLock";

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
  useOverlayScrollLock(isOpen);
  const { inventory, prestigeLevel } = useGame();
  const [selectedItems, setSelectedItems] = useState<Collectible[]>([]);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const startLockRef = useRef(false);

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
    setSelectedItems((prev) => {
      if (prev.length >= 3) return prev;
      if (prev.some((selected) => selected.id === item.id)) return prev;
      return [...prev, item];
    });
    setCollectionModalOpen(false);
  };

  const handleRemoveUnit = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartBattle = () => {
    if (selectedItems.length === 0 || startLockRef.current) return;
    startLockRef.current = true;
    onStartBattle(selectedItems);
    window.setTimeout(() => {
      startLockRef.current = false;
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <div className="flex min-h-full items-start justify-center py-4 sm:py-6">
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="system-shell flex max-h-[calc(100dvh-2rem)] w-full max-w-6xl flex-col overflow-hidden sm:max-h-[calc(100dvh-3rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-white/10 p-5 sm:p-6">
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
              <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-dim mb-3">
                  Select Your Squad (up to 3)
                </p>

                <div className="grid grid-cols-1 gap-4 mb-5 md:grid-cols-3">
                  {[0, 1, 2].map((index) => {
                    const item = selectedItems[index];
                    if (item) {
                      const funko = item.funkoId ? getFunkoById(item.funkoId) : undefined;
                      return (
                        <div
                          key={item.id}
                          className="h-full"
                        >
                          <CollectibleDisplayCard
                            name={item.funkoName || item.product}
                            rarity={item.rarity}
                            imagePath={funko?.imagePath}
                            stats={item.stats}
                            metrics={[
                              { label: "Value", value: `$${item.value}`, tone: "gold" },
                              {
                                label: "Market",
                                value: funko ? `~$${funko.baseValue}` : "--",
                              },
                            ]}
                            variant="feature"
                            actions={[
                              {
                                label: "Remove",
                                onClick: () => handleRemoveUnit(index),
                                tone: "danger",
                              },
                            ]}
                          />
                        </div>
                      );
                    }
                    return (
                      <button
                        key={`empty-${index}`}
                        onClick={() => setCollectionModalOpen(true)}
                        className="module-card flex min-h-[420px] flex-col items-center justify-center gap-3 border border-dashed border-white/14 bg-white/[0.03] p-5 text-center transition-all hover:border-accent/40 hover:bg-accent/5 cursor-pointer md:min-h-[560px]"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-text-dim">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-text-dim">Select</span>
                      </button>
                    );
                  })}
                </div>

                {/* Stats Comparison */}
                {selectedItems.length > 0 && (
                  <div className="bg-surface/50 border border-white/10 rounded-xl p-3">
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
              </div>

              <div className="border-t border-white/10 px-5 py-4 sm:px-6">
                <div className="mx-auto max-w-sm">
                  <ArcadeButton
                    onClick={handleStartBattle}
                    disabled={selectedItems.length === 0}
                    tone="accent"
                    size="primary"
                    fillMode="center"
                    fullWidth
                  >
                    Start Battle
                  </ArcadeButton>
                </div>
              </div>
            </motion.div>
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
      )}
    </AnimatePresence>
  );
}
