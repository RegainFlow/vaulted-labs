import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getFunkoById } from "../../data/funkos";
import type { Collectible } from "../../types/collectible";
import { CollectibleDisplayCard } from "./CollectibleDisplayCard";
import { useOverlayScrollLock } from "../../hooks/useOverlayScrollLock";

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
    const funko = item.funkoId ? getFunkoById(item.funkoId) : undefined;

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
        <CollectibleDisplayCard
          name={item.funkoName || item.product}
          rarity={item.rarity}
          imagePath={funko?.imagePath}
          stats={item.stats}
          metrics={[
            {
              label: "Value",
              value: `$${item.value}`,
              tone: "gold",
            },
            {
              label: "Market",
              value: funko ? `~$${funko.baseValue}` : "--",
            },
          ]}
          variant="selection"
          topRightBadge={
            item.isEquipped ? (
              <span className="rounded-full border border-accent/35 bg-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                Equipped
              </span>
            ) : undefined
          }
          detail={
            <div className="flex items-center  justify-center">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-accent">
                Select
              </span>
            </div>
          }
        />
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
                          className="w-[min(82vw,21rem)] flex-none snap-center"
                        >
                          {renderItemCard(item)}
                        </div>
                      ))}
                    </div>

                    <div className="mx-auto hidden max-w-6xl grid-cols-2 gap-6 sm:grid lg:grid-cols-3 xl:grid-cols-4">
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
