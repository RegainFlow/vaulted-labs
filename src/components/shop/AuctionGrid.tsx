import { motion } from "motion/react";
import { useGame } from "../../context/GameContext";
import { AuctionCard } from "./AuctionCard";

export function AuctionGrid() {
  const { auctions, balance, placeBid } = useGame();

  if (auctions.length === 0) {
    return (
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
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <p className="text-text-muted text-sm font-bold mb-1">
          No active auctions
        </p>
        <p className="text-text-dim text-xs">
          Check back later for new auctions.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {auctions.map((auction, idx) => (
        <AuctionCard
          key={auction.id}
          auction={auction}
          balance={balance}
          onBid={placeBid}
          isFirst={idx === 0}
        />
      ))}
    </div>
  );
}
