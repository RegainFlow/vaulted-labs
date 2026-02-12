import { useState } from "react";
import { motion } from "motion/react";
import type { BossFight } from "../../types/game";

interface BossFightCardProps {
  boss: BossFight;
  playerLevel: number;
}

export function BossFightCard({ boss, playerLevel }: BossFightCardProps) {
  const [showToast, setShowToast] = useState(false);
  const isUnlocked = playerLevel >= boss.requiredLevel;

  const handleFight = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border p-4 transition-all duration-300 ${
        isUnlocked
          ? "bg-surface-elevated/50 border-neon-cyan/30 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]"
          : "bg-surface/30 border-white/5 opacity-50 grayscale"
      }`}
    >
      {/* Lock icon for locked bosses */}
      {!isUnlocked && (
        <div className="absolute top-3 right-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-dim">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      )}

      <h4 className={`text-sm font-black uppercase tracking-wider mb-1 ${isUnlocked ? "text-white" : "text-text-dim"}`}>
        {boss.name}
      </h4>
      <p className="text-[10px] text-text-muted leading-relaxed mb-3">
        {boss.description}
      </p>

      <div className="flex items-center gap-2 mb-3">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-accent shrink-0">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="2" />
        </svg>
        <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider">
          {isUnlocked ? "Unlocked" : `Unlocks at Level ${boss.requiredLevel}`}
        </span>
      </div>

      <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 mb-3">
        <span className="text-[9px] font-bold text-text-dim uppercase tracking-wider">Reward: </span>
        <span className="text-[9px] font-bold text-neon-green">{boss.rewardDescription}</span>
      </div>

      {isUnlocked ? (
        <div className="relative">
          <button
            onClick={handleFight}
            className="w-full px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20 transition-all cursor-pointer"
          >
            Fight
          </button>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-surface border border-white/10 text-[10px] text-text-muted whitespace-nowrap shadow-xl"
            >
              Coming Soon
            </motion.div>
          )}
        </div>
      ) : (
        <div className="w-full px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/5 text-text-dim text-center">
          Locked
        </div>
      )}
    </motion.div>
  );
}
