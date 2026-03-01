import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useTutorial } from "../../hooks/useTutorial";
import {
  getGroupedSpotlightRect,
  getSafeViewportInsets,
  getTooltipPlacement,
  scrollTargetIntoView,
  waitForTarget,
  waitForTargets,
} from "../../lib/tutorial-viewport";
import type {
  TargetRect,
  TutorialHostCommand,
  TutorialStepDefinition,
} from "../../types/tutorial";
import { TutorialCompletionPanel } from "./TutorialCompletionPanel";
import { TutorialInstructionRail } from "./TutorialInstructionRail";
import { TutorialIntroPanel } from "./TutorialIntroPanel";
import { TutorialSpotlight } from "./TutorialSpotlight";

const DEFAULT_PADDING = 10;
const DEFAULT_RADIUS = 18;
const TOOLTIP_HEIGHT_GUESS = 168;

interface TutorialOverlayProps {
  tutorialId: string;
  steps: TutorialStepDefinition[];
  isActive: boolean;
  onComplete: () => void;
  onStepChange?: (index: number, step: TutorialStepDefinition) => void;
  onCommand?: (command: TutorialHostCommand, step: TutorialStepDefinition) => void;
}

function getAccentColor(accent: TutorialStepDefinition["accentColor"]) {
  switch (accent) {
    case "neon-green":
      return "#69e7a0";
    case "neon-cyan":
      return "#79b5db";
    default:
      return "#ff2d95";
  }
}

export function TutorialOverlay({
  tutorialId,
  steps,
  isActive,
  onComplete,
  onStepChange,
  onCommand,
}: TutorialOverlayProps) {
  const { currentIndex, currentStep, next, skip, complete } = useTutorial({
    steps,
    isActive,
    onComplete,
    onStepChange,
    onCommand,
  });
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [targetMissing, setTargetMissing] = useState(false);
  const [tooltipHeight, setTooltipHeight] = useState(TOOLTIP_HEIGHT_GUESS);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const targetsRef = useRef<Element[]>([]);
  const stepId = currentStep?.id ?? null;
  const accentColor = getAccentColor(currentStep?.accentColor);
  const currentTarget = currentStep?.target;
  const shouldResolveTarget =
    Boolean(
      isActive &&
        currentStep &&
        (currentStep.kind === "spotlight" || currentTarget?.showRing)
    );

  const getInsets = useCallback(
    () =>
      getSafeViewportInsets({
        hasTopNav: true,
        hasBottomDock: true,
        isMobile: typeof window !== "undefined" ? window.innerWidth < 640 : false,
      }),
    []
  );

  const syncSpotlight = useCallback(() => {
    if (!targetsRef.current.length || !currentTarget) return;
    const rect = getGroupedSpotlightRect(
      targetsRef.current,
      currentTarget.padding ?? DEFAULT_PADDING,
      getInsets()
    );
    setTargetRect(rect);
  }, [currentTarget, getInsets]);

  useEffect(() => {
    if (!isActive) {
      targetsRef.current = [];
      const resetId = window.setTimeout(() => {
        setTargetRect(null);
        setTargetMissing(false);
      }, 0);
      return () => window.clearTimeout(resetId);
    }

    document.body.classList.add("tutorial-active");
    return () => {
      document.body.classList.remove("tutorial-active");
    };
  }, [isActive]);

  useEffect(() => {
    if (!shouldResolveTarget || !currentTarget) {
      targetsRef.current = [];
      const resetId = window.setTimeout(() => {
        setTargetRect(null);
        setTargetMissing(false);
      }, 0);
      return () => window.clearTimeout(resetId);
    }

    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;

    const resolveTargets = async () => {
      const selectors = currentTarget.selectors ?? (
        currentTarget.selector ? [currentTarget.selector] : []
      );
      if (selectors.length === 0) {
        targetsRef.current = [];
        setTargetRect(null);
        setTargetMissing(true);
        return;
      }

      let targets: Element[] = [];

      if (selectors.length > 1) {
        targets = await waitForTargets(selectors, {
          fallbackSelectors: currentTarget.fallbackSelectors,
          requireAll: currentTarget.requireAll,
          timeoutMs: 1800,
          intervalMs: 100,
        });
      } else {
        const [selector] = selectors;
        const target = await waitForTarget(selector, {
          fallbackSelectors: currentTarget.fallbackSelectors,
          timeoutMs: 1800,
          intervalMs: 100,
        });
        targets = target ? [target] : [];
      }

      if (cancelled) return;

      if (!targets.length) {
        targetsRef.current = [];
        setTargetRect(null);
        setTargetMissing(true);
        return;
      }

      targetsRef.current = targets;
      setTargetMissing(false);

      const insets = getInsets();
      scrollTargetIntoView(targets[0], {
        topInset: insets.top,
        bottomInset: insets.bottom,
        behavior: "smooth",
      });

      const updateRect = () => {
        if (cancelled) return;
        setTargetRect(
          getGroupedSpotlightRect(
            targets,
            currentTarget.padding ?? DEFAULT_PADDING,
            insets
          )
        );
      };

      window.requestAnimationFrame(updateRect);
      window.setTimeout(updateRect, 180);

      resizeObserver = new ResizeObserver(updateRect);
      targets.forEach((target) => resizeObserver?.observe(target));
    };

    resolveTargets();

    window.addEventListener("resize", syncSpotlight);
    window.addEventListener("scroll", syncSpotlight, true);

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      window.removeEventListener("resize", syncSpotlight);
      window.removeEventListener("scroll", syncSpotlight, true);
    };
  }, [currentTarget, getInsets, isActive, shouldResolveTarget, syncSpotlight]);

  useEffect(() => {
    if (!isActive || !currentStep || !tooltipRef.current) return;

    const measure = () => {
      if (!tooltipRef.current) return;
      const measured = Math.ceil(tooltipRef.current.getBoundingClientRect().height);
      if (measured > 0) {
        setTooltipHeight(measured);
      }
    };

    const rafId = window.requestAnimationFrame(measure);
    return () => window.cancelAnimationFrame(rafId);
  }, [currentIndex, currentStep, isActive, targetRect, targetMissing]);

  useEffect(() => {
    if (
      !isActive ||
      !currentStep ||
      !targetsRef.current.length ||
      !currentStep.advanceOn?.some((trigger) => trigger.type === "target-click")
    ) {
      return;
    }

    const cleanups = targetsRef.current
      .filter((target): target is HTMLElement => target instanceof HTMLElement)
      .map((target) => {
        const handleClick = () => {
          const clickTrigger = currentStep.advanceOn?.find(
            (trigger) => trigger.type === "target-click"
          );
          window.setTimeout(() => next(clickTrigger?.nextStepId), 120);
        };

        target.addEventListener("click", handleClick, { once: true });
        return () => target.removeEventListener("click", handleClick);
      });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [currentStep, isActive, next, stepId]);

  const useTargetAttachedRail =
    currentStep?.kind === "rail" &&
    currentStep.compact &&
    Boolean(targetRect);

  const tooltipStyle = useMemo((): CSSProperties | undefined => {
    if (!currentStep || (!useTargetAttachedRail && currentStep.kind !== "spotlight")) {
      return undefined;
    }

    const insets = getInsets();
    const compactRail = currentStep.kind === "rail";
    const compactRailWidth =
      window.innerWidth < 640 ? 248 : 272;
    if (!targetRect) {
      const width = Math.min(
        window.innerWidth - 16,
        window.innerWidth < 640 ? 300 : compactRail ? compactRailWidth : 360
      );
      return {
        top: Math.max(insets.top + 8, window.innerHeight * 0.5 - tooltipHeight / 2),
        left: Math.max(8, (window.innerWidth - width) / 2),
        maxWidth: width,
      };
    }

    if (useTargetAttachedRail) {
      const safeLeft = insets.left + 8;
      const safeRight = window.innerWidth - insets.right - 8;
      const safeTop = insets.top + 8;
      const safeBottom = window.innerHeight - insets.bottom - 8;
      const width = Math.min(compactRailWidth, safeRight - safeLeft);
      const height = Math.min(tooltipHeight || 96, 112);
      const gap = 16;
      const centeredLeft = targetRect.left + targetRect.width / 2 - width / 2;
      const left = Math.max(safeLeft, Math.min(centeredLeft, safeRight - width));
      const roomAbove = targetRect.top - safeTop;
      const placeAbove = roomAbove >= height + gap;
      const idealTop = placeAbove
        ? targetRect.top - height - gap
        : targetRect.top + targetRect.height + gap;
      const top = Math.max(safeTop, Math.min(idealTop, safeBottom - height));

      return {
        top,
        left,
        maxWidth: width,
      };
    }

    return getTooltipPlacement(targetRect, {
      preferredPosition: currentStep.placement === "bottom" ? "bottom" : "top",
      insets,
      maxWidth: window.innerWidth < 640 ? 300 : compactRail ? compactRailWidth : 360,
      tooltipHeightGuess: compactRail ? Math.min(tooltipHeight, 120) : tooltipHeight,
    });
  }, [currentStep, getInsets, targetRect, tooltipHeight, useTargetAttachedRail]);

  const isTargetClickStep = Boolean(
    currentStep?.advanceOn?.some((trigger) => trigger.type === "target-click")
  );
  const isEventDrivenStep = Boolean(
    currentStep?.advanceOn?.length &&
      currentStep.advanceOn.every((trigger) => trigger.type === "event")
  );

  if (!isActive || !currentStep) {
    return null;
  }

  if (currentStep.kind === "intro") {
    return (
      <div className="fixed inset-0 z-[220] flex items-center justify-center bg-[rgba(2,7,12,0.58)] px-4">
        <TutorialIntroPanel
          kicker={currentStep.kicker}
          title={currentStep.title}
          body={currentStep.body}
          actionLabel={currentStep.actionLabel}
          onNext={() => next()}
          onSkip={skip}
        />
      </div>
    );
  }

  if (currentStep.kind === "complete") {
    return (
      <div className="fixed inset-0 z-[220] flex items-center justify-center bg-[rgba(2,7,12,0.58)] px-4">
        <TutorialCompletionPanel
          kicker={currentStep.kicker}
          title={currentStep.title}
          body={currentStep.body}
          actionLabel={currentStep.actionLabel}
          onDone={complete}
        />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <div key={`${tutorialId}-${stepId}`} className="fixed inset-0 z-[220] pointer-events-none">
        {currentStep.kind === "spotlight" && (
          <TutorialSpotlight
            rect={targetRect}
            radius={currentTarget?.radius ?? DEFAULT_RADIUS}
            accentColor={accentColor}
          />
        )}

        {currentStep.kind === "rail" && currentTarget?.showRing && targetRect && (
          <TutorialSpotlight
            rect={targetRect}
            radius={currentTarget.radius ?? DEFAULT_RADIUS}
            accentColor={accentColor}
            showMask={false}
          />
        )}

        <div ref={tooltipRef}>
          <TutorialInstructionRail
            kicker={currentStep.kicker}
            title={currentStep.title}
            body={
              targetMissing && currentStep.kind === "spotlight"
                ? `${currentStep.body} Continue when the target is visible.`
                : currentStep.hint ?? currentStep.body
            }
            actionLabel={currentStep.actionLabel}
            onNext={() => next()}
            onSkip={skip}
            targetClickStep={isTargetClickStep}
            eventDrivenStep={isEventDrivenStep}
            compact={Boolean(currentStep.compact)}
            bottomAnchored={currentStep.kind === "rail" && !useTargetAttachedRail}
            style={
              currentStep.kind === "spotlight" || useTargetAttachedRail
                ? tooltipStyle
                : undefined
            }
          />
        </div>
      </div>
    </AnimatePresence>
  );
}
