import { motion } from "motion/react";
import { CATEGORY_COLORS } from "../../data/quests";
import type { QuestCardProps } from "../../types/game";

export function QuestCard({ quest, progress }: QuestCardProps) {
  const borderColor = CATEGORY_COLORS[quest.category] || "#ff2d95";
  const isCompleted = progress.status === "completed";
  const isLocked = progress.status === "locked";
  const progressPercent = Math.min(
    (progress.progress / quest.requirement.target) * 100,
    100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-xl border-l-4 bg-surface-elevated/50 backdrop-blur-sm p-3 sm:p-4 transition-all ${
        isCompleted ? "opacity-60" : isLocked ? "opacity-40 grayscale" : ""
      }`}
      style={{
        borderLeftColor: isCompleted
          ? "#39ff14"
          : isLocked
            ? "#6a6a80"
            : borderColor
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h4
            className={`text-xs sm:text-sm font-black uppercase tracking-wider ${
              isCompleted
                ? "text-neon-green line-through"
                : isLocked
                  ? "text-text-dim"
                  : "text-white"
            }`}
          >
            {isCompleted && (
              <span className="inline-block mr-1.5 text-neon-green no-underline">
                &#10003;
              </span>
            )}
            {quest.title}
          </h4>
          <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">
            {quest.description}
          </p>
        </div>

        {/* Rewards */}
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <span className="text-[9px] font-bold text-accent">
            +{quest.xpReward} XP
          </span>
          {quest.creditReward && (
            <span className="text-[9px] font-bold text-vault-gold">
              +${quest.creditReward}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {!isLocked && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-mono text-text-dim">
              {progress.progress} / {quest.requirement.target}
            </span>
            <span className="text-[9px] font-mono text-text-dim">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface border border-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                backgroundColor: isCompleted ? "#39ff14" : borderColor
              }}
            />
          </div>
        </div>
      )}

      {/* Locked overlay */}
      {isLocked && (
        <p className="text-[9px] font-bold text-text-dim uppercase tracking-wider mt-2">
          Unlocks at Level {quest.requiredLevel}
        </p>
      )}
    </motion.div>
  );
}
