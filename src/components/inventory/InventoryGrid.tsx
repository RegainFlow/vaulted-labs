import { motion } from "motion/react";
import { useGame } from "../../context/GameContext";
import { InventoryItemCard } from "./InventoryItemCard";

export function InventoryGrid() {
  const { inventory, cashoutItem, shipItem, listItem } = useGame();
  const items = inventory.filter((item) => item.status === "held");

  return (
    <div>
      {items.length === 0 ? (
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
            Open vaults on the Vaults page to start collecting.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, idx) => (
            <InventoryItemCard
              key={item.id}
              item={item}
              onCashout={cashoutItem}
              onShip={shipItem}
              onList={listItem}
              isFirst={idx === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
