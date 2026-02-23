import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { Navbar } from "../components/shared/Navbar";
import { ResourceBar } from "../components/arena/ResourceBar";
import { BattleCard } from "../components/arena/BattleCard";
import { BattleSetupModal } from "../components/arena/BattleSetupModal";
import { BattleOverlay } from "../components/arena/BattleOverlay";
import { LockedOverlay } from "../components/shared/LockedOverlay";
import { useGame } from "../context/GameContext";
import { BATTLES } from "../data/gamification";
import { trackEvent, AnalyticsEvents } from "../lib/analytics";
import { isFeatureUnlocked } from "../lib/unlocks";
import type { Battle, CombatResult } from "../types/gamification";
import type { Collectible } from "../types/collectible";

export function ArenaBattlesPage() {
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
    shards,
    defeatedBosses,
    spendBossEnergy,
    completeBattle
  } = useGame();
  const navigate = useNavigate();
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [activeBattle, setActiveBattle] = useState<Battle | null>(null);
  const [battleSquad, setBattleSquad] = useState<Collectible[] | null>(null);
  const locked = !isFeatureUnlocked("battles", xp);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!locked) return;
    trackEvent(AnalyticsEvents.FEATURE_LOCKED_CLICKED, { featureKey: "battles" });
  }, [locked]);

  const handleStartBattle = (items: Collectible[]) => {
    if (!selectedBattle) return;
    if (!spendBossEnergy(selectedBattle.energyCost)) return;
    setActiveBattle(selectedBattle);
    setBattleSquad(items);
    setSelectedBattle(null);
  };

  const handleBattleComplete = (result: CombatResult) => {
    if (battleSquad && activeBattle) {
      completeBattle(activeBattle.id, result);
    }
    setActiveBattle(null);
    setBattleSquad(null);
  };

  const hideDock = !!selectedBattle || !!activeBattle || !!battleSquad;

  return (
    <>
      <Navbar
        showHUD
        hideDock={hideDock}
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
              <span className="text-accent">Battles</span>
            </h1>
            <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto">
              Select a boss, choose your squad, and fight for progression.
            </p>
          </div>

          <ResourceBar />

          {!locked && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BATTLES.map((battle) => (
                <BattleCard
                  key={battle.id}
                  battle={battle}
                  playerLevel={levelInfo.level}
                  isDefeated={defeatedBosses.includes(battle.id)}
                  energyCost={battle.energyCost}
                  currentEnergy={bossEnergy}
                  onFight={setSelectedBattle}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedBattle && (
        <BattleSetupModal
          battle={selectedBattle}
          isOpen={!!selectedBattle}
          onClose={() => setSelectedBattle(null)}
          onStartBattle={handleStartBattle}
        />
      )}

      <AnimatePresence>
        {battleSquad && activeBattle && (
          <BattleOverlay
            battle={activeBattle}
            squadItems={battleSquad}
            rankLevel={prestigeLevel}
            onComplete={handleBattleComplete}
          />
        )}
      </AnimatePresence>

      <LockedOverlay isOpen={locked} featureKey="battles" xp={xp} />
    </>
  );
}
