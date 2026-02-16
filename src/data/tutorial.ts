import type { TutorialStep } from "../types/tutorial";

function getHudSelector(): string {
  const isMobile = window.innerWidth < 768;
  return isMobile ? '[data-tutorial="hud"]' : '[data-tutorial="hud-desktop"]';
}

export const LINEAR_FLOW: Record<string, TutorialStep> = {
  welcome: "hud",
  hud: "categories",
  categories: "open-vault",
  "result-store": "result-ship",
  "result-ship": "result-cashout"
};

export const TOOLTIP_STEPS: Record<
  string,
  {
    selector: string | (() => string);
    title: string;
    description: string;
    position: "top" | "bottom";
  }
> = {
  hud: {
    selector: getHudSelector,
    title: "Your Dashboard",
    description:
      "This is your dashboard. Credits, loot, and level — always visible.",
    position: "bottom"
  },
  categories: {
    selector: '[data-tutorial="categories"]',
    title: "Categories",
    description:
      "Categories filter what you're hunting for. Funko Pop! is selected.",
    position: "bottom"
  }
};

// Steps that Tutorial.tsx should NOT render (handled inside VaultOverlay)
export const OVERLAY_STEPS = new Set<string>([
  "pick-box",
  "revealing",
  "result-store",
  "result-ship",
  "result-cashout"
]);
