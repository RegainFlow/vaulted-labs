import { motion } from "motion/react";
import type { Battle, LevelInfo } from "../../types/gamification";
import { BossIcon } from "../../assets/boss-icons";
import { ArcadeButton } from "../shared/ArcadeButton";

interface BattleCardProps {
  battle: Battle;
  playerLevel: number;
  isDefeated: boolean;
  energyCost: number;
  currentEnergy: number;
  onFight: (battle: Battle) => void;
  levelInfo?: LevelInfo;
}

export function BattleCard({
  battle,
  playerLevel,
  isDefeated,
  energyCost,
  currentEnergy,
  onFight,
  levelInfo
}: BattleCardProps) {
  const isLocked = playerLevel < battle.requiredLevel;
  const hasEnergy = currentEnergy >= energyCost;
  const canFight = !isLocked && hasEnergy;
  const xpIntoLevel = levelInfo
    ? Math.max(0, levelInfo.currentXP - levelInfo.xpForCurrentLevel)
    : 0;
  const xpNeeded = levelInfo
    ? Math.max(1, levelInfo.xpForNextLevel - levelInfo.xpForCurrentLevel)
    : 1;
  const xpRemaining = levelInfo
    ? Math.max(0, levelInfo.xpForNextLevel - levelInfo.currentXP)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`module-card relative overflow-hidden transition-all duration-300 ${
        isLocked
          ? "opacity-50 grayscale"
          : isDefeated
            ? "border-neon-green/30 hover:-translate-y-0.5"
            : "border-white/10 hover:border-accent/30 hover:-translate-y-0.5"
      }`}
    >
      {/* Defeated badge */}
      {isDefeated && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-neon-green/10 border border-neon-green/30 text-neon-green">
            Defeated
          </span>
        </div>
      )}

      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,45,149,0.72)_50%,transparent_100%)]" />
      <div className="p-5 sm:p-6">
        {/* Boss icon + info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center [&>svg]:w-8 [&>svg]:h-8">
            <BossIcon bossId={battle.id} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black text-white uppercase tracking-wide">
              {battle.name}
            </h4>
            <p className="text-[10px] text-text-dim">{battle.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-[16px] border border-white/10 bg-black/20 px-2 py-2 text-center">
            <p className="text-[8px] font-bold uppercase text-text-dim">HP</p>
            <p className="text-xs font-mono font-bold text-white">{battle.hp}</p>
          </div>
          <div className="rounded-[16px] border border-white/10 bg-black/20 px-2 py-2 text-center">
            <p className="text-[8px] font-bold uppercase text-text-dim">ATK</p>
            <p className="text-xs font-mono font-bold text-error">{battle.atk}</p>
          </div>
          <div className="rounded-[16px] border border-white/10 bg-black/20 px-2 py-2 text-center">
            <p className="text-[8px] font-bold uppercase text-text-dim">DEF</p>
            <p className="text-xs font-mono font-bold text-neon-cyan">{battle.def}</p>
          </div>
        </div>

        {/* Reward info */}
        <div className="flex items-center justify-between mb-2 text-[10px]">
          <span className="text-text-dim">
            Shards: <span className="text-rarity-rare font-bold">{battle.shardReward.min}-{battle.shardReward.max}</span>
          </span>
          <span className="text-text-dim">
            XP: <span className="text-accent font-bold">+{battle.xpReward}</span>
          </span>
        </div>

        {/* XP progress toward next level */}
        {levelInfo && (
          <div className="mb-4 rounded-[16px] border border-white/10 bg-black/20 px-3 py-3">
            <div className="mb-1 flex items-center justify-between text-[9px]">
              <span className="text-text-dim">Level Progress</span>
              <span className="font-mono text-accent">Lv {levelInfo.level}</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent/60 rounded-full transition-all duration-300"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-text-dim">
              <span>{xpIntoLevel} / {xpNeeded} XP</span>
              <span>{xpRemaining} left</span>
            </div>
          </div>
        )}

        {/* Action */}
        {isLocked ? (
          <div className="text-center py-2">
            <p className="text-[10px] font-bold text-text-dim uppercase tracking-wider">
              Requires Level {battle.requiredLevel}
            </p>
          </div>
        ) : (
          <div className="pt-1">
            <ArcadeButton
              onClick={() => canFight && onFight(battle)}
              disabled={!canFight}
              tone="accent"
              size="compact"
              fillMode="center"
              fullWidth
            >
              {!hasEnergy ? "No Energy" : isDefeated ? "Fight Again" : "Fight"} ({energyCost} Energy)
            </ArcadeButton>
          </div>
        )}
      </div>
    </motion.div>
  );
}
