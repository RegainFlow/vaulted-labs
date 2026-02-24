import { motion } from "motion/react";
import type { Battle, LevelInfo } from "../../types/gamification";
import { BossIcon } from "../../assets/boss-icons";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border bg-surface-elevated/50 overflow-hidden transition-all duration-300 ${
        isLocked
          ? "opacity-50 grayscale"
          : isDefeated
            ? "border-neon-green/30 hover:-translate-y-0.5 hover:shadow-lg"
            : "border-white/10 hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-lg"
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

      <div className="p-4 sm:p-5">
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
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-surface/50 rounded-lg px-2 py-1.5 text-center">
            <p className="text-[8px] font-bold uppercase text-text-dim">HP</p>
            <p className="text-xs font-mono font-bold text-white">{battle.hp}</p>
          </div>
          <div className="bg-surface/50 rounded-lg px-2 py-1.5 text-center">
            <p className="text-[8px] font-bold uppercase text-text-dim">ATK</p>
            <p className="text-xs font-mono font-bold text-error">{battle.atk}</p>
          </div>
          <div className="bg-surface/50 rounded-lg px-2 py-1.5 text-center">
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
          <div className="mb-4">
            <div className="flex items-center justify-between text-[9px] mb-1">
              <span className="text-text-dim">
                {Math.round(levelInfo.currentXP - levelInfo.xpForCurrentLevel)} / {levelInfo.xpForNextLevel - levelInfo.xpForCurrentLevel} XP to Lv {levelInfo.level + 1}
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent/60 rounded-full transition-all duration-300"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
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
          <button
            onClick={() => canFight && onFight(battle)}
            disabled={!canFight}
            className={`w-full px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              canFight
                ? "bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 hover:border-accent/50 active:scale-[0.98] cursor-pointer"
                : "bg-white/5 border-white/10 text-text-dim cursor-not-allowed"
            }`}
          >
            {!hasEnergy ? "No Energy" : isDefeated ? "Fight Again" : "Fight"}{" "}
            <span className="text-text-dim">({energyCost} Energy)</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
