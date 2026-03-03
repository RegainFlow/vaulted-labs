import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Battle, CombatResult, CombatExchange, SquadStats } from "../../types/gamification";
import type { Collectible } from "../../types/collectible";
import { simulateCombat, getPrestigeBattleStats } from "../../data/gamification";
import { buildBattleTimeline, getBattlePresentationProfile } from "../../lib/battle-presentation";
import { playSfx } from "../../lib/audio";
import { ProvablyFairReceiptModal } from "../shared/ProvablyFairReceiptModal";
import { useGame } from "../../context/GameContext";
import { AnalyticsEvents, trackEvent } from "../../lib/analytics";
import { useOverlayScrollLock } from "../../hooks/useOverlayScrollLock";
import { BattleScreen } from "./battle/BattleScreen";
import { ArcadeButton } from "../shared/ArcadeButton";

type BattlePhase = "intro" | "combat" | "result";

interface BattleOverlayProps {
  battle: Battle;
  squadItems: Collectible[];
  rankLevel: number;
  onComplete: (result: CombatResult) => void;
  resolvedResult?: CombatResult | null;
  proofReceiptId?: string | null;
}

export function BattleOverlay({
  battle,
  squadItems,
  rankLevel,
  onComplete,
  resolvedResult = null,
  proofReceiptId = null,
}: BattleOverlayProps) {
  useOverlayScrollLock(true);
  const { getProvablyFairReceipt } = useGame();
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<BattlePhase>("intro");
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [combatResult, setCombatResult] = useState<CombatResult | null>(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [flashSide, setFlashSide] = useState<"player" | "boss" | null>(null);
  const prevFrameRef = useRef<CombatExchange | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scaled = getPrestigeBattleStats(battle, rankLevel);
  const profile = getBattlePresentationProfile(battle.id);

  const squadStats = useMemo<SquadStats>(() => {
    return squadItems.reduce(
      (acc, item) => ({
        totalAtk: acc.totalAtk + item.stats.atk,
        totalDef: acc.totalDef + item.stats.def,
        totalAgi: acc.totalAgi + item.stats.agi,
        memberCount: acc.memberCount + 1,
      }),
      { totalAtk: 0, totalDef: 0, totalAgi: 0, memberCount: 0 }
    );
  }, [squadItems]);

  const result = useMemo(
    () => resolvedResult ?? simulateCombat(squadStats, battle, rankLevel),
    [resolvedResult, squadStats, battle, rankLevel]
  );

  useEffect(() => {
    setCombatResult(result);
  }, [result]);

  const timeline = useMemo(
    () =>
      combatResult
        ? buildBattleTimeline({
            battle,
            squadItems,
            combatResult,
          })
        : [],
    [battle, squadItems, combatResult]
  );

  const currentFrame =
    phase === "combat"
      ? timeline[Math.min(currentFrameIndex, Math.max(0, timeline.length - 1))] ?? null
      : phase === "result"
        ? timeline[timeline.length - 1] ?? null
        : null;

  const displaySquadHp =
    currentFrame?.exchange.squadHpAfter ??
    (phase === "result" ? combatResult?.finalSquadHp ?? 120 : 120);
  const displayBossHp =
    currentFrame?.exchange.bossHpAfter ??
    (phase === "result" ? combatResult?.finalBossHp ?? scaled.hp : scaled.hp);

  useEffect(() => {
    playSfx("battle_enter");
  }, []);

  useEffect(() => {
    const scheduled: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, delay: number) => {
      const timer = setTimeout(fn, delay);
      timersRef.current.push(timer);
      scheduled.push(timer);
      return timer;
    };

    if (phase === "intro") {
      schedule(() => {
        setPhase("combat");
        setCurrentFrameIndex(0);
      }, prefersReducedMotion ? 700 : 1400);
    }

    return () => {
      scheduled.forEach(clearTimeout);
    };
  }, [phase, prefersReducedMotion]);

  useEffect(() => {
    if (phase !== "combat" || !combatResult) return;

    if (currentFrameIndex >= timeline.length) {
      const timer = setTimeout(() => setPhase("result"), prefersReducedMotion ? 300 : 700);
      timersRef.current.push(timer);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setCurrentFrameIndex((prev) => prev + 1);
    }, prefersReducedMotion ? 600 : 1200);
    timersRef.current.push(timer);

    return () => clearTimeout(timer);
  }, [phase, currentFrameIndex, combatResult, timeline.length, prefersReducedMotion]);

  useEffect(() => {
    if (!currentFrame) return;
    playSfx("battle_hit");
  }, [currentFrame]);

  useEffect(() => {
    if (phase !== "result" || !combatResult) return;
    playSfx(combatResult.victory ? "battle_win" : "battle_loss");
  }, [combatResult, phase]);

  useEffect(() => {
    if (!currentFrame) return;
    const prev = prevFrameRef.current;
    prevFrameRef.current = currentFrame.exchange;

    if (prev && prev.round !== currentFrame.round) {
      setFlashSide(currentFrame.exchange.bossDamage > currentFrame.exchange.squadDamage ? "player" : "boss");
      const timer = setTimeout(() => setFlashSide(null), 180);
      return () => clearTimeout(timer);
    }
  }, [currentFrame]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] overflow-hidden bg-bg/95 px-2 py-2 backdrop-blur-xl sm:px-3 sm:py-3"
    >
      <div className="relative mx-auto flex h-full w-full max-w-6xl items-center justify-center">
        {flashSide ? (
          <motion.div
            key={flashSide}
            className={`pointer-events-none absolute inset-0 z-0 rounded-[34px] ${
              flashSide === "player"
                ? "bg-[radial-gradient(circle_at_18%_50%,rgba(0,234,255,0.18)_0%,transparent_36%)]"
                : "bg-[radial-gradient(circle_at_82%_50%,rgba(255,43,214,0.2)_0%,transparent_36%)]"
            }`}
            initial={{ opacity: 0.45 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          />
        ) : null}

        <div className="relative z-10 w-full">
          <BattleScreen
            battle={battle}
            squadItems={squadItems}
            profile={profile}
            frames={timeline}
            currentFrame={currentFrame}
            currentSquadHp={displaySquadHp}
            currentBossHp={displayBossHp}
            maxBossHp={scaled.hp}
            phase={phase}
          />

          {phase === "intro" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
            >
              <div className="rounded-[24px] border border-white/10 bg-black/45 px-6 py-6 text-center shadow-[0_0_36px_rgba(255,43,214,0.12)] backdrop-blur-xl">
                <div className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45">
                  Combat Link Established
                </div>
                <div className="mt-3 text-3xl font-black uppercase tracking-[0.08em] text-white sm:text-4xl">
                  You vs {battle.name}
                </div>
                <div className="mt-3 text-[11px] uppercase tracking-[0.24em] text-white/55 sm:text-sm">
                  Squad synchronization in progress
                </div>
              </div>
            </motion.div>
          ) : null}

          {phase === "result" && combatResult ? (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center p-4"
            >
              <div className="system-shell pointer-events-auto relative w-full max-w-2xl overflow-hidden px-5 py-5 sm:px-6">
                <div
                  className="absolute inset-0 opacity-80"
                  style={{
                    background: combatResult.victory
                      ? "radial-gradient(circle at 30% 50%, rgba(57,255,20,0.16) 0%, transparent 36%), radial-gradient(circle at 78% 40%, rgba(0,234,255,0.12) 0%, transparent 40%)"
                      : "radial-gradient(circle at 72% 40%, rgba(255,43,214,0.18) 0%, transparent 40%)",
                  }}
                />
                <div className="relative z-10 flex flex-col gap-4">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.32em] text-white/45">
                      Combat Resolution
                    </div>
                    <div
                      className={`mt-3 text-4xl font-black uppercase tracking-[0.08em] ${
                        combatResult.victory ? "text-neon-green" : "text-accent"
                      }`}
                    >
                      {combatResult.victory ? "Victory" : "Defeat"}
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="rounded-[18px] border border-white/10 bg-black/20 px-3 py-3">
                        <div className="text-[8px] font-black uppercase tracking-[0.22em] text-white/45">Shards</div>
                        <div className="mt-1 text-lg font-mono font-bold text-violet-300">
                          +{combatResult.shardsEarned}
                        </div>
                      </div>
                      <div className="rounded-[18px] border border-white/10 bg-black/20 px-3 py-3">
                        <div className="text-[8px] font-black uppercase tracking-[0.22em] text-white/45">XP</div>
                        <div className="mt-1 text-lg font-mono font-bold text-accent">
                          +{combatResult.xpEarned}
                        </div>
                      </div>
                      <div className="rounded-[18px] border border-white/10 bg-black/20 px-3 py-3">
                        <div className="text-[8px] font-black uppercase tracking-[0.22em] text-white/45">Rounds</div>
                        <div className="mt-1 text-lg font-mono font-bold text-white">
                          {combatResult.exchanges.length}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-white/8 pt-4 sm:flex-row sm:items-center sm:justify-end">
                    {proofReceiptId ? (
                      <button
                        type="button"
                        onClick={() => {
                          trackEvent(AnalyticsEvents.PROVABLY_FAIR_RECEIPT_OPENED, {
                            source: "battle_result",
                            receipt_id: proofReceiptId,
                          });
                          setShowProofModal(true);
                        }}
                        className="system-rail px-5 py-3 text-[10px] font-black uppercase tracking-[0.24em] text-white"
                      >
                        View Proof
                      </button>
                    ) : null}
                    <div className="sm:min-w-[220px]">
                      <ArcadeButton
                        onClick={() => onComplete(combatResult)}
                        tone="accent"
                        size="primary"
                        fillMode="center"
                        fullWidth
                      >
                        {combatResult.shardsEarned > 0 ? "Collect Shards" : "Continue"}
                      </ArcadeButton>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>

      <ProvablyFairReceiptModal
        receipt={
          showProofModal && proofReceiptId
            ? getProvablyFairReceipt(proofReceiptId)
            : null
        }
        onClose={() => setShowProofModal(false)}
      />
    </motion.div>
  );
}
