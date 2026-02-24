import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { CSSProperties } from "react";
import { trackEvent, AnalyticsEvents } from "../../lib/analytics";
import {
  getSafeViewportInsets,
  getSpotlightRect,
  getTooltipPlacement,
  scrollTargetIntoView,
  waitForTarget
} from "../../lib/tutorial-viewport";
import {
  OPEN_TUTORIAL_BONUS_SHOWN_EVENT,
  OPEN_TUTORIAL_BONUS_JACKPOT_EVENT,
  OPEN_TUTORIAL_REVEAL_READY_EVENT,
  OPEN_TUTORIAL_SPIN_STARTED_EVENT
} from "../../lib/tutorial-events";

const STORAGE_KEY = "vaultedlabs_open_tutorial_completed";
const PADDING = 8;
const TOOLTIP_MIN_HEIGHT = 170;
const TARGET_RETRY_DELAY_MS = 220;
const TARGET_MAX_ATTEMPTS = 6;

/* ——— Step configuration ——— */

interface TutorialStepConfig {
  id: "pick-vault" | "spin" | "bonus" | "reveal";
  title: string;
  message: string;
  /** Short one-liner for the floating hint bar (overlay steps). */
  hint: string;
  selector: string;
  fallbackSelector?: string;
  advanceOnTargetClick?: boolean;
  /**
   * "spotlight" — dark mask + cutout + positioned tooltip (vault grid steps).
   * "hint"      — compact floating bar, no overlay, no spotlight (overlay steps).
   */
  mode: "spotlight" | "hint";
  /** Render a pulsing border ring on the selector target (hint mode only). */
  showRing?: boolean;
}

const STEPS: TutorialStepConfig[] = [
  {
    id: "pick-vault",
    title: "Pick a Vault",
    message: "Tap the highlighted vault to open the spinner.",
    hint: "Tap the highlighted vault",
    selector: '[data-tutorial="vault-diamond"]',
    fallbackSelector: '[data-tutorial="vault-bronze"]',
    advanceOnTargetClick: true,
    mode: "spotlight"
  },
  {
    id: "spin",
    title: "Spin",
    message: "Hit SPIN to reveal your collectible.",
    hint: "Tap SPIN to reveal your collectible",
    selector: '[data-tutorial="spin-button"]',
    mode: "hint",
    showRing: true
  },
  {
    id: "bonus",
    title: "Bonus Round",
    message: "Click LOCK to stop each spinner. Match all 3 for a jackpot!",
    hint: "Tap LOCK to stop each spinner — match all 3!",
    selector: '[data-tutorial="bonus-lock"]',
    mode: "hint",
    showRing: true
  },
  {
    id: "reveal",
    title: "Your Result",
    message: "Cashout for credits or Equip to save it.",
    hint: "Choose an action: Cashout, Equip, or Ship",
    selector: '[data-tutorial="reveal-actions"]',
    mode: "hint"
  }
];

/* ——— Helpers ——— */

interface OpenMicroTutorialProps {
  replayNonce?: number;
  onActiveChange?: (active: boolean) => void;
}

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
    window.innerHeight * 0.55 - tooltipHeight / 2,
    insets.top + margin,
    window.innerHeight - insets.bottom - tooltipHeight - margin
  );

  return { top, left, maxWidth: width };
}

function getTargetElement(step: TutorialStepConfig) {
  return document.querySelector(step.selector) ??
    (step.fallbackSelector ? document.querySelector(step.fallbackSelector) : null);
}

/* ——— Component ——— */

export function OpenMicroTutorial({
  replayNonce = 0,
  onActiveChange
}: OpenMicroTutorialProps) {
  const [isActive, setIsActive] = useState(() => {
    if (replayNonce > 0) return true;
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(STORAGE_KEY) !== "true";
    } catch {
      return false;
    }
  });
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [targetMissing, setTargetMissing] = useState(false);
  const [tooltipHeight, setTooltipHeight] = useState(TOOLTIP_MIN_HEIGHT);
  const [spinActionTriggered, setSpinActionTriggered] = useState(false);
  const [jackpotCelebrating, setJackpotCelebrating] = useState(false);
  const hasTrackedShownRef = useRef(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<Element | null>(null);
  const step = STEPS[stepIndex];
  const spinStepIndex = STEPS.findIndex((item) => item.id === "spin");
  const bonusStepIndex = STEPS.findIndex((item) => item.id === "bonus");
  const revealStepIndex = STEPS.findIndex((item) => item.id === "reveal");

  /* ——— Lifecycle & event wiring (unchanged logic) ——— */

  useEffect(() => {
    if (replayNonce <= 0) return;
    const resetId = window.setTimeout(() => {
      setIsActive(true);
      setStepIndex(0);
      setTargetRect(null);
      setTargetMissing(false);
      setSpinActionTriggered(false);
      setJackpotCelebrating(false);
    }, 0);
    return () => window.clearTimeout(resetId);
  }, [replayNonce]);

  useEffect(() => { onActiveChange?.(isActive); }, [isActive, onActiveChange]);
  useEffect(() => { return () => { onActiveChange?.(false); }; }, [onActiveChange]);

  useEffect(() => {
    if (!isActive) { hasTrackedShownRef.current = false; return; }
    if (hasTrackedShownRef.current) return;
    hasTrackedShownRef.current = true;
    trackEvent(AnalyticsEvents.TUTORIAL_SHOWN, { tutorial: "open_micro" });
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    document.body.classList.add("tutorial-active");
    return () => { document.body.classList.remove("tutorial-active"); };
  }, [isActive]);

  /* ——— Hint ring target resolution (hint-mode steps with showRing) ——— */

  const [hintRingRect, setHintRingRect] = useState<{
    top: number; left: number; width: number; height: number;
  } | null>(null);
  const hintRingRef = useRef<Element | null>(null);

  const syncHintRingRect = useCallback(() => {
    if (!hintRingRef.current) return;
    const insets = getTutorialInsets();
    setHintRingRect(getSpotlightRect(hintRingRef.current, PADDING, insets));
  }, []);

  useEffect(() => {
    if (!isActive || !step || step.mode !== "hint" || !step.showRing) {
      hintRingRef.current = null;
      setHintRingRect(null);
      return;
    }

    let cancelled = false;
    let retryTimeoutId: number | null = null;
    let retries = 0;

    const resolveTarget = async () => {
      if (cancelled) return;
      const fallbackSelectors = step.fallbackSelector ? [step.fallbackSelector] : [];
      const target = await waitForTarget(step.selector, {
        fallbackSelectors,
        timeoutMs: 1200,
        intervalMs: 120
      });
      if (cancelled) return;
      if (target) {
        hintRingRef.current = target;
        const insets = getTutorialInsets();
        setHintRingRect(getSpotlightRect(target, PADDING, insets));
        return;
      }
      if (retries < TARGET_MAX_ATTEMPTS) {
        retries += 1;
        retryTimeoutId = window.setTimeout(resolveTarget, TARGET_RETRY_DELAY_MS);
        return;
      }
      hintRingRef.current = null;
      setHintRingRect(null);
    };

    resolveTarget();
    window.addEventListener("resize", syncHintRingRect);
    window.addEventListener("scroll", syncHintRingRect, true);
    return () => {
      cancelled = true;
      if (retryTimeoutId != null) window.clearTimeout(retryTimeoutId);
      window.removeEventListener("resize", syncHintRingRect);
      window.removeEventListener("scroll", syncHintRingRect, true);
    };
  }, [isActive, step, syncHintRingRect]);

  /* ——— Spotlight target resolution (only for spotlight-mode steps) ——— */

  const syncSpotlightRect = useCallback(() => {
    if (!targetRef.current) return;
    const insets = getTutorialInsets();
    setTargetRect(getSpotlightRect(targetRef.current, PADDING, insets));
  }, []);

  useEffect(() => {
    if (!isActive || !step || step.mode !== "spotlight") {
      targetRef.current = null;
      setTargetRect(null);
      return;
    }

    let cancelled = false;
    let retryTimeoutId: number | null = null;
    let retries = 0;

    const resolveTarget = async () => {
      if (cancelled) return;
      const fallbackSelectors = step.fallbackSelector ? [step.fallbackSelector] : [];
      const target = await waitForTarget(step.selector, {
        fallbackSelectors,
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
      if (retryTimeoutId != null) window.clearTimeout(retryTimeoutId);
      window.removeEventListener("resize", syncSpotlightRect);
      window.removeEventListener("scroll", syncSpotlightRect, true);
    };
  }, [isActive, step, syncSpotlightRect]);

  /* ——— Click-to-advance for pick-vault ——— */

  useEffect(() => {
    if (!isActive || !step.advanceOnTargetClick) return;
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    const attachClickListener = async () => {
      const fallbackSelectors = step.fallbackSelector ? [step.fallbackSelector] : [];
      const target = await waitForTarget(step.selector, {
        fallbackSelectors,
        timeoutMs: 1200,
        intervalMs: 120
      });
      if (cancelled || !(target instanceof HTMLElement)) return;
      const handleTargetClick = () => {
        window.setTimeout(() => {
          setTargetRect(null);
          setTargetMissing(false);
          setStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
        }, 160);
      };
      target.addEventListener("click", handleTargetClick, { once: true });
      cleanup = () => target.removeEventListener("click", handleTargetClick);
    };

    attachClickListener();
    return () => { cancelled = true; cleanup?.(); };
  }, [isActive, step]);

  /* ——— Event-driven step transitions ——— */

  useEffect(() => {
    if (!isActive) return;
    const handleSpinStarted = () => {
      setSpinActionTriggered(true);
      setTargetRect(null);
      setTargetMissing(false);
      if (step.id === "pick-vault") setStepIndex(spinStepIndex);
    };
    window.addEventListener(OPEN_TUTORIAL_SPIN_STARTED_EVENT, handleSpinStarted);
    return () => { window.removeEventListener(OPEN_TUTORIAL_SPIN_STARTED_EVENT, handleSpinStarted); };
  }, [isActive, spinStepIndex, step.id]);

  useEffect(() => {
    if (!isActive || step.id !== "spin") return;
    const target = getTargetElement(step);
    if (!(target instanceof HTMLElement)) return;
    const handleSpinClick = () => {
      setSpinActionTriggered(true);
      setTargetRect(null);
    };
    target.addEventListener("click", handleSpinClick, { once: true });
    return () => { target.removeEventListener("click", handleSpinClick); };
  }, [isActive, step]);

  useEffect(() => {
    if (!isActive) return;
    const handleBonusShown = () => {
      if (step.id !== "spin") return;
      setSpinActionTriggered(false);
      setTargetRect(null);
      setTargetMissing(false);
      setStepIndex(bonusStepIndex);
    };
    const handleRevealReady = () => {
      if (step.id !== "spin" && step.id !== "bonus") return;
      setSpinActionTriggered(false);
      setTargetRect(null);
      setTargetMissing(false);
      setStepIndex(revealStepIndex);
    };
    const handleJackpot = () => {
      setJackpotCelebrating(true);
    };
    window.addEventListener(OPEN_TUTORIAL_BONUS_SHOWN_EVENT, handleBonusShown);
    window.addEventListener(OPEN_TUTORIAL_REVEAL_READY_EVENT, handleRevealReady);
    window.addEventListener(OPEN_TUTORIAL_BONUS_JACKPOT_EVENT, handleJackpot);
    return () => {
      window.removeEventListener(OPEN_TUTORIAL_BONUS_SHOWN_EVENT, handleBonusShown);
      window.removeEventListener(OPEN_TUTORIAL_REVEAL_READY_EVENT, handleRevealReady);
      window.removeEventListener(OPEN_TUTORIAL_BONUS_JACKPOT_EVENT, handleJackpot);
    };
  }, [isActive, bonusStepIndex, revealStepIndex, step.id]);

  /* ——— Tooltip height measurement (spotlight mode only) ——— */

  useEffect(() => {
    if (!isActive || step.mode !== "spotlight") return;
    if (!tooltipRef.current) return;
    const measure = () => {
      if (!tooltipRef.current) return;
      const measured = Math.ceil(tooltipRef.current.getBoundingClientRect().height);
      if (measured > 0) setTooltipHeight(measured);
    };
    const rafId = window.requestAnimationFrame(measure);
    return () => window.cancelAnimationFrame(rafId);
  }, [isActive, stepIndex, targetRect, targetMissing, step.mode]);

  /* ——— Actions ——— */

  const completeTutorial = useCallback((eventName: string) => {
    try { localStorage.setItem(STORAGE_KEY, "true"); } catch { /* noop */ }
    setIsActive(false);
    trackEvent(eventName, { tutorial: "open_micro" });
  }, []);

  const handleSkip = () => { completeTutorial(AnalyticsEvents.TUTORIAL_SKIPPED); };

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setTargetRect(null);
      setTargetMissing(false);
      setStepIndex((prev) => prev + 1);
      return;
    }
    completeTutorial(AnalyticsEvents.TUTORIAL_COMPLETED);
  };

  /* ——— Tooltip positioning (spotlight mode) ——— */

  const getTooltipStyle = useCallback((): CSSProperties => {
    const insets = getTutorialInsets();
    if (!targetRect) return getFallbackTooltipStyle(tooltipHeight, insets);
    return getTooltipPlacement(targetRect, {
      preferredPosition: "top",
      insets,
      maxWidth: window.innerWidth < 640 ? 300 : 360,
      tooltipHeightGuess: tooltipHeight
    });
  }, [targetRect, tooltipHeight]);

  /* ——— Visibility guards ——— */

  const hideDuringSpin =
    spinActionTriggered && (step.id === "pick-vault" || step.id === "spin");

  // Hide the bonus hint bar once the jackpot celebration starts
  const hideBonusAfterJackpot = step.id === "bonus" && jackpotCelebrating;

  if (!isActive || hideDuringSpin || hideBonusAfterJackpot) return null;

  /* ——————————————————————————————————————————————————————
   *  RENDER: Hint bar mode (spin / bonus / reveal)
   * —————————————————————————————————————————————————————— */

  if (step.mode === "hint") {
    const isBonus = step.id === "bonus";
    const borderClass = isBonus ? "border-neon-green/40" : "border-accent/40";
    const glowClass = isBonus
      ? "shadow-[0_-4px_24px_rgba(57,255,20,0.12)]"
      : "shadow-[0_-4px_24px_rgba(255,45,149,0.12)]";
    const dotColor = isBonus ? "bg-neon-green" : "bg-accent";
    const ringBorderClass = isBonus ? "border-neon-green" : "border-accent";
    const ringGlow = isBonus
      ? "0 0 30px rgba(57,255,20,0.4), inset 0 0 20px rgba(57,255,20,0.15)"
      : "0 0 30px rgba(255,45,149,0.4), inset 0 0 20px rgba(255,45,149,0.15)";

    return (
      <>
        {/* Optional pulsing ring on target (no dark overlay) */}
        {step.showRing && hintRingRect && (
          <div
            className={`fixed rounded-xl border-2 ${ringBorderClass} pointer-events-none animate-pulse z-[210]`}
            style={{
              top: hintRingRect.top,
              left: hintRingRect.left,
              width: hintRingRect.width,
              height: hintRingRect.height,
              boxShadow: ringGlow
            }}
          />
        )}

        {/* Bottom pill bar */}
        <AnimatePresence>
          <motion.div
            key={`hint-${step.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-[210] pointer-events-none flex justify-center px-3 pb-3 sm:pb-4"
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
                {step.hint}
              </p>

              {/* Skip / Done */}
              {step.id === "reveal" ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="shrink-0 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer bg-accent text-white hover:bg-accent-hover"
                >
                  Got it
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="shrink-0 text-[9px] text-text-dim hover:text-text-muted uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Skip
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </>
    );
  }

  /* ——————————————————————————————————————————————————————
   *  RENDER: Spotlight mode (pick-vault)
   * —————————————————————————————————————————————————————— */

  const svgWidth = window.innerWidth;
  const svgHeight = window.innerHeight;
  const insets = getTutorialInsets();
  const maxTooltipHeight = Math.max(
    TOOLTIP_MIN_HEIGHT,
    window.innerHeight - insets.top - insets.bottom - 16
  );
  const tooltipStyle = getTooltipStyle();
  const maskId = `open-micro-mask-${step.id}`;

  return (
    <AnimatePresence>
      <motion.div
        key={`open-micro-${step.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[210] pointer-events-none"
      >
        {/* Dark overlay with spotlight cutout */}
        <svg width={svgWidth} height={svgHeight} className="absolute inset-0">
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
            fill="rgba(0,0,0,0.68)"
            mask={`url(#${maskId})`}
          />
        </svg>

        {/* Animated spotlight border */}
        {targetRect && (
          <div
            className="absolute rounded-xl border-2 animate-pulse border-accent"
            style={{
              top: targetRect.top,
              left: targetRect.left,
              width: targetRect.width,
              height: targetRect.height,
              boxShadow: "0 0 30px rgba(255,45,149,0.35), inset 0 0 18px rgba(255,45,149,0.15)"
            }}
          />
        )}

        {/* Tooltip card */}
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute w-[calc(100%-16px)] sm:w-auto max-w-[300px] sm:max-w-sm rounded-xl border border-accent/40 bg-surface-elevated p-4 sm:p-5 z-[211] pointer-events-auto overflow-y-auto shadow-[0_0_30px_rgba(255,45,149,0.25)]"
          style={{
            ...tooltipStyle,
            maxHeight: maxTooltipHeight
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
              {step.title}
            </p>
            <span className="text-[9px] font-mono text-text-dim">
              {stepIndex + 1} / {STEPS.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">
            {step.message}
          </p>
          {targetMissing && (
            <p className="text-[10px] text-text-dim uppercase tracking-wider mb-3">
              Target not found. Continue when ready.
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
            {step.advanceOnTargetClick ? (
              <span className="text-[10px] font-bold uppercase tracking-wider text-neon-cyan">
                Tap Vault
              </span>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer bg-accent text-white hover:bg-accent-hover"
              >
                Next
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
