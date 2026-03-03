import { useEffect } from "react";

let activeLocks = 0;
let lockedScrollY = 0;
let originalBodyStyles: Partial<CSSStyleDeclaration> | null = null;
let originalHtmlStyles: Partial<CSSStyleDeclaration> | null = null;

function applyScrollLock() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const { body, documentElement } = document;
  lockedScrollY = window.scrollY;
  const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

  originalBodyStyles = {
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    overflow: body.style.overflow,
    paddingRight: body.style.paddingRight,
    touchAction: body.style.touchAction,
  };

  originalHtmlStyles = {
    overflow: documentElement.style.overflow,
    overscrollBehavior: documentElement.style.overscrollBehavior,
  };

  body.style.position = "fixed";
  body.style.top = `-${lockedScrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflow = "hidden";
  body.style.touchAction = "none";
  body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : "";

  documentElement.style.overflow = "hidden";
  documentElement.style.overscrollBehavior = "none";
}

function releaseScrollLock() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const { body, documentElement } = document;

  if (originalBodyStyles) {
    body.style.position = originalBodyStyles.position ?? "";
    body.style.top = originalBodyStyles.top ?? "";
    body.style.left = originalBodyStyles.left ?? "";
    body.style.right = originalBodyStyles.right ?? "";
    body.style.width = originalBodyStyles.width ?? "";
    body.style.overflow = originalBodyStyles.overflow ?? "";
    body.style.paddingRight = originalBodyStyles.paddingRight ?? "";
    body.style.touchAction = originalBodyStyles.touchAction ?? "";
  }

  if (originalHtmlStyles) {
    documentElement.style.overflow = originalHtmlStyles.overflow ?? "";
    documentElement.style.overscrollBehavior =
      originalHtmlStyles.overscrollBehavior ?? "";
  }

  window.scrollTo(0, lockedScrollY);
  originalBodyStyles = null;
  originalHtmlStyles = null;
}

export function useOverlayScrollLock(active: boolean) {
  useEffect(() => {
    if (!active || typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    activeLocks += 1;
    if (activeLocks === 1) {
      applyScrollLock();
    }

    return () => {
      activeLocks = Math.max(0, activeLocks - 1);
      if (activeLocks === 0) {
        releaseScrollLock();
      }
    };
  }, [active]);
}
