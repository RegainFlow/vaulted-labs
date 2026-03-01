import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  TutorialHostCommand,
  TutorialStepDefinition,
} from "../types/tutorial";

interface UseTutorialOptions {
  steps: TutorialStepDefinition[];
  isActive: boolean;
  onComplete: () => void;
  onStepChange?: (index: number, step: TutorialStepDefinition) => void;
  onCommand?: (command: TutorialHostCommand, step: TutorialStepDefinition) => void;
}

function findStepIndexById(steps: TutorialStepDefinition[], stepId?: string) {
  if (!stepId) return -1;
  return steps.findIndex((step) => step.id === stepId);
}

export function useTutorial({
  steps,
  isActive,
  onComplete,
  onStepChange,
  onCommand,
}: UseTutorialOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const wasActiveRef = useRef(false);
  const stepsRef = useRef(steps);

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  const currentStep = steps[currentIndex] ?? null;

  useEffect(() => {
    if (!isActive) {
      wasActiveRef.current = false;
      return;
    }

    if (wasActiveRef.current) {
      return;
    }

    wasActiveRef.current = true;
    const resetId = window.setTimeout(() => {
      setCurrentIndex(0);
    }, 0);

    return () => window.clearTimeout(resetId);
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !currentStep) return;

    onStepChange?.(currentIndex, currentStep);
    onCommand?.(currentStep.command ?? { type: "none" }, currentStep);
  }, [currentIndex, currentStep, isActive, onCommand, onStepChange]);

  const complete = useCallback(() => {
    setCurrentIndex(0);
    onComplete();
  }, [onComplete]);

  const next = useCallback(
    (nextStepId?: string) => {
      if (!currentStep) {
        complete();
        return;
      }

      const targetedIndex = findStepIndexById(stepsRef.current, nextStepId);
      if (targetedIndex >= 0) {
        setCurrentIndex(targetedIndex);
        return;
      }

      if (currentIndex >= stepsRef.current.length - 1) {
        complete();
        return;
      }

      setCurrentIndex((prev) => prev + 1);
    },
    [complete, currentIndex, currentStep]
  );

  const skip = useCallback(() => {
    complete();
  }, [complete]);

  useEffect(() => {
    if (!isActive || !currentStep?.advanceOn?.length) return;

    const cleanups: Array<() => void> = [];

    currentStep.advanceOn
      .filter((trigger) => trigger.type === "event" && trigger.eventName)
      .forEach((trigger) => {
        const handleEvent = () => next(trigger.nextStepId);
        window.addEventListener(trigger.eventName as string, handleEvent);
        cleanups.push(() =>
          window.removeEventListener(trigger.eventName as string, handleEvent)
        );
      });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [currentStep, isActive, next]);

  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      skip();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isActive, skip]);

  return useMemo(
    () => ({
      currentIndex,
      currentStep,
      next,
      skip,
      complete,
    }),
    [complete, currentIndex, currentStep, next, skip]
  );
}
