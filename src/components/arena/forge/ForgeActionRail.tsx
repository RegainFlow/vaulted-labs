import type { ReactNode } from "react";
import { ArcadeButton } from "../../shared/ArcadeButton";

export function ForgeActionRail({
  allSelected,
  forging,
  onForge,
  boostRail,
}: {
  allSelected: boolean;
  forging: boolean;
  onForge: () => void;
  boostRail: ReactNode;
}) {
  return (
    <div className="system-rail grid gap-3 rounded-[22px] px-3 py-3 sm:px-5 sm:py-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
      {boostRail}
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between xl:min-w-[20rem] xl:gap-5">
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
            Chamber State
          </div>
          <div className="mt-1 text-sm font-black uppercase tracking-[0.12em] text-white sm:text-base">
            {forging ? "Forging" : allSelected ? "Ready" : "Select 3 Items"}
          </div>
          <div className="mt-1 text-[10px] text-white/50 sm:text-[11px]">
            {allSelected
              ? "Recipe linked. Resolve the crucible when ready."
              : "Link three collectibles to arm the chamber."}
          </div>
        </div>
        <ArcadeButton
          onClick={onForge}
          disabled={!allSelected || forging}
          loading={forging}
          loadingLabel="Forging"
          tone="accent"
          size="primary"
          className="w-full sm:min-w-[16rem] sm:w-auto"
        >
          Forge
        </ArcadeButton>
      </div>
    </div>
  );
}
