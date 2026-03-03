import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { Navbar } from "../components/shared/Navbar";
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
    completeBattle,
    resolveBattleFairly,
  } = useGame();
  const navigate = useNavigate();
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [activeBattle, setActiveBattle] = useState<Battle | null>(null);
  const [battleSquad, setBattleSquad] = useState<Collectible[] | null>(null);
  const [battleResultSeed, setBattleResultSeed] = useState<CombatResult | null>(null);
  const [battleReceiptId, setBattleReceiptId] = useState<string | null>(null);
  const locked = !isFeatureUnlocked("battles", xp);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!locked) return;
    trackEvent(AnalyticsEvents.FEATURE_LOCKED_CLICKED, { featureKey: "battles" });
  }, [locked]);

  const handleStartBattle = async (items: Collectible[]) => {
    if (!selectedBattle) return;
    if (!spendBossEnergy(selectedBattle.energyCost)) return;
    const squadStats = items.reduce(
      (acc, item) => ({
        totalAtk: acc.totalAtk + item.stats.atk,
        totalDef: acc.totalDef + item.stats.def,
        totalAgi: acc.totalAgi + item.stats.agi,
        memberCount: acc.memberCount + 1,
      }),
      { totalAtk: 0, totalDef: 0, totalAgi: 0, memberCount: 0 }
    );
    const fairResponse = await resolveBattleFairly({
      battleId: selectedBattle.id,
      squadItemIds: items.map((item) => item.id),
      squadStats,
      rankLevel: prestigeLevel,
    });
    setActiveBattle(selectedBattle);
    setBattleSquad(items);
    setBattleResultSeed(
      ((fairResponse?.resultPayload as unknown) as CombatResult) ?? null
    );
    setBattleReceiptId(fairResponse?.receipt.id ?? null);
    setSelectedBattle(null);
  };

  const handleBattleComplete = (result: CombatResult) => {
    if (battleSquad && activeBattle) {
      completeBattle(activeBattle.id, result, battleReceiptId ?? undefined);
    }
    setActiveBattle(null);
    setBattleSquad(null);
    setBattleResultSeed(null);
    setBattleReceiptId(null);
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
                  levelInfo={levelInfo}
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
            resolvedResult={battleResultSeed}
            proofReceiptId={battleReceiptId}
          />
        )}
      </AnimatePresence>

      <LockedOverlay isOpen={locked} featureKey="battles" xp={xp} />
    </>
  );
}
