import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { TutorialProps, TargetRect } from "../types/tutorial";
import { OVERLAY_STEPS, TOOLTIP_STEPS } from "../data/tutorial";

const PADDING = 8;
const TUTORIAL_SEQUENCE = [
  "welcome",
  "hud",
  "categories",
  "odds",
  "contents",
  "open-vault",
  "complete"
] as const;
const TOTAL_STEPS = TUTORIAL_SEQUENCE.length;

function getStepIndex(step: string): number {
  const index = TUTORIAL_SEQUENCE.indexOf(
    step as (typeof TUTORIAL_SEQUENCE)[number]
  );
  return index >= 0 ? index + 1 : 1;
}

function getTargetRect(selector: string): TargetRect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top - PADDING,
    left: rect.left - PADDING,
    width: rect.width + PADDING * 2,
    height: rect.height + PADDING * 2
  };
}

function getTooltipPosition(
  rect: TargetRect,
  position: "top" | "bottom",
  step?: string
): React.CSSProperties {
  const isMobile = window.innerWidth < 640;
  const tooltipMaxWidth = isMobile ? 280 : 340;

  // Keep the spotlight visible on small screens for top bar targets.
  if (isMobile && (step === "hud" || step === "categories")) {
    return {
      top: Math.max(rect.top + rect.height + 40, window.innerHeight * 0.4),
      left: Math.max(8, (window.innerWidth - tooltipMaxWidth) / 2)
    };
  }

  if (position === "bottom" || isMobile) {
    const top = Math.max(
      8,
      Math.min(rect.top + rect.height + 12, window.innerHeight - 200)
    );
    return {
      top,
      left: isMobile
        ? Math.max(8, (window.innerWidth - tooltipMaxWidth) / 2)
        : Math.max(12, Math.min(rect.left, window.innerWidth - tooltipMaxWidth))
    };
  }

  return {
    bottom: Math.max(8, window.innerHeight - rect.top + 12),
    left: Math.max(12, Math.min(rect.left, window.innerWidth - tooltipMaxWidth))
  };
}

export function Tutorial({
  step,
  onAdvance,
  onComplete,
  completedAction,
  onSkip
}: TutorialProps) {
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const clickTimestamps = useRef<number[]>([]);

  useEffect(() => {
    if (!step || !onSkip) return;
    const handleClick = () => {
      const now = Date.now();
      clickTimestamps.current.push(now);
      clickTimestamps.current = clickTimestamps.current.filter(
        (timestamp) => now - timestamp < 1000
      );
      if (clickTimestamps.current.length > 3) {
        onSkip();
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [step, onSkip]);

  const updateRect = useCallback(() => {
    if (!step) return;

    if (step === "open-vault") {
      setTargetRect(getTargetRect('[data-tutorial="vault-diamond"]'));
      return;
    }

    const config = TOOLTIP_STEPS[step];
    if (!config) {
      setTargetRect(null);
      return;
    }

    const selector =
      typeof config.selector === "function" ? config.selector() : config.selector;
    setTargetRect(getTargetRect(selector));
  }, [step]);

  useEffect(() => {
    const initialMeasureTimer = window.setTimeout(updateRect, 0);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.clearTimeout(initialMeasureTimer);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [updateRect]);

  useEffect(() => {
    if (step !== "open-vault") return;
    const el = document.querySelector('[data-tutorial="vault-diamond"]');
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(updateRect, 400);
    setTimeout(updateRect, 800);
  }, [step, updateRect]);

  useEffect(() => {
    if (!step || step === "open-vault") return;
    const config = TOOLTIP_STEPS[step];
    if (!config) return;

    const selector =
      typeof config.selector === "function" ? config.selector() : config.selector;
    const el = document.querySelector(selector);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(updateRect, 400);
  }, [step, updateRect]);

  if (!step) return null;
  if (OVERLAY_STEPS.has(step)) return null;

  const svgWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
  const svgHeight = typeof window !== "undefined" ? window.innerHeight : 1080;

  if (step === "welcome") {
    return (
      <AnimatePresence>
        <motion.div
          key="tutorial-welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-surface-elevated border border-accent/30 rounded-2xl p-8 sm:p-10 max-w-md w-full text-center shadow-[0_0_60px_rgba(255,45,149,0.15)]"
          >
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent/30">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-accent"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <span className="text-[9px] font-mono text-text-dim">
              {getStepIndex(step)} / {TOTAL_STEPS}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3 mt-1">
              Welcome to VaultedLabs!
            </h2>
            <p className="text-text-muted text-sm leading-relaxed mb-8">
              Let&apos;s open your first vault. We will cover your dashboard,
              odds, contents, spin flow, and post-reveal actions.
            </p>
            <button
              onClick={onAdvance}
              className="px-8 py-3 bg-accent text-white text-sm font-black uppercase tracking-widest rounded-xl border-b-[4px] border-[#a01d5e] shadow-[0_6px_16px_rgba(255,45,149,0.3)] hover:shadow-[0_4px_12px_rgba(255,45,149,0.4)] active:border-b-[2px] transition-all duration-100 cursor-pointer"
            >
              Let&apos;s Go
            </button>
            {onSkip && (
              <button
                onClick={onSkip}
                className="mt-4 block mx-auto text-[10px] text-text-dim hover:text-text-muted uppercase tracking-widest transition-colors cursor-pointer"
              >
                Skip Tutorial
              </button>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (step === "complete") {
    const actionText = completedAction || "stored";
    return (
      <AnimatePresence>
        <motion.div
          key="tutorial-complete"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-surface-elevated border border-neon-green/30 rounded-2xl p-8 sm:p-10 max-w-md w-full text-center shadow-[0_0_60px_rgba(57,255,20,0.1)]"
          >
            <div className="w-16 h-16 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-neon-green/30">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-neon-green"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-[9px] font-mono text-text-dim">
              {getStepIndex(step)} / {TOTAL_STEPS}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3 mt-1">
              You&apos;re All Set!
            </h2>
            <p className="text-text-muted text-sm leading-relaxed mb-2">
              Your item has been <span className="text-white font-bold">{actionText}</span>.
            </p>
            <p className="text-text-muted text-sm leading-relaxed mb-8">
              You earned <span className="text-neon-green font-bold">90 XP</span>
              from your first vault. Now go explore and keep progressing.
            </p>
            <button
              onClick={onComplete}
              className="px-8 py-3 bg-neon-green/90 text-bg text-sm font-black uppercase tracking-widest rounded-xl border-b-[4px] border-[#2ab80f] shadow-[0_6px_16px_rgba(57,255,20,0.2)] hover:shadow-[0_4px_12px_rgba(57,255,20,0.3)] active:border-b-[2px] transition-all duration-100 cursor-pointer"
            >
              Start Playing
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const tooltipConfig = TOOLTIP_STEPS[step];
  if (tooltipConfig && targetRect) {
    const tooltipStyle = getTooltipPosition(
      targetRect,
      tooltipConfig.position,
      step
    );

    return (
      <AnimatePresence>
        <motion.div
          key={`tutorial-${step}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200]"
        >
          <svg
            width={svgWidth}
            height={svgHeight}
            className="absolute inset-0"
            style={{ pointerEvents: "none" }}
          >
            <defs>
              <mask id="tutorial-mask">
                <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="white" />
                <rect
                  x={targetRect.left}
                  y={targetRect.top}
                  width={targetRect.width}
                  height={targetRect.height}
                  rx="12"
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width={svgWidth}
              height={svgHeight}
              fill="rgba(0,0,0,0.8)"
              mask="url(#tutorial-mask)"
              style={{ pointerEvents: "all" }}
            />
          </svg>

          <div
            className="absolute rounded-xl border-2 border-accent pointer-events-none animate-pulse"
            style={{
              top: targetRect.top,
              left: targetRect.left,
              width: targetRect.width,
              height: targetRect.height,
              boxShadow:
                "0 0 30px rgba(255,45,149,0.4), inset 0 0 20px rgba(255,45,149,0.15)"
            }}
          />

          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bg-surface-elevated border border-accent/40 rounded-xl p-4 sm:p-5 w-[calc(100%-16px)] sm:w-auto max-w-[280px] sm:max-w-sm shadow-[0_0_30px_rgba(255,45,149,0.25)] z-[201]"
            style={tooltipStyle}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                {tooltipConfig.title}
              </p>
              <span className="text-[9px] font-mono text-text-dim">
                {getStepIndex(step)} / {TOTAL_STEPS}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-3 sm:mb-4">
              {tooltipConfig.description}
            </p>
            <div className="flex items-center justify-between">
              {onSkip && (
                <button
                  onClick={onSkip}
                  className="text-[10px] text-text-dim hover:text-text-muted uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Skip
                </button>
              )}
              <button
                onClick={onAdvance}
                className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer shadow-[0_0_15px_rgba(255,45,149,0.3)]"
              >
                Next
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (step === "open-vault" && targetRect) {
    const tooltipStyle = getTooltipPosition(targetRect, "bottom");
    return (
      <AnimatePresence>
        <motion.div
          key="tutorial-open-vault"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] pointer-events-none"
        >
          <svg width={svgWidth} height={svgHeight} className="absolute inset-0">
            <defs>
              <mask id="tutorial-mask-vault">
                <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="white" />
                <rect
                  x={targetRect.left}
                  y={targetRect.top}
                  width={targetRect.width}
                  height={targetRect.height}
                  rx="16"
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width={svgWidth}
              height={svgHeight}
              fill="rgba(0,0,0,0.8)"
              mask="url(#tutorial-mask-vault)"
            />
          </svg>

          <div
            className="absolute rounded-2xl border-2 border-accent pointer-events-none animate-pulse"
            style={{
              top: targetRect.top,
              left: targetRect.left,
              width: targetRect.width,
              height: targetRect.height,
              boxShadow:
                "0 0 30px rgba(255,45,149,0.4), inset 0 0 20px rgba(255,45,149,0.15)"
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bg-surface-elevated border border-accent/40 rounded-xl p-4 sm:p-5 w-[calc(100%-16px)] sm:w-auto max-w-[280px] sm:max-w-sm shadow-[0_0_30px_rgba(255,45,149,0.25)] z-[201]"
            style={tooltipStyle}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                Open a Vault
              </p>
              <span className="text-[9px] font-mono text-text-dim">
                {getStepIndex(step)} / {TOTAL_STEPS}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-3">
              Open a vault to continue.
            </p>
            {onSkip && (
              <button
                onClick={onSkip}
                className="text-[10px] text-text-dim hover:text-text-muted uppercase tracking-widest transition-colors cursor-pointer"
              >
                Skip Tutorial
              </button>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
