export type TutorialStep =
  | "welcome"
  | "hud"
  | "categories"
  | "odds"
  | "contents"
  | "open-vault"
  | "spin-reel"
  | "result-store"
  | "result-ship"
  | "result-cashout"
  | "complete";

export interface TutorialProps {
  step: TutorialStep | null;
  onAdvance: () => void;
  onComplete: () => void;
  completedAction: string | null;
  onSkip?: () => void;
}

export interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface PageTutorialStepConfig {
  id: string;
  type: "welcome" | "spotlight" | "complete";
  selector?: string;
  title: string;
  description: string;
  position?: "top" | "bottom";
}

export interface PageTutorialProps {
  pageKey: string;
  steps: PageTutorialStepConfig[];
  isActive: boolean;
  onComplete: () => void;
  onStepChange?: (index: number) => void;
}
