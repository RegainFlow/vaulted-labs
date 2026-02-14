import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { TutorialStep } from "../hooks/useTutorial";

interface TutorialProps {
  step: TutorialStep | null;
  onAdvance: () => void;
  onComplete: () => void;
  completedAction: string | null;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 8;

function getTargetRect(selector: string): TargetRect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top - PADDING,
    left: rect.left - PADDING,
    width: rect.width + PADDING * 2,
    height: rect.height + PADDING * 2,
  };
}

function getTooltipPosition(rect: TargetRect, position: "top" | "bottom", step?: string): React.CSSProperties {
  const isMobile = window.innerWidth < 640;
  const tooltipMaxWidth = isMobile ? 280 : 340;

  // On mobile for top-of-screen elements (hud, categories), position tooltip
  // in the middle of the screen so the highlighted element is clearly visible above
  if (isMobile && (step === "hud" || step === "categories")) {
    return {
      top: Math.max(rect.top + rect.height + 40, window.innerHeight * 0.4),
      left: Math.max(8, (window.innerWidth - tooltipMaxWidth) / 2),
    };
  }

  if (position === "bottom" || isMobile) {
    return {
      top: rect.top + rect.height + 12,
      left: isMobile ? Math.max(8, (window.innerWidth - tooltipMaxWidth) / 2) : Math.max(12, Math.min(rect.left, window.innerWidth - tooltipMaxWidth)),
    };
  }
  return {
    bottom: window.innerHeight - rect.top + 12,
    left: Math.max(12, Math.min(rect.left, window.innerWidth - tooltipMaxWidth)),
  };
}

function getHudSelector(): string {
  const isMobile = window.innerWidth < 768;
  return isMobile ? '[data-tutorial="hud"]' : '[data-tutorial="hud-desktop"]';
}

const TOOLTIP_STEPS: Record<string, { selector: string | (() => string); title: string; description: string; position: "top" | "bottom" }> = {
  hud: {
    selector: getHudSelector,
    title: "Your Dashboard",
    description: "This is your dashboard. Credits, loot, and level — always visible.",
    position: "bottom",
  },
  categories: {
    selector: '[data-tutorial="categories"]',
    title: "Categories",
    description: "Categories filter what you're hunting for. Funko Pop! is selected.",
    position: "bottom",
  },
};

/* Steps that Tutorial.tsx should NOT render (handled inside VaultOverlay) */
const OVERLAY_STEPS = new Set<string>(["pick-box", "revealing", "result-store", "result-ship", "result-cashout"]);

export function Tutorial({ step, onAdvance, onComplete, completedAction }: TutorialProps) {
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);

  const updateRect = useCallback(() => {
    if (!step) return;

    if (step === "open-vault") {
      const rect = getTargetRect('[data-tutorial="vault-bronze"]');
      setTargetRect(rect);
      return;
    }

    const config = TOOLTIP_STEPS[step];
    if (config) {
      const selector = typeof config.selector === "function" ? config.selector() : config.selector;
      const rect = getTargetRect(selector);
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [step]);

  useEffect(() => {
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [updateRect]);

  /* Scroll to top so HUD is visible for hud/categories steps */
  useEffect(() => {
    if (step === "hud" || step === "categories") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(updateRect, 300);
    }
  }, [step, updateRect]);

  /* Scroll Bronze card into view when reaching open-vault step */
  useEffect(() => {
    if (step === "open-vault") {
      const el = document.querySelector('[data-tutorial="vault-bronze"]');
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // Re-measure rect after scroll
        setTimeout(updateRect, 400);
      }
    }
  }, [step, updateRect]);

  if (!step) return null;
  if (OVERLAY_STEPS.has(step)) return null;

  const svgWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
  const svgHeight = typeof window !== "undefined" ? window.innerHeight : 1080;

  /* ── Welcome overlay ── */
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
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
              Welcome to VaultedLabs!
            </h2>
            <p className="text-text-muted text-sm leading-relaxed mb-8">
              Let's open your first vault — on us. You'll pick a box, reveal a collectible, and decide what to do with it. Everything you earn is yours to keep.
            </p>
            <button
              onClick={onAdvance}
              className="px-8 py-3 bg-accent text-white text-sm font-black uppercase tracking-widest rounded-xl border-b-[4px] border-[#a01d5e] shadow-[0_6px_16px_rgba(255,45,149,0.3)] hover:shadow-[0_4px_12px_rgba(255,45,149,0.4)] active:border-b-[2px] transition-all duration-100 cursor-pointer"
            >
              Let's Go
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  /* ── Complete overlay ── */
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
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-neon-green">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
              You're All Set!
            </h2>
            <p className="text-text-muted text-sm leading-relaxed mb-2">
              Your item has been <span className="text-white font-bold">{actionText}</span>.
            </p>
            <p className="text-text-muted text-sm leading-relaxed mb-8">
              You earned <span className="text-neon-green font-bold">24 XP</span> from your first vault. Now go explore — open more vaults, build your collection, and level up.
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

  /* ── Tooltip steps: hud, categories ── */
  const tooltipConfig = TOOLTIP_STEPS[step];
  if (tooltipConfig && targetRect) {
    const tooltipStyle = getTooltipPosition(targetRect, tooltipConfig.position, step);
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
              boxShadow: "0 0 30px rgba(255,45,149,0.4), inset 0 0 20px rgba(255,45,149,0.15)",
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
            <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight mb-1">
              {tooltipConfig.title}
            </p>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-3 sm:mb-4">
              {tooltipConfig.description}
            </p>
            <div className="flex items-center justify-end">
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

  /* ── open-vault step: SVG mask cutout on Bronze card ── */
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
          <svg
            width={svgWidth}
            height={svgHeight}
            className="absolute inset-0"
          >
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
              boxShadow: "0 0 30px rgba(255,45,149,0.4), inset 0 0 20px rgba(255,45,149,0.15)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bg-surface-elevated border border-accent/40 rounded-xl p-4 sm:p-5 w-[calc(100%-16px)] sm:w-auto max-w-[280px] sm:max-w-sm shadow-[0_0_30px_rgba(255,45,149,0.25)] z-[201]"
            style={tooltipStyle}
          >
            <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight mb-1">
              Open a Vault
            </p>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Tap the Bronze vault to open it — this one's free!
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
