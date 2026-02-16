import { motion } from "motion/react";
import type { BossFightCardProps } from "../../types/gamification";
import { BossIcon } from "../../assets/boss-icons";

export function BossFightCard({ boss, playerLevel, isDefeated, onFight }: BossFightCardProps) {
  const isUnlocked = playerLevel >= boss.requiredLevel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border p-4 transition-all duration-300 ${
        isDefeated
          ? "bg-surface-elevated/30 border-neon-green/20"
          : isUnlocked
            ? "bg-surface-elevated/50 border-neon-cyan/30 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]"
            : "bg-surface/30 border-white/5 opacity-50 grayscale"
      }`}
    >
      {/* Defeated badge */}
      {isDefeated && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-neon-green/10 border border-neon-green/30">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#39ff14" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-[9px] font-black uppercase tracking-wider text-neon-green">Defeated</span>
        </div>
      )}

      {/* Lock icon for locked bosses */}
      {!isDefeated && !isUnlocked && (
        <div className="absolute top-3 right-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-text-dim"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      )}

      {/* Boss icon */}
      <div className="mb-2">
        <BossIcon bossId={boss.id} size={32} color={isUnlocked ? "#00f0ff" : "#6a6a80"} />
      </div>

      <h4
        className={`text-sm font-black uppercase tracking-wider mb-1 ${isUnlocked ? "text-white" : "text-text-dim"}`}
      >
        {boss.name}
      </h4>
      <p className="text-[10px] text-text-muted leading-relaxed mb-3">
        {boss.description}
      </p>

      <div className="flex items-center gap-2 mb-3">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          className="text-accent shrink-0"
        >
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider">
          {isUnlocked ? "Unlocked" : `Unlocks at Level ${boss.requiredLevel}`}
        </span>
      </div>

      <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 mb-3">
        <span className="text-[9px] font-bold text-text-dim uppercase tracking-wider">
          Reward:{" "}
        </span>
        <span className="text-[9px] font-bold text-neon-green">
          {boss.rewardDescription}
        </span>
      </div>

      {isDefeated ? (
        <div className="w-full px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-neon-green/10 border border-neon-green/20 text-neon-green text-center flex items-center justify-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Defeated
        </div>
      ) : isUnlocked ? (
        <button
          onClick={() => onFight(boss)}
          className="w-full px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20"
        >
          Fight
        </button>
      ) : (
        <div className="w-full px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/5 text-text-dim text-center">
          Locked
        </div>
      )}
    </motion.div>
  );
}
