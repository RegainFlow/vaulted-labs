export type TutorialId =
  | "vaults"
  | "locker"
  | "wallet"
  | "collection"
  | "arena";

export type TutorialStep = string;

export type TutorialStepKind = "intro" | "spotlight" | "rail" | "complete";

export type TutorialPlacement = "auto" | "top" | "bottom";

export type TutorialAccent = "accent" | "neon-green" | "neon-cyan";

export interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface TutorialTargetConfig {
  selector?: string;
  selectors?: string[];
  fallbackSelectors?: string[];
  padding?: number;
  radius?: number;
  showRing?: boolean;
  requireAll?: boolean;
}

export interface TutorialAdvanceTrigger {
  type: "next" | "event" | "target-click";
  eventName?: string;
  nextStepId?: string;
}

export type TutorialHostCommand =
  | { type: "none" }
  | { type: "locker:set-section"; section: "inventory" | "market" | "arena" }
  | { type: "collection:set-tab"; tab: "my-collection" | "market" | "auctions" }
  | { type: "arena:set-section"; section: "battles" | "forge" | "quests" };

export interface TutorialStepDefinition {
  id: string;
  kind: TutorialStepKind;
  title: string;
  body: string;
  kicker?: string;
  hint?: string;
  placement?: TutorialPlacement;
  accentColor?: TutorialAccent;
  compact?: boolean;
  target?: TutorialTargetConfig;
  advanceOn?: TutorialAdvanceTrigger[];
  command?: TutorialHostCommand;
  actionLabel?: string;
}

export interface TutorialDefinition {
  id: TutorialId;
  storageKey?: string;
  steps: TutorialStepDefinition[];
}

export interface PageTutorialProps {
  pageKey: string;
  steps: TutorialStepDefinition[];
  isActive: boolean;
  onComplete: () => void;
  onStepChange?: (index: number, step: TutorialStepDefinition) => void;
  onCommand?: (command: TutorialHostCommand, step: TutorialStepDefinition) => void;
}
