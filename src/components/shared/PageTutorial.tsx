import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { CSSProperties } from "react";
import type { PageTutorialProps, TargetRect } from "../../types/tutorial";
import {
  getSafeViewportInsets,
  getSpotlightRect,
  getTooltipPlacement,
  scrollTargetIntoView,
  waitForTarget
} from "../../lib/tutorial-viewport";

const PADDING = 8;
const TOOLTIP_MIN_HEIGHT = 170;
const TARGET_RETRY_DELAY_MS = 220;
const TARGET_MAX_ATTEMPTS = 6;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function getTutorialInsets() {
  return getSafeViewportInsets({
    hasTopNav: true,
    hasBottomDock: true,
    isMobile: window.innerWidth < 640
  });
}

function getFallbackTooltipStyle(
  tooltipHeight: number,
  insets: ReturnType<typeof getTutorialInsets>
): CSSProperties {
  const margin = 8;
  const width = Math.min(window.innerWidth - margin * 2, window.innerWidth < 640 ? 300 : 360);
  const left = clamp(
    (window.innerWidth - width) / 2,
    insets.left + margin,
    window.innerWidth - insets.right - width - margin
  );
  const top = clamp(
    window.innerHeight * 0.5 - tooltipHeight / 2,
    insets.top + margin,
    window.innerHeight - insets.bottom - tooltipHeight - margin
  );

  return { top, left, maxWidth: width };
}

export function PageTutorial({
  pageKey,
  steps,
  isActive,
  onComplete,
  onStepChange
}: PageTutorialProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [targetMissing, setTargetMissing] = useState(false);
  const [tooltipHeight, setTooltipHeight] = useState(TOOLTIP_MIN_HEIGHT);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<Element | null>(null);
  const wasActiveRef = useRef(false);
  const stepChangeRef = useRef(onStepChange);
  const currentStep = steps[currentIndex];

  useEffect(() => {
    stepChangeRef.current = onStepChange;
  }, [onStepChange]);

  useEffect(() => {
    if (!isActive) {
      wasActiveRef.current = false;
      return;
    }
    if (wasActiveRef.current) return;
    wasActiveRef.current = true;

    const resetId = window.setTimeout(() => {
      setCurrentIndex(0);
      setTargetRect(null);
      setTargetMissing(false);
      stepChangeRef.current?.(0);
    }, 0);
    return () => window.clearTimeout(resetId);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    document.body.classList.add("tutorial-active");
    return () => {
      document.body.classList.remove("tutorial-active");
    };
  }, [isActive]);

  const syncSpotlightRect = useCallback(() => {
    if (!targetRef.current) return;
    const insets = getTutorialInsets();
    setTargetRect(getSpotlightRect(targetRef.current, PADDING, insets));
  }, []);

  const needsTarget =
    currentStep?.type === "spotlight" ||
    (currentStep?.type === "hint" && currentStep.showRing);

  useEffect(() => {
    if (!isActive || !currentStep || !needsTarget || !currentStep.selector) {
      targetRef.current = null;
      return;
    }

    let cancelled = false;
    let retryTimeoutId: number | null = null;
    let retries = 0;

    const resolveTarget = async () => {
      if (cancelled) return;

      const target = await waitForTarget(currentStep.selector ?? "", {
        timeoutMs: 1200,
        intervalMs: 120
      });

      if (cancelled) return;

      if (target) {
        targetRef.current = target;
        const insets = getTutorialInsets();
        scrollTargetIntoView(target, {
          topInset: insets.top,
          bottomInset: insets.bottom,
          behavior: "smooth"
        });
        setTargetRect(getSpotlightRect(target, PADDING, insets));
        setTargetMissing(false);
        return;
      }

      if (retries < TARGET_MAX_ATTEMPTS) {
        retries += 1;
        retryTimeoutId = window.setTimeout(resolveTarget, TARGET_RETRY_DELAY_MS);
        return;
      }

      targetRef.current = null;
      setTargetRect(null);
      setTargetMissing(true);
    };

    resolveTarget();

    window.addEventListener("resize", syncSpotlightRect);
    window.addEventListener("scroll", syncSpotlightRect, true);

    return () => {
      cancelled = true;
      if (retryTimeoutId != null) {
        window.clearTimeout(retryTimeoutId);
      }
      window.removeEventListener("resize", syncSpotlightRect);
      window.removeEventListener("scroll", syncSpotlightRect, true);
    };
  }, [isActive, currentStep, needsTarget, syncSpotlightRect]);

  useEffect(() => {
    if (!isActive) return;
    if (!tooltipRef.current) return;

    const measure = () => {
      if (!tooltipRef.current) return;
      const measured = Math.ceil(tooltipRef.current.getBoundingClientRect().height);
      if (measured > 0) {
        setTooltipHeight(measured);
      }
    };

    const rafId = window.requestAnimationFrame(measure);
    return () => window.cancelAnimationFrame(rafId);
  }, [isActive, currentIndex, targetRect, targetMissing]);

  const handleSkip = () => {
    setCurrentIndex(0);
    setTargetRect(null);
    setTargetMissing(false);
    onStepChange?.(0);
    onComplete();
  };

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      setTargetRect(null);
      setTargetMissing(false);
      onStepChange?.(next);
      return;
    }
    setCurrentIndex(0);
    setTargetRect(null);
    setTargetMissing(false);
    onStepChange?.(0);
    onComplete();
  };

  const getTooltipStyle = useCallback((): CSSProperties => {
    const insets = getTutorialInsets();
    if (!targetRect) {
      return getFallbackTooltipStyle(tooltipHeight, insets);
    }

    return getTooltipPlacement(targetRect, {
      preferredPosition: currentStep?.position ?? "bottom",
      insets,
      maxWidth: window.innerWidth < 640 ? 300 : 360,
      tooltipHeightGuess: tooltipHeight
    });
  }, [currentStep?.position, targetRect, tooltipHeight]);

  if (!isActive || !currentStep) return null;

  const svgWidth = window.innerWidth;
  const svgHeight = window.innerHeight;
  const stepIndicator = `${currentIndex + 1} / ${steps.length}`;
  const insets = getTutorialInsets();
  const maxTooltipHeight = Math.max(
    TOOLTIP_MIN_HEIGHT,
    window.innerHeight - insets.top - insets.bottom - 16
  );

  if (currentStep.type === "welcome") {
    return (
      <AnimatePresence>
        <motion.div
          key={`page-tutorial-welcome-${pageKey}`}
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
              type="button"
              onClick={handleNext}
              className="px-8 py-3 bg-accent text-white text-sm font-black uppercase tracking-widest rounded-xl border-b-[4px] border-[#a01d5e] shadow-[0_6px_16px_rgba(255,45,149,0.3)] hover:shadow-[0_4px_12px_rgba(255,45,149,0.4)] active:border-b-[2px] transition-all duration-100 cursor-pointer"
            >
              Let&apos;s Go
            </button>
            <button
              type="button"
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

  if (currentStep.type === "complete") {
    return (
      <AnimatePresence>
        <motion.div
          key={`page-tutorial-complete-${pageKey}`}
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
              type="button"
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

  /* ——— Hint mode: lightweight pill bar + optional ring ——— */

  if (currentStep.type === "hint") {
    const accent = currentStep.accentColor ?? "accent";
    const borderClass =
      accent === "neon-green" ? "border-neon-green/40" :
      accent === "neon-cyan" ? "border-neon-cyan/40" :
      "border-accent/40";
    const glowClass =
      accent === "neon-green" ? "shadow-[0_-4px_24px_rgba(57,255,20,0.12)]" :
      accent === "neon-cyan" ? "shadow-[0_-4px_24px_rgba(0,240,255,0.12)]" :
      "shadow-[0_-4px_24px_rgba(255,45,149,0.12)]";
    const dotColor =
      accent === "neon-green" ? "bg-neon-green" :
      accent === "neon-cyan" ? "bg-neon-cyan" :
      "bg-accent";
    const ringBorderClass =
      accent === "neon-green" ? "border-neon-green" :
      accent === "neon-cyan" ? "border-neon-cyan" :
      "border-accent";
    const ringGlow =
      accent === "neon-green" ? "0 0 30px rgba(57,255,20,0.4), inset 0 0 20px rgba(57,255,20,0.15)" :
      accent === "neon-cyan" ? "0 0 30px rgba(0,240,255,0.4), inset 0 0 20px rgba(0,240,255,0.15)" :
      "0 0 30px rgba(255,45,149,0.4), inset 0 0 20px rgba(255,45,149,0.15)";
    const pillText = currentStep.hint || currentStep.description;

    return (
      <>
        {/* Optional pulsing ring on target (no dark overlay) */}
        {currentStep.showRing && targetRect && (
          <div
            className={`fixed rounded-xl border-2 ${ringBorderClass} pointer-events-none animate-pulse z-[200]`}
            style={{
              top: targetRect.top,
              left: targetRect.left,
              width: targetRect.width,
              height: targetRect.height,
              boxShadow: ringGlow
            }}
          />
        )}

        {/* Bottom pill bar */}
        <AnimatePresence>
          <motion.div
            key={`page-hint-${currentStep.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-[200] pointer-events-none flex justify-center px-3 pb-3 sm:pb-4"
          >
            <div
              className={`pointer-events-auto flex items-center gap-3 rounded-xl border ${borderClass} bg-surface-elevated/95 backdrop-blur-md px-4 py-3 ${glowClass} max-w-md w-full`}
            >
              {/* Pulsing dot */}
              <span className="relative flex shrink-0">
                <span className={`absolute inline-flex h-2.5 w-2.5 rounded-full ${dotColor} opacity-50 animate-ping`} />
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dotColor}`} />
              </span>

              {/* Hint text */}
              <p className="text-[11px] sm:text-xs text-text-muted leading-snug flex-1">
                {pillText}
              </p>

              {/* Step indicator */}
              <span className="text-[9px] font-mono text-text-dim shrink-0">
                {stepIndicator}
              </span>

              {/* Skip + Next */}
              <button
                type="button"
                onClick={handleSkip}
                className="shrink-0 text-[9px] text-text-dim hover:text-text-muted uppercase tracking-widest transition-colors cursor-pointer"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="shrink-0 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer bg-accent text-white hover:bg-accent-hover"
              >
                {currentIndex < steps.length - 1 ? "Next" : "Done"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </>
    );
  }

  /* ——— Spotlight mode (default) ——— */

  const tooltipStyle = getTooltipStyle();
  const maskId = `page-tutorial-mask-${pageKey}-${currentStep.id}`;

  return (
    <AnimatePresence>
      <motion.div
        key={`page-tutorial-${pageKey}-${currentStep.id}`}
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
            <mask id={maskId}>
              <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="white" />
              {targetRect && (
                <rect
                  x={targetRect.left}
                  y={targetRect.top}
                  width={targetRect.width}
                  height={targetRect.height}
                  rx="12"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width={svgWidth}
            height={svgHeight}
            fill="rgba(0,0,0,0.8)"
            mask={`url(#${maskId})`}
            style={{ pointerEvents: "all" }}
          />
        </svg>

        {targetRect && (
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
        )}

        <motion.div
          ref={tooltipRef}
          key={`${currentStep.id}-tooltip`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute bg-surface-elevated border border-accent/40 rounded-xl p-4 sm:p-5 w-[calc(100%-16px)] sm:w-auto max-w-[300px] sm:max-w-sm shadow-[0_0_30px_rgba(255,45,149,0.25)] z-[201] overflow-y-auto"
          style={{
            ...tooltipStyle,
            maxHeight: maxTooltipHeight
          }}
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
          {targetMissing && (
            <p className="text-[10px] text-text-dim uppercase tracking-wider mb-3">
              Target not found. Tap next to continue.
            </p>
          )}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleSkip}
              className="text-[10px] text-text-dim hover:text-text-muted uppercase tracking-widest transition-colors cursor-pointer"
            >
              Skip
            </button>
            <button
              type="button"
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
