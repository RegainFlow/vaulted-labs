import { motion } from "motion/react";
import type { CSSProperties } from "react";

interface TutorialInstructionRailProps {
  kicker?: string;
  title: string;
  body: string;
  actionLabel?: string;
  onNext?: () => void;
  onSkip: () => void;
  bottomAnchored?: boolean;
  targetClickStep?: boolean;
  eventDrivenStep?: boolean;
  compact?: boolean;
  style?: CSSProperties;
}

export function TutorialInstructionRail({
  kicker,
  title,
  body,
  actionLabel,
  onNext,
  onSkip,
  bottomAnchored = false,
  targetClickStep = false,
  eventDrivenStep = false,
  compact = false,
  style,
}: TutorialInstructionRailProps) {
  const passiveStep = targetClickStep || eventDrivenStep;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`pointer-events-auto z-[221] w-[calc(100%-16px)] ${
        bottomAnchored
          ? "fixed bottom-0 left-1/2 mb-3 max-w-[280px] -translate-x-1/2 px-0 sm:mb-4 sm:max-w-[300px]"
          : compact
            ? "absolute max-w-[272px]"
            : "absolute max-w-[360px]"
      }`}
      style={style}
    >
      <div
        className={`system-shell border border-accent/32 shadow-[0_0_28px_rgba(255,45,149,0.18)] ${
          bottomAnchored || compact ? "px-3 py-2" : "px-4 py-3"
        }`}
      >
        <p className="system-label">{kicker ?? "Tutorial"}</p>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p
              className={`font-black uppercase tracking-tight text-white ${
                bottomAnchored || compact ? "text-[12px]" : "text-sm"
              }`}
            >
              {title}
            </p>
            <p
              className={`mt-1 leading-relaxed text-text-muted ${
                bottomAnchored || compact ? "text-[10px]" : "text-xs"
              }`}
            >
              {body}
            </p>
          </div>
        </div>
        <div className={`flex items-center justify-between gap-3 ${compact ? "mt-2" : "mt-3"}`}>
          <button
            type="button"
            onClick={onSkip}
            className="text-[10px] font-bold uppercase tracking-[0.24em] text-text-dim transition-colors hover:text-text-muted"
          >
            Skip
          </button>
          {passiveStep ? (
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-accent">
              {actionLabel ?? (targetClickStep ? "Tap Target" : "Do This")}
            </span>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className="command-button px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em]"
            >
              {actionLabel ?? "Next"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
