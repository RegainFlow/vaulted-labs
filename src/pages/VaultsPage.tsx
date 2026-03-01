import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../components/shared/Navbar";
import { TutorialHelpButton } from "../components/shared/TutorialHelpButton";
import { VaultGrid } from "../components/vault/VaultGrid";
import { OpenMicroTutorial } from "../components/vault/OpenMicroTutorial";
import { useGame } from "../context/GameContext";

export function VaultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
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
  const [tutorialStepId, setTutorialStepId] = useState<string | null>(null);
  const skipOpenTutorial = Boolean(
    (location.state as { skipOpenTutorial?: boolean } | null)?.skipOpenTutorial
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!skipOpenTutorial) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, navigate, skipOpenTutorial]);

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
        key={`open-micro-${tutorialReplayNonce}`}
        replayNonce={tutorialReplayNonce}
        disabled={skipOpenTutorial}
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
