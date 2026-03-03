import { FunkoImage } from "../../shared/FunkoImage";
import { resolveCollectibleImagePath } from "../../../lib/collectible-display";
import type { Collectible } from "../../../types/collectible";

export function ForgeInputSlot({
  index,
  item,
  onSelect,
  onRemove,
  compact = false,
}: {
  index: number;
  item: Collectible | null;
  onSelect: () => void;
  onRemove: () => void;
  compact?: boolean;
}) {
  if (!item) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={`module-card group flex w-full flex-col items-center justify-center gap-3 border border-dashed border-white/14 bg-white/[0.03] text-center transition-all duration-300 hover:border-accent/35 hover:bg-accent/6 ${
          compact ? "min-h-[156px] p-3.5" : "min-h-[172px] p-4"
        }`}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-[16px] border border-white/10 bg-black/20 text-white/55 transition-colors group-hover:border-accent/25 group-hover:text-accent">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div className="text-[13px] font-black uppercase tracking-[0.16em] text-white">
            Select Item
          </div>
          <div className="mt-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-white/42">
            Input {index + 1}
          </div>
        </div>
      </button>
    );
  }

  const imagePath = resolveCollectibleImagePath(item);

  return (
    <div className={`module-card flex w-full flex-col overflow-hidden ${compact ? "min-h-[156px] p-3" : "min-h-[172px] p-3.5"}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full border border-white/12 bg-black/30 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white/60">
          {item.rarity}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full border border-error/30 bg-error/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-error transition-colors hover:bg-error/20"
        >
          Remove
        </button>
      </div>

      <div className="mt-2.5 rounded-[20px] border border-white/10 bg-black/20 p-2">
        <div className={compact ? "h-[68px]" : "h-[78px]"}>
          <FunkoImage
            name={item.funkoName || item.product}
            rarity={item.rarity}
            imagePath={imagePath}
            size="hero"
            showLabel={false}
            className="!h-full !w-full !rounded-[20px]"
          />
        </div>
      </div>

      <div className="mt-2.5 truncate text-[13px] font-black uppercase tracking-[0.08em] text-white">
        {item.funkoName || item.product}
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        <div className="rounded-[12px] border border-white/10 bg-black/20 px-2 py-1.5 text-center">
          <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/45">ATK</div>
          <div className="mt-1 text-xs font-mono font-bold text-error">{item.stats.atk}</div>
        </div>
        <div className="rounded-[12px] border border-white/10 bg-black/20 px-2 py-1.5 text-center">
          <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/45">DEF</div>
          <div className="mt-1 text-xs font-mono font-bold text-accent">{item.stats.def}</div>
        </div>
        <div className="rounded-[12px] border border-white/10 bg-black/20 px-2 py-1.5 text-center">
          <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/45">AGI</div>
          <div className="mt-1 text-xs font-mono font-bold text-neon-green">{item.stats.agi}</div>
        </div>
      </div>
    </div>
  );
}
