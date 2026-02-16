import { motion } from "motion/react";

interface TutorialHelpButtonProps {
  onClick: () => void;
}

export function TutorialHelpButton({ onClick }: TutorialHelpButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[100] w-10 h-10 rounded-full bg-surface-elevated border border-accent/30 text-accent flex items-center justify-center shadow-[0_0_20px_rgba(255,45,149,0.15)] hover:bg-accent/10 hover:border-accent/50 transition-all cursor-pointer"
      aria-label="Replay tutorial"
    >
      <span className="text-lg font-black leading-none">?</span>
    </motion.button>
  );
}
