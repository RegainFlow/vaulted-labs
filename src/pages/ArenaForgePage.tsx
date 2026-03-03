import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/shared/Navbar";
import { ForgePanel } from "../components/arena/ForgePanel";
import { LockedOverlay } from "../components/shared/LockedOverlay";
import { useGame } from "../context/GameContext";
import { trackEvent, AnalyticsEvents } from "../lib/analytics";
import { isFeatureUnlocked } from "../lib/unlocks";

export function ArenaForgePage() {
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
  const locked = !isFeatureUnlocked("forge", xp);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!locked) return;
    trackEvent(AnalyticsEvents.FEATURE_LOCKED_CLICKED, { featureKey: "forge" });
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
      <main className="min-h-screen bg-bg px-3 sm:px-4 md:px-6 pt-28 md:pt-24 pb-20 sm:pb-24">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/locker/arena")}
            className="mb-3 rounded-lg border border-white/15 bg-surface px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted transition-colors hover:border-white/30 hover:text-white cursor-pointer"
          >
            Back to Arena Home
          </button>

          {!locked && <ForgePanel />}
        </div>
      </main>
      <LockedOverlay isOpen={locked} featureKey="forge" xp={xp} />
    </>
  );
}
