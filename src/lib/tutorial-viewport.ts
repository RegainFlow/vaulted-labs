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
  const width = Math.min(maxWidth, availableWidth);
  const isMobile = window.innerWidth < 640;

  let left = isMobile
    ? safeLeft + (availableWidth - width) / 2
    : rect.left;
  left = clamp(left, safeLeft, safeRight - width);

  const roomAbove = rect.top - safeTop;
  const roomBelow = safeBottom - (rect.top + rect.height);

  let placeBelow = preferredPosition !== "top";
  if (preferredPosition === "top" && roomAbove < tooltipHeightGuess && roomBelow > roomAbove) {
    placeBelow = true;
  }
  if (preferredPosition === "bottom" && roomBelow < tooltipHeightGuess && roomAbove > roomBelow) {
    placeBelow = false;
  }

  const idealTop = placeBelow
    ? rect.top + rect.height + 12
    : rect.top - tooltipHeightGuess - 12;
  const top = clamp(idealTop, safeTop, safeBottom - tooltipHeightGuess);

  return {
    top,
    left,
    maxWidth: width
  };
}

function queryTarget(selector: string, fallbackSelectors: string[] = []) {
  return document.querySelector(selector) ??
    fallbackSelectors.map((entry) => document.querySelector(entry)).find(Boolean) ??
    null;
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
