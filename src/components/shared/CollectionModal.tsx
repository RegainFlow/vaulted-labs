import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Collectible } from "../../types/collectible";
import { useOverlayScrollLock } from "../../hooks/useOverlayScrollLock";
import { resolveCollectibleCatalogEntry, resolveCollectibleImagePath } from "../../lib/collectible-display";
import { FunkoImage } from "./FunkoImage";

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
  title = "Select Inventory Item",
}: CollectionModalProps) {
  useOverlayScrollLock(isOpen);
  const [selectionLocked, setSelectionLocked] = useState(false);
  const excludeSet = new Set(excludeIds);
  const available = items.filter(
    (item) => item.status === "held" && !excludeSet.has(item.id)
  );

  const handleClose = () => {
    setSelectionLocked(false);
    onClose();
  };

  const renderItemCard = (item: Collectible) => {
    const funko = resolveCollectibleCatalogEntry(item);
    const imagePath = resolveCollectibleImagePath(item);

    return (
      <button
        key={item.id}
        onClick={() => {
          if (selectionLocked) return;
          setSelectionLocked(true);
          onSelect(item);
          window.setTimeout(() => setSelectionLocked(false), 0);
        }}
        disabled={selectionLocked}
        className="w-full text-left"
      >
        <div className="module-card flex h-full min-h-[430px] flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1">
          <div className="relative overflow-hidden border-b border-white/8 px-4 pb-4 pt-14">
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 14%, ${item.rarity === "legendary" ? "rgba(255,215,0,0.14)" : item.rarity === "rare" ? "rgba(168,85,247,0.16)" : item.rarity === "uncommon" ? "rgba(0,234,255,0.14)" : "rgba(255,255,255,0.08)"} 0%, rgba(8,12,20,0.98) 64%)`,
              }}
            />
            <div className="pointer-events-none absolute left-4 top-4 z-20">
              <span className="rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-sm"
                style={{
                  color:
                    item.rarity === "legendary"
                      ? "#ffd84a"
                      : item.rarity === "rare"
                        ? "#b96fff"
                        : item.rarity === "uncommon"
                          ? "#00eaff"
                          : "#a8b0c0",
                  borderColor:
                    item.rarity === "legendary"
                      ? "rgba(255,216,74,0.3)"
                      : item.rarity === "rare"
                        ? "rgba(185,111,255,0.32)"
                        : item.rarity === "uncommon"
                          ? "rgba(0,234,255,0.28)"
                          : "rgba(168,176,192,0.24)",
                  backgroundColor: "rgba(10,16,24,0.82)",
                }}
              >
                {item.rarity}
              </span>
            </div>
            {item.isEquipped ? (
              <div className="pointer-events-none absolute right-4 top-4 z-20">
                <span className="rounded-full border border-accent/35 bg-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                  Equipped
                </span>
              </div>
            ) : null}
            <div className="relative z-10 rounded-[28px] border border-white/10 bg-black/20 p-3">
              <div className="h-[220px]">
                <FunkoImage
                  name={item.funkoName || item.product}
                  rarity={item.rarity}
                  imagePath={imagePath}
                  size="hero"
                  showLabel={false}
                  className="!h-full !w-full !rounded-[24px]"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
            <h3 className="truncate text-lg font-black uppercase tracking-[0.08em] text-white">
              {item.funkoName || item.product}
            </h3>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <div className="rounded-[16px] border border-white/10 bg-black/20 px-3 py-2 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-dim">
                  ATK
                </p>
                <p className="mt-1 text-sm font-mono font-bold text-error">{item.stats.atk}</p>
              </div>
              <div className="rounded-[16px] border border-white/10 bg-black/20 px-3 py-2 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-dim">
                  DEF
                </p>
                <p className="mt-1 text-sm font-mono font-bold text-accent">{item.stats.def}</p>
              </div>
              <div className="rounded-[16px] border border-white/10 bg-black/20 px-3 py-2 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-dim">
                  AGI
                </p>
                <p className="mt-1 text-sm font-mono font-bold text-neon-green">{item.stats.agi}</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <div className="rounded-[16px] border border-white/10 bg-black/20 px-3 py-2.5">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-dim">
                  Value
                </p>
                <p className="mt-1 text-sm font-mono font-bold text-vault-gold">
                  ${item.value}
                </p>
              </div>
              <div className="rounded-[16px] border border-white/10 bg-black/20 px-3 py-2.5">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-dim">
                  Market
                </p>
                <p className="mt-1 text-sm font-mono font-bold text-white">
                  {funko ? `~$${funko.baseValue}` : "--"}
                </p>
              </div>
            </div>

            <div className="mt-auto pt-4 text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                Select
              </span>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div className="flex min-h-full items-start justify-center py-4 sm:py-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="system-shell flex max-h-[calc(100dvh-2rem)] w-full max-w-6xl flex-col overflow-hidden sm:max-h-[calc(100dvh-3rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close"
                onClick={handleClose}
                className="system-close"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="relative z-10 border-b border-white/8 px-5 py-4 pr-14 sm:pr-16">
                <h3 className="text-sm font-black uppercase tracking-[0.28em] text-white">
                  {title}
                </h3>
              </div>

              <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
                {available.length === 0 ? (
                  <div className="module-card text-center py-12">
                    <p className="text-text-muted text-sm font-bold mb-1">
                      No items available
                    </p>
                    <p className="text-text-dim text-xs">
                      Open vaults to get collectibles for your squad or forge.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 sm:hidden">
                      {available.map((item) => (
                        <div
                          key={item.id}
                          className="w-[min(78vw,18rem)] flex-none snap-center"
                        >
                          {renderItemCard(item)}
                        </div>
                      ))}
                    </div>

                    <div className="mx-auto hidden max-w-6xl grid-cols-2 gap-4 sm:grid lg:grid-cols-3 xl:grid-cols-4">
                      {available.map((item) => (
                        <div key={item.id} className="min-w-0">
                          {renderItemCard(item)}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
