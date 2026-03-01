import { useCallback, useEffect, useState } from "react";
import { TutorialOverlay } from "../tutorial/TutorialOverlay";
import { VAULT_TUTORIAL_STEPS, VAULT_TUTORIAL_STORAGE_KEY } from "../../data/tutorial";
import {
  isTutorialCompleted,
  migrateTutorialCompletion,
  setTutorialCompleted,
} from "../../lib/tutorial-storage";
import { useGame } from "../../context/GameContext";

const LEGACY_STORAGE_KEYS = ["vaultedlabs_open_tutorial_completed"];

interface OpenMicroTutorialProps {
  replayNonce?: number;
  disabled?: boolean;
  onActiveChange?: (active: boolean) => void;
  onStepChange?: (stepId: string | null) => void;
}

export function OpenMicroTutorial({
  replayNonce = 0,
  disabled = false,
  onActiveChange,
  onStepChange,
}: OpenMicroTutorialProps) {
  const { hasSeenTutorial, setHasSeenTutorial } = useGame();
  const [isActive, setIsActive] = useState(() => {
    if (disabled) return false;
    if (replayNonce > 0) return true;
    return !(
      isTutorialCompleted(VAULT_TUTORIAL_STORAGE_KEY) || hasSeenTutorial
    );
  });

  useEffect(() => {
    migrateTutorialCompletion(VAULT_TUTORIAL_STORAGE_KEY, LEGACY_STORAGE_KEYS);
  }, []);

  useEffect(() => {
    if (!hasSeenTutorial) return;
    setTutorialCompleted(VAULT_TUTORIAL_STORAGE_KEY, true);
  }, [hasSeenTutorial]);

  useEffect(() => {
    if (!disabled) return;
    setIsActive(false);
  }, [disabled]);

  useEffect(() => {
    onActiveChange?.(isActive);
  }, [isActive, onActiveChange]);

  useEffect(() => {
    if (!isActive) {
      onStepChange?.(null);
    }
  }, [isActive, onStepChange]);

  const handleComplete = useCallback(() => {
    setTutorialCompleted(VAULT_TUTORIAL_STORAGE_KEY, true);
    setHasSeenTutorial(true);
    setIsActive(false);
  }, [setHasSeenTutorial]);

  return (
    <TutorialOverlay
      tutorialId="vaults"
      steps={VAULT_TUTORIAL_STEPS}
      isActive={isActive}
      onComplete={handleComplete}
      onStepChange={(_, step) => onStepChange?.(step.id)}
    />
  );
}
