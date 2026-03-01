import { motion } from "motion/react";
import { useGame } from "../../context/GameContext";

export function WalletHeader() {
  const { balance, creditTransactions } = useGame();

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
      </div>
    </motion.div>
  );
}
