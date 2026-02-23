import { motion } from "motion/react";
import {
  FEATURE_UNLOCK_LABEL,
  getUnlockXP,
  isFeatureUnlocked,
  type UnlockFeatureKey
} from "../../lib/unlocks";

type ArenaCardKey = "battles" | "forge" | "quests";

interface LockerArenaHomeProps {
  xp: number;
  onSelect: (featureKey: ArenaCardKey) => void;
}

const ARENA_CARDS: { key: ArenaCardKey; title: string; description: string }[] = [
  {
    key: "battles",
    title: "Battles",
    description: "Fight bosses, burn energy, and earn progression rewards."
  },
  {
    key: "forge",
    title: "Forge",
    description: "Combine collectibles into stronger outcomes."
  },
  {
    key: "quests",
    title: "Quests",
    description: "Track milestones and claim long-term progression XP."
  }
];

export function LockerArenaHome({ xp, onSelect }: LockerArenaHomeProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="text-center mb-2">
        <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-white">
          Arena Home
        </h2>
        <p className="text-xs sm:text-sm text-text-muted">
          Choose your next arena objective.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {ARENA_CARDS.map((card, index) => {
          const featureKey = card.key as UnlockFeatureKey;
          const unlocked = isFeatureUnlocked(featureKey, xp);

          return (
            <motion.button
              key={card.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => onSelect(card.key)}
              className={`rounded-2xl border p-5 sm:p-6 text-left transition-all ${
                unlocked
                  ? "bg-surface-elevated/60 border-white/12 hover:border-accent/45 hover:-translate-y-0.5 cursor-pointer"
                  : "bg-surface/40 border-white/8 cursor-pointer opacity-80"
              }`}
            >
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wide text-white">
                {card.title}
              </h3>
              <p className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
                {card.description}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-4">
                {unlocked ? (
                  <span className="text-neon-green">Open</span>
                ) : (
                  <span className="text-text-dim">
                    Locked until {getUnlockXP(featureKey)} XP
                  </span>
                )}
              </p>
              {!unlocked && (
                <p className="text-[10px] text-accent mt-1">
                  {FEATURE_UNLOCK_LABEL[featureKey]}
                </p>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
