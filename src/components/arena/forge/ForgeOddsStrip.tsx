import type { Rarity } from "../../../types/vault";

const RARITY_TONES: Record<Rarity, string> = {
  common: "#a8b0c0",
  uncommon: "#00eaff",
  rare: "#b96fff",
  legendary: "#ffd84a",
};

export function ForgeOddsStrip({
  odds,
}: {
  odds: Record<Rarity, number> | null;
}) {
  if (!odds) {
    return (
      <div className="system-rail flex items-center justify-between gap-3 rounded-[18px] px-3 py-3 sm:px-4 sm:py-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
            Forge Odds
          </div>
          <div className="mt-1.5 text-sm text-white/58">
            Link three collectibles to view rarity outcome percentages.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="system-rail rounded-[18px] px-3 py-3 sm:px-4 sm:py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
          Outcome Bias
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/38">
          Recipe-weighted
        </div>
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(Object.keys(odds) as Rarity[]).map((rarity) => (
          <div
            key={rarity}
            className="rounded-[14px] border border-white/10 bg-black/20 px-2.5 py-2.5"
            style={{ boxShadow: `0 0 0 1px ${RARITY_TONES[rarity]}16 inset` }}
          >
            <div
              className="text-[9px] font-black uppercase tracking-[0.22em]"
              style={{ color: RARITY_TONES[rarity] }}
            >
              {rarity}
            </div>
            <div className="mt-1.5 text-base font-black uppercase tracking-[0.08em] text-white">
              {odds[rarity]}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
