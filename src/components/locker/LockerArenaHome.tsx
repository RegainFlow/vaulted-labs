import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArenaStatusDeck } from "../arena/ArenaStatusDeck";
import { ArcadeButton } from "../shared/ArcadeButton";
import {
  getUnlockXP,
  isFeatureUnlocked,
  type UnlockFeatureKey,
} from "../../lib/unlocks";
import type { LevelInfo } from "../../types/gamification";

type ArenaCardKey = "battles" | "forge" | "quests";

interface LockerArenaHomeProps {
  xp: number;
  levelInfo: LevelInfo;
  bossEnergy: number;
  maxBossEnergy: number;
  shards: number;
  freeSpins: number;
  prestigeLevel: number;
  canRankUp: boolean;
  onRankUp: () => void;
  onConvertShardsToFreeSpin: () => void;
  onSelect: (featureKey: ArenaCardKey) => void;
}

const ARENA_CARDS: {
  key: ArenaCardKey;
  title: string;
  description: string;
  toneClass: string;
  icon: ReactNode;
}[] = [
  {
    key: "battles",
    title: "Battles",
    description: "Fight bosses, burn energy, and earn progression rewards.",
    toneClass: "text-accent",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 4h8l1 4-5 4-5-4 1-4Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M12 12v8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: "forge",
    title: "Forge",
    description: "Combine collectibles into stronger outcomes.",
    toneClass: "text-vault-gold",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M14 4a4 4 0 1 0 0 8h2l4 4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 21l6-6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: "quests",
    title: "Quests",
    description: "Track milestones and claim long-term progression XP.",
    toneClass: "text-neon-green",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function LockerArenaHome({
  xp,
  levelInfo,
  bossEnergy,
  maxBossEnergy,
  shards,
  freeSpins,
  prestigeLevel,
  canRankUp,
  onRankUp,
  onConvertShardsToFreeSpin,
  onSelect,
}: LockerArenaHomeProps) {
  return (
    <div className="space-y-6 sm:space-y-7">
      <ArenaStatusDeck
        bossEnergy={bossEnergy}
        maxBossEnergy={maxBossEnergy}
        shards={shards}
        freeSpins={freeSpins}
        prestigeLevel={prestigeLevel}
        levelInfo={levelInfo}
        canRankUp={canRankUp}
        onRankUp={onRankUp}
        onConvertShardsToFreeSpin={onConvertShardsToFreeSpin}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {ARENA_CARDS.map((card, index) => {
          const featureKey = card.key as UnlockFeatureKey;
          const unlocked = isFeatureUnlocked(featureKey, xp);

          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className={`module-card group relative flex min-h-[248px] flex-col overflow-hidden p-5 text-left transition-all duration-300 ${
                unlocked
                  ? "hover:-translate-y-1 hover:border-white/18"
                  : "opacity-85"
              }`}
            >
              <div
                className={`pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-90 ${card.toneClass}`}
              />
              <div className="mb-5 flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/10 bg-black/20 ${card.toneClass}`}
                >
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-[0.08em] text-white">
                    {card.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-text-muted">
                {card.description}
              </p>

              <div className="mt-auto space-y-2 pt-6">
                <ArcadeButton
                  onClick={unlocked ? () => onSelect(card.key) : undefined}
                  disabled={!unlocked}
                  tone={unlocked ? "accent" : "neutral"}
                  size="compact"
                  fillMode="center"
                  fullWidth
                >
                  {unlocked
                    ? "Enter"
                    : `Locked Until Lv ${getUnlockXP(featureKey)}`}
                </ArcadeButton>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
