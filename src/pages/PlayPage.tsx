import { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { VaultGrid } from "../components/VaultGrid";
import { Tutorial } from "../components/Tutorial";
import { Footer } from "../components/Footer";
import { useGame } from "../context/GameContext";
import { useTutorial } from "../hooks/useTutorial";
import { trackEvent, AnalyticsEvents } from "../lib/analytics";

export function PlayPage() {
  const { balance, inventory, levelInfo, hasSeenTutorial, setHasSeenTutorial } = useGame();
  const { step, advance, goTo, completedAction, setCompletedAction, reset } = useTutorial(hasSeenTutorial);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (step === "welcome") {
      trackEvent(AnalyticsEvents.TUTORIAL_STARTED);
    }
  }, []);

  const handleTutorialAdvance = () => {
    if (step) {
      trackEvent(AnalyticsEvents.TUTORIAL_STEP_COMPLETED, { step });
    }
    advance();
  };

  const handleTutorialComplete = () => {
    trackEvent(AnalyticsEvents.TUTORIAL_COMPLETED, {
      action: completedAction,
    });
    setHasSeenTutorial(true);
    reset();
  };

  return (
    <>
      <Navbar showHUD balance={balance} inventoryCount={inventory.length} xp={levelInfo.currentXP} level={levelInfo.level} />
      <main>
        <VaultGrid
          tutorialStep={step}
          onTutorialAdvance={goTo}
          onTutorialSetAction={setCompletedAction}
        />
      </main>
      <Footer />
      <Tutorial
        step={step}
        onAdvance={handleTutorialAdvance}
        onComplete={handleTutorialComplete}
        completedAction={completedAction}
      />
    </>
  );
}
