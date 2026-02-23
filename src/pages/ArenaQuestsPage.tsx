import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/shared/Navbar";
import { ResourceBar } from "../components/arena/ResourceBar";
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
    levelInfo,
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
        level={levelInfo.level}
        prestigeLevel={prestigeLevel}
        freeSpins={freeSpins}
        cashoutFlashTimestamp={cashoutFlashTimestamp}
        cashoutStreak={cashoutStreak}
        bossEnergy={bossEnergy}
        maxBossEnergy={maxBossEnergy}
        shards={shards}
      />
      <main className="min-h-screen bg-bg px-3 sm:px-4 md:px-6 pt-36 md:pt-28 pb-28 sm:pb-28 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/locker/arena")}
            className="mb-4 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-surface border border-white/15 text-text-muted hover:text-white hover:border-white/30 transition-colors cursor-pointer"
          >
            Back to Arena Home
          </button>

          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-1 sm:mb-2">
              <span className="text-accent">Quests</span>
            </h1>
            <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto">
              Track your quest line and stack consistent XP gains.
            </p>
          </div>

          <ResourceBar />
          {!locked && <QuestList />}
        </div>
      </main>
      <LockedOverlay isOpen={locked} featureKey="quests" xp={xp} />
    </>
  );
}
