import { motion } from "motion/react";
import { useGame } from "../../context/GameContext";
import { BOSS_ENERGY_CONFIG, SHARD_CONFIG, getLevelInfo } from "../../data/gamification";

export function ResourceBar() {
  const { bossEnergy, shards, xp, freeSpins, prestigeLevel, convertShardsToFreeSpin } = useGame();
  const levelInfo = getLevelInfo(xp);
  const canConvert = shards >= SHARD_CONFIG.freeSpinConversionCost;

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 sm:mb-8"
      data-tutorial="arena-resources"
    >
      {/* Energy */}
      <div className="bg-surface-elevated/50 border border-white/10 rounded-xl p-3 sm:p-4" data-tutorial="arena-rankup">
        <div className="flex items-center gap-2 mb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-neon-green shrink-0">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-dim">Energy</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: BOSS_ENERGY_CONFIG.maxEnergy }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                i < bossEnergy
                  ? "bg-neon-green shadow-[0_0_6px_rgba(57,255,20,0.4)]"
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>
        <p className="text-[10px] font-mono text-text-dim mt-1.5">{bossEnergy}/{BOSS_ENERGY_CONFIG.maxEnergy}</p>
      </div>

      {/* Shards */}
      <div className="bg-surface-elevated/50 border border-white/10 rounded-xl p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-rarity-rare shrink-0">
            <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="12,6 18,9.5 18,14.5 12,18 6,14.5 6,9.5" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-dim">Shards</span>
        </div>
        <p className="text-lg font-mono font-bold text-rarity-rare">{shards}</p>
        {canConvert && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => convertShardsToFreeSpin()}
            className="mt-1.5 px-2 py-1 rounded text-[8px] font-bold uppercase tracking-wider bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 transition-colors cursor-pointer"
          >
            → Free Spin ({SHARD_CONFIG.freeSpinConversionCost})
          </motion.button>
        )}
      </div>

      {/* XP / Level */}
      <div className="bg-surface-elevated/50 border border-white/10 rounded-xl p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-accent shrink-0">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-dim">Level</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-mono font-bold text-accent">{levelInfo.level}</span>
          {prestigeLevel > 0 && (
            <span className="flex gap-0.5">
              {Array.from({ length: prestigeLevel }).map((_, i) => (
                <span key={i} className="text-vault-gold text-xs">&#9733;</span>
              ))}
            </span>
          )}
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${levelInfo.progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Free Spins */}
      <div className="bg-surface-elevated/50 border border-white/10 rounded-xl p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-vault-gold shrink-0">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-dim">Free Spins</span>
        </div>
        <p className="text-lg font-mono font-bold text-vault-gold">{freeSpins}</p>
      </div>
    </div>
  );
}
