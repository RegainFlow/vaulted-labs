import { useEffect, useRef, useState } from "react";
import { Navbar } from "../components/shared/Navbar";
import { VaultGrid } from "../components/vault/VaultGrid";
import { Tutorial } from "../components/Tutorial";
import { TutorialHelpButton } from "../components/shared/TutorialHelpButton";
import { Footer } from "../components/shared/Footer";
import { useGame } from "../context/GameContext";
import { useTutorial } from "../hooks/useTutorial";
import { trackEvent, AnalyticsEvents } from "../lib/analytics";

export function PlayPage() {
  const { balance, inventory, levelInfo, hasSeenTutorial, setHasSeenTutorial, prestigeLevel, freeSpins, cashoutFlashTimestamp, cashoutStreak } =
    useGame();
  const { step, advance, goTo, completedAction, setCompletedAction, reset } =
    useTutorial(hasSeenTutorial);
  const [vaultOpen, setVaultOpen] = useState(false);
  const tutorialStartedTrackedRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (step === "welcome" && !tutorialStartedTrackedRef.current) {
      tutorialStartedTrackedRef.current = true;
      trackEvent(AnalyticsEvents.TUTORIAL_STARTED);
    }
  }, [step]);

  const handleTutorialAdvance = () => {
    if (step) {
      trackEvent(AnalyticsEvents.TUTORIAL_STEP_COMPLETED, { step });
    }
    advance();
  };

  const handleTutorialComplete = () => {
    trackEvent(AnalyticsEvents.TUTORIAL_COMPLETED, {
      action: completedAction
    });
    setHasSeenTutorial(true);
    reset();
  };

  return (
    <>
      <Navbar
        showHUD
        balance={balance}
        inventoryCount={inventory.length}
        xp={levelInfo.currentXP}
        level={levelInfo.level}
        prestigeLevel={prestigeLevel}
        freeSpins={freeSpins}
        cashoutFlashTimestamp={cashoutFlashTimestamp}
        cashoutStreak={cashoutStreak}
      />
      <main>
        <VaultGrid
          tutorialStep={step}
          onTutorialAdvance={goTo}
          onTutorialSetAction={setCompletedAction}
          onOverlayChange={setVaultOpen}
        />
      </main>
      <Footer />
      <Tutorial
        step={step}
        onAdvance={handleTutorialAdvance}
        onComplete={handleTutorialComplete}
        onSkip={handleTutorialComplete}
        completedAction={completedAction}
      />
      {hasSeenTutorial && !step && !vaultOpen && (
        <TutorialHelpButton onClick={() => goTo("welcome")} />
      )}
    </>
  );
}
