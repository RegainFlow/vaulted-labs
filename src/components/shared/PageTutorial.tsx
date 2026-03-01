import { TutorialOverlay } from "../tutorial/TutorialOverlay";
import type { PageTutorialProps } from "../../types/tutorial";

export function PageTutorial({
  pageKey,
  steps,
  isActive,
  onComplete,
  onStepChange,
  onCommand,
}: PageTutorialProps) {
  return (
    <TutorialOverlay
      tutorialId={pageKey}
      steps={steps}
      isActive={isActive}
      onComplete={onComplete}
      onStepChange={onStepChange}
      onCommand={onCommand}
    />
  );
}
