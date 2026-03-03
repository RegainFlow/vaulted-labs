import { useState, type ReactNode } from "react";
import { SHARD_CONFIG } from "../../data/gamification";
import { getPrestigeShiftBreakdown } from "../../data/vaults";
import type { LevelInfo } from "../../types/gamification";
import { ArcadeButton } from "../shared/ArcadeButton";

interface ArenaStatusDeckProps {
  bossEnergy: number;
  maxBossEnergy: number;
  shards: number;
  freeSpins: number;
  prestigeLevel: number;
  levelInfo: LevelInfo;
  canRankUp?: boolean;
  onRankUp?: () => void;
  onConvertShardsToFreeSpin?: () => void;
  className?: string;
  tutorialId?: string;
  rankupTutorialId?: string;
  variant?: "default" | "compact";
}

function EnergyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polygon
        points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <polygon
        points="12,6 18,9.5 18,14.5 12,18 6,14.5 6,9.5"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.55"
      />
    </svg>
  );
}

function LevelIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function FreeSpinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RankUpIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2 4 6v5c0 5.25 3.4 10.15 8 11.25 4.6-1.1 8-6 8-11.25V6l-8-4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 7v7m0 0-3-3m3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatusCard({
  label,
  toneClass,
  accentGlow,
  icon,
  children,
  tutorialId,
  className = "",
}: {
  label: string;
  toneClass: string;
  accentGlow: string;
  icon: ReactNode;
  children: ReactNode;
  tutorialId?: string;
  className?: string;
}) {
  return (
    <div
      className={`module-card relative overflow-hidden rounded-[22px] p-4 sm:p-5 ${className}`.trim()}
      {...(tutorialId ? { "data-tutorial": tutorialId } : {})}
    >
      <div
        className={`pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-90 ${toneClass}`}
        style={{ filter: accentGlow }}
      />
      <div className="mb-3 flex items-center gap-2">
        <span className={toneClass}>{icon}</span>
        <span className={`text-[10px] font-black uppercase tracking-[0.24em] ${toneClass}`}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

export function ArenaStatusDeck({
  bossEnergy,
  maxBossEnergy,
  shards,
  freeSpins,
  prestigeLevel,
  levelInfo,
  canRankUp = false,
  onRankUp,
  onConvertShardsToFreeSpin,
  className = "",
  tutorialId,
  rankupTutorialId,
  variant = "default",
}: ArenaStatusDeckProps) {
  const [showMobilePrestigeDetails, setShowMobilePrestigeDetails] = useState(false);
  const xpIntoLevel = Math.max(0, levelInfo.currentXP - levelInfo.xpForCurrentLevel);
  const xpNeeded = Math.max(1, levelInfo.xpForNextLevel - levelInfo.xpForCurrentLevel);
  const xpRemaining = Math.max(0, levelInfo.xpForNextLevel - levelInfo.currentXP);
  const canConvert = shards >= SHARD_CONFIG.freeSpinConversionCost;
  const isMaxRank = prestigeLevel >= 3;
  const activeRank = Math.min(prestigeLevel, 3);
  const previewRank = Math.min(prestigeLevel + 1, 3);
  const currentShift = getPrestigeShiftBreakdown(activeRank);
  const previewShift = getPrestigeShiftBreakdown(previewRank);
  const rankShift = activeRank > 0 ? currentShift : previewShift;
  const rankButtonLabel = isMaxRank ? "Max Prestige" : canRankUp ? "Prestige" : "Reach Lv 10";
  const rankSummary = isMaxRank
    ? "Max bonus active"
    : canRankUp
      ? "Lv 10 reached"
      : "Reach Lv 10";
  const rankOddsLabel = activeRank > 0 ? "Vault Odds Bonus" : "Next Prestige Bonus";

  if (variant === "compact") {
    return (
      <div
        className={`system-rail grid gap-2 rounded-[24px] px-3 py-3 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto] ${className}`.trim()}
        {...(tutorialId ? { "data-tutorial": tutorialId } : {})}
      >
        <div className="rounded-[18px] border border-white/10 bg-black/18 px-3 py-2.5">
          <div className="text-[9px] font-black uppercase tracking-[0.22em] text-neon-green">Energy</div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <div className="flex flex-1 gap-1.5">
              {Array.from({ length: maxBossEnergy }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full ${
                    index < bossEnergy ? "bg-neon-green shadow-[0_0_10px_rgba(105,231,160,0.32)]" : "bg-white/8"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-mono font-bold text-white">
              {bossEnergy}/{maxBossEnergy}
            </span>
          </div>
        </div>

        <div className="rounded-[18px] border border-white/10 bg-black/18 px-3 py-2.5">
          <div className="text-[9px] font-black uppercase tracking-[0.22em] text-rarity-rare">Shards</div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className="text-lg font-mono font-black text-rarity-rare">{shards}</span>
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim">
              {canConvert ? "Ready to convert" : "7 -> Spin"}
            </span>
          </div>
        </div>

        <div className="rounded-[18px] border border-white/10 bg-black/18 px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] font-black uppercase tracking-[0.22em] text-accent">Level</span>
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim">
              {xpRemaining} to next
            </span>
          </div>
          <div className="mt-1.5 text-lg font-mono font-black text-accent">Lv {levelInfo.level}</div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="level-progress-fill h-full rounded-full"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>

        <div className="rounded-[18px] border border-white/10 bg-black/18 px-3 py-2.5">
          <div className="text-[9px] font-black uppercase tracking-[0.22em] text-vault-gold">Free Spins</div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className="text-lg font-mono font-black text-vault-gold">{freeSpins}</span>
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim">
              Vault reward
            </span>
          </div>
        </div>

        <div
          className="rounded-[18px] border border-accent/16 bg-accent/[0.05] px-3 py-2.5"
          {...(rankupTutorialId ? { "data-tutorial": rankupTutorialId } : {})}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[9px] font-black uppercase tracking-[0.22em] text-accent">Prestige</div>
              <div className="mt-1 text-base font-mono font-black text-accent">{activeRank}</div>
              <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim">
                {rankSummary}
              </div>
            </div>
            <ArcadeButton
              onClick={canRankUp && !isMaxRank ? onRankUp : undefined}
              disabled={!canRankUp || isMaxRank}
              tone={!canRankUp || isMaxRank ? "neutral" : "accent"}
              size="compact"
              fillMode="center"
              className="min-w-[11rem]"
            >
              {rankButtonLabel}
            </ArcadeButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`space-y-3 ${className}`.trim()}
      {...(tutorialId ? { "data-tutorial": tutorialId } : {})}
    >
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatusCard
          label="Energy"
          toneClass="text-neon-green"
          accentGlow="drop-shadow(0 0 10px rgba(105,231,160,0.32))"
          icon={<EnergyIcon />}
        >
          <div className="space-y-3">
            <div className="flex gap-1.5">
              {Array.from({ length: maxBossEnergy }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${
                    index < bossEnergy
                      ? "bg-neon-green shadow-[0_0_12px_rgba(105,231,160,0.36)]"
                      : "bg-white/8"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-end justify-between gap-2">
              <span className="text-2xl font-mono font-black text-white">
                {bossEnergy}
                <span className="text-sm text-text-dim">/{maxBossEnergy}</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-dim">
                +1 every 10m
              </span>
            </div>
          </div>
        </StatusCard>

        <StatusCard
          label="Shards"
          toneClass="text-rarity-rare"
          accentGlow="drop-shadow(0 0 10px rgba(168,85,247,0.26))"
          icon={<ShardIcon />}
        >
          <div className="space-y-3">
            <div className="flex items-end justify-between gap-2">
              <span className="text-2xl font-mono font-black text-rarity-rare">
                {shards}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim">
                7 -&gt; Free Spin
              </span>
            </div>
            <div className="min-h-[30px]">
              {canConvert && onConvertShardsToFreeSpin ? (
                <button
                  type="button"
                  onClick={onConvertShardsToFreeSpin}
                  className="system-rail inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-rarity-rare transition-colors hover:border-rarity-rare/35 hover:text-white"
                >
                  Convert
                  <span className="text-text-dim">
                    {SHARD_CONFIG.freeSpinConversionCost}
                  </span>
                </button>
              ) : (
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim">
                  Vault battle drops
                </span>
              )}
            </div>
          </div>
        </StatusCard>

        <StatusCard
          label="Level"
          toneClass="text-accent"
          accentGlow="drop-shadow(0 0 10px rgba(255,45,149,0.3))"
          icon={<LevelIcon />}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-mono font-black text-accent">
                  Lv {levelInfo.level}
                </span>
                {prestigeLevel > 0 ? (
                  <span className="flex gap-0.5">
                    {Array.from({ length: prestigeLevel }).map((_, index) => (
                      <span key={index} className="text-vault-gold text-xs">
                        &#9733;
                      </span>
                    ))}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim">
                {xpRemaining} to next
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="level-progress-fill h-full rounded-full"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-text-dim">
              <span>
                {xpIntoLevel}/{xpNeeded} XP
              </span>
              <span>Lv {levelInfo.level + 1}</span>
            </div>
          </div>
        </StatusCard>

        <StatusCard
          label="Free Spins"
          toneClass="text-vault-gold"
          accentGlow="drop-shadow(0 0 10px rgba(255,215,0,0.26))"
          icon={<FreeSpinIcon />}
        >
          <div className="space-y-3">
            <div className="flex items-end justify-between gap-2">
              <span className="text-2xl font-mono font-black text-vault-gold">
                {freeSpins}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim">
                vault reward
              </span>
            </div>
            <div className="rounded-[16px] border border-white/8 bg-black/15 px-3 py-2">
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim">
                Use them in Vaults without credits
              </p>
            </div>
          </div>
        </StatusCard>
      </div>

      <StatusCard
        label="Prestige"
        toneClass="text-accent"
        accentGlow="drop-shadow(0 0 10px rgba(255,45,149,0.3))"
        icon={<RankUpIcon />}
        tutorialId={rankupTutorialId}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-mono font-black text-accent">
                  Prestige {activeRank}
                </span>
                {activeRank > 0 ? (
                  <span className="flex gap-0.5">
                    {Array.from({ length: activeRank }).map((_, index) => (
                      <span key={index} className="text-vault-gold text-xs">
                        &#9733;
                      </span>
                    ))}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim">
                {rankSummary}
              </p>
              <p className="mt-2 text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim sm:hidden">
                Vault odds bonus
              </p>
            </div>
            <div className="hidden flex-wrap items-center gap-2 sm:justify-end sm:flex">
              <span className="rounded-full border border-accent/20 bg-accent/8 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-accent">
                All Vaults
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim">
                Lower Common. Raise stronger pulls.
              </span>
            </div>
          </div>

          <div className="sm:hidden">
            <button
              type="button"
              onClick={() => setShowMobilePrestigeDetails((current) => !current)}
              className="system-rail inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-accent"
            >
              {showMobilePrestigeDetails ? "Hide bonus details" : "View bonus details"}
            </button>
          </div>

          <div
            className={`rounded-[18px] border border-white/8 bg-black/15 px-4 py-4 ${
              showMobilePrestigeDetails ? "block" : "hidden"
            } sm:block`}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white">
                {rankOddsLabel}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-text-dim">
                Prestige {activeRank > 0 ? activeRank : previewRank}
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[14px] border border-white/6 bg-white/[0.02] px-3 py-2">
                <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-text-dim">
                  Common
                </p>
                <p className="mt-1 text-sm font-black text-error">
                  {rankShift.common}%
                </p>
              </div>
              <div className="rounded-[14px] border border-white/6 bg-white/[0.02] px-3 py-2">
                <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-text-dim">
                  Uncommon
                </p>
                <p className="mt-1 text-sm font-black text-rarity-uncommon">
                  +{rankShift.uncommon}%
                </p>
              </div>
              <div className="rounded-[14px] border border-white/6 bg-white/[0.02] px-3 py-2">
                <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-text-dim">
                  Rare
                </p>
                <p className="mt-1 text-sm font-black text-rarity-rare">
                  +{rankShift.rare}%
                </p>
              </div>
              <div className="rounded-[14px] border border-white/6 bg-white/[0.02] px-3 py-2">
                <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-text-dim">
                  Legendary
                </p>
                <p className="mt-1 text-sm font-black text-vault-gold">
                  +{rankShift.legendary}%
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/6 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="hidden text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim sm:block">
              Prestige applies across every vault tier and stacks up to Prestige 3.
            </p>
            <ArcadeButton
              onClick={canRankUp && !isMaxRank ? onRankUp : undefined}
              disabled={!canRankUp || isMaxRank}
              tone={!canRankUp || isMaxRank ? "neutral" : "accent"}
              size="compact"
              fillMode="center"
              className="w-full sm:w-auto sm:min-w-[240px]"
            >
              {rankButtonLabel}
            </ArcadeButton>
          </div>
        </div>
      </StatusCard>
    </div>
  );
}
