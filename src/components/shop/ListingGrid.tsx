import { motion } from "motion/react";
import { useGame } from "../../context/GameContext";
import { ListingCard } from "./ListingCard";

export function ListingGrid() {
  const { listings, balance, buyListing } = useGame();

  if (listings.length === 0) {
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <p className="text-text-muted text-sm font-bold mb-1">
          No listings available
        </p>
        <p className="text-text-dim text-xs">Check back later for new items.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing, idx) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          balance={balance}
          onBuy={buyListing}
          isFirst={idx === 0}
        />
      ))}
    </div>
  );
}
