import { useState } from "react";
import { motion } from "motion/react";
import { useGame } from "../../context/GameContext";
import { InventoryItemCard } from "./InventoryItemCard";
import { FILTERS } from "../../data/inventory";
import type { ItemStatus } from "../../types/inventory";

export function InventoryGrid() {
  const { inventory, cashoutItem, shipItem } = useGame();
  const [filter, setFilter] = useState<ItemStatus | "all">("all");

  const filtered =
    filter === "all"
      ? inventory
      : inventory.filter((item) => item.status === filter);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
              filter === f.value
                ? "bg-accent/10 border-accent/30 text-accent"
                : "bg-surface border-white/10 text-text-muted hover:text-white hover:border-white/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 rounded-full bg-surface-elevated border border-white/10 flex items-center justify-center mx-auto mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-text-dim"
            >
              <path d="M21 8V21H3V8" />
              <path d="M23 3H1V8H23V3Z" />
              <path d="M10 12H14" />
            </svg>
          </div>
          <p className="text-text-muted text-sm font-bold mb-1">No items yet</p>
          <p className="text-text-dim text-xs">
            Open vaults on the Play page to start collecting.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <InventoryItemCard
              key={item.id}
              item={item}
              onCashout={cashoutItem}
              onShip={shipItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}
