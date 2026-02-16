import { useState } from "react";
import { motion } from "motion/react";
import { useGame } from "../../context/GameContext";
import { TransactionRow } from "./TransactionRow";
import type { CreditType } from "../../types/wallet";
import { FILTERS } from "../../data/wallet";

export function TransactionList() {
  const { creditTransactions } = useGame();
  const [filter, setFilter] = useState<CreditType | "all">("all");

  const filtered =
    filter === "all"
      ? creditTransactions
      : creditTransactions.filter((tx) => tx.type === filter);

  // Show most recent first
  const sorted = [...filtered].reverse();

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

      {sorted.length === 0 ? (
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
              <circle cx="12" cy="12" r="10" />
              <path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5s-2 .5-2 1.5 1 1.5 2 2 2 1 2 2-1 1.5-2 1.5-2-.5-2.5-1.5M12 7v1m0 8v1" />
            </svg>
          </div>
          <p className="text-text-muted text-sm font-bold mb-1">
            No transactions
          </p>
          <p className="text-text-dim text-xs">
            Your credit history will appear here.
          </p>
        </motion.div>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          {sorted.map((tx, i) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              isLast={i === sorted.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
