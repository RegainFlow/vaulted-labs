import { motion } from "motion/react";

interface TutorialIntroPanelProps {
  kicker?: string;
  title: string;
  body: string;
  actionLabel?: string;
  onNext: () => void;
  onSkip: () => void;
}

export function TutorialIntroPanel({
  kicker,
  title,
  body,
  actionLabel,
  onNext,
  onSkip,
}: TutorialIntroPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 10 }}
      transition={{ type: "spring", damping: 22, stiffness: 240 }}
      className="system-shell-strong pointer-events-auto w-full max-w-md border border-accent/35 px-6 py-6 text-center shadow-[0_0_40px_rgba(255,45,149,0.2)]"
    >
      <p className="system-label">{kicker ?? "Tutorial"}</p>
      <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">{body}</p>
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onSkip}
          className="text-[10px] font-bold uppercase tracking-[0.24em] text-text-dim transition-colors hover:text-text-muted"
        >
          Skip
        </button>
        <button
          type="button"
          onClick={onNext}
          className="command-button px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.24em]"
        >
          {actionLabel ?? "Begin"}
        </button>
      </div>
    </motion.div>
  );
}
