import type { CSSProperties } from "react";
import type { TargetRect } from "../types/tutorial";

export interface SafeViewportInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface SafeViewportOptions {
  hasTopNav?: boolean;
  hasBottomDock?: boolean;
  isMobile?: boolean;
  extraTop?: number;
  extraRight?: number;
  extraBottom?: number;
  extraLeft?: number;
}

interface ScrollTargetOptions {
  topInset?: number;
  bottomInset?: number;
  behavior?: ScrollBehavior;
}

interface WaitForTargetOptions {
  fallbackSelectors?: string[];
  timeoutMs?: number;
  intervalMs?: number;
}

interface WaitForTargetsOptions extends WaitForTargetOptions {
  requireAll?: boolean;
}

interface TooltipPlacementOptions {
  preferredPosition?: "top" | "bottom";
  insets?: SafeViewportInsets;
  maxWidth?: number;
  tooltipHeightGuess?: number;
}

const SAFE_MARGIN = 8;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function isVisibleTarget(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return false;

  const style = window.getComputedStyle(element);
  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.opacity === "0"
  ) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 && element.getClientRects().length > 0;
}

export function getSafeViewportInsets({
  hasTopNav = true,
  hasBottomDock = false,
  isMobile = typeof window !== "undefined" ? window.innerWidth < 640 : false,
  extraTop = 0,
  extraRight = 0,
  extraBottom = 0,
  extraLeft = 0
}: SafeViewportOptions = {}): SafeViewportInsets {
  const topBase = hasTopNav ? (isMobile ? 124 : 88) : 0;
  const bottomBase = hasBottomDock ? (isMobile ? 88 : 20) : 0;

  return {
    top: topBase + extraTop,
    right: extraRight,
    bottom: bottomBase + extraBottom,
    left: extraLeft
  };
}

export function getSpotlightRect(
  target: Element,
  padding = 8,
  insets: SafeViewportInsets = getSafeViewportInsets()
): TargetRect {
  const rect = target.getBoundingClientRect();

  const unclampedTop = rect.top - padding;
  const unclampedLeft = rect.left - padding;
  const unclampedRight = rect.right + padding;
  const unclampedBottom = rect.bottom + padding;

  const minTop = insets.top + SAFE_MARGIN;
  const minLeft = insets.left + SAFE_MARGIN;
  const maxRight = window.innerWidth - insets.right - SAFE_MARGIN;
  const maxBottom = window.innerHeight - insets.bottom - SAFE_MARGIN;

  const top = clamp(unclampedTop, minTop, maxBottom);
  const left = clamp(unclampedLeft, minLeft, maxRight);
  const right = clamp(unclampedRight, minLeft, maxRight);
  const bottom = clamp(unclampedBottom, minTop, maxBottom);

  return {
    top,
    left,
    width: Math.max(1, right - left),
    height: Math.max(1, bottom - top)
  };
}

export function scrollTargetIntoView(
  target: Element,
  {
    topInset = 0,
    bottomInset = 0,
    behavior = "smooth"
  }: ScrollTargetOptions = {}
) {
  if (typeof window === "undefined") return;

  target.scrollIntoView({
    behavior,
    block: "center",
    inline: "nearest"
  });

  // Nested scroll containers sometimes keep the spotlight off-screen after
  // the first couple of steps. Force parent containers to center too.
  let parent: HTMLElement | null = target.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    const canScrollY =
      (style.overflowY === "auto" || style.overflowY === "scroll") &&
      parent.scrollHeight > parent.clientHeight;
    if (canScrollY) {
      const targetRect = target.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const targetCenter = targetRect.top + targetRect.height / 2;
      const parentCenter = parentRect.top + parentRect.height / 2;
      parent.scrollBy({ top: targetCenter - parentCenter, behavior });
    }
    parent = parent.parentElement;
  }

  const rect = target.getBoundingClientRect();
  const safeTop = topInset + SAFE_MARGIN;
  const safeBottom = window.innerHeight - bottomInset - SAFE_MARGIN;
  const targetCenter = rect.top + rect.height / 2;
  const safeCenter = safeTop + (safeBottom - safeTop) / 2;

  if (rect.top < safeTop || rect.bottom > safeBottom) {
    const delta = targetCenter - safeCenter;
    if (Math.abs(delta) > 1) {
      window.scrollBy({ top: delta, behavior });
    }
  }
}

export function getTooltipPlacement(
  rect: TargetRect,
  {
    preferredPosition = "bottom",
    insets = getSafeViewportInsets(),
    maxWidth = window.innerWidth < 640 ? 280 : 340,
    tooltipHeightGuess = 170
  }: TooltipPlacementOptions = {}
): CSSProperties {
  const safeLeft = insets.left + SAFE_MARGIN;
  const safeTop = insets.top + SAFE_MARGIN;
  const safeRight = window.innerWidth - insets.right - SAFE_MARGIN;
  const safeBottom = window.innerHeight - insets.bottom - SAFE_MARGIN;
  const availableWidth = Math.max(220, safeRight - safeLeft);
  const availableHeight = Math.max(220, safeBottom - safeTop);
  const width = Math.min(maxWidth, availableWidth);
  const isMobile = window.innerWidth < 640;
  const tooltipHeight = Math.min(tooltipHeightGuess, availableHeight);

  let left = isMobile
    ? safeLeft + (availableWidth - width) / 2
    : rect.left;
  left = clamp(left, safeLeft, safeRight - width);

  const roomAbove = rect.top - safeTop;
  const roomBelow = safeBottom - (rect.top + rect.height);
  const targetIsTall = rect.height >= availableHeight * 0.55;

  let placeBelow = preferredPosition !== "top";
  if (preferredPosition === "top" && roomAbove < tooltipHeightGuess && roomBelow > roomAbove) {
    placeBelow = true;
  }
  if (preferredPosition === "bottom" && roomBelow < tooltipHeightGuess && roomAbove > roomBelow) {
    placeBelow = false;
  }

  let idealTop = placeBelow
    ? rect.top + rect.height + 12
    : rect.top - tooltipHeight - 12;

  // Large spotlight targets can trap tooltips off-screen. Center instead.
  if (targetIsTall) {
    idealTop = safeTop + (availableHeight - tooltipHeight) / 2;
  }

  const top = clamp(idealTop, safeTop, safeBottom - tooltipHeight);

  return {
    top,
    left,
    maxWidth: width
  };
}

function queryTarget(selector: string, fallbackSelectors: string[] = []) {
  const directMatches = Array.from(document.querySelectorAll(selector));
  const visibleDirectMatch = directMatches.find(isVisibleTarget);
  if (visibleDirectMatch) {
    return visibleDirectMatch;
  }

  const fallbackMatches = fallbackSelectors
    .flatMap((entry) => Array.from(document.querySelectorAll(entry)));
  const visibleFallbackMatch = fallbackMatches.find(isVisibleTarget);
  if (visibleFallbackMatch) {
    return visibleFallbackMatch;
  }

  return null;
}

function queryTargets(
  selectors: string[],
  fallbackSelectors: string[] = [],
  requireAll = false
) {
  const resolved = selectors
    .map((selector) => {
      const matches = Array.from(document.querySelectorAll(selector));
      return matches.find(isVisibleTarget) ?? null;
    })
    .filter((entry): entry is Element => Boolean(entry));

  if (resolved.length > 0 && (!requireAll || resolved.length === selectors.length)) {
    return resolved;
  }

  if (fallbackSelectors.length === 0) {
    return resolved;
  }

  const fallbackResolved = fallbackSelectors
    .map((selector) => {
      const matches = Array.from(document.querySelectorAll(selector));
      return matches.find(isVisibleTarget) ?? null;
    })
    .filter((entry): entry is Element => Boolean(entry));

  if (fallbackResolved.length === 0) {
    return resolved;
  }

  return fallbackResolved;
}

export function waitForTarget(
  selector: string,
  {
    fallbackSelectors = [],
    timeoutMs = 1600,
    intervalMs = 120
  }: WaitForTargetOptions = {}
): Promise<Element | null> {
  return new Promise((resolve) => {
    const immediate = queryTarget(selector, fallbackSelectors);
    if (immediate) {
      resolve(immediate);
      return;
    }

    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const target = queryTarget(selector, fallbackSelectors);
      if (target) {
        window.clearInterval(interval);
        resolve(target);
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        window.clearInterval(interval);
        resolve(null);
      }
    }, intervalMs);
  });
}

export function waitForTargets(
  selectors: string[],
  {
    fallbackSelectors = [],
    timeoutMs = 1600,
    intervalMs = 120,
    requireAll = false
  }: WaitForTargetsOptions = {}
): Promise<Element[]> {
  return new Promise((resolve) => {
    const immediate = queryTargets(selectors, fallbackSelectors, requireAll);
    if (immediate.length > 0 && (!requireAll || immediate.length === selectors.length)) {
      resolve(immediate);
      return;
    }

    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const targets = queryTargets(selectors, fallbackSelectors, requireAll);
      if (targets.length > 0 && (!requireAll || targets.length === selectors.length)) {
        window.clearInterval(interval);
        resolve(targets);
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        window.clearInterval(interval);
        resolve(targets);
      }
    }, intervalMs);
  });
}

export function getGroupedSpotlightRect(
  targets: Element[],
  padding = 8,
  insets: SafeViewportInsets = getSafeViewportInsets()
): TargetRect | null {
  const visibleTargets = targets.filter(isVisibleTarget);
  if (visibleTargets.length === 0) return null;

  const rects = visibleTargets.map((target) => target.getBoundingClientRect());
  const left = Math.min(...rects.map((rect) => rect.left));
  const top = Math.min(...rects.map((rect) => rect.top));
  const right = Math.max(...rects.map((rect) => rect.right));
  const bottom = Math.max(...rects.map((rect) => rect.bottom));

  const unionTarget = {
    getBoundingClientRect: () =>
      ({
        left,
        top,
        right,
        bottom,
        width: right - left,
        height: bottom - top,
      }) as DOMRect,
  };

  return getSpotlightRect(unionTarget as Element, padding, insets);
}
