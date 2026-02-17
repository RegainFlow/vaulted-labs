import { useEffect, useState } from "react";
import { Navbar } from "../components/shared/Navbar";
import { InventoryGrid } from "../components/inventory/InventoryGrid";
import { PageTutorial } from "../components/shared/PageTutorial";
import { TutorialHelpButton } from "../components/shared/TutorialHelpButton";
import { Footer } from "../components/shared/Footer";
import { useGame } from "../context/GameContext";
import { INVENTORY_TUTORIAL_STEPS } from "../data/tutorial";

export function InventoryPage() {
  const { balance, inventory, levelInfo, prestigeLevel, hasSeenInventoryTutorial, setHasSeenInventoryTutorial, seedDemoItem, removeDemoItem } = useGame();
  const [tutorialActive, setTutorialActive] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!hasSeenInventoryTutorial) {
      seedDemoItem();
      const timer = setTimeout(() => setTutorialActive(true), 600);
      return () => clearTimeout(timer);
    }
  }, [hasSeenInventoryTutorial, seedDemoItem]);

  return (
    <>
      <Navbar
        showHUD
        balance={balance}
        inventoryCount={inventory.length}
        xp={levelInfo.currentXP}
        level={levelInfo.level}
        prestigeLevel={prestigeLevel}
      />
      <main className="min-h-screen bg-bg px-3 sm:px-4 md:px-6 pt-28 md:pt-28 pb-8 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-1 sm:mb-2">
              Your <span className="text-neon-cyan">Loot</span>
            </h1>
            <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto">
              Manage your collection. Hold, ship, or cashout.
            </p>
          </div>
          <InventoryGrid />
        </div>
      </main>
      <Footer />
      <PageTutorial
        pageKey="inventory"
        steps={INVENTORY_TUTORIAL_STEPS}
        isActive={tutorialActive}
        onComplete={() => {
          setTutorialActive(false);
          setHasSeenInventoryTutorial(true);
          removeDemoItem();
        }}
      />
      {hasSeenInventoryTutorial && !tutorialActive && (
        <TutorialHelpButton onClick={() => setTutorialActive(true)} />
      )}
    </>
  );
}
