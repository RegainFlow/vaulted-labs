export type TutorialStep =
  | "welcome"
  | "hud"
  | "categories"
  | "open-vault"
  | "pick-box"
  | "revealing"
  | "result-store"
  | "result-ship"
  | "result-cashout"
  | "complete";

export interface TutorialProps {
  step: TutorialStep | null;
  onAdvance: () => void;
  onComplete: () => void;
  completedAction: string | null;
}

export interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}
