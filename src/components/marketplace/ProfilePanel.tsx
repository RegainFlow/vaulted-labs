import { motion } from "motion/react";
import { useGame } from "../../context/GameContext";
import { BOSS_FIGHTS } from "../../data/gamification";
import { BossFightCard } from "./BossFightCard";

export function ProfilePanel() {
  const { levelInfo, inventory, creditTransactions, xp } = useGame();

  const totalItems = inventory.length;
  const totalVaultsOpened = creditTransactions.filter(
    (tx) => tx.type === "spent" && tx.description.includes("Vault purchase")
  ).length;
  const totalCreditsEarned = creditTransactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Level + XP */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-surface-elevated/50 backdrop-blur-sm p-4 sm:p-6"
      >
        <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl font-black text-accent" style={{ textShadow: "0 0 20px rgba(255,45,149,0.5)" }}>
                {levelInfo.level}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-1">Current Level</p>
            <p className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mb-2">
              Level {levelInfo.level}
            </p>
            {/* XP bar */}
            <div className="w-full h-2.5 sm:h-3 rounded-full bg-surface border border-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #ff2d95, #00f0ff)" }}
              />
            </div>
            <p className="text-[10px] font-mono text-text-muted mt-1.5">
              {xp} / {levelInfo.xpForNextLevel} XP
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="text-center px-2 sm:px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-surface border border-white/10">
            <p className="text-base sm:text-lg font-mono font-black text-neon-cyan">{totalItems}</p>
            <p className="text-[8px] sm:text-[9px] font-bold text-text-dim uppercase tracking-wider">Items</p>
          </div>
          <div className="text-center px-2 sm:px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-surface border border-white/10">
            <p className="text-base sm:text-lg font-mono font-black text-accent">{totalVaultsOpened}</p>
            <p className="text-[8px] sm:text-[9px] font-bold text-text-dim uppercase tracking-wider">Vaults</p>
          </div>
          <div className="text-center px-2 sm:px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-surface border border-white/10">
            <p className="text-base sm:text-lg font-mono font-black text-vault-gold">${totalCreditsEarned}</p>
            <p className="text-[8px] sm:text-[9px] font-bold text-text-dim uppercase tracking-wider">Earned</p>
          </div>
        </div>
      </motion.div>

      {/* Boss Fights */}
      <div>
        <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight mb-3 sm:mb-4">
          Boss <span className="text-accent">Fights</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {BOSS_FIGHTS.map((boss) => (
            <BossFightCard key={boss.id} boss={boss} playerLevel={levelInfo.level} />
          ))}
        </div>
      </div>
    </div>
  );
}
