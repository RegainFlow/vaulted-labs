import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Battle } from "../../types/gamification";
import type { Collectible } from "../../types/collectible";
import { useGame } from "../../context/GameContext";
import { CollectionModal } from "../shared/CollectionModal";
import { getPrestigeBattleStats } from "../../data/gamification";
import { BossIcon } from "../../assets/boss-icons";
import { ArcadeButton } from "../shared/ArcadeButton";
import { useOverlayScrollLock } from "../../hooks/useOverlayScrollLock";
import { getBattlePresentationProfile } from "../../lib/battle-presentation";
import { FunkoImage } from "../shared/FunkoImage";
import { resolveCollectibleImagePath } from "../../lib/collectible-display";

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
  onStartBattle,
}: BattleSetupModalProps) {
  useOverlayScrollLock(isOpen);
  const { inventory, prestigeLevel } = useGame();
  const [selectedItems, setSelectedItems] = useState<Collectible[]>([]);
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const startLockRef = useRef(false);

  const scaled = getPrestigeBattleStats(battle, prestigeLevel);
  const profile = getBattlePresentationProfile(battle.id);
  const selectedIds = selectedItems.map((item) => item.id);

  const squadStats = selectedItems.reduce(
    (acc, item) => ({
      totalAtk: acc.totalAtk + item.stats.atk,
      totalDef: acc.totalDef + item.stats.def,
      totalAgi: acc.totalAgi + item.stats.agi,
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
    setSelectedItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
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
          <div className="flex min-h-full items-start justify-center py-3 sm:py-4">
            <motion.div
              initial={{ scale: 0.94, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 24 }}
              transition={{ type: "spring", damping: 22 }}
              className="system-shell flex max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden sm:max-h-[calc(100dvh-2rem)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="border-b border-white/10 px-4 py-3.5 pr-14 sm:px-5 sm:py-4 sm:pr-16">
                <div className="flex items-start gap-4">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-white/10 bg-black/25">
                    <div className="absolute inset-0 rounded-[16px]" style={{ background: profile.hudGradient, opacity: 0.55 }} />
                    <BossIcon bossId={battle.id} size={28} color={profile.accentPrimary} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-black uppercase tracking-[0.28em] text-white/42">
                      Tactical Loadout
                    </div>
                    <h3 className="mt-2 text-xl font-black uppercase tracking-[0.08em] text-white sm:text-[1.75rem]">
                      VS. {battle.name}
                    </h3>
                    <p className="mt-2 text-sm text-white/58">
                      {profile.bossSubtitle}. Assemble up to 3 units before entering the arena.
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="system-close"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-4.5">
                <div className="grid gap-3 xl:grid-cols-[220px_minmax(0,1fr)]">
                  <div>
                    <div className="module-card relative overflow-hidden px-4 py-4">
                      <div className="absolute inset-0 opacity-80" style={{ background: profile.ambientGradient }} />
                      <div className="relative z-10">
                        <div className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
                          Boss Preview
                        </div>
                        <div className="relative mx-auto mt-3 flex h-[138px] items-center justify-center rounded-[20px] border border-white/10 bg-black/30">
                          <div className="absolute inset-4 rounded-full border border-white/10" />
                          <div className="absolute inset-[24%] rounded-full border border-accent/25" />
                          <BossIcon bossId={battle.id} size={64} color={profile.accentPrimary} />
                        </div>
                        <div className="mt-3 rounded-[18px] border border-white/10 bg-black/20 px-4 py-4">
                          <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
                            Threat Summary
                          </div>
                          <div className="mt-2 text-lg font-black uppercase tracking-[0.06em] text-white">
                            {profile.threatLabel}
                          </div>
                          <div className="mt-2 text-sm text-white/58">
                            {battle.description}
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="rounded-[14px] border border-white/10 bg-black/20 px-3 py-2.5 text-center">
                              <div className="text-[8px] font-black uppercase tracking-[0.22em] text-white/45">HP</div>
                              <div className="mt-1 text-sm font-mono font-bold text-white">{scaled.hp}</div>
                            </div>
                            <div className="rounded-[14px] border border-white/10 bg-black/20 px-3 py-2.5 text-center">
                              <div className="text-[8px] font-black uppercase tracking-[0.22em] text-white/45">Energy</div>
                              <div className="mt-1 text-sm font-mono font-bold text-neon-green">{battle.energyCost}</div>
                            </div>
                            <div className="rounded-[14px] border border-white/10 bg-black/20 px-3 py-2.5 text-center">
                              <div className="text-[8px] font-black uppercase tracking-[0.22em] text-white/45">ATK</div>
                              <div className="mt-1 text-sm font-mono font-bold text-[#ff5d8f]">{scaled.atk}</div>
                            </div>
                            <div className="rounded-[14px] border border-white/10 bg-black/20 px-3 py-2.5 text-center">
                              <div className="text-[8px] font-black uppercase tracking-[0.22em] text-white/45">DEF</div>
                              <div className="mt-1 text-sm font-mono font-bold text-[#8cecff]">{scaled.def}</div>
                            </div>
                          </div>
                          {battle.mechanics ? (
                            <div className="mt-3 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/65">
                              {battle.mechanics}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
                        Select Your Squad
                      </div>
                      <div className="mt-3 grid gap-3 md:grid-cols-3">
                        {[0, 1, 2].map((index) => {
                          const item = selectedItems[index];
                          if (item) {
                            return (
                              <div
                                key={item.id}
                                className="module-card flex min-h-[210px] flex-col overflow-hidden px-3 py-3"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="text-[9px] font-black uppercase tracking-[0.24em] text-cyan-200/75">
                                    Unit {index + 1}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveUnit(index)}
                                    className="rounded-full border border-error/30 bg-error/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-error cursor-pointer transition-colors hover:bg-error/20"
                                  >
                                    Remove
                                  </button>
                                </div>
                                <div className="mt-3 rounded-[18px] border border-white/10 bg-black/20 p-2.5">
                                  <div className="mx-auto h-[92px] w-full max-w-[122px]">
                                    <FunkoImage
                                      name={item.funkoName || item.product}
                                      rarity={item.rarity}
                                      imagePath={resolveCollectibleImagePath(item)}
                                      size="hero"
                                      showLabel={false}
                                    />
                                  </div>
                                </div>
                                <div className="mt-3 text-sm font-black uppercase tracking-[0.05em] text-white">
                                  {item.funkoName || item.product}
                                </div>
                                <div className="mt-2.5 grid grid-cols-3 gap-2">
                                  <div className="rounded-[14px] border border-white/10 bg-black/20 px-2 py-2 text-center">
                                    <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/45">ATK</div>
                                    <div className="mt-1 text-sm font-mono font-bold text-[#ff5d8f]">{item.stats.atk}</div>
                                  </div>
                                  <div className="rounded-[14px] border border-white/10 bg-black/20 px-2 py-2 text-center">
                                    <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/45">DEF</div>
                                    <div className="mt-1 text-sm font-mono font-bold text-[#9d8dff]">{item.stats.def}</div>
                                  </div>
                                  <div className="rounded-[14px] border border-white/10 bg-black/20 px-2 py-2 text-center">
                                    <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/45">AGI</div>
                                    <div className="mt-1 text-sm font-mono font-bold text-[#7cffc9]">{item.stats.agi}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <button
                              key={`empty-${index}`}
                              onClick={() => setCollectionModalOpen(true)}
                              className="module-card flex min-h-[210px] flex-col items-center justify-center gap-3 border border-dashed border-white/14 bg-white/[0.03] p-5 text-center transition-all hover:border-accent/40 hover:bg-accent/5 cursor-pointer"
                            >
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-white/55">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                              </div>
                              <div>
                                <div className="text-sm font-black uppercase tracking-[0.16em] text-white">
                                  Select Unit
                                </div>
                                <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-white/42">
                                  Slot {index + 1}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="module-card px-4 py-4 sm:px-5">
                      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
                            Squad Comparison
                          </div>
                          <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-[16px] border border-white/10 bg-black/20 px-3 py-3">
                              <div className="text-[8px] font-black uppercase tracking-[0.22em] text-white/45">Squad ATK</div>
                              <div className="mt-1 text-sm font-mono font-bold text-[#ff5d8f]">{squadStats.totalAtk}</div>
                            </div>
                            <div className="rounded-[16px] border border-white/10 bg-black/20 px-3 py-3">
                              <div className="text-[8px] font-black uppercase tracking-[0.22em] text-white/45">Squad DEF</div>
                              <div className="mt-1 text-sm font-mono font-bold text-[#9d8dff]">{squadStats.totalDef}</div>
                            </div>
                            <div className="rounded-[16px] border border-white/10 bg-black/20 px-3 py-3">
                              <div className="text-[8px] font-black uppercase tracking-[0.22em] text-white/45">Squad AGI</div>
                              <div className="mt-1 text-sm font-mono font-bold text-[#7cffc9]">{squadStats.totalAgi}</div>
                            </div>
                            <div className="rounded-[16px] border border-white/10 bg-black/20 px-3 py-3">
                              <div className="text-[8px] font-black uppercase tracking-[0.22em] text-white/45">Readiness</div>
                              <div className="mt-1 text-sm font-black uppercase tracking-[0.12em] text-white">
                                {selectedItems.length}/3 linked
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="lg:min-w-[220px]">
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
                    </div>
                  </div>
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
