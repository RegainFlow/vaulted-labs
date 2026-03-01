import { useState } from "react";
import { motion } from "motion/react";
import { useGame } from "../../context/GameContext";
import { TransactionRow } from "./TransactionRow";
import type { CreditType } from "../../types/wallet";
import { FILTERS } from "../../data/wallet";
import { SegmentedTabs } from "../shared/SegmentedTabs";

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
      <SegmentedTabs
        tabs={FILTERS.map((f) => ({ key: f.value, label: f.label, mobileLabel: f.label }))}
        activeKey={filter}
        onChange={(key) => setFilter(key as CreditType | "all")}
        containerTutorialId="wallet-filters"
        layoutId="wallet-filter-indicator"
        mode="scroll"
        className="max-w-full"
      />

      {sorted.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="system-shell text-center py-16"
        >
          <div className="system-readout mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
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
        <div className="system-ledger" data-tutorial="wallet-transactions">
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
