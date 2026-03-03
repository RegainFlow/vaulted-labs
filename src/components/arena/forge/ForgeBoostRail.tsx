export function ForgeBoostRail({
  allSelected,
  boostSpins,
  maxBoosts,
  freeSpins,
  onDecrease,
  onIncrease,
}: {
  allSelected: boolean;
  boostSpins: number;
  maxBoosts: number;
  freeSpins: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
          Boost Spins
        </div>
        <div className="mt-1 text-xs text-white/60 sm:text-sm">
          {allSelected
            ? maxBoosts > 0
              ? "Reduce common odds and lift stronger outcomes."
              : "No free spins available for forge boosts."
            : "Link all three inputs before biasing the crucible."}
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        <div className="rounded-[14px] border border-white/10 bg-black/20 px-2.5 py-2 text-center">
          <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/45">
            Available
          </div>
          <div className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-vault-gold sm:text-sm">
            {freeSpins}
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-[14px] border border-white/10 bg-black/25 px-2 py-2">
          <button
            type="button"
            onClick={onDecrease}
            disabled={!allSelected || boostSpins <= 0}
            className="command-segment flex h-7 w-7 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.04] text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            -
          </button>
          <div className="min-w-10 text-center text-sm font-mono font-bold text-neon-green">
            {boostSpins}/{maxBoosts}
          </div>
          <button
            type="button"
            onClick={onIncrease}
            disabled={!allSelected || boostSpins >= maxBoosts}
            className="command-segment flex h-7 w-7 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.04] text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
