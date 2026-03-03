import type { Collectible } from "../../../types/collectible";
import { ForgeCrucible } from "./ForgeCrucible";
import { ForgeInputSlot } from "./ForgeInputSlot";

export function ForgeChamber({
  items,
  onSelectSlot,
  onRemoveItem,
  phase,
  reducedMotion,
}: {
  items: (Collectible | null)[];
  onSelectSlot: (index: number) => void;
  onRemoveItem: (index: number) => void;
  phase: "dissolve" | "crucible" | "materialize" | null;
  reducedMotion: boolean;
}) {
  const selectedCount = items.filter(Boolean).length;

  return (
    <div className="system-shell relative overflow-hidden px-3 py-3.5 sm:px-5 sm:py-5 lg:px-6">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,transparent_22%,transparent_100%)] opacity-60" />
      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
            Link Inputs
          </div>
          <div className="hidden text-[10px] font-black uppercase tracking-[0.24em] text-white/42 sm:block">
            Chamber Biases Toward The Core
          </div>
        </div>

        <div className="grid gap-3 lg:gap-3">
          <div className="mx-auto w-full max-w-[22rem]">
            <ForgeCrucible
              phase={phase}
              selectedCount={selectedCount}
              reducedMotion={reducedMotion}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {items.map((item, index) => (
              <ForgeInputSlot
                key={item?.id ?? `slot-${index}`}
                index={index}
                item={item}
                onSelect={() => onSelectSlot(index)}
                onRemove={() => onRemoveItem(index)}
                compact={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
