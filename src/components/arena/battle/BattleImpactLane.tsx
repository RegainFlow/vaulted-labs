import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Collectible } from "../../../types/collectible";
import type { Battle } from "../../../types/gamification";
import type { BattlePresentationProfile } from "../../../data/battle-presentation";
import type { BattleTimelineFrame } from "../../../lib/battle-presentation";
import { resolveCollectibleImagePath } from "../../../lib/collectible-display";
import { CharacterAvatar } from "./CharacterCard";
import { BossDisplay } from "./BossCard";

interface CombatArenaProps {
  battle: Battle;
  squadItems: Collectible[];
  profile: BattlePresentationProfile;
  currentFrame: BattleTimelineFrame | null;
  currentSquadHp: number;
  maxSquadHp: number;
}

function buildSquadHpDistribution(count: number, totalSquadHp: number, maxSquadHp: number) {
  const safeCount = Math.max(1, count);
  const maxPerMember = Math.round(maxSquadHp / safeCount);
  const ratio = Math.max(0, Math.min(1, totalSquadHp / Math.max(1, maxSquadHp)));
  return Array.from({ length: safeCount }).map(() => ({
    current: Math.max(0, Math.round(maxPerMember * ratio)),
    max: maxPerMember,
  }));
}

export function CombatArena({
  battle,
  squadItems,
  profile,
  currentFrame,
  currentSquadHp,
  maxSquadHp,
}: CombatArenaProps) {
  const prefersReducedMotion = useReducedMotion();
  const activeIndex = currentFrame?.activeSquadIndex ?? 0;
  const activeItem = squadItems[activeIndex] ?? squadItems[0] ?? null;
  const hpDistribution = buildSquadHpDistribution(squadItems.length, currentSquadHp, maxSquadHp);
  const playerDamage = currentFrame?.exchange.bossDamage ?? 0;
  const bossDamage = currentFrame?.exchange.squadDamage ?? 0;

  return (
    <div className="rounded-[26px] border border-white/10 bg-black/18 px-3 py-3 sm:px-4 sm:py-4 backdrop-blur-md">
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(170px,0.9fr)_minmax(180px,1fr)_minmax(220px,1.1fr)] lg:items-center">
        <div className="order-3 flex flex-col items-center gap-3 lg:order-1">
          {activeItem ? (
            <CharacterAvatar
              item={activeItem}
              imagePath={resolveCollectibleImagePath(activeItem)}
              hpCurrent={hpDistribution[activeIndex]?.current ?? hpDistribution[0]?.current ?? currentSquadHp}
              hpMax={hpDistribution[activeIndex]?.max ?? hpDistribution[0]?.max ?? maxSquadHp}
              active
            />
          ) : null}
        </div>

        <div className="order-2 lg:order-2">
          <div className="relative flex min-h-[118px] items-center justify-center overflow-hidden rounded-[20px] border border-white/10 bg-black/22 sm:min-h-[220px] sm:rounded-[24px]">
            <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.18)_20%,rgba(255,255,255,0.18)_80%,transparent_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,43,214,0.08)_0%,transparent_46%)]" />

            <AnimatePresence mode="wait">
              {currentFrame ? (
                <motion.div
                  key={currentFrame.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex h-full w-full items-center justify-center"
                >
                  <motion.div
                    animate={
                      prefersReducedMotion
                        ? {}
                        : currentFrame.crit
                          ? { scale: [1, 1.08, 1] }
                          : { opacity: [0.76, 1, 0.82] }
                    }
                    transition={{ duration: 0.35 }}
                    className={`rounded-full border px-4 py-2 text-sm font-black uppercase tracking-[0.2em] ${
                      currentFrame.crit
                        ? "border-vault-gold/35 bg-vault-gold/10 text-vault-gold"
                        : "border-white/10 bg-black/24 text-white/72"
                    }`}
                  >
                    {currentFrame.crit ? "Critical" : `${currentFrame.playerAbility.label} Clash`}
                  </motion.div>

                  <div className="absolute left-[10%] top-1/2 -translate-y-1/2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200 shadow-[0_0_16px_rgba(0,234,255,0.12)]">
                    -{playerDamage}
                  </div>
                  <div className="absolute right-[10%] top-1/2 -translate-y-1/2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-accent shadow-[0_0_16px_rgba(255,43,214,0.12)]">
                    -{bossDamage}
                  </div>
                </motion.div>
              ) : (
                <div className="text-center">
                  <div className="text-[10px] font-black uppercase tracking-[0.28em] text-white/40">
                    Combat Link
                  </div>
                  <div className="mt-3 text-lg font-black uppercase tracking-[0.14em] text-white">
                    Stand By
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="order-1 lg:order-3">
          <BossDisplay
            battle={battle}
            profile={profile}
            statusLabel={currentFrame?.bossStatus ?? profile.threatLabel}
          />
        </div>
      </div>
    </div>
  );
}
