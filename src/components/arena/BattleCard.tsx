import { motion } from "motion/react";
import type { Battle, LevelInfo } from "../../types/gamification";
import { BossIcon } from "../../assets/boss-icons";
import { ArcadeButton } from "../shared/ArcadeButton";
import { getBattlePresentationProfile } from "../../lib/battle-presentation";

interface BattleCardProps {
  battle: Battle;
  playerLevel: number;
  isDefeated: boolean;
  energyCost: number;
  currentEnergy: number;
  onFight: (battle: Battle) => void;
  levelInfo?: LevelInfo;
}

export function BattleCard({
  battle,
  playerLevel,
  isDefeated,
  energyCost,
  currentEnergy,
  onFight,
  levelInfo: _levelInfo,
}: BattleCardProps) {
  const isLocked = playerLevel < battle.requiredLevel;
  const hasEnergy = currentEnergy >= energyCost;
  const canFight = !isLocked && hasEnergy;
  const profile = getBattlePresentationProfile(battle.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className={`module-card group relative overflow-hidden px-5 py-5 transition-all duration-300 sm:px-6 sm:py-6 ${
        isLocked
          ? "opacity-55 grayscale"
          : "hover:-translate-y-1 hover:border-accent/30"
      }`}
      style={{
        boxShadow: isLocked
          ? undefined
          : "0 22px 46px rgba(0,0,0,0.3), 0 0 30px rgba(255,43,214,0.08)",
      }}
    >
      <div className="absolute inset-0 opacity-80" style={{ background: profile.ambientGradient }} />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,43,214,0.72)_48%,rgba(0,234,255,0.72)_100%)]" />

      {isDefeated ? (
        <div className="absolute right-4 top-4 z-10 rounded-full border border-neon-green/30 bg-neon-green/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-neon-green">
          Cleared
        </div>
      ) : null}

      <div className="relative z-10 space-y-5">
        <div className="flex items-start gap-4">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] border border-white/10 bg-black/30">
            <div className="absolute inset-2 rounded-[18px] border border-white/8" />
            <div className="absolute inset-0 rounded-[24px]" style={{ background: profile.hudGradient, opacity: 0.55 }} />
            <BossIcon bossId={battle.id} size={56} color={profile.accentPrimary} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/42">
              {profile.threatLabel}
            </div>
            <h3 className="mt-2 text-xl font-black uppercase tracking-[0.05em] text-white">
              {battle.name}
            </h3>
            <p className="mt-2 max-w-md text-sm text-white/62">
              {battle.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-[18px] border border-white/10 bg-black/20 px-3 py-3 text-center">
            <div className="text-[8px] font-black uppercase tracking-[0.22em] text-white/45">HP</div>
            <div className="mt-1 text-base font-mono font-bold text-white">{battle.hp}</div>
          </div>
          <div className="rounded-[18px] border border-white/10 bg-black/20 px-3 py-3 text-center">
            <div className="text-[8px] font-black uppercase tracking-[0.22em] text-white/45">ATK</div>
            <div className="mt-1 text-base font-mono font-bold text-[#ff5d8f]">{battle.atk}</div>
          </div>
          <div className="rounded-[18px] border border-white/10 bg-black/20 px-3 py-3 text-center">
            <div className="text-[8px] font-black uppercase tracking-[0.22em] text-white/45">DEF</div>
            <div className="mt-1 text-base font-mono font-bold text-[#8cecff]">{battle.def}</div>
          </div>
        </div>

        <div className="rounded-[20px] border border-white/10 bg-black/20 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
              Reward Profile
            </div>
            <div className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white/55">
              {battle.energyCost} Energy
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-violet-200">
              {battle.shardReward.min}-{battle.shardReward.max} Shards
            </span>
            <span className="rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-accent">
              +{battle.xpReward} XP
            </span>
            {battle.mechanics ? (
              <span className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/62">
                {battle.mechanics}
              </span>
            ) : null}
          </div>
        </div>

        {isLocked ? (
          <div className="rounded-[18px] border border-white/10 bg-black/20 px-4 py-4 text-center">
            <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
              Unlock Condition
            </div>
            <div className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-white">
              Reach Level {battle.requiredLevel}
            </div>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/48">
              {hasEnergy
                ? isDefeated
                  ? "Boss archived. Re-enter for another run."
                  : "Squad ready. Enter combat when prepared."
                : "Energy depleted. Recharge before entering combat."}
            </div>
            <div className="md:min-w-[220px]">
              <ArcadeButton
                onClick={() => canFight && onFight(battle)}
                disabled={!canFight}
                tone="accent"
                size="compact"
                fillMode="center"
                fullWidth
              >
                {!hasEnergy ? "No Energy" : isDefeated ? "Fight Again" : "Fight"}
              </ArcadeButton>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
