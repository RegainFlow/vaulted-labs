import { useMemo } from "react";
import type { Collectible } from "../../../types/collectible";
import type { Battle } from "../../../types/gamification";
import type { BattlePresentationProfile } from "../../../data/battle-presentation";
import type { BattleFeedEntry, BattleTimelineFrame } from "../../../lib/battle-presentation";
import { CombatArena } from "./BattleImpactLane";
import { CombatFeed } from "./BattleFeed";
import { AbilityBar } from "./AbilityBar";
import { HealthBar } from "./HealthBar";
import { resolveCollectibleImagePath } from "../../../lib/collectible-display";

interface BattleScreenProps {
  battle: Battle;
  squadItems: Collectible[];
  profile: BattlePresentationProfile;
  frames: BattleTimelineFrame[];
  currentFrame: BattleTimelineFrame | null;
  currentSquadHp: number;
  currentBossHp: number;
  maxSquadHp?: number;
  maxBossHp: number;
  phase: "intro" | "combat" | "result";
}

export function BattleScreen({
  battle,
  squadItems,
  profile,
  frames,
  currentFrame,
  currentSquadHp,
  currentBossHp,
  maxSquadHp = 120,
  maxBossHp,
  phase,
}: BattleScreenProps) {
  const feedEntries = useMemo<BattleFeedEntry[]>(
    () => {
      if (!currentFrame) return [];
      return frames
        .filter((frame) => frame.round <= currentFrame.round)
        .flatMap((frame) => {
          const entries = [frame.playerFeed, frame.bossFeed];
          if (frame.systemFeed) entries.push(frame.systemFeed);
          return entries;
        });
    },
    [frames, currentFrame]
  );

  return (
    <div
      className="system-shell-strong relative overflow-hidden px-2.5 py-2.5 sm:px-4 sm:py-4 lg:h-[calc(100dvh-2rem)] lg:max-h-[820px]"
      style={{
        boxShadow:
          "0 34px 80px rgba(0,0,0,0.48), 0 0 42px rgba(255,43,214,0.12), 0 0 52px rgba(0,234,255,0.08)",
      }}
    >
      <div className="absolute inset-0 opacity-90" style={{ background: profile.ambientGradient }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,transparent_24%,transparent_78%,rgba(255,255,255,0.02)_100%)]" />
      <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.6) 0px, transparent 2px, transparent 8px)" }} />

      <div className="relative z-10 flex min-h-0 flex-col gap-2.5 lg:h-full lg:grid lg:grid-rows-[auto_minmax(0,1fr)_auto] lg:gap-3">
        <div
          className="rounded-[20px] border border-white/10 px-3 py-2.5 sm:px-4 sm:py-3"
          style={{ background: profile.hudGradient }}
        >
          <div className="grid gap-2.5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <HealthBar
              label="Player HP"
              current={currentSquadHp}
              max={maxSquadHp}
              tone="cyan"
              kicker="Squad live"
            />
            <div className="text-center">
              <div className="text-[9px] font-black uppercase tracking-[0.24em] text-white/42">
                Battle State
              </div>
              <div className="mt-1 text-lg font-black uppercase tracking-[0.08em] text-white sm:text-2xl">
                {currentFrame ? `Round ${currentFrame.round}` : "YOU VS BOSS"}
              </div>
            </div>
            <HealthBar
              label="Boss HP"
              current={currentBossHp}
              max={maxBossHp}
              tone="magenta"
              align="right"
              kicker={phase === "result" ? "Resolution" : currentFrame?.bossStatus ?? profile.threatLabel}
            />
          </div>
        </div>

        <div className="min-h-0 lg:min-h-0">
          <CombatArena
            battle={battle}
            squadItems={squadItems}
            profile={profile}
            currentFrame={currentFrame}
            currentSquadHp={currentSquadHp}
            maxSquadHp={maxSquadHp}
          />
        </div>

        <div className="grid shrink-0 gap-2.5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
          <div className="rounded-[18px] border border-white/10 bg-black/18 px-3 py-2.5 backdrop-blur-md">
            <div className="text-[8px] font-black uppercase tracking-[0.22em] text-white/40">
              Squad
            </div>
            <div className="mt-2 flex items-center gap-2">
              {squadItems.map((item, index) => {
                const active = (currentFrame?.activeSquadIndex ?? 0) === index;
                const imagePath = resolveCollectibleImagePath(item);
                return (
                  <div
                    key={item.id}
                    className={`relative h-10 w-10 overflow-hidden rounded-full border sm:h-11 sm:w-11 ${
                      active
                        ? "border-cyan-300/45 bg-cyan-400/12"
                        : "border-white/10 bg-black/22 opacity-70"
                    }`}
                    style={{
                      boxShadow: active ? "0 0 16px rgba(0,234,255,0.16)" : undefined,
                    }}
                    title={item.funkoName || item.product}
                  >
                    {imagePath ? (
                      <div className="absolute inset-1 overflow-hidden rounded-full">
                        <img
                          src={imagePath}
                          alt={item.funkoName || item.product}
                          className="h-full w-full object-contain object-top"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-1 flex items-center justify-center rounded-full bg-black/28 text-[10px] font-black uppercase tracking-[0.16em] text-white/60">
                        {index + 1}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <CombatFeed entries={feedEntries} />

          <AbilityBar
            profile={profile}
            activePlayerAbilityId={currentFrame?.playerAbility.id ?? profile.playerAbilities[0]?.id ?? "strike"}
            activeBossAbility={currentFrame?.bossAbility ?? profile.bossAbilities[0]}
            currentRound={currentFrame?.round ?? 0}
          />
        </div>
      </div>
    </div>
  );
}
