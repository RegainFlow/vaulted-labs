import { ArcadeButton } from "../../shared/ArcadeButton";
import type { Rarity } from "../../../types/vault";

export function ForgeHud({
  selectedCount,
  freeSpins,
  odds,
  proofAvailable,
  onOpenProof,
}: {
  selectedCount: number;
  freeSpins: number;
  odds: Record<Rarity, number> | null;
  proofAvailable: boolean;
  onOpenProof: () => void;
}) {
  const bestOutcome = odds
    ? (Object.entries(odds)
        .filter(([rarity]) => rarity !== "common")
        .sort(([, a], [, b]) => b - a)[0] ?? null)
    : null;

  return (
    <div className="system-rail relative overflow-hidden rounded-[22px] px-3 py-3 sm:px-4 sm:py-3.5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(255,43,214,0.18)_0%,transparent_40%),radial-gradient(circle_at_85%_0%,rgba(0,234,255,0.12)_0%,transparent_34%)]" />
      <div className="relative z-10 flex flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
            Arena Foundry
          </div>
          <h3 className="mt-1 text-base font-black uppercase tracking-[0.06em] text-white sm:text-xl">
            Forge Chamber
          </h3>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 xl:min-w-[28rem]">
          <div className="system-readout rounded-[16px] px-3 py-2">
            <div className="text-[9px] font-black uppercase tracking-[0.22em] text-white/40">
              Linked
            </div>
            <div className="mt-1 text-sm font-black uppercase tracking-[0.08em] text-white sm:text-base">
              {selectedCount}/3
            </div>
          </div>
          <div className="system-readout rounded-[16px] px-3 py-2">
            <div className="text-[9px] font-black uppercase tracking-[0.22em] text-white/40">
              Free Spins
            </div>
            <div className="mt-1 text-sm font-black uppercase tracking-[0.08em] text-vault-gold sm:text-base">
              {freeSpins}
            </div>
          </div>
          <div className="system-readout rounded-[16px] px-3 py-2">
            <div className="text-[9px] font-black uppercase tracking-[0.22em] text-white/40">
              Best Pull
            </div>
            <div className="mt-1 text-[11px] font-black uppercase tracking-[0.08em] text-accent sm:text-base">
              {bestOutcome ? `${bestOutcome[0]} ${bestOutcome[1]}%` : "Awaiting recipe"}
            </div>
          </div>
        </div>

        {proofAvailable ? (
          <ArcadeButton
            onClick={onOpenProof}
            tone="neutral"
            size="compact"
            className="min-w-[11rem] xl:self-stretch"
          >
            View Proof
          </ArcadeButton>
        ) : null}
      </div>
    </div>
  );
}
