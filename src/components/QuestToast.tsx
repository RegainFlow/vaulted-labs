import { motion, AnimatePresence } from "motion/react";
import { useGame } from "../context/GameContext";

export function QuestToastNotification() {
  const { questToast, dismissQuestToast } = useGame();

  return (
    <AnimatePresence>
      {questToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 50, x: "-50%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 sm:bottom-6 left-1/2 z-[100] flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-surface-elevated border border-neon-green/30 shadow-[0_0_30px_rgba(57,255,20,0.15)] cursor-pointer w-[calc(100%-32px)] sm:w-auto max-w-md"
          onClick={dismissQuestToast}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neon-green/10 rounded-full flex items-center justify-center shrink-0 border border-neon-green/20">
            <span className="text-neon-green text-base sm:text-lg font-black">&#10003;</span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs font-black text-white uppercase tracking-wider truncate">
              Quest Complete: {questToast.questTitle}
            </p>
            <p className="text-[10px] sm:text-[11px] font-bold text-text-muted mt-0.5 sm:mt-1">
              +{questToast.xpReward} XP
              {questToast.creditReward ? ` · +$${questToast.creditReward}` : ""}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
