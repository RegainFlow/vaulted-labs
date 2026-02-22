import { useEffect, useState, useMemo } from "react";
import { Navbar } from "../components/shared/Navbar";
import { ShopTabs } from "../components/shop/ShopTabs";
import { PageTutorial } from "../components/shared/PageTutorial";
import { TutorialHelpButton } from "../components/shared/TutorialHelpButton";
import { Footer } from "../components/shared/Footer";
import { useGame } from "../context/GameContext";
import { SHOP_TUTORIAL_STEPS } from "../data/tutorial";

export function ShopPage() {
  const { balance, inventory, levelInfo, prestigeLevel, freeSpins, cashoutFlashTimestamp, cashoutStreak, hasSeenShopTutorial, setHasSeenShopTutorial } = useGame();
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialStepIndex, setTutorialStepIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!hasSeenShopTutorial) {
      const timer = setTimeout(() => setTutorialActive(true), 600);
      return () => clearTimeout(timer);
    }
  }, [hasSeenShopTutorial]);

  // Force auctions tab when tutorial reaches auction-related steps
  const forceTab = useMemo(() => {
    if (!tutorialActive) return null;
    const step = SHOP_TUTORIAL_STEPS[tutorialStepIndex];
    if (!step) return null;
    const auctionSteps = ["shop-auction-tab", "shop-auction", "shop-timer", "shop-bid"];
    if (auctionSteps.includes(step.id)) return "auctions" as const;
    return null;
  }, [tutorialActive, tutorialStepIndex]);

  return (
    <>
      <Navbar
        showHUD
        balance={balance}
        inventoryCount={inventory.length}
        xp={levelInfo.currentXP}
        level={levelInfo.level}
        prestigeLevel={prestigeLevel}
        freeSpins={freeSpins}
        cashoutFlashTimestamp={cashoutFlashTimestamp}
        cashoutStreak={cashoutStreak}
      />
      <main className="min-h-screen bg-bg px-3 sm:px-4 md:px-6 pt-28 md:pt-28 pb-8 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-1 sm:mb-2">
              The <span className="text-accent">Shop</span>
            </h1>
            <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto">
              Buy collectibles and bid on auctions.
            </p>
          </div>
          <ShopTabs forceTab={forceTab} />
        </div>
      </main>
      <Footer />
      <PageTutorial
        pageKey="shop"
        steps={SHOP_TUTORIAL_STEPS}
        isActive={tutorialActive}
        onComplete={() => {
          setTutorialActive(false);
          setHasSeenShopTutorial(true);
          setTutorialStepIndex(0);
        }}
        onStepChange={setTutorialStepIndex}
      />
      {hasSeenShopTutorial && !tutorialActive && (
        <TutorialHelpButton onClick={() => setTutorialActive(true)} />
      )}
    </>
  );
}
