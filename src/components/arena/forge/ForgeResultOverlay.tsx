import { motion, AnimatePresence } from "motion/react";
import type { Collectible } from "../../../types/collectible";
import { resolveCollectibleCatalogEntry, resolveCollectibleImagePath } from "../../../lib/collectible-display";
import { FunkoImage } from "../../shared/FunkoImage";
import { ArcadeButton } from "../../shared/ArcadeButton";

export function ForgeResultOverlay({
  result,
  receiptId,
  onClose,
  onOpenProof,
}: {
  result: Collectible | null;
  receiptId: string | null;
  onClose: () => void;
  onOpenProof: () => void;
}) {
  const catalogItem = result ? resolveCollectibleCatalogEntry(result) : undefined;
  const imagePath = result ? resolveCollectibleImagePath(result) : undefined;

  return (
    <AnimatePresence>
      {result ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/82 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 24, stiffness: 220 }}
            className="system-shell-strong relative w-full max-w-3xl overflow-hidden px-5 py-5 sm:px-6 sm:py-6"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="system-close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                Forge Result
              </div>
              <h3 className="mt-3 text-2xl font-black uppercase tracking-[0.06em] text-white sm:text-3xl">
                {result.funkoName || result.product}
              </h3>
              <div className="mt-2 text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: result.rarity === "legendary" ? "#ffd84a" : result.rarity === "rare" ? "#b96fff" : result.rarity === "uncommon" ? "#00eaff" : "#a8b0c0" }}>
                {result.rarity} outcome
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
              <div className="rounded-[28px] border border-white/10 bg-black/20 p-3">
                <div className="h-[248px]">
                  <FunkoImage
                    name={result.funkoName || result.product}
                    rarity={result.rarity}
                    imagePath={imagePath}
                    size="hero"
                    showLabel={false}
                    className="!h-full !w-full !rounded-[24px]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="rounded-[16px] border border-white/10 bg-black/20 px-3 py-3 text-center">
                    <div className="text-[9px] font-black uppercase tracking-[0.22em] text-white/45">ATK</div>
                    <div className="mt-1 text-base font-mono font-bold text-error">{result.stats.atk}</div>
                  </div>
                  <div className="rounded-[16px] border border-white/10 bg-black/20 px-3 py-3 text-center">
                    <div className="text-[9px] font-black uppercase tracking-[0.22em] text-white/45">DEF</div>
                    <div className="mt-1 text-base font-mono font-bold text-accent">{result.stats.def}</div>
                  </div>
                  <div className="rounded-[16px] border border-white/10 bg-black/20 px-3 py-3 text-center">
                    <div className="text-[9px] font-black uppercase tracking-[0.22em] text-white/45">AGI</div>
                    <div className="mt-1 text-base font-mono font-bold text-neon-green">{result.stats.agi}</div>
                  </div>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
                    <div className="text-[9px] font-black uppercase tracking-[0.22em] text-white/45">Value</div>
                    <div className="mt-2 text-lg font-black uppercase tracking-[0.08em] text-vault-gold">${result.value}</div>
                  </div>
                  <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-3">
                    <div className="text-[9px] font-black uppercase tracking-[0.22em] text-white/45">Market</div>
                    <div className="mt-2 text-lg font-black uppercase tracking-[0.08em] text-white">
                      {catalogItem ? `~$${catalogItem.baseValue}` : "--"}
                    </div>
                  </div>
                </div>

                <div className="system-rail flex flex-col gap-3 rounded-[22px] px-4 py-3 sm:flex-row sm:items-center sm:justify-end">
                  {receiptId ? (
                    <ArcadeButton onClick={onOpenProof} tone="neutral" size="compact" className="min-w-[10rem]">
                      View Proof
                    </ArcadeButton>
                  ) : null}
                  <ArcadeButton onClick={onClose} tone="accent" size="primary" className="min-w-[14rem]">
                    Add to Inventory
                  </ArcadeButton>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
