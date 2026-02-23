import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import type { Battle, CombatResult, CombatExchange, SquadStats } from "../../types/gamification";
import type { Collectible } from "../../types/collectible";
import { simulateCombat, getPrestigeBattleStats } from "../../data/gamification";
import { BossIcon } from "../../assets/boss-icons";

type BattlePhase = "intro" | "combat" | "result";

interface BattleOverlayProps {
  battle: Battle;
  squadItems: Collectible[];
  rankLevel: number;
  onComplete: (result: CombatResult) => void;
}

export function BattleOverlay({
  battle,
  squadItems,
  rankLevel,
  onComplete
}: BattleOverlayProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<BattlePhase>("intro");
  const [currentExchangeIndex, setCurrentExchangeIndex] = useState(-1);
  const [combatResult, setCombatResult] = useState<CombatResult | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scaled = getPrestigeBattleStats(battle, rankLevel);

  const squadStats = useMemo<SquadStats>(() => {
    return squadItems.reduce(
      (acc, item) => ({
        totalAtk: acc.totalAtk + item.stats.atk,
        totalDef: acc.totalDef + item.stats.def,
        totalAgi: acc.totalAgi + item.stats.agi,
        memberCount: acc.memberCount + 1
      }),
      { totalAtk: 0, totalDef: 0, totalAgi: 0, memberCount: 0 }
    );
  }, [squadItems]);

  // Run combat simulation on mount
  const result = useMemo(
    () => simulateCombat(squadStats, battle, rankLevel),
    [squadStats, battle, rankLevel]
  );

  useEffect(() => {
    setCombatResult(result);
  }, [result]);

  // Phase progression
  useEffect(() => {
    const schedule = (fn: () => void, delay: number) => {
      const t = setTimeout(fn, delay);
      timersRef.current.push(t);
      return t;
    };

    if (phase === "intro") {
      schedule(() => {
        setPhase("combat");
        setCurrentExchangeIndex(0);
      }, prefersReducedMotion ? 800 : 2000);
    }

    return () => timersRef.current.forEach(clearTimeout);
  }, [phase, prefersReducedMotion]);

  // Animate combat exchanges
  useEffect(() => {
    if (phase !== "combat" || !combatResult || currentExchangeIndex < 0) return;

    if (currentExchangeIndex >= combatResult.exchanges.length) {
      const t = setTimeout(() => setPhase("result"), 1000);
      timersRef.current.push(t);
      return;
    }

    const t = setTimeout(() => {
      setCurrentExchangeIndex((prev) => prev + 1);
    }, prefersReducedMotion ? 400 : 1500);
    timersRef.current.push(t);

    return () => clearTimeout(t);
  }, [phase, currentExchangeIndex, combatResult, prefersReducedMotion]);

  const currentExchange: CombatExchange | null =
    combatResult && currentExchangeIndex > 0 && currentExchangeIndex <= combatResult.exchanges.length
      ? combatResult.exchanges[currentExchangeIndex - 1]
      : null;

  // HP values for display
  const displaySquadHp = currentExchange ? currentExchange.squadHpAfter : 120;
  const displayBossHp = currentExchange ? currentExchange.bossHpAfter : scaled.hp;
  const squadHpPercent = Math.max(0, (displaySquadHp / 120) * 100);
  const bossHpPercent = Math.max(0, (displayBossHp / scaled.hp) * 100);

  const shakeClass = currentExchange?.quality === "critical" ? "shake-heavy" : currentExchange?.quality === "strong" ? "shake-light" : "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[80] bg-bg/95 backdrop-blur-xl flex items-center justify-center ${shakeClass}`}
    >
      <div className="w-full max-w-lg px-4">
        <AnimatePresence mode="wait">
          {/* Intro */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-surface border border-white/10 flex items-center justify-center [&>svg]:w-12 [&>svg]:h-12">
                <BossIcon bossId={battle.id} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-2">
                {battle.name}
              </h2>
              <p className="text-text-muted text-sm">{battle.description}</p>
              <div className="flex justify-center gap-2 mt-4 text-[10px] font-mono text-text-dim">
                {squadItems.map((item) => (
                  <span key={item.id} className="px-2 py-1 bg-surface rounded-lg border border-white/10">
                    {item.funkoName || item.product}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Combat */}
          {phase === "combat" && combatResult && (
            <motion.div
              key="combat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* HP Bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase text-neon-cyan">Your Squad</span>
                    <span className="text-[10px] font-mono text-white">{Math.max(0, displaySquadHp)}/120</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-neon-cyan rounded-full"
                      animate={{ width: `${squadHpPercent}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase text-error">{battle.name}</span>
                    <span className="text-[10px] font-mono text-white">{Math.max(0, displayBossHp)}/{scaled.hp}</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-error rounded-full"
                      animate={{ width: `${bossHpPercent}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              {/* Exchange display */}
              <AnimatePresence mode="wait">
                {currentExchange && (
                  <motion.div
                    key={currentExchange.round}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-surface/50 border border-white/10 rounded-xl p-4"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-text-dim mb-3">
                      Round {currentExchange.round}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-[9px] font-bold uppercase text-neon-cyan mb-1">Your Attack</p>
                        <p className="text-xl font-mono font-black text-neon-cyan">
                          -{currentExchange.squadDamage}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-bold uppercase text-error mb-1">Boss Attack</p>
                        <p className="text-xl font-mono font-black text-error">
                          -{currentExchange.bossDamage}
                        </p>
                      </div>
                    </div>
                    {currentExchange.quality !== "normal" && (
                      <p className={`text-center text-xs font-black uppercase mt-2 ${
                        currentExchange.quality === "critical" ? "text-vault-gold" :
                        currentExchange.quality === "strong" ? "text-neon-green" :
                        "text-text-dim"
                      }`}>
                        {currentExchange.quality}!
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-center text-[10px] font-mono text-text-dim">
                Exchange {Math.min(currentExchangeIndex, combatResult.exchanges.length)} / {combatResult.exchanges.length}
              </p>
            </motion.div>
          )}

          {/* Result */}
          {phase === "result" && combatResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <motion.h2
                className={`text-4xl sm:text-5xl font-black uppercase tracking-tighter ${
                  combatResult.victory ? "text-neon-green" : "text-error"
                }`}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                style={{
                  textShadow: combatResult.victory
                    ? "0 0 30px rgba(57,255,20,0.5)"
                    : "0 0 30px rgba(255,59,92,0.5)"
                }}
              >
                {combatResult.victory ? "Victory!" : "Defeat"}
              </motion.h2>

              <div className="bg-surface/50 border border-white/10 rounded-xl p-5 space-y-3">
                {combatResult.shardsEarned > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-dim">Shards Earned</span>
                    <span className="text-sm font-mono font-bold text-rarity-rare">
                      +{combatResult.shardsEarned}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-dim">XP Earned</span>
                  <span className="text-sm font-mono font-bold text-accent">
                    +{combatResult.xpEarned}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-dim">Rounds</span>
                  <span className="text-sm font-mono font-bold text-white">
                    {combatResult.exchanges.length}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onComplete(combatResult)}
                className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-all cursor-pointer"
              >
                {combatResult.shardsEarned > 0 ? "Collect Shards" : "Continue"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
