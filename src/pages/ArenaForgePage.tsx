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
      <main className="min-h-screen bg-bg px-3 sm:px-4 md:px-6 pt-32 md:pt-24 pb-20 sm:pb-24">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/locker/arena")}
            className="mb-3 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-surface border border-white/15 text-text-muted hover:text-white hover:border-white/30 transition-colors cursor-pointer"
          >
            Back to Arena Home
          </button>

          <div className="system-shell-strong mb-4 overflow-hidden px-5 py-4 text-center sm:mb-5 sm:px-6 sm:py-5">
            <div className="mx-auto max-w-3xl">
              <div className="text-[10px] font-black uppercase tracking-[0.32em] text-white/42">
                Arena Foundry
              </div>
              <h1 className="mt-2 text-2xl font-black uppercase tracking-[0.04em] text-white sm:text-3xl md:text-4xl">
                <span className="text-accent">Forge</span> Chamber
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                Link three collectibles, bias the crucible with free spins, and resolve a stronger outcome through the verified forge flow.
              </p>
            </div>
          </div>

          {!locked && <ForgePanel />}
        </div>
      </main>
      <LockedOverlay isOpen={locked} featureKey="forge" xp={xp} />
    </>
  );
}
