import { useState, useCallback } from "react";
import type { TutorialStep } from "../types/tutorial";
import { LINEAR_FLOW } from "../data/tutorial";

export function useTutorial(hasSeenTutorial: boolean) {
  const [step, setStep] = useState<TutorialStep | null>(
    hasSeenTutorial ? null : "welcome"
  );
  const [completedAction, setCompletedAction] = useState<string | null>(null);

  // Linear "Next" button transitions
  const advance = useCallback(() => {
    setStep((prev) => {
      if (!prev) return null;
      return LINEAR_FLOW[prev] ?? prev;
    });
  }, []);

  // Event-driven transitions
  const goTo = useCallback((next: TutorialStep) => {
    setStep(next);
  }, []);

  // Reset tutorial (called on complete)
  const reset = useCallback(() => {
    setStep(null);
  }, []);

  return { step, advance, goTo, completedAction, setCompletedAction, reset };
}
