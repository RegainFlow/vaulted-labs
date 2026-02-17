export function BossIcon({
  bossId,
  size = 64,
  color = "#ff2d95"
}: {
  bossId: string;
  size?: number;
  color?: string;
}) {
  switch (bossId) {
    case "boss-1": // The Vault Keeper
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_rgba(255,45,149,0.5)]"
        >
          <path d="M12 2L3 7v6c0 5.5 4.5 10 9 10s9-4.5 9-10V7l-9-5z" />
          <circle cx="12" cy="11" r="3" />
          <path d="M12 14v4M10 16h4" />
          {/* Menacing eyes */}
          <path d="M10 10l1 1m3-1l-1 1" strokeWidth="2" />
        </svg>
      );
    case "boss-2": // Chrono Shard
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          className="drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
        >
          <path d="M12 2l4 4-4 4-4-4 4-4zM12 14l4 4-4 4-4-4 4-4zM2 12l4-4 4 4-4 4-4-4zM14 12l4-4 4 4-4 4-4-4z" />
          <circle cx="12" cy="12" r="2" fill={color} />
          {/* Temporal distortion lines */}
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2" opacity="0.5" />
        </svg>
      );
    case "boss-3": // Neon Hydra
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          className="drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]"
        >
          <path d="M12 22s-4-4-4-10c0-2.5 1.5-4.5 4-5.5m0 15.5s4-4 4-10c0-2.5-1.5-4.5-4-5.5" />
          <path d="M8 10c-2-1-4-3-4-6m12 6c2-1 4-3 4-6" />
          <circle cx="4" cy="4" r="2" />
          <circle cx="12" cy="2" r="2" />
          <circle cx="20" cy="4" r="2" />
        </svg>
      );
    case "boss-4": // Diamond Golem
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="drop-shadow-[0_0_12px_rgba(185,242,255,0.6)]"
        >
          <path d="M7 2l10 0 5 7-10 13L2 9l5-7z" />
          <path d="M7 2l5 7 5-7M2 9h20M12 22l-5-13 5-3 5 3-5 13z" strokeWidth="1" opacity="0.6" />
          {/* Glowing core */}
          <rect x="10" y="10" width="4" height="4" fill={color} opacity="0.8" />
        </svg>
      );
    default:
      return null;
  }
}
