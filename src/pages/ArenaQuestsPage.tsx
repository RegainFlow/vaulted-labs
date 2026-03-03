import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/shared/Navbar";
import { QuestList } from "../components/profile/QuestList";
import { LockedOverlay } from "../components/shared/LockedOverlay";
import { useGame } from "../context/GameContext";
import { trackEvent, AnalyticsEvents } from "../lib/analytics";
import { isFeatureUnlocked } from "../lib/unlocks";

export function ArenaQuestsPage() {
  const {
    balance,
    inventory,
    xp,
    prestigeLevel,
    freeSpins,
    cashoutFlashTimestamp,
    cashoutStreak,
    bossEnergy,
    maxBossEnergy,
    shards
  } = useGame();
  const navigate = useNavigate();
  const locked = !isFeatureUnlocked("quests", xp);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!locked) return;
    trackEvent(AnalyticsEvents.FEATURE_LOCKED_CLICKED, { featureKey: "quests" });
  }, [locked]);

  return (
    <>
      <Navbar
        showHUD
        balance={balance}
        inventoryCount={inventory.length}
        xp={xp}
        prestigeLevel={prestigeLevel}
        freeSpins={freeSpins}
        cashoutFlashTimestamp={cashoutFlashTimestamp}
        cashoutStreak={cashoutStreak}
        bossEnergy={bossEnergy}
        maxBossEnergy={maxBossEnergy}
        shards={shards}
      />
      <main className="app-page-shell-compact bg-bg px-3 sm:px-4 md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          <button
            onClick={() => navigate("/locker/arena")}
            className="app-back-button self-start"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to Arena Home
          </button>

          {!locked && <QuestList />}
        </div>
      </main>
      <LockedOverlay isOpen={locked} featureKey="quests" xp={xp} />
    </>
  );
}
