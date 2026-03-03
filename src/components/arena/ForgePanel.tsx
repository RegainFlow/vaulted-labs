import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useGame } from "../../context/GameContext";
import { getFunkoById } from "../../data/funkos";
import { CollectionModal } from "../shared/CollectionModal";
import { CollectibleDisplayCard } from "../shared/CollectibleDisplayCard";
import { FunkoImage } from "../shared/FunkoImage";
import { RARITY_CONFIG } from "../../data/vaults";
import { getForgeOdds, applyForgeBoost } from "../../data/forge";
import { MAX_FORGE_BOOSTS } from "../../types/forge";
import { FORGE_ANIMATION } from "../../lib/motion-presets";
import { playSfx } from "../../lib/audio";
import { ProvablyFairReceiptModal } from "../shared/ProvablyFairReceiptModal";
import { AnalyticsEvents, trackEvent } from "../../lib/analytics";
import type { Collectible } from "../../types/collectible";
import type { Rarity } from "../../types/vault";
import { useOverlayScrollLock } from "../../hooks/useOverlayScrollLock";

type ForgePhase = "dissolve" | "crucible" | "materialize" | null;

export function ForgePanel() {
  const { inventory, freeSpins, forgeItems, resolveForgeFairly, getProvablyFairReceipt } = useGame();
  const [selectedItems, setSelectedItems] = useState<(Collectible | null)[]>([null, null, null]);
  const [boostSpins, setBoostSpins] = useState(0);
  const [modalSlot, setModalSlot] = useState<number | null>(null);
  const [forgePhase, setForgePhase] = useState<ForgePhase>(null);
  const [forgeResult, setForgeResult] = useState<Collectible | null>(null);
  const [forgeReceiptId, setForgeReceiptId] = useState<string | null>(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const forgeLockRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const forging = forgePhase !== null;
  useOverlayScrollLock(forging || Boolean(forgeResult));

  useEffect(() => {
    playSfx("foundry_open");
  }, []);

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
  const dissolveParticles = useMemo(
    () =>
      Array.from({ length: FORGE_ANIMATION.sparkCount * 3 }).map((_, i) => {
        const itemIdx = Math.floor(i / FORGE_ANIMATION.sparkCount);
        const xStart = (itemIdx - 1) * 80;
        const offset = ((i % FORGE_ANIMATION.sparkCount) - FORGE_ANIMATION.sparkCount / 2) * 10;
        return {
          id: i,
          itemIdx,
          xStart,
          xTarget: xStart + offset,
          yTarget: ((i % 5) - 2) * 18,
          delay: (i % FORGE_ANIMATION.sparkCount) * 0.04,
        };
      }),
    []
  );
  const emberCount =
    typeof window !== "undefined" && window.innerWidth < 640
      ? 15
      : FORGE_ANIMATION.emberCount;
  const emberParticles = useMemo(
    () =>
      Array.from({ length: emberCount }).map((_, i) => ({
        id: i,
        x: ((i % 5) - 2) * 14,
        y: -(72 + (i % 6) * 18),
        duration: 0.9 + (i % 4) * 0.12,
        delay: (i % 6) * 0.08,
      })),
    [emberCount]
  );

  const handleSelectItem = (item: Collectible) => {
    if (modalSlot === null) return;
    if (selectedItems.some((entry) => entry?.id === item.id)) {
      setModalSlot(null);
      return;
    }
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
    if (!allSelected || forgeLockRef.current) return;
    forgeLockRef.current = true;
    playSfx("foundry_forge");
    const items = selectedItems as Collectible[];

    // Phase 1: Dissolve
    setForgePhase("dissolve");

    setTimeout(() => {
      // Phase 2: Crucible
      setForgePhase("crucible");

      setTimeout(() => {
        // Phase 3: Materialize
        setForgePhase("materialize");

        setTimeout(() => {
          void (async () => {
            const fairResponse = await resolveForgeFairly({
              inputItemIds: [items[0].id, items[1].id, items[2].id],
              inputRarities: [items[0].rarity, items[1].rarity, items[2].rarity],
              inputVaultTiers: [
                items[0].vaultTier,
                items[1].vaultTier,
                items[2].vaultTier,
              ],
              inputValues: [items[0].value, items[1].value, items[2].value],
              spinsUsed: boostSpins,
              oddsSnapshot: odds,
            });

            const result = forgeItems(
              [items[0].id, items[1].id, items[2].id],
              boostSpins,
              fairResponse
                ? {
                    rarity: fairResponse.resultPayload.rarity as Rarity,
                    product: fairResponse.resultPayload.product as string,
                    vaultTier: fairResponse.resultPayload.vaultTier as typeof items[number]["vaultTier"],
                    value: Number(fairResponse.resultPayload.value),
                    stats: fairResponse.resultPayload.stats as Collectible["stats"],
                    receiptId: fairResponse.receipt.id,
                  }
                : undefined
            );
            setForgePhase(null);
            forgeLockRef.current = false;
            if (result) {
              setForgeReceiptId(fairResponse?.receipt.id ?? null);
              setForgeResult(result);
              setSelectedItems([null, null, null]);
              setBoostSpins(0);
            }
          })();
        }, FORGE_ANIMATION.materializeDuration);
      }, FORGE_ANIMATION.crucibleDuration);
    }, FORGE_ANIMATION.dissolveDuration);
  };

  const rarityColors: Record<Rarity, string> = {
    common: "#6B7280",
    uncommon: "#3B82F6",
    rare: "#a855f7",
    legendary: "#FFD700"
  };

  return (
    <div data-tutorial="arena-forge" className="system-shell px-4 py-4 sm:px-5 sm:py-5">
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
                  variant="selection"
                  actions={[
                    {
                      label: "Remove",
                      onClick: () => handleRemoveItem(index),
                      tone: "danger",
                    },
                  ]}
                />
              </div>
            );
          }
          return (
            <button
              key={`forge-slot-${index}`}
              onClick={() => setModalSlot(index)}
              className="module-card flex min-h-[470px] flex-col items-center justify-center gap-3 border border-dashed border-white/14 bg-white/[0.03] p-6 text-center transition-all hover:border-rarity-rare/40 hover:bg-rarity-rare/5 cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-text-dim">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-[9px] font-bold uppercase tracking-wider text-text-dim">Select</span>
            </button>
          );
        })}
      </div>

      {/* Live odds table */}
      {odds && (
        <div className="module-card p-3 mb-4">
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
        <div className="module-card p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-text-dim">
              Boost with Free Spins ({freeSpins} available)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBoostSpins(Math.max(0, boostSpins - 1))}
                disabled={boostSpins <= 0}
                className="command-segment flex h-7 w-7 items-center justify-center rounded-[12px] border border-white/10 bg-white/[0.04] text-white text-xs font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="text-xs font-mono font-bold text-neon-green w-4 text-center">{boostSpins}</span>
              <button
                onClick={() => setBoostSpins(Math.min(maxBoosts, boostSpins + 1))}
                disabled={boostSpins >= maxBoosts}
                className="command-segment flex h-7 w-7 items-center justify-center rounded-[12px] border border-white/10 bg-white/[0.04] text-white text-xs font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
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
            ? "bg-rarity-rare/10 border-rarity-rare/30 text-rarity-rare hover:bg-rarity-rare/20 active:scale-[0.98] cursor-pointer"
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm"
          >
            {prefersReducedMotion ? (
              <div className="text-center">
                <motion.p
                  className="text-lg font-black uppercase tracking-widest text-rarity-rare"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Forging...
                </motion.p>
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center">
                {/* Phase 1: Dissolve — items animate toward center */}
                <AnimatePresence>
                  {forgePhase === "dissolve" && selectedItems.map((item, i) => {
                    if (!item) return null;
                    const xOffset = (i - 1) * 80;
                    return (
                      <motion.div
                        key={`dissolve-${item.id}`}
                        className="absolute"
                        initial={{ x: xOffset, y: 0, opacity: 1, scale: 1 }}
                        animate={{ x: 0, y: 0, opacity: 0, scale: 0.2 }}
                        transition={{ duration: 0.9, ease: "easeIn" }}
                      >
                        <FunkoImage name={item.funkoName || item.product} rarity={item.rarity} size="sm" />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Dissolve spark particles */}
                <AnimatePresence>
                  {forgePhase === "dissolve" && (
                    <>
                      {dissolveParticles.map((particle) => {
                        return (
                          <motion.div
                            key={`spark-${particle.id}`}
                            className="absolute w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: RARITY_CONFIG[(selectedItems[particle.itemIdx]?.rarity ?? "common") as keyof typeof RARITY_CONFIG]?.color ?? "#a855f7" }}
                            initial={{ x: particle.xStart, y: 0, opacity: 1, scale: 0.5 }}
                            animate={{
                              x: particle.xTarget,
                              y: particle.yTarget,
                              opacity: 0,
                              scale: 0
                            }}
                            transition={{ duration: 0.6, delay: particle.delay, ease: "easeOut" }}
                          />
                        );
                      })}
                    </>
                  )}
                </AnimatePresence>

                {/* Phase 2: Crucible — glowing orb with ember particles */}
                <AnimatePresence>
                  {forgePhase === "crucible" && (
                    <>
                      <motion.div
                        className="w-24 h-24 rounded-full"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ background: FORGE_ANIMATION.crucibleGradient }}
                      />
                      {/* Ember particles drifting upward */}
                      {emberParticles.map((particle) => (
                        <motion.div
                          key={`ember-${particle.id}`}
                          className="absolute w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: FORGE_ANIMATION.emberColors[particle.id % FORGE_ANIMATION.emberColors.length]
                          }}
                          initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                          animate={{
                            x: particle.x,
                            y: particle.y,
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.3]
                          }}
                          transition={{
                            duration: particle.duration,
                            delay: particle.delay,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>

                {/* Phase 3: Materialize — white flash + new item placeholder */}
                <AnimatePresence>
                  {forgePhase === "materialize" && (
                    <>
                      <motion.div
                        className="fixed inset-0 pointer-events-none z-50"
                        initial={{ opacity: 0.6 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
                      />
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 15, stiffness: 200 }}
                        className="w-20 h-20 rounded-2xl bg-rarity-rare/20 border-2 border-rarity-rare/40 flex items-center justify-center"
                      >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-rarity-rare">
                          <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8 2.4-7.2-6-4.8h7.6z" fill="currentColor" />
                        </svg>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* Phase label */}
                <p className="absolute -bottom-12 text-sm font-black uppercase tracking-widest text-rarity-rare">
                  {forgePhase === "dissolve" ? "Dissolving..." :
                   forgePhase === "crucible" ? "Smelting..." :
                   "Materializing..."}
                </p>
              </div>
            )}
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
              className="system-shell w-full max-w-xl p-5 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-accent">
                  Forge Result
                </p>
              </div>
              <CollectibleDisplayCard
                name={forgeResult.funkoName || forgeResult.product}
                rarity={forgeResult.rarity}
                imagePath={getFunkoById(forgeResult.funkoId || "")?.imagePath}
                stats={forgeResult.stats}
                metrics={[
                  { label: "Value", value: `$${forgeResult.value}`, tone: "gold" },
                  {
                    label: "Market",
                    value: getFunkoById(forgeResult.funkoId || "") ? `~$${getFunkoById(forgeResult.funkoId || "")?.baseValue}` : "--",
                  },
                ]}
                variant="feature"
                actions={[
                  {
                    label: "Add to Inventory",
                    onClick: () => setForgeResult(null),
                    tone: "accent",
                  },
                  ...(forgeReceiptId
                    ? [
                        {
                          label: "View Proof",
                          onClick: () => {
                            if (forgeReceiptId) {
                              trackEvent(AnalyticsEvents.PROVABLY_FAIR_RECEIPT_OPENED, {
                                source: "forge_result",
                                receipt_id: forgeReceiptId,
                              });
                            }
                            setShowProofModal(true);
                          },
                          tone: "muted" as const,
                        },
                      ]
                    : []),
                ]}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ProvablyFairReceiptModal
        receipt={
          showProofModal && forgeReceiptId
            ? getProvablyFairReceipt(forgeReceiptId)
            : null
        }
        onClose={() => setShowProofModal(false)}
      />

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
