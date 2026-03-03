import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useGame } from "../../context/GameContext";
import { CollectionModal } from "../shared/CollectionModal";
import { ProvablyFairReceiptModal } from "../shared/ProvablyFairReceiptModal";
import { RARITY_CONFIG } from "../../data/vaults";
import { getForgeOdds, applyForgeBoost } from "../../data/forge";
import { MAX_FORGE_BOOSTS } from "../../types/forge";
import { FORGE_ANIMATION } from "../../lib/motion-presets";
import { playSfx } from "../../lib/audio";
import { AnalyticsEvents, trackEvent } from "../../lib/analytics";
import type { Collectible } from "../../types/collectible";
import type { Rarity } from "../../types/vault";
import { useOverlayScrollLock } from "../../hooks/useOverlayScrollLock";
import { ForgeHud } from "./forge/ForgeHud";
import { ForgeChamber } from "./forge/ForgeChamber";
import { ForgeOddsStrip } from "./forge/ForgeOddsStrip";
import { ForgeBoostRail } from "./forge/ForgeBoostRail";
import { ForgeActionRail } from "./forge/ForgeActionRail";
import { ForgeResultOverlay } from "./forge/ForgeResultOverlay";
import { FunkoImage } from "../shared/FunkoImage";

type ForgeAnimationPhase = "dissolve" | "crucible" | "materialize" | null;

export function ForgePanel() {
  const { inventory, freeSpins, forgeItems, resolveForgeFairly, getProvablyFairReceipt } = useGame();
  const [selectedItems, setSelectedItems] = useState<(Collectible | null)[]>([null, null, null]);
  const [boostSpins, setBoostSpins] = useState(0);
  const [modalSlot, setModalSlot] = useState<number | null>(null);
  const [forgePhase, setForgePhase] = useState<ForgeAnimationPhase>(null);
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

  const selectedIds = selectedItems.filter(Boolean).map((item) => item!.id);
  const allSelected = selectedItems.every(Boolean);
  const selectedCount = selectedItems.filter(Boolean).length;
  const maxBoosts = Math.min(MAX_FORGE_BOOSTS, freeSpins);

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
        const xStart = (itemIdx - 1) * 110;
        const offset = ((i % FORGE_ANIMATION.sparkCount) - FORGE_ANIMATION.sparkCount / 2) * 12;
        return {
          id: i,
          itemIdx,
          xStart,
          xTarget: xStart + offset,
          yTarget: ((i % 5) - 2) * 20,
          delay: (i % FORGE_ANIMATION.sparkCount) * 0.035,
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
        y: -(88 + (i % 6) * 18),
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

    setForgePhase("dissolve");

    setTimeout(() => {
      setForgePhase("crucible");

      setTimeout(() => {
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
                  funkoId:
                    typeof fairResponse.resultPayload.funkoId === "string"
                      ? fairResponse.resultPayload.funkoId
                      : undefined,
                  funkoName:
                    typeof fairResponse.resultPayload.funkoName === "string"
                      ? fairResponse.resultPayload.funkoName
                      : undefined,
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

  return (
    <div data-tutorial="arena-forge" className="system-shell-strong relative overflow-hidden px-3 py-3 sm:px-5 sm:py-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(255,43,214,0.1)_0%,transparent_30%),radial-gradient(circle_at_85%_0%,rgba(0,234,255,0.08)_0%,transparent_28%)]" />
      <div className="relative z-10 space-y-2.5 sm:space-y-3">
        <ForgeHud
          selectedCount={selectedCount}
          freeSpins={freeSpins}
          odds={odds}
          proofAvailable={Boolean(forgeResult && forgeReceiptId)}
          onOpenProof={() => setShowProofModal(true)}
        />

        <ForgeChamber
          items={selectedItems}
          onSelectSlot={setModalSlot}
          onRemoveItem={handleRemoveItem}
          phase={forgePhase}
          reducedMotion={Boolean(prefersReducedMotion)}
        />

        <div className="space-y-3">
          <ForgeOddsStrip odds={odds} />
          <ForgeActionRail
            allSelected={allSelected}
            forging={forging}
            onForge={handleForge}
            boostRail={
              <ForgeBoostRail
                allSelected={allSelected}
                boostSpins={boostSpins}
                maxBoosts={maxBoosts}
                freeSpins={freeSpins}
                onDecrease={() => setBoostSpins(Math.max(0, boostSpins - 1))}
                onIncrease={() => setBoostSpins(Math.min(maxBoosts, boostSpins + 1))}
              />
            }
          />
        </div>
      </div>

      <AnimatePresence>
        {forging ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/88 p-4 backdrop-blur-md"
          >
            {prefersReducedMotion ? (
              <div className="system-shell-strong w-full max-w-md px-5 py-8 text-center">
                <p className="text-lg font-black uppercase tracking-[0.24em] text-accent">
                  Forging
                </p>
                <p className="mt-3 text-sm text-white/58">
                  The crucible is resolving your linked collectibles.
                </p>
              </div>
            ) : (
              <div className="system-shell-strong relative flex w-full max-w-3xl flex-col items-center justify-center overflow-hidden px-6 py-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,43,214,0.18)_0%,transparent_30%),radial-gradient(circle_at_50%_70%,rgba(0,234,255,0.12)_0%,transparent_35%)]" />

                <AnimatePresence>
                  {forgePhase === "dissolve" &&
                    selectedItems.map((item, i) => {
                      if (!item) return null;
                      const xOffset = (i - 1) * 110;
                      return (
                        <motion.div
                          key={`dissolve-${item.id}`}
                          className="absolute"
                          initial={{ x: xOffset, y: i === 2 ? 90 : -20, opacity: 1, scale: 1 }}
                          animate={{ x: 0, y: 0, opacity: 0, scale: 0.24 }}
                          transition={{ duration: 0.9, ease: "easeIn" }}
                        >
                          <FunkoImage name={item.funkoName || item.product} rarity={item.rarity} size="sm" />
                        </motion.div>
                      );
                    })}
                </AnimatePresence>

                <AnimatePresence>
                  {forgePhase === "dissolve"
                    ? dissolveParticles.map((particle) => (
                        <motion.div
                          key={`spark-${particle.id}`}
                          className="absolute h-1.5 w-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              RARITY_CONFIG[(selectedItems[particle.itemIdx]?.rarity ?? "common") as keyof typeof RARITY_CONFIG]?.color ??
                              "#a855f7",
                          }}
                          initial={{ x: particle.xStart, y: 0, opacity: 1, scale: 0.5 }}
                          animate={{
                            x: particle.xTarget,
                            y: particle.yTarget,
                            opacity: 0,
                            scale: 0,
                          }}
                          transition={{ duration: 0.6, delay: particle.delay, ease: "easeOut" }}
                        />
                      ))
                    : null}
                </AnimatePresence>

                <AnimatePresence>
                  {forgePhase === "crucible" ? (
                    <>
                      <motion.div
                        className="h-28 w-28 rounded-full"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.15, 1], opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ background: FORGE_ANIMATION.crucibleGradient }}
                      />
                      {emberParticles.map((particle) => (
                        <motion.div
                          key={`ember-${particle.id}`}
                          className="absolute h-1 w-1 rounded-full"
                          style={{
                            backgroundColor:
                              FORGE_ANIMATION.emberColors[
                                particle.id % FORGE_ANIMATION.emberColors.length
                              ],
                          }}
                          initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                          animate={{
                            x: particle.x,
                            y: particle.y,
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.3],
                          }}
                          transition={{
                            duration: particle.duration,
                            delay: particle.delay,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    </>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {forgePhase === "materialize" ? (
                    <>
                      <motion.div
                        className="fixed inset-0 pointer-events-none z-50"
                        initial={{ opacity: 0.55 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ backgroundColor: "rgba(255,255,255,0.24)" }}
                      />
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 15, stiffness: 200 }}
                        className="flex h-24 w-24 items-center justify-center rounded-[28px] border-2 border-accent/40 bg-accent/14"
                      >
                        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" className="text-accent">
                          <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8 2.4-7.2-6-4.8h7.6z" fill="currentColor" />
                        </svg>
                      </motion.div>
                    </>
                  ) : null}
                </AnimatePresence>

                <p className="relative z-10 mt-8 text-sm font-black uppercase tracking-[0.24em] text-accent">
                  {forgePhase === "dissolve"
                    ? "Dissolving"
                    : forgePhase === "crucible"
                      ? "Compressing"
                      : "Materializing"}
                </p>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ForgeResultOverlay
        result={forgeResult}
        receiptId={forgeReceiptId}
        onClose={() => setForgeResult(null)}
        onOpenProof={() => {
          if (forgeReceiptId) {
            trackEvent(AnalyticsEvents.PROVABLY_FAIR_RECEIPT_OPENED, {
              source: "forge_result",
              receipt_id: forgeReceiptId,
            });
          }
          setShowProofModal(true);
        }}
      />

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
        title="Select Forge Input"
      />
    </div>
  );
}
