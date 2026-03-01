import { useEffect, useRef, useState } from "react";
import { Navbar } from "../components/shared/Navbar";
import { VaultGrid } from "../components/vault/VaultGrid";
import { TutorialHelpButton } from "../components/shared/TutorialHelpButton";
import { OpenMicroTutorial } from "../components/vault/OpenMicroTutorial";
import { useGame } from "../context/GameContext";

export function OpenPage() {
  const {
    balance, inventory, xp, levelInfo, setHasSeenTutorial,
    prestigeLevel, freeSpins, cashoutFlashTimestamp, cashoutStreak,
    bossEnergy, maxBossEnergy, shards
  } = useGame();
  const [vaultOpen, setVaultOpen] = useState(false);
  const [tutorialReplayNonce, setTutorialReplayNonce] = useState(0);
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialStepId, setTutorialStepId] = useState<string | null>(null);
  const tutorialWasActiveRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (tutorialActive) {
      tutorialWasActiveRef.current = true;
      return;
    }
    if (tutorialWasActiveRef.current) {
      setHasSeenTutorial(true);
      tutorialWasActiveRef.current = false;
    }
  }, [setHasSeenTutorial, tutorialActive]);

  return (
    <>
      <Navbar
        showHUD
        balance={balance}
        inventoryCount={inventory.length}
        xp={xp}
        level={levelInfo.level}
        prestigeLevel={prestigeLevel}
        freeSpins={freeSpins}
        cashoutFlashTimestamp={cashoutFlashTimestamp}
        cashoutStreak={cashoutStreak}
        bossEnergy={bossEnergy}
        maxBossEnergy={maxBossEnergy}
        shards={shards}
        hideDock={vaultOpen}
        tutorialActive={tutorialActive}
      />
      <main>
        <VaultGrid
          onOverlayChange={setVaultOpen}
          microTutorialActive={tutorialActive}
          tutorialStepId={tutorialStepId}
          tutorialMode={tutorialActive ? "demo" : null}
        />
      </main>
      <OpenMicroTutorial
        key={`open-page-micro-${tutorialReplayNonce}`}
        replayNonce={tutorialReplayNonce}
        disabled={false}
        onActiveChange={setTutorialActive}
        onStepChange={setTutorialStepId}
      />
      {!vaultOpen && !tutorialActive && (
        <TutorialHelpButton
          onClick={() => setTutorialReplayNonce((prev) => prev + 1)}
        />
      )}
    </>
  );
}
