import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../components/shared/Navbar";
import { SegmentedTabs } from "../components/shared/SegmentedTabs";
import { PageTutorial } from "../components/shared/PageTutorial";
import { TutorialHelpButton } from "../components/shared/TutorialHelpButton";
import { InventoryGrid } from "../components/inventory/InventoryGrid";
import { LockerMarketView } from "../components/locker/LockerMarketView";
import { LockerArenaHome } from "../components/locker/LockerArenaHome";
import { LockedOverlay } from "../components/shared/LockedOverlay";
import { useGame } from "../context/GameContext";
import {
  LOCKER_TUTORIAL_STEPS,
  LOCKER_TUTORIAL_STORAGE_KEY,
} from "../data/tutorial";
import { trackEvent, AnalyticsEvents } from "../lib/analytics";
import {
  isTutorialCompleted,
  setTutorialCompleted,
} from "../lib/tutorial-storage";
import { isFeatureUnlocked, type UnlockFeatureKey } from "../lib/unlocks";
import type { TutorialHostCommand } from "../types/tutorial";

type LockerSection = "inventory" | "market" | "arena";

const SECTIONS: LockerSection[] = ["inventory", "market", "arena"];

export function LockerPage() {
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
    hasSeenCollectionTutorial,
    setHasSeenCollectionTutorial
  } = useGame();
  const initialTutorialActive =
    !isTutorialCompleted(LOCKER_TUTORIAL_STORAGE_KEY) &&
    !hasSeenCollectionTutorial &&
    isFeatureUnlocked("market", xp) &&
    isFeatureUnlocked("arena", xp);

  const { section } = useParams();
  const navigate = useNavigate();
  const [manualLockedFeature, setManualLockedFeature] = useState<UnlockFeatureKey | null>(null);
  const [tutorialActive, setTutorialActive] = useState(initialTutorialActive);
  const [tutorialSection, setTutorialSection] = useState<LockerSection | null>(
    initialTutorialActive ? "inventory" : null
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!hasSeenCollectionTutorial) return;
    setTutorialCompleted(LOCKER_TUTORIAL_STORAGE_KEY, true);
  }, [hasSeenCollectionTutorial]);

  const currentSection: LockerSection = useMemo(() => {
    if (!section || !SECTIONS.includes(section as LockerSection)) return "inventory";
    return section as LockerSection;
  }, [section]);

  const canRunLockerTutorial = useMemo(
    () => isFeatureUnlocked("market", xp) && isFeatureUnlocked("arena", xp),
    [xp]
  );

  const displaySection: LockerSection = tutorialSection ?? currentSection;

  const routeLockedFeature: UnlockFeatureKey | null = useMemo(() => {
    if (!isFeatureUnlocked("locker", xp)) return "locker";
    if (displaySection === "market" && !isFeatureUnlocked("market", xp)) return "market";
    if (displaySection === "arena" && !isFeatureUnlocked("arena", xp)) return "arena";
    return null;
  }, [displaySection, xp]);

  const activeLockedFeature = manualLockedFeature ?? routeLockedFeature;

  const tabs: { key: LockerSection; label: string; mobileLabel: string; tutorialId: string }[] = [
    { key: "inventory", label: "Inventory", mobileLabel: "Inventory", tutorialId: "locker-tab-inventory" },
    { key: "market", label: "Market", mobileLabel: "Market", tutorialId: "locker-tab-market" },
    { key: "arena", label: "Arena", mobileLabel: "Arena", tutorialId: "locker-tab-arena" }
  ];

  const handleSectionChange = (key: LockerSection) => {
    if (tutorialActive) return;

    const featureKey: UnlockFeatureKey =
      key === "inventory" ? "locker" : key === "market" ? "market" : "arena";

    if (!isFeatureUnlocked(featureKey, xp)) {
      trackEvent(AnalyticsEvents.FEATURE_LOCKED_CLICKED, { featureKey });
      setManualLockedFeature(featureKey);
      return;
    }

    trackEvent(AnalyticsEvents.TAB_SWITCH, { tab: key, location: "locker" });
    navigate(`/locker/${key}`);
  };

  const handleArenaSelect = (featureKey: "battles" | "forge" | "quests") => {
    if (!isFeatureUnlocked(featureKey, xp)) {
      trackEvent(AnalyticsEvents.FEATURE_LOCKED_CLICKED, { featureKey });
      setManualLockedFeature(featureKey);
      return;
    }
    navigate(`/arena/${featureKey}`);
  };

  const handleTutorialCommand = (command: TutorialHostCommand) => {
    if (command.type !== "locker:set-section") {
      return;
    }

    setTutorialSection(command.section);
  };

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
        tutorialActive={tutorialActive}
      />
      <main className="min-h-screen bg-bg px-3 sm:px-4 md:px-6 pt-36 md:pt-28 pb-28 sm:pb-28 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-1 sm:mb-2">
              <span className="text-neon-cyan">Locker</span>
            </h1>
            <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto">
              Manage inventory, browse market, and launch arena systems.
            </p>
          </div>

          <SegmentedTabs
            tabs={tabs}
            activeKey={displaySection}
            onChange={(key) => handleSectionChange(key as LockerSection)}
            containerTutorialId="locker-tabs"
            layoutId="locker-tabs-indicator"
            className="justify-center"
          />

          {!routeLockedFeature && displaySection === "inventory" && (
            <div data-tutorial="locker-inventory">
              <InventoryGrid />
            </div>
          )}
          {!routeLockedFeature && displaySection === "market" && (
            <div data-tutorial="locker-market">
              <LockerMarketView />
            </div>
          )}
          {!routeLockedFeature && displaySection === "arena" && (
            <div data-tutorial="locker-arena">
              <LockerArenaHome xp={xp} onSelect={handleArenaSelect} />
            </div>
          )}
        </div>
      </main>

      <LockedOverlay
        isOpen={activeLockedFeature != null}
        featureKey={activeLockedFeature ?? "locker"}
        xp={xp}
        {...(manualLockedFeature
          ? { onClose: () => setManualLockedFeature(null) }
          : {})}
      />

      <PageTutorial
        pageKey="locker"
        steps={LOCKER_TUTORIAL_STEPS}
        isActive={tutorialActive}
        onCommand={handleTutorialCommand}
        onComplete={() => {
          setTutorialActive(false);
          setTutorialSection(null);
          setTutorialCompleted(LOCKER_TUTORIAL_STORAGE_KEY, true);
          setHasSeenCollectionTutorial(true);
        }}
      />
      {!tutorialActive && canRunLockerTutorial && (
        <TutorialHelpButton
          onClick={() => {
            setTutorialActive(true);
            setTutorialSection("inventory");
          }}
        />
      )}
    </>
  );
}
