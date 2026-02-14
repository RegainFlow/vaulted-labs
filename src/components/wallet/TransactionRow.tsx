import type { CreditTransaction } from "../../types/game";

interface TransactionRowProps {
  transaction: CreditTransaction;
  isLast: boolean;
}

const TYPE_CONFIG: Record<string, { icon: string; color: string; bgColor: string }> = {
  earned: { icon: "+", color: "text-neon-cyan", bgColor: "bg-neon-cyan/10" },
  spent: { icon: "-", color: "text-accent", bgColor: "bg-accent/10" },
  incentive: { icon: "+", color: "text-vault-gold", bgColor: "bg-vault-gold/10" },
};

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

export function TransactionRow({ transaction, isLast }: TransactionRowProps) {
  const config = TYPE_CONFIG[transaction.type] || TYPE_CONFIG.earned;
  const isPositive = transaction.amount > 0;

  return (
    <div className={`flex items-center gap-3 px-3 sm:px-4 py-3 bg-surface-elevated/30 ${!isLast ? "border-b border-white/5" : ""}`}>
      {/* Type icon */}
      <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center shrink-0`}>
        <span className={`text-sm font-black ${config.color}`}>{config.icon}</span>
      </div>

      {/* Description */}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-bold text-white truncate">{transaction.description}</p>
        <p className="text-[10px] text-text-dim">{formatTimestamp(transaction.timestamp)}</p>
      </div>

      {/* Amount */}
      <span className={`text-sm sm:text-base font-mono font-black shrink-0 ${isPositive ? "text-neon-cyan" : "text-accent"}`}>
        {isPositive ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
      </span>
    </div>
  );
}
