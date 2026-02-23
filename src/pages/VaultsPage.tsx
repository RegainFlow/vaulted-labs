import { useEffect, useState } from "react";
import { Navbar } from "../components/shared/Navbar";
import { TutorialHelpButton } from "../components/shared/TutorialHelpButton";
import { VaultGrid } from "../components/vault/VaultGrid";
import { OpenMicroTutorial } from "../components/vault/OpenMicroTutorial";
import { useGame } from "../context/GameContext";

export function VaultsPage() {
  const {
    balance,
    inventory,
    xp,
    levelInfo,
    prestigeLevel,
    freeSpins,
    cashoutFlashTimestamp,
    cashoutStreak,
    bossEnergy,
    maxBossEnergy,
    shards
  } = useGame();
  const [vaultOpen, setVaultOpen] = useState(false);
  const [tutorialReplayNonce, setTutorialReplayNonce] = useState(0);
  const [tutorialActive, setTutorialActive] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        <VaultGrid onOverlayChange={setVaultOpen} />
      </main>
      <OpenMicroTutorial
        key={`open-micro-${tutorialReplayNonce}`}
        replayNonce={tutorialReplayNonce}
        onActiveChange={setTutorialActive}
      />
      {!vaultOpen && !tutorialActive && (
        <TutorialHelpButton
          onClick={() => setTutorialReplayNonce((prev) => prev + 1)}
        />
      )}
    </>
  );
}
