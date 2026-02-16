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
      color: "text-neon-cyan",
      borderColor: "border-neon-cyan/20",
      bgColor: "bg-neon-cyan/5"
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
      {/* Main balance */}
      <div className="text-center mb-6">
        <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-2">
          Available Balance
        </p>
        <p className="text-4xl sm:text-5xl md:text-6xl font-mono font-black text-vault-gold animate-hud-shimmer">
          $
          {balance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
      </div>

      {/* Breakdown cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {breakdownCards.map((card) => (
          <div
            key={card.label}
            className={`text-center px-2 sm:px-4 py-3 sm:py-4 rounded-xl border ${card.borderColor} ${card.bgColor}`}
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
            <p className="text-[8px] sm:text-[9px] font-bold text-text-dim uppercase tracking-wider mt-1">
              {card.label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
