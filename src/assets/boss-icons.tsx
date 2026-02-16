/** SVG icon components for each boss — neon-styled glyphs */

interface BossIconProps {
  size?: number;
  color?: string;
}

/** Vault Keeper — shield/lock */
export function VaultKeeperIcon({ size = 48, color = "#00f0ff" }: BossIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M24 4L6 14v12c0 11 8 18 18 20 10-2 18-9 18-20V14L24 4z"
        stroke={color}
        strokeWidth="2"
        fill={`${color}10`}
        style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
      />
      <rect x="18" y="22" width="12" height="10" rx="2" stroke={color} strokeWidth="2" />
      <path d="M21 22v-4a3 3 0 016 0v4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="27" r="1.5" fill={color} />
    </svg>
  );
}

/** Chrono Shard — hourglass/crystal */
export function ChronoShardIcon({ size = 48, color = "#9945ff" }: BossIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M16 6h16v8l-6 10 6 10v8H16v-8l6-10-6-10V6z"
        stroke={color}
        strokeWidth="2"
        fill={`${color}10`}
        style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
      />
      <path d="M18 8h12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M18 40h12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path
        d="M20 32l4-8 4 8"
        stroke={color}
        strokeWidth="1.5"
        fill={`${color}30`}
      />
      <circle cx="24" cy="24" r="2" fill={color} opacity="0.6" />
    </svg>
  );
}

/** Neon Hydra — triple-headed serpent */
export function NeonHydraIcon({ size = 48, color = "#39ff14" }: BossIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M24 40V28"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
      />
      <path
        d="M24 28c-4-2-8-6-10-12a4 4 0 017-3l3 5"
        stroke={color}
        strokeWidth="2"
        fill="none"
        style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
      />
      <path
        d="M24 28c0-4 0-10 0-16a4 4 0 018 0l-4 6"
        stroke={color}
        strokeWidth="2"
        fill="none"
        style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
      />
      <path
        d="M24 28c4-2 8-6 10-12a4 4 0 00-7-3l-3 5"
        stroke={color}
        strokeWidth="2"
        fill="none"
        style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
      />
      <circle cx="14" cy="14" r="2" fill={color} />
      <circle cx="24" cy="10" r="2" fill={color} />
      <circle cx="34" cy="14" r="2" fill={color} />
    </svg>
  );
}

/** Diamond Golem — geometric diamond figure */
export function DiamondGolemIcon({ size = 48, color = "#b9f2ff" }: BossIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <polygon
        points="24,4 38,18 24,44 10,18"
        stroke={color}
        strokeWidth="2"
        fill={`${color}10`}
        style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
      />
      <line x1="10" y1="18" x2="38" y2="18" stroke={color} strokeWidth="1.5" />
      <line x1="24" y1="4" x2="17" y2="18" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="24" y1="4" x2="31" y2="18" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="17" y1="18" x2="24" y2="44" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="31" y1="18" x2="24" y2="44" stroke={color} strokeWidth="1" opacity="0.5" />
      <circle cx="24" cy="22" r="3" stroke={color} strokeWidth="1.5" fill={`${color}20`} />
    </svg>
  );
}

const BOSS_ICON_MAP: Record<string, React.FC<BossIconProps>> = {
  "boss-1": VaultKeeperIcon,
  "boss-2": ChronoShardIcon,
  "boss-3": NeonHydraIcon,
  "boss-4": DiamondGolemIcon
};

export function BossIcon({ bossId, ...props }: BossIconProps & { bossId: string }) {
  const Icon = BOSS_ICON_MAP[bossId] ?? VaultKeeperIcon;
  return <Icon {...props} />;
}
