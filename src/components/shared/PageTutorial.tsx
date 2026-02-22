import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { PageTutorialProps, TargetRect } from "../../types/tutorial";

const PADDING = 8;

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
  position: "top" | "bottom" = "bottom"
): React.CSSProperties {
  const isMobile = window.innerWidth < 640;
  const tooltipMaxWidth = isMobile ? 280 : 340;

  const leftPos = isMobile
    ? Math.max(8, (window.innerWidth - tooltipMaxWidth) / 2)
    : Math.max(12, Math.min(rect.left, window.innerWidth - tooltipMaxWidth));

  if (position === "bottom" || isMobile) {
    const top = rect.top + rect.height + 12;
    // If tooltip would go below viewport, position above instead
    if (top + 160 > window.innerHeight) {
      const aboveTop = rect.top - 12 - 160;
      if (aboveTop >= 8) {
        return { top: aboveTop, left: leftPos };
      }
      const bottom = window.innerHeight - rect.top + 12;
      return {
        bottom: Math.max(8, Math.min(bottom, window.innerHeight - 20)),
        left: leftPos
      };
    }
    return {
      top: Math.max(8, Math.min(top, window.innerHeight - 200)),
      left: leftPos
    };
  }
  // Position top: place tooltip above the element
  const aboveTop = rect.top - 12 - 160;
  if (aboveTop >= 8) {
    return {
      top: aboveTop,
      left: Math.max(12, Math.min(rect.left, window.innerWidth - tooltipMaxWidth))
    };
  }
  const bottom = window.innerHeight - rect.top + 12;
  return {
    bottom: Math.max(8, Math.min(bottom, window.innerHeight - 20)),
    left: Math.max(12, Math.min(rect.left, window.innerWidth - tooltipMaxWidth))
  };
}

export function PageTutorial({
  steps,
  isActive,
  onComplete,
  onStepChange
}: PageTutorialProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const clickTimestamps = useRef<number[]>([]);

  const currentStep = steps[currentIndex];

  // Auto-dismiss on rapid clicking (>3 clicks in 1 second)
  useEffect(() => {
    if (!isActive) return;
    const handleClick = () => {
      const now = Date.now();
      clickTimestamps.current.push(now);
      clickTimestamps.current = clickTimestamps.current.filter((t) => now - t < 1000);
      if (clickTimestamps.current.length > 3) {
        setCurrentIndex(0);
        onStepChange?.(0);
        onComplete();
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isActive, onComplete, onStepChange]);

  const updateRect = useCallback(() => {
    if (!currentStep || currentStep.type !== "spotlight" || !currentStep.selector) {
      setTargetRect(null);
      return;
    }
    const rect = getTargetRect(currentStep.selector);
    setTargetRect(rect);
  }, [currentStep]);

  useEffect(() => {
    if (isActive) return;
    const resetTimer = window.setTimeout(() => setCurrentIndex(0), 0);
    return () => window.clearTimeout(resetTimer);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    const initialMeasureTimer = window.setTimeout(updateRect, 0);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.clearTimeout(initialMeasureTimer);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [isActive, updateRect]);

  // Scroll spotlight elements into view
  useEffect(() => {
    if (!isActive || !currentStep || currentStep.type !== "spotlight" || !currentStep.selector) return;
    const el = document.querySelector(currentStep.selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setTimeout(updateRect, 400);
    }
  }, [isActive, currentIndex, currentStep, updateRect]);

  if (!isActive || !currentStep) return null;

  const handleSkip = () => {
    setCurrentIndex(0);
    onStepChange?.(0);
    onComplete();
  };

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      onStepChange?.(next);
    } else {
      setCurrentIndex(0);
      onStepChange?.(0);
      onComplete();
    }
  };

  const svgWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
  const svgHeight = typeof window !== "undefined" ? window.innerHeight : 1080;

  const stepIndicator = `${currentIndex + 1} / ${steps.length}`;

  // Welcome overlay
  if (currentStep.type === "welcome") {
    return (
      <AnimatePresence>
        <motion.div
          key="page-tutorial-welcome"
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
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
              {currentStep.title}
            </h2>
            <p className="text-text-muted text-sm leading-relaxed mb-8">
              {currentStep.description}
            </p>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-accent text-white text-sm font-black uppercase tracking-widest rounded-xl border-b-[4px] border-[#a01d5e] shadow-[0_6px_16px_rgba(255,45,149,0.3)] hover:shadow-[0_4px_12px_rgba(255,45,149,0.4)] active:border-b-[2px] transition-all duration-100 cursor-pointer"
            >
              Let's Go
            </button>
            <button
              onClick={handleSkip}
              className="mt-4 block mx-auto text-[10px] text-text-dim hover:text-text-muted uppercase tracking-widest transition-colors cursor-pointer"
            >
              Skip Tutorial
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Complete overlay
  if (currentStep.type === "complete") {
    return (
      <AnimatePresence>
        <motion.div
          key="page-tutorial-complete"
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
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-3">
              {currentStep.title}
            </h2>
            <p className="text-text-muted text-sm leading-relaxed mb-8">
              {currentStep.description}
            </p>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-neon-green/90 text-bg text-sm font-black uppercase tracking-widest rounded-xl border-b-[4px] border-[#2ab80f] shadow-[0_6px_16px_rgba(57,255,20,0.2)] hover:shadow-[0_4px_12px_rgba(57,255,20,0.3)] active:border-b-[2px] transition-all duration-100 cursor-pointer"
            >
              Got It
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Spotlight step
  if (currentStep.type === "spotlight" && targetRect) {
    const tooltipStyle = getTooltipPosition(
      targetRect,
      currentStep.position || "bottom"
    );

    return (
      <AnimatePresence>
        <motion.div
          key={`page-tutorial-${currentStep.id}`}
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
              <mask id={`page-tutorial-mask-${currentStep.id}`}>
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
              mask={`url(#page-tutorial-mask-${currentStep.id})`}
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
              boxShadow: "0 0 30px rgba(255,45,149,0.4), inset 0 0 20px rgba(255,45,149,0.15)"
            }}
          />

          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bg-surface-elevated border border-accent/40 rounded-xl p-4 sm:p-5 w-[calc(100%-16px)] sm:w-auto max-w-[280px] sm:max-w-sm shadow-[0_0_30px_rgba(255,45,149,0.25)] z-[201]"
            style={tooltipStyle}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                {currentStep.title}
              </p>
              <span className="text-[9px] font-mono text-text-dim">
                {stepIndicator}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-3 sm:mb-4">
              {currentStep.description}
            </p>
            <div className="flex items-center justify-between">
              <button
                onClick={handleSkip}
                className="text-[10px] text-text-dim hover:text-text-muted uppercase tracking-widest transition-colors cursor-pointer"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer shadow-[0_0_15px_rgba(255,45,149,0.3)]"
              >
                {currentIndex < steps.length - 1 ? "Next" : "Done"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Spotlight step but no target found — skip to next
  if (currentStep.type === "spotlight" && !targetRect) {
    // Wait a moment for the element to render, then try again or skip
    return (
      <motion.div
        key="page-tutorial-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-surface-elevated border border-accent/30 rounded-xl p-6 max-w-sm w-full text-center"
        >
          <p className="text-sm font-black text-white uppercase tracking-tight mb-2">
            {currentStep.title}
          </p>
          <p className="text-xs text-text-muted leading-relaxed mb-4">
            {currentStep.description}
          </p>
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-[10px] text-text-dim hover:text-text-muted uppercase tracking-widest transition-colors cursor-pointer"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-accent text-white hover:bg-accent-hover transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return null;
}
