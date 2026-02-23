import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGame } from "../../context/GameContext";
import { CollectionModal } from "../shared/CollectionModal";
import { FunkoImage } from "../shared/FunkoImage";
import { RARITY_CONFIG } from "../../data/vaults";
import { getForgeOdds, applyForgeBoost } from "../../data/forge";
import { MAX_FORGE_BOOSTS } from "../../types/forge";
import type { Collectible } from "../../types/collectible";
import type { Rarity } from "../../types/vault";

export function ForgePanel() {
  const { inventory, freeSpins, forgeItems } = useGame();
  const [selectedItems, setSelectedItems] = useState<(Collectible | null)[]>([null, null, null]);
  const [boostSpins, setBoostSpins] = useState(0);
  const [modalSlot, setModalSlot] = useState<number | null>(null);
  const [forging, setForging] = useState(false);
  const [forgeResult, setForgeResult] = useState<Collectible | null>(null);

  const selectedIds = selectedItems.filter(Boolean).map((i) => i!.id);
  const allSelected = selectedItems.every(Boolean);
  const maxBoosts = Math.min(MAX_FORGE_BOOSTS, freeSpins);

  // Live odds calculation
  const odds = useMemo(() => {
    if (!allSelected) return null;
    const items = selectedItems as Collectible[];
    const baseOdds = getForgeOdds(items[0].rarity, items[1].rarity, items[2].rarity);
    return applyForgeBoost(baseOdds, boostSpins);
  }, [selectedItems, allSelected, boostSpins]);

  const handleSelectItem = (item: Collectible) => {
    if (modalSlot === null) return;
    setSelectedItems((prev) => {
      const next = [...prev];
      next[modalSlot] = item;
      return next;
    });
    setModalSlot(null);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const handleForge = () => {
    if (!allSelected) return;
    const items = selectedItems as Collectible[];
    setForging(true);

    // Animate forging for 2.5 seconds
    setTimeout(() => {
      const result = forgeItems(
        [items[0].id, items[1].id, items[2].id],
        boostSpins
      );
      setForging(false);
      if (result) {
        setForgeResult(result);
        setSelectedItems([null, null, null]);
        setBoostSpins(0);
      }
    }, 2500);
  };

  const rarityColors: Record<Rarity, string> = {
    common: "#6B7280",
    uncommon: "#3B82F6",
    rare: "#a855f7",
    legendary: "#FFD700"
  };

  return (
    <div data-tutorial="arena-forge">
      <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">
        Forge
      </h3>
      <p className="text-[10px] text-text-dim mb-4">
        Combine 3 collectibles into a new one. Higher rarity inputs = better odds.
      </p>

      {/* Input slots */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[0, 1, 2].map((index) => {
          const item = selectedItems[index];
          if (item) {
            const rarityConfig = RARITY_CONFIG[item.rarity];
            return (
              <button
                key={item.id}
                onClick={() => handleRemoveItem(index)}
                className="rounded-xl border bg-surface/50 p-3 text-center transition-all hover:border-error/40 cursor-pointer group"
                style={{ borderColor: `${rarityConfig.color}40` }}
              >
                <FunkoImage name={item.funkoName || item.product} rarity={item.rarity} size="xs" className="mx-auto mb-1" />
                <p className="text-[9px] font-bold text-white truncate">{item.funkoName || item.product}</p>
                <span className="text-[8px] font-bold uppercase" style={{ color: rarityConfig.color }}>
                  {item.rarity}
                </span>
                <div className="opacity-0 group-hover:opacity-100 text-[8px] text-error font-bold mt-1 transition-opacity">
                  Remove
                </div>
              </button>
            );
          }
          return (
            <button
              key={`forge-slot-${index}`}
              onClick={() => setModalSlot(index)}
              className="rounded-xl border-2 border-dashed border-white/15 bg-surface/30 p-6 flex flex-col items-center justify-center gap-1 hover:border-rarity-rare/40 transition-all cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-text-dim">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-[8px] font-bold uppercase text-text-dim">Add</span>
            </button>
          );
        })}
      </div>

      {/* Live odds table */}
      {odds && (
        <div className="bg-surface/50 border border-white/10 rounded-xl p-3 mb-4">
          <p className="text-[9px] font-bold uppercase tracking-wider text-text-dim mb-2">Forge Odds</p>
          <div className="flex gap-3">
            {(["common", "uncommon", "rare", "legendary"] as Rarity[]).map((rarity) => (
              <div key={rarity} className="flex-1 text-center">
                <p className="text-[8px] font-bold uppercase" style={{ color: rarityColors[rarity] }}>
                  {rarity}
                </p>
                <p className="text-xs font-mono font-bold text-white">
                  {odds[rarity]}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Boost toggle */}
      {allSelected && maxBoosts > 0 && (
        <div className="bg-surface/50 border border-white/10 rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text-dim">
              Boost with Free Spins ({freeSpins} available)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBoostSpins(Math.max(0, boostSpins - 1))}
                disabled={boostSpins <= 0}
                className="w-6 h-6 rounded bg-surface border border-white/10 text-white text-xs font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="text-xs font-mono font-bold text-neon-green w-4 text-center">{boostSpins}</span>
              <button
                onClick={() => setBoostSpins(Math.min(maxBoosts, boostSpins + 1))}
                disabled={boostSpins >= maxBoosts}
                className="w-6 h-6 rounded bg-surface border border-white/10 text-white text-xs font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forge button */}
      <button
        onClick={handleForge}
        disabled={!allSelected || forging}
        className={`w-full px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
          allSelected && !forging
            ? "bg-rarity-rare/10 border-rarity-rare/30 text-rarity-rare hover:bg-rarity-rare/20 cursor-pointer"
            : "bg-white/5 border-white/10 text-text-dim cursor-not-allowed"
        }`}
      >
        {forging ? "Forging..." : "FORGE"}
      </button>

      {/* Forging animation overlay */}
      <AnimatePresence>
        {forging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-full border-4 border-rarity-rare/30 border-t-rarity-rare"
            />
            <p className="absolute bottom-1/3 text-sm font-black uppercase tracking-widest text-rarity-rare">
              Forging...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forge result overlay */}
      <AnimatePresence>
        {forgeResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setForgeResult(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-surface-elevated border border-white/10 rounded-2xl p-8 max-w-sm text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <FunkoImage name={forgeResult.funkoName || forgeResult.product} rarity={forgeResult.rarity} size="lg" className="mx-auto mb-4" />
              <h3 className="text-xl font-black text-white uppercase mb-1">
                {RARITY_CONFIG[forgeResult.rarity].label}!
              </h3>
              <span
                className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border mb-3"
                style={{
                  color: RARITY_CONFIG[forgeResult.rarity].color,
                  borderColor: `${RARITY_CONFIG[forgeResult.rarity].color}40`,
                  backgroundColor: `${RARITY_CONFIG[forgeResult.rarity].color}10`
                }}
              >
                {forgeResult.rarity}
              </span>
              <div className="flex justify-center gap-3 text-xs font-mono mb-4">
                <span className="text-error">ATK {forgeResult.stats.atk}</span>
                <span className="text-neon-cyan">DEF {forgeResult.stats.def}</span>
                <span className="text-neon-green">AGI {forgeResult.stats.agi}</span>
              </div>
              <p className="text-text-muted text-sm mb-4">
                Value: <span className="font-bold text-white">${forgeResult.value}</span>
              </p>
              <button
                onClick={() => setForgeResult(null)}
                className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-all cursor-pointer"
              >
                Add to Collection
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CollectionModal
        isOpen={modalSlot !== null}
        onClose={() => setModalSlot(null)}
        onSelect={handleSelectItem}
        items={inventory}
        excludeIds={selectedIds}
        title="Select for Forge"
      />
    </div>
  );
}
