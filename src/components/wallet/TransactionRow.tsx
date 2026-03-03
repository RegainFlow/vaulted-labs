import { TYPE_CONFIG } from "../../data/wallet";
import type { TransactionRowProps } from "../../types/wallet";

function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TransactionRow({
  transaction,
  isLast,
  onOpenReceipt,
}: TransactionRowProps) {
  const config = TYPE_CONFIG[transaction.type] || TYPE_CONFIG.earned;
  const isPositive = transaction.amount > 0;
  const isActivity = transaction.type === "activity";

  return (
    <div
      className={`relative flex items-center gap-3 px-3 sm:px-4 py-3.5 sm:py-4 ${!isLast ? "border-b border-white/6" : ""}`}
    >
      {/* Type icon */}
      <div
        className={`system-readout flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${config.bgColor}`}
      >
        <span className={`text-sm font-black ${config.color}`}>
          {config.icon}
        </span>
      </div>

      {/* Description */}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-bold text-white truncate">
          {transaction.description}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <p className="system-kicker">{formatTimestamp(transaction.timestamp)}</p>
          {transaction.provablyFairReceiptId && onOpenReceipt ? (
            <button
              type="button"
              onClick={() => onOpenReceipt(transaction.provablyFairReceiptId!)}
              className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] ${
                transaction.provablyFairStatus === "revealed"
                  ? "border-neon-green/35 text-neon-green"
                  : "border-accent/35 text-accent"
              }`}
            >
              Proof
            </button>
          ) : null}
        </div>
      </div>

      {/* Amount */}
      <span
        className={`shrink-0 text-sm sm:text-base font-mono font-black ${
          isActivity
            ? "text-text-muted"
            : isPositive
              ? "text-accent"
              : "text-error"
        }`}
      >
        {isActivity
          ? "Recorded"
          : `${isPositive ? "+" : ""}$${Math.abs(transaction.amount).toLocaleString()}`}
      </span>
    </div>
  );
}
