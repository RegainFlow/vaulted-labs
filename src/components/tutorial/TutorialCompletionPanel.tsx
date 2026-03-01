import { motion } from "motion/react";

interface TutorialCompletionPanelProps {
  kicker?: string;
  title: string;
  body: string;
  actionLabel?: string;
  onDone: () => void;
}

export function TutorialCompletionPanel({
  kicker,
  title,
  body,
  actionLabel,
  onDone,
}: TutorialCompletionPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 10 }}
      transition={{ type: "spring", damping: 22, stiffness: 240 }}
      className="system-shell-strong pointer-events-auto w-full max-w-md border border-neon-green/35 px-6 py-6 text-center shadow-[0_0_40px_rgba(57,255,20,0.14)]"
    >
      <p className="system-label text-neon-green">{kicker ?? "Tutorial"}</p>
      <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">{body}</p>
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={onDone}
          className="command-button px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.24em]"
        >
          {actionLabel ?? "Done"}
        </button>
      </div>
    </motion.div>
  );
}
