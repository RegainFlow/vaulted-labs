import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { AnalyticsEvents, trackEvent } from "../../lib/analytics";

function shorten(value: string, start = 10, end = 6) {
  if (value.length <= start + end + 3) return value;
  return `${value.slice(0, start)}...${value.slice(-end)}`;
}

export function WalletHeader() {
  const {
    balance,
    creditTransactions,
    walletId,
    provablyFairCommit,
    provablyFairReceipts,
    rotateProvablyFairSeed,
  } = useGame();

  const incentiveTotal = creditTransactions
    .filter((tx) => tx.type === "incentive")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const earnedTotal = creditTransactions
    .filter((tx) => tx.type === "earned")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const spentTotal = Math.abs(
    creditTransactions
      .filter((tx) => tx.type === "spent")
      .reduce((sum, tx) => sum + tx.amount, 0)
  );

  const breakdownCards = [
    {
      label: "Earned",
      value: earnedTotal,
      color: "text-accent",
      borderColor: "border-accent/20",
      bgColor: "bg-accent/5"
    },
    {
      label: "Incentive",
      value: incentiveTotal,
      color: "text-vault-gold",
      borderColor: "border-vault-gold/20",
      bgColor: "bg-vault-gold/5"
    },
    {
      label: "Spent",
      value: spentTotal,
      color: "text-accent",
      borderColor: "border-accent/20",
      bgColor: "bg-accent/5"
    }
  ];

  const hasRevealedReceipt = provablyFairReceipts.some(
    (receipt) => receipt.revealStatus === "revealed"
  );
  const proofStatus = !provablyFairCommit
    ? "Awaiting session"
    : hasRevealedReceipt
      ? "Ready to Verify"
      : provablyFairReceipts.length > 0
        ? "Pending Reveal"
        : "Committed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 sm:mb-8"
    >
      <div className="system-shell px-4 py-5 sm:px-6 sm:py-6">
        <div className="relative z-10 text-center" data-tutorial="wallet-balance">
          <p className="system-kicker mb-2">Balance Ledger</p>
          <p className="text-4xl sm:text-5xl md:text-6xl font-mono font-black text-vault-gold animate-hud-shimmer">
            $
            {balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>

        <div
          className="relative z-10 mt-5 grid grid-cols-3 gap-2 sm:gap-4"
          data-tutorial="wallet-breakdown"
        >
          {breakdownCards.map((card) => (
            <div
              key={card.label}
              className={`module-card px-2.5 py-3 text-center sm:px-4 sm:py-4 ${card.borderColor} ${card.bgColor}`}
            >
              <p
                className={`text-base sm:text-xl font-mono font-black ${card.color}`}
              >
                $
                {card.value.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}
              </p>
              <p className="system-label mt-2">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="module-card relative z-10 mt-5 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div>
                <p className="system-kicker mb-1">Provably Fair</p>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-white">
                  Wallet Proof ID
                </p>
                <p className="mt-1 font-mono text-xs text-text-muted">
                  {shorten(walletId, 12, 8)}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="system-label">Server Hash</p>
                  <p className="mt-1 font-mono text-[11px] text-white">
                    {provablyFairCommit
                      ? shorten(provablyFairCommit.serverSeedHash, 14, 12)
                      : "Unavailable"}
                  </p>
                </div>
                <div>
                  <p className="system-label">Next Nonce</p>
                  <p className="mt-1 font-mono text-[11px] text-white">
                    {provablyFairCommit?.nextNonce ?? "--"}
                  </p>
                </div>
                <div>
                  <p className="system-label">Receipts</p>
                  <p className="mt-1 font-mono text-[11px] text-white">
                    {provablyFairReceipts.length}
                  </p>
                </div>
                <div>
                  <p className="system-label">Status</p>
                  <p className="mt-1 font-mono text-[11px] text-white">
                    {proofStatus}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  void rotateProvablyFairSeed();
                }}
                className="system-rail px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white"
              >
                Rotate Seed
              </button>
              <Link
                to="/provably-fair"
                onClick={() =>
                  trackEvent(AnalyticsEvents.PROVABLY_FAIR_DOC_OPENED, {
                    source: "wallet_header",
                  })
                }
                className="system-rail px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white"
              >
                Open Fairness Doc
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
