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

const RESOURCE_PILLS = [
  {
    label: "Energy",
    description: "Spent to start battles. Regenerates 1 every 10 minutes (max 5).",
    color: "text-neon-green",
    borderColor: "border-neon-green/20",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-neon-green shrink-0">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
      </svg>
    )
  },
  {
    label: "Level",
    description: "Your progression rank. Earn XP to level up and unlock arena features.",
    color: "text-accent",
    borderColor: "border-accent/20",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-accent shrink-0">
        <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8 2.4-7.2-6-4.8h7.6z" fill="currentColor" />
      </svg>
    )
  },
  {
    label: "Shards",
    description: "Dropped from boss battles. Collect 7 to convert into a Free Spin.",
    color: "text-rarity-rare",
    borderColor: "border-rarity-rare/20",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-rarity-rare shrink-0">
        <path d="M12 2L4 12l8 10 8-10L12 2z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    label: "Free Spins",
    description: "Open vaults for free. Earned from Vault Lock jackpots or shard conversion.",
    color: "text-vault-gold",
    borderColor: "border-vault-gold/20",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-vault-gold shrink-0">
        <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8 2.4-7.2-6-4.8h7.6z" fill="currentColor" />
      </svg>
    )
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

      {/* Resource info pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {RESOURCE_PILLS.map((pill) => (
          <div
            key={pill.label}
            className={`bg-surface/40 border ${pill.borderColor} rounded-lg p-2.5`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              {pill.icon}
              <span className={`text-[10px] font-black uppercase tracking-wider ${pill.color}`}>
                {pill.label}
              </span>
            </div>
            <p className="text-[9px] text-text-dim leading-relaxed">
              {pill.description}
            </p>
          </div>
        ))}
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
