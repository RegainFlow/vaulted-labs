import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { Navbar } from "../components/shared/Navbar";
import { ResourceBar } from "../components/arena/ResourceBar";
import { BattleCard } from "../components/arena/BattleCard";
import { BattleSetupModal } from "../components/arena/BattleSetupModal";
import { BattleOverlay } from "../components/arena/BattleOverlay";
import { ForgePanel } from "../components/arena/ForgePanel";
import { QuestList } from "../components/profile/QuestList";
import { SegmentedTabs } from "../components/shared/SegmentedTabs";
import { PageTutorial } from "../components/shared/PageTutorial";
import { TutorialHelpButton } from "../components/shared/TutorialHelpButton";
import { useGame } from "../context/GameContext";
import { BATTLES } from "../data/gamification";
import { ARENA_TUTORIAL_STEPS } from "../data/tutorial";
import type { Battle, CombatResult } from "../types/gamification";
import type { Collectible } from "../types/collectible";

type ArenaSection = "battles" | "forge" | "quests";

export function ArenaPage() {
  const {
    balance, inventory, xp, levelInfo, prestigeLevel, freeSpins,
    cashoutFlashTimestamp, cashoutStreak, bossEnergy, maxBossEnergy, shards,
    defeatedBosses, spendBossEnergy, completeBattle, resolveBattleFairly,
    resetDemo, setHasSeenArenaTutorial
  } = useGame();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<ArenaSection>("battles");
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [activeBattle, setActiveBattle] = useState<Battle | null>(null);
  const [battleSquad, setBattleSquad] = useState<Collectible[] | null>(null);
  const [battleResultSeed, setBattleResultSeed] = useState<CombatResult | null>(null);
  const [battleReceiptId, setBattleReceiptId] = useState<string | null>(null);
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialStepIndex, setTutorialStepIndex] = useState(0);
  const tutorialStep = ARENA_TUTORIAL_STEPS[tutorialStepIndex];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const displaySection = useMemo<ArenaSection>(() => {
    if (!tutorialActive || !tutorialStep) return activeSection;
    if (["arena-tab-forge", "arena-forge"].includes(tutorialStep.id)) return "forge";
    if (["arena-tab-quests", "arena-quests"].includes(tutorialStep.id)) return "quests";
    return "battles";
  }, [tutorialActive, tutorialStep, activeSection]);

  const handleFight = (battle: Battle) => {
    setSelectedBattle(battle);
  };

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

  const sections: { key: ArenaSection; label: string; mobileLabel: string; tutorialId?: string }[] = [
    { key: "battles", label: "Battles", mobileLabel: "Battles" },
    { key: "forge", label: "Forge", mobileLabel: "Forge", tutorialId: "arena-tab-forge" },
    { key: "quests", label: "Quests", mobileLabel: "Quests", tutorialId: "arena-tab-quests" }
  ];

  const hideDock =
    !!selectedBattle ||
    !!activeBattle ||
    !!battleSquad;

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
        hideDock={hideDock}
        tutorialActive={tutorialActive}
      />
      <main className="min-h-screen bg-bg px-3 sm:px-4 md:px-6 pt-32 md:pt-28 pb-28 sm:pb-28 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-1 sm:mb-2">
              The <span className="text-accent">Arena</span>
            </h1>
            <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto">
              Equip your squad, battle bosses, and forge new collectibles.
            </p>
          </div>

          {/* Resources */}
          <ResourceBar />

          <SegmentedTabs
            tabs={sections}
            activeKey={displaySection}
            onChange={(key) => setActiveSection(key as ArenaSection)}
            containerTutorialId="arena-tabs"
            layoutId="arena-tabs-indicator"
            className="justify-center"
          />

          {/* Section content */}
          {displaySection === "battles" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-tutorial="arena-battles">
              {BATTLES.map((battle) => (
                <BattleCard
                  key={battle.id}
                  battle={battle}
                  playerLevel={levelInfo.level}
                  isDefeated={defeatedBosses.includes(battle.id)}
                  energyCost={battle.energyCost}
                  currentEnergy={bossEnergy}
                  onFight={handleFight}
                />
              ))}
            </div>
          )}

          {displaySection === "forge" && <ForgePanel />}

          {displaySection === "quests" && <QuestList />}

          <div className="mt-8 sm:mt-12 space-y-4">
            <div className="pt-6 border-t border-white/5 text-center">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={() => { resetDemo(); navigate("/"); window.scrollTo(0, 0); }}
                  className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest bg-error/10 border border-error/30 text-error hover:bg-error/20 hover:border-error/50 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Reset Demo
                </button>
              </div>
              <p className="text-[11px] text-text-muted mt-2">
                Debug tools for testing demo progression.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Battle Setup Modal */}
      {selectedBattle && (
        <BattleSetupModal
          battle={selectedBattle}
          isOpen={!!selectedBattle}
          onClose={() => setSelectedBattle(null)}
          onStartBattle={handleStartBattle}
        />
      )}

      {/* Battle Overlay */}
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

      <AnimatePresence>
      </AnimatePresence>

      <PageTutorial
        pageKey="arena"
        steps={ARENA_TUTORIAL_STEPS}
        isActive={tutorialActive}
        onStepChange={setTutorialStepIndex}
        onComplete={() => {
          setTutorialActive(false);
          setHasSeenArenaTutorial(true);
          setTutorialStepIndex(0);
        }}
      />
      {!tutorialActive && (
        <TutorialHelpButton onClick={() => setTutorialActive(true)} />
      )}
    </>
  );
}
