import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useGame } from "../../context/GameContext";
import { PrestigeOverlay } from "../profile/PrestigeOverlay";
import { ArenaStatusDeck } from "./ArenaStatusDeck";

export function ResourceBar() {
  const {
    bossEnergy,
    maxBossEnergy,
    shards,
    freeSpins,
    prestigeLevel,
    canPrestige,
    prestige,
    convertShardsToFreeSpin,
    levelInfo,
  } = useGame();
  const [showRankUpOverlay, setShowRankUpOverlay] = useState(false);
  const [overlayRankLevel, setOverlayRankLevel] = useState(prestigeLevel);

  return (
    <>
      <ArenaStatusDeck
        bossEnergy={bossEnergy}
        maxBossEnergy={maxBossEnergy}
        shards={shards}
        freeSpins={freeSpins}
        prestigeLevel={prestigeLevel}
        levelInfo={levelInfo}
        canRankUp={canPrestige}
        onRankUp={() => {
          const nextRankLevel = Math.min(prestigeLevel + 1, 3);
          setOverlayRankLevel(nextRankLevel);
          prestige();
          setShowRankUpOverlay(true);
        }}
        onConvertShardsToFreeSpin={convertShardsToFreeSpin}
        className="mb-6 sm:mb-8"
        tutorialId="arena-resources"
        rankupTutorialId="arena-rankup"
      />

      <AnimatePresence>
        {showRankUpOverlay && (
          <PrestigeOverlay
            prestigeLevel={overlayRankLevel}
            onClose={() => setShowRankUpOverlay(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
