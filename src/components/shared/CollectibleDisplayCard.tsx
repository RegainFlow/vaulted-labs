import type { ReactNode } from "react";
import { RARITY_CONFIG } from "../../data/vaults";
import type { ItemStats } from "../../types/collectible";
import type { Rarity } from "../../types/vault";
import { FunkoImage } from "./FunkoImage";

type MetricTone = "default" | "accent" | "gold" | "success" | "muted";
type ActionTone = "accent" | "gold" | "success" | "danger" | "muted";
type CardVariant = "feature" | "selection" | "vault-preview";
type StatsMode = "full" | "minimal" | "hidden";
type MetricsMode = "cards" | "inline";

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
  color?: string;
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
  showRarityBadge?: boolean;
  variant?: CardVariant;
  statsMode?: StatsMode;
  metricsMode?: MetricsMode;
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

function getVariantClasses(variant: CardVariant) {
  if (variant === "selection") {
    return {
      root: "min-h-[470px]",
      hero: "min-h-[260px] p-4 pt-16",
      frame: "rounded-[28px] p-2.5",
      body: "px-5 pb-5 pt-4",
      title: "text-lg",
    };
  }

  if (variant === "vault-preview") {
    return {
      root: "min-h-[380px]",
      hero: "min-h-[228px] p-3 pt-5",
      frame: "rounded-[24px] p-2",
      body: "px-4 pb-4 pt-3",
      title: "text-[14px]",
    };
  }

  return {
    root: "min-h-[560px]",
    hero: "min-h-[320px] p-5 pt-16",
    frame: "rounded-[32px] p-3",
    body: "px-6 pb-6 pt-5",
    title: "text-lg sm:text-[1.35rem]",
  };
}

function getActionSurface(action: CollectibleDisplayAction) {
  if (action.color) {
    return {
      style: {
        color: action.color,
        borderColor: `${action.color}3d`,
        backgroundColor: `${action.color}12`,
        boxShadow: `0 0 20px ${action.color}12`,
      },
    };
  }

  const tone = action.tone ?? "accent";
  const className =
    tone === "gold"
      ? "border-vault-gold/30 bg-vault-gold/10"
      : tone === "success"
        ? "border-neon-green/30 bg-neon-green/10"
        : tone === "danger"
          ? "border-error/30 bg-error/10"
          : tone === "muted"
            ? "border-white/10 bg-white/[0.04]"
            : "border-accent/30 bg-accent/10";

  return { className };
}

function StatCell({
  label,
  value,
  toneClass,
  minimal = false,
}: {
  label: string;
  value: number;
  toneClass: string;
  minimal?: boolean;
}) {
  if (minimal) {
    return (
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-2.5 py-1">
        <span className="text-[9px] font-black uppercase tracking-[0.18em] text-text-dim">
          {label}
        </span>
        <span className={`text-[11px] font-mono font-bold ${toneClass}`}>{value}</span>
      </div>
    );
  }

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
  showRarityBadge = true,
  variant = "feature",
  statsMode = "full",
  metricsMode = "cards",
  dimmed = false,
  className = "",
}: CollectibleDisplayCardProps) {
  const rarityConfig = RARITY_CONFIG[rarity];
  const shellColor = rarityConfig.color;
  const variantClasses = getVariantClasses(variant);
  const showStats = Boolean(stats) && statsMode !== "hidden";
  const cardMetrics = metricsMode === "cards";
  const inlineMetrics = metricsMode === "inline";

  return (
    <div
      className={`module-card relative flex h-full flex-col overflow-hidden transition-all duration-300 ${
        dimmed ? "opacity-60 grayscale" : "hover:-translate-y-1"
      } ${variantClasses.root} ${className}`}
      style={{
        borderColor: `${shellColor}30`,
        boxShadow: dimmed
          ? undefined
          : `0 26px 54px rgba(0,0,0,0.28), 0 0 36px ${shellColor}14`,
      }}
      {...(tutorialId ? { "data-tutorial": tutorialId } : {})}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${shellColor}cc 50%, transparent 100%)`,
        }}
      />

      {(showRarityBadge || topLeftBadge) && (
        <div className="pointer-events-none absolute left-5 top-5 z-30">
          {topLeftBadge ?? (
            <span
              className="rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-sm"
              style={{
                color: rarityConfig.color,
                borderColor: `${rarityConfig.color}4d`,
                backgroundColor: "rgba(10,16,24,0.82)",
                boxShadow: `0 0 16px ${rarityConfig.color}16`,
              }}
            >
              {rarity}
            </span>
          )}
        </div>
      )}

      {topRightBadge && (
        <div className="pointer-events-none absolute right-5 top-5 z-30">
          {topRightBadge}
        </div>
      )}

      <div
        className={`relative overflow-hidden border-b border-white/8 ${variantClasses.hero}`}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 14%, ${shellColor}24 0%, rgba(8,12,20,0.98) 64%)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,transparent_24%,transparent_100%)] opacity-70" />
        <div className="absolute inset-x-8 bottom-0 h-20 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.02)_28%,rgba(0,0,0,0.44)_100%)]" />
        <div className={`relative z-10 h-full w-full border border-white/10 bg-black/20 ${variantClasses.frame}`}>
          <FunkoImage
            name={name}
            imagePath={imagePath}
            rarity={rarity}
            size="hero"
            showLabel={false}
            className="!h-full !w-full !rounded-[inherit]"
          />
        </div>
      </div>

      <div className={`flex flex-1 flex-col ${variantClasses.body}`}>
        <div>
          <h3
            className={`truncate font-black uppercase tracking-[0.08em] text-white ${variantClasses.title}`}
          >
            {name}
          </h3>
          {subtitle && (
            <div className="mt-1 text-[11px] font-mono uppercase tracking-[0.2em] text-text-dim">
              {subtitle}
            </div>
          )}
        </div>

        {showStats && (
          <div
            className={
              statsMode === "minimal"
                ? "mt-3 flex flex-wrap gap-2"
                : "mt-4 grid grid-cols-3 gap-2.5"
            }
          >
            <StatCell
              label="ATK"
              value={stats!.atk}
              toneClass="text-error"
              minimal={statsMode === "minimal"}
            />
            <StatCell
              label="DEF"
              value={stats!.def}
              toneClass="text-accent"
              minimal={statsMode === "minimal"}
            />
            <StatCell
              label="AGI"
              value={stats!.agi}
              toneClass="text-neon-green"
              minimal={statsMode === "minimal"}
            />
          </div>
        )}

        {metrics.length > 0 && cardMetrics && (
          <div className={`mt-3 grid ${getMetricColumns(metrics.length)} gap-2.5`}>
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

        {metrics.length > 0 && inlineMetrics && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/8 pt-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em]"
              >
                <span className="text-text-dim">{metric.label}</span>
                <span className={METRIC_TONE_STYLES[metric.tone ?? "default"]}>
                  {metric.value}
                </span>
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
                {actions.map((action) => {
                  const actionSurface = getActionSurface(action);

                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={action.onClick}
                      disabled={action.disabled}
                      {...(action.tutorialId
                        ? { "data-tutorial": action.tutorialId }
                        : {})}
                      className={`command-segment min-h-[44px] rounded-[14px] border px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                        action.disabled
                          ? "cursor-not-allowed opacity-45"
                          : "cursor-pointer hover:-translate-y-0.5"
                      } ${ACTION_TONE_STYLES[action.tone ?? "accent"]} ${actionSurface.className ?? ""}`}
                      style={actionSurface.style}
                    >
                      {action.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
