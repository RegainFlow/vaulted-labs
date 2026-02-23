import { useEffect, useState, useMemo } from "react";
import { Navbar } from "../components/shared/Navbar";
import { InventoryGrid } from "../components/inventory/InventoryGrid";
import { ListingGrid } from "../components/shop/ListingGrid";
import { AuctionGrid } from "../components/shop/AuctionGrid";
import { SegmentedTabs } from "../components/shared/SegmentedTabs";
import { PageTutorial } from "../components/shared/PageTutorial";
import { TutorialHelpButton } from "../components/shared/TutorialHelpButton";
import { useGame } from "../context/GameContext";
import { COLLECTION_TUTORIAL_STEPS } from "../data/tutorial";

type CollectionTab = "my-collection" | "market" | "auctions";

export function CollectionPage() {
  const {
    balance, inventory, levelInfo, prestigeLevel, freeSpins,
    cashoutFlashTimestamp, cashoutStreak, bossEnergy, maxBossEnergy, shards,
    setHasSeenCollectionTutorial,
    seedDemoItem, removeDemoItem
  } = useGame();
  const [activeTab, setActiveTab] = useState<CollectionTab>("my-collection");
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialStepIndex, setTutorialStepIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tutorialStep = COLLECTION_TUTORIAL_STEPS[tutorialStepIndex];
  const displayTab = useMemo<CollectionTab>(() => {
    if (!tutorialActive || !tutorialStep) return activeTab;

    if (["collection-market-tab", "collection-listing"].includes(tutorialStep.id)) {
      return "market";
    }
    if (["collection-auction-tab", "collection-auction"].includes(tutorialStep.id)) {
      return "auctions";
    }
    return "my-collection";
  }, [tutorialActive, tutorialStep, activeTab]);

  const tabs: { key: CollectionTab; label: string; mobileLabel: string; tutorialId?: string }[] = [
    { key: "my-collection", label: "My Collection", mobileLabel: "Collection" },
    {
      key: "market",
      label: "Market",
      mobileLabel: "Market",
      tutorialId: "collection-market-tab"
    },
    {
      key: "auctions",
      label: "Auctions",
      mobileLabel: "Auctions",
      tutorialId: "collection-auction-tab"
    }
  ];

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
        bossEnergy={bossEnergy}
        maxBossEnergy={maxBossEnergy}
        shards={shards}
      />
      <main className="min-h-screen bg-bg px-3 sm:px-4 md:px-6 pt-32 md:pt-28 pb-28 sm:pb-28 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-1 sm:mb-2">
              <span className="text-neon-cyan">Collection</span>
            </h1>
            <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto">
              Manage your collectibles, buy from the market, or bid on auctions.
            </p>
          </div>

          <SegmentedTabs
            tabs={tabs}
            activeKey={displayTab}
            onChange={(key) => setActiveTab(key as CollectionTab)}
            containerTutorialId="collection-tabs"
            layoutId="collection-tabs-indicator"
            className="justify-center"
          />

          {/* Tab content */}
          {displayTab === "my-collection" && <InventoryGrid />}
          {displayTab === "market" && <ListingGrid />}
          {displayTab === "auctions" && <AuctionGrid />}
        </div>
      </main>
      <PageTutorial
        pageKey="collection"
        steps={COLLECTION_TUTORIAL_STEPS}
        isActive={tutorialActive}
        onComplete={() => {
          setTutorialActive(false);
          setHasSeenCollectionTutorial(true);
          removeDemoItem();
          setTutorialStepIndex(0);
        }}
        onStepChange={setTutorialStepIndex}
      />
      {!tutorialActive && (
        <TutorialHelpButton onClick={() => {
          seedDemoItem();
          setTutorialActive(true);
        }} />
      )}
    </>
  );
}
