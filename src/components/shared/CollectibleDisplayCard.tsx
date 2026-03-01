import type { ReactNode } from "react";
import { RARITY_CONFIG } from "../../data/vaults";
import type { ItemStats } from "../../types/collectible";
import type { Rarity } from "../../types/vault";
import { FunkoImage } from "./FunkoImage";

type MetricTone = "default" | "accent" | "gold" | "success" | "muted";
type ActionTone = "accent" | "gold" | "success" | "danger" | "muted";

export interface CollectibleDisplayMetric {
  label: string;
  value: ReactNode;
  tone?: MetricTone;
}

export interface CollectibleDisplayAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: ActionTone;
  tutorialId?: string;
}

interface CollectibleDisplayCardProps {
  name: string;
  rarity: Rarity;
  imagePath?: string;
  stats?: ItemStats;
  metrics?: CollectibleDisplayMetric[];
  subtitle?: ReactNode;
  detail?: ReactNode;
  actions?: CollectibleDisplayAction[];
  actionsSlot?: ReactNode;
  topLeftBadge?: ReactNode;
  topRightBadge?: ReactNode;
  tutorialId?: string;
  accentColor?: string;
  density?: "full" | "compact";
  dimmed?: boolean;
  className?: string;
}

const METRIC_TONE_STYLES: Record<MetricTone, string> = {
  default: "text-white",
  accent: "text-accent",
  gold: "text-vault-gold",
  success: "text-neon-green",
  muted: "text-text-muted",
};

const ACTION_TONE_STYLES: Record<ActionTone, string> = {
  accent: "text-accent",
  gold: "text-vault-gold",
  success: "text-neon-green",
  danger: "text-error",
  muted: "text-text-dim",
};

function getActionColumns(count: number) {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  return "grid-cols-3";
}

function getMetricColumns(count: number) {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-2";
  return "grid-cols-3";
}

function StatCell({
  label,
  value,
  toneClass,
}: {
  label: string;
  value: number;
  toneClass: string;
}) {
  return (
    <div className="rounded-[16px] border border-white/10 bg-black/20 px-3 py-2 text-center">
      <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-dim">
        {label}
      </p>
      <p className={`mt-1 text-sm font-mono font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

export function CollectibleDisplayCard({
  name,
  rarity,
  imagePath,
  stats,
  metrics = [],
  subtitle,
  detail,
  actions = [],
  actionsSlot,
  topLeftBadge,
  topRightBadge,
  tutorialId,
  accentColor,
  density = "full",
  dimmed = false,
  className = "",
}: CollectibleDisplayCardProps) {
  const rarityConfig = RARITY_CONFIG[rarity];
  const shellColor = accentColor ?? rarityConfig.color;
  const compact = density === "compact";
  const rootClasses = compact ? "min-h-[340px]" : "min-h-[510px]";
  const heroClasses = compact ? "h-[188px] p-3" : "h-[294px] p-4";
  const bodyClasses = compact ? "px-4 pb-4 pt-3" : "px-5 pb-5 pt-4";

  return (
    <div
      className={`module-card relative flex h-full flex-col overflow-hidden transition-all duration-300 ${
        dimmed ? "opacity-60 grayscale" : "hover:-translate-y-1"
      } ${rootClasses} ${className}`}
      style={{
        borderColor: `${shellColor}30`,
        boxShadow: dimmed
          ? undefined
          : `0 24px 44px rgba(0,0,0,0.18), 0 0 28px ${shellColor}14`,
      }}
      {...(tutorialId ? { "data-tutorial": tutorialId } : {})}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${shellColor}cc 50%, transparent 100%)`,
        }}
      />

      <div className="pointer-events-none absolute left-4 top-4 z-10">
        {topLeftBadge ?? (
          <span
            className="rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]"
            style={{
              color: rarityConfig.color,
              borderColor: `${rarityConfig.color}44`,
              backgroundColor: `${rarityConfig.color}12`,
            }}
          >
            {rarity}
          </span>
        )}
      </div>

      {topRightBadge && (
        <div className="pointer-events-none absolute right-4 top-4 z-10">
          {topRightBadge}
        </div>
      )}

      <div className={`relative overflow-hidden border-b border-white/8 ${heroClasses}`}>
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 16%, ${shellColor}24 0%, rgba(8,12,20,0.98) 62%)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,transparent_24%,transparent_100%)] opacity-70" />
        <div className="absolute inset-x-8 bottom-0 h-16 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.02)_32%,rgba(0,0,0,0.34)_100%)]" />
        <div className="relative z-10 h-full w-full rounded-[30px] border border-white/10 bg-black/20 p-2">
          <FunkoImage
            name={name}
            imagePath={imagePath}
            rarity={rarity}
            size="hero"
            showLabel={false}
            className="!h-full !w-full !rounded-[28px]"
          />
        </div>
      </div>

      <div className={`flex flex-1 flex-col ${bodyClasses}`}>
        <div>
          <h3
            className={`truncate font-black uppercase tracking-[0.08em] text-white ${
              compact ? "text-[13px]" : "text-base sm:text-lg"
            }`}
          >
            {name}
          </h3>
          {subtitle && (
            <div className="mt-1 text-[11px] font-mono uppercase tracking-[0.2em] text-text-dim">
              {subtitle}
            </div>
          )}
        </div>

        {stats && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            <StatCell label="ATK" value={stats.atk} toneClass="text-error" />
            <StatCell label="DEF" value={stats.def} toneClass="text-accent" />
            <StatCell label="AGI" value={stats.agi} toneClass="text-neon-green" />
          </div>
        )}

        {metrics.length > 0 && (
          <div className={`mt-3 grid ${getMetricColumns(metrics.length)} gap-2`}>
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[16px] border border-white/10 bg-black/20 px-3 py-2.5"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-dim">
                  {metric.label}
                </p>
                <p
                  className={`mt-1 text-sm font-mono font-bold ${
                    METRIC_TONE_STYLES[metric.tone ?? "default"]
                  }`}
                >
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {detail && <div className="mt-3">{detail}</div>}

        {(actions.length > 0 || actionsSlot) && (
          <div className="mt-auto pt-4">
            {actionsSlot ?? (
              <div
                className={`system-rail grid ${getActionColumns(actions.length)} gap-2 p-2`}
              >
                {actions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={action.onClick}
                    disabled={action.disabled}
                    {...(action.tutorialId
                      ? { "data-tutorial": action.tutorialId }
                      : {})}
                    className={`command-segment min-h-[42px] px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] ${
                      action.disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"
                    } ${ACTION_TONE_STYLES[action.tone ?? "accent"]}`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
