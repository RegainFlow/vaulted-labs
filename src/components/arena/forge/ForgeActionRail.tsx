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
    <div className="system-rail grid gap-5 rounded-[24px] px-4 py-4 sm:px-5 sm:py-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
      {boostRail}
      <div className="flex min-w-[18rem] flex-col gap-4 sm:flex-row sm:items-end sm:justify-between xl:min-w-[20rem] xl:gap-5">
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
            Chamber State
          </div>
          <div className="mt-1.5 text-sm font-black uppercase tracking-[0.12em] text-white sm:text-base">
            {forging ? "Forging" : allSelected ? "Ready" : "Select 3 Items"}
          </div>
          <div className="mt-1 text-[11px] text-white/50">
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
          className="min-w-[15rem] sm:min-w-[16rem]"
        >
          Forge
        </ArcadeButton>
      </div>
    </div>
  );
}
