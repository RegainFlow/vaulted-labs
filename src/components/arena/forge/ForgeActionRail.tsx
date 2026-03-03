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
    <div className="system-rail grid gap-4 rounded-[24px] px-4 py-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
      {boostRail}
      <div className="flex min-w-[18rem] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:gap-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
            Chamber State
          </div>
          <div className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-white sm:text-sm">
            {forging ? "Forging" : allSelected ? "Ready" : "Select 3 Items"}
          </div>
        </div>
        <ArcadeButton
          onClick={onForge}
          disabled={!allSelected || forging}
          loading={forging}
          loadingLabel="Forging"
          tone="accent"
          size="primary"
          className="min-w-[15rem]"
        >
          Forge
        </ArcadeButton>
      </div>
    </div>
  );
}
