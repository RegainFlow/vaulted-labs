import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { getPreviewStats } from "../../data/item-stats";
import { getVaultItemsByRarity } from "../../data/funkos";
import {
  RARITY_CONFIG,
  getPrestigeOdds,
  VALUE_RANGE_REDUCTION,
} from "../../data/vaults";
import type { Vault, VaultTierName } from "../../types/vault";
import type { Rarity } from "../../types/vault";
import { CollectibleDisplayCard } from "../shared/CollectibleDisplayCard";
import { useOverlayScrollLock } from "../../hooks/useOverlayScrollLock";

interface VaultContentsModalProps {
  vault: Vault;
  prestigeLevel: number;
  onClose: () => void;
}

const RARITY_ORDER: Rarity[] = ["legendary", "rare", "uncommon", "common"];

export function VaultContentsModal({
  vault,
  prestigeLevel,
  onClose,
}: VaultContentsModalProps) {
  useOverlayScrollLock(true);
  const odds = getPrestigeOdds(vault.rarities, prestigeLevel);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] overflow-y-auto bg-bg/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <div className="flex min-h-full items-start justify-center px-4 py-8 sm:px-12 sm:py-12">
        <div
          className="system-shell w-full max-w-[110rem] px-4 py-5 sm:px-6 sm:py-6"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
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

          <div className="relative z-10 mb-8 pr-14 sm:pr-16">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                {vault.name} <span style={{ color: vault.color }}>Vault</span>{" "}
                Items
              </h2>
            </div>
          </div>

          {RARITY_ORDER.map((rarity) => {
            const config = RARITY_CONFIG[rarity];
            const chance = odds[rarity];
            const minVal = Math.max(
              1,
              Math.round(vault.price * config.minMult - VALUE_RANGE_REDUCTION)
            );
            const maxVal = Math.round(
              vault.price * config.maxMult - VALUE_RANGE_REDUCTION
            );
            const items = getVaultItemsByRarity(
              vault.name as VaultTierName,
              rarity
            );
            if (items.length === 0) return null;

            return (
              <div key={rarity} className="relative z-10 mb-8">
                <div
                  className="system-rail mb-4 flex items-center justify-between px-4 py-3"
                  style={{ borderColor: `${config.color}30` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: config.color,
                        boxShadow: `0 0 10px ${config.color}50`,
                      }}
                    />
                    <h3
                      className="text-lg font-black uppercase tracking-[0.18em]"
                      style={{ color: config.color }}
                    >
                      {rarity}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span
                      className="font-mono font-bold"
                      style={{ color: config.color }}
                    >
                      {chance}%
                    </span>
                    <span className="font-mono text-text-dim">
                      ${minVal} - ${maxVal}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {items.map((funko) => (
                    <CollectibleDisplayCard
                      key={funko.id}
                      name={funko.name}
                      rarity={funko.rarity}
                      imagePath={funko.imagePath}
                      stats={getPreviewStats(
                        funko.rarity,
                        vault.name as VaultTierName
                      )}
                        metrics={[
                          {
                            label: "Market",
                            value: `~$${Math.min(funko.baseValue, maxVal)}`,
                            tone: "gold",
                          },
                        ]}
                      variant="vault-preview"
                      showRarityBadge={false}
                      statsMode="minimal"
                      metricsMode="inline"
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>,
    document.body
  );
}
