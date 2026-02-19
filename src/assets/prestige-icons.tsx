const PRESTIGE_CONFIGS = [
  { color: "#ff8c00", glow: "rgba(255,140,0,0.5)" },
  { color: "#9945ff", glow: "rgba(153,69,255,0.5)" },
  { color: "#ff2d95", glow: "rgba(255,45,149,0.5)" },
] as const;

export function PrestigeShieldIcon({
  level,
  size = 40,
}: {
  level: 1 | 2 | 3;
  size?: number;
}) {
  const cfg = PRESTIGE_CONFIGS[level - 1];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={cfg.color}
      strokeWidth="1.5"
      className={`drop-shadow-[0_0_8px_${cfg.glow}]`}
      style={{ filter: `drop-shadow(0 0 8px ${cfg.glow})` }}
    >
      {/* Shield body */}
      <path d="M12 2L4 6v5c0 5.25 3.4 10.15 8 11.25 4.6-1.1 8-6 8-11.25V6l-8-4z" />
      {/* Inner chevron */}
      <path
        d="M12 7l-4 3v3c0 2.75 1.7 5.3 4 6 2.3-.7 4-3.25 4-6v-3l-4-3z"
        fill={cfg.color}
        opacity="0.15"
      />
      {/* Star center */}
      <path
        d="M12 10l1.5 2.5H16l-2 2 .7 2.5L12 15.5 9.3 17l.7-2.5-2-2h2.5L12 10z"
        fill={cfg.color}
        opacity="0.9"
      />
      {/* Level numerals */}
      {level >= 2 && (
        <circle cx="8" cy="8" r="1" fill={cfg.color} opacity="0.6" />
      )}
      {level >= 3 && (
        <circle cx="16" cy="8" r="1" fill={cfg.color} opacity="0.6" />
      )}
    </svg>
  );
}
