import type { BattleAbilityPresentation, BattlePresentationProfile } from "../../../data/battle-presentation";

function AbilityIcon({ icon, tone }: { icon: BattleAbilityPresentation["icon"]; tone: BattleAbilityPresentation["tone"] }) {
  const stroke =
    tone === "cyan"
      ? "#00eaff"
      : tone === "magenta"
        ? "#ff2bd6"
        : tone === "gold"
          ? "#ffd700"
          : tone === "green"
            ? "#39ff14"
            : "rgba(255,255,255,0.82)";

  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 1.8 };

  if (icon === "shield") {
    return (
      <svg {...common}>
        <path d="M12 3l7 3v5c0 5.2-3.3 8.9-7 10-3.7-1.1-7-4.8-7-10V6l7-3z" />
      </svg>
    );
  }
  if (icon === "burst") {
    return (
      <svg {...common}>
        <path d="M12 3l1.6 5.1L19 10l-4.1 3 1.6 5-4.5-3.1L7.5 18l1.6-5L5 10l5.4-1.9L12 3z" />
      </svg>
    );
  }
  if (icon === "pulse") {
    return (
      <svg {...common}>
        <path d="M3 12h4l2-5 4 10 2-5h6" />
      </svg>
    );
  }
  if (icon === "fracture") {
    return (
      <svg {...common}>
        <path d="M14 3L7 13h4l-1 8 7-10h-4l1-8z" />
      </svg>
    );
  }
  if (icon === "coil") {
    return (
      <svg {...common}>
        <path d="M6 18c0-6 12-2 12-8a3 3 0 00-3-3c-2 0-3 1-3 3s1 3 3 3h2" />
      </svg>
    );
  }
  if (icon === "core") {
    return (
      <svg {...common}>
        <path d="M12 4l5 3v6l-5 3-5-3V7l5-3z" />
        <path d="M12 9.5l2.5 1.5v3L12 15.5 9.5 14v-3L12 9.5z" opacity="0.7" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M4 19L19 4" />
      <path d="M9 19L20 8" opacity="0.55" />
    </svg>
  );
}

interface AbilityBarProps {
  profile: BattlePresentationProfile;
  activePlayerAbilityId: string;
  activeBossAbility: BattleAbilityPresentation;
  currentRound: number;
}

export function AbilityBar({
  profile,
  activePlayerAbilityId,
  activeBossAbility,
  currentRound,
}: AbilityBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-white/10 bg-black/18 px-3 py-3 backdrop-blur-md">
      <div className="flex items-center gap-2">
        {profile.playerAbilities.map((ability, index) => {
          const active = ability.id === activePlayerAbilityId;
          return (
            <div
              key={ability.id}
              aria-label={ability.label}
              title={ability.label}
              className={`relative flex h-11 w-11 items-center justify-center rounded-full border ${
                active
                  ? "border-accent/40 bg-accent/12"
                  : "border-white/10 bg-black/20"
              }`}
              style={{
                boxShadow: active ? "0 0 16px rgba(255,43,214,0.14)" : undefined,
              }}
            >
              <AbilityIcon icon={ability.icon} tone={ability.tone} />
              <div
                className="absolute bottom-1 left-1/2 h-1 -translate-x-1/2 rounded-full bg-white/12"
                style={{
                  width: `${active ? 24 : Math.max(10, ((currentRound + index) % 3) * 8)}px`,
                  background: active
                    ? "linear-gradient(90deg, rgba(255,43,214,0.9) 0%, rgba(0,234,255,0.72) 100%)"
                    : "rgba(255,255,255,0.14)",
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2.5 rounded-full border border-accent/18 bg-accent/8 px-3 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/22 bg-black/22">
          <AbilityIcon icon={activeBossAbility.icon} tone={activeBossAbility.tone} />
        </div>
        <div className="min-w-0">
          <div className="text-[8px] font-black uppercase tracking-[0.22em] text-white/38">
            Threat
          </div>
          <div className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-white">
            {activeBossAbility.label}
          </div>
        </div>
      </div>
    </div>
  );
}
