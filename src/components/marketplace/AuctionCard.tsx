import { useState, useEffect } from "react";
import { motion } from "motion/react";
import type { Auction } from "../../types/game";
import { RARITY_CONFIG } from "../../data/vaults";
import { VaultIcon } from "../VaultIcons";

interface AuctionCardProps {
  auction: Auction;
  balance: number;
  onBid: (auctionId: string, amount: number) => boolean;
}

const VAULT_COLORS: Record<string, string> = {
  Bronze: "#cd7f32",
  Silver: "#e0e0e0",
  Gold: "#ffd700",
  Platinum: "#79b5db",
  Obsidian: "#6c4e85",
  Diamond: "#b9f2ff",
};

function formatTimeLeft(ms: number): string {
  if (ms <= 0) return "Ended";
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function AuctionCard({ auction, balance, onBid }: AuctionCardProps) {
  const { item, sellerName, currentBid, currentBidder, endsAt } = auction;
  const rarityConfig = RARITY_CONFIG[item.rarity];
  const vaultColor = VAULT_COLORS[item.vaultTier] || "#ffffff";

  const [timeLeft, setTimeLeft] = useState(endsAt - Date.now());
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");

  const isUrgent = timeLeft > 0 && timeLeft < 5 * 60 * 1000;
  const isEnded = timeLeft <= 0;
  const isWinning = currentBidder === "You";

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(endsAt - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  const handleBid = () => {
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      setBidError("Enter a valid amount");
      return;
    }
    if (amount <= currentBid) {
      setBidError(`Bid must exceed $${currentBid}`);
      return;
    }
    if (amount > balance) {
      setBidError("Insufficient credits");
      return;
    }
    const success = onBid(auction.id, amount);
    if (success) {
      setBidAmount("");
      setBidError("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border bg-surface-elevated/50 backdrop-blur-sm overflow-hidden transition-all duration-300 ${
        isEnded ? "opacity-50 grayscale" : "hover:-translate-y-1 hover:shadow-xl"
      }`}
      style={{ borderColor: isWinning ? "#39ff1440" : `${vaultColor}20` }}
    >
      {/* Header gradient */}
      <div
        className="h-2 w-full"
        style={{ background: `linear-gradient(90deg, ${vaultColor}40, ${vaultColor}10)` }}
      />

      <div className="p-3 sm:p-4">
        {/* Icon + info */}
        <div className="flex items-center gap-2.5 sm:gap-3 mb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center border shrink-0" style={{ borderColor: `${vaultColor}30`, backgroundColor: `${vaultColor}08` }}>
            <VaultIcon name={item.vaultTier} color={vaultColor} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-bold text-white truncate">{item.product}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: vaultColor }}>
              {item.vaultTier} Vault
            </p>
          </div>
        </div>

        {/* Rarity + seller */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border"
            style={{
              color: rarityConfig.color,
              borderColor: `${rarityConfig.color}40`,
              backgroundColor: `${rarityConfig.color}10`,
            }}
          >
            {item.rarity}
          </span>
          <span className="text-[10px] text-text-dim">@{sellerName}</span>
        </div>

        {/* Timer */}
        <div className={`flex items-center justify-between mb-3 px-3 py-2 rounded-lg border ${
          isUrgent ? "bg-error/10 border-error/30 animate-urgency-pulse" :
          isEnded ? "bg-white/5 border-white/10" :
          "bg-surface border-white/10"
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-dim">Time Left</span>
          <span className={`text-sm font-mono font-bold ${isUrgent ? "text-error" : isEnded ? "text-text-dim" : "text-white"}`}>
            {formatTimeLeft(timeLeft)}
          </span>
        </div>

        {/* Current bid */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-dim">Current Bid</span>
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-vault-gold">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5s-2 .5-2 1.5 1 1.5 2 2 2 1 2 2-1 1.5-2 1.5-2-.5-2.5-1.5M12 7v1m0 8v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-lg font-mono font-black text-vault-gold">${currentBid}</span>
          </div>
        </div>

        {/* Winning indicator */}
        {isWinning && !isEnded && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-neon-green/10 border border-neon-green/30 text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-neon-green">You're winning!</span>
          </div>
        )}

        {/* Bid input */}
        {!isEnded && (
          <div className="pt-3 border-t border-white/5">
            <div className="flex gap-2">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => { setBidAmount(e.target.value); setBidError(""); }}
                placeholder={`Min $${currentBid + 1}`}
                className="flex-1 min-w-0 px-2.5 sm:px-3 py-2 rounded-lg bg-surface border border-white/10 text-white text-xs sm:text-sm font-mono placeholder:text-text-dim focus:outline-none focus:border-neon-cyan/50 transition-colors"
              />
              <button
                onClick={handleBid}
                className="px-3 sm:px-4 py-2 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-white transition-all cursor-pointer shrink-0"
              >
                Bid
              </button>
            </div>
            {bidError && (
              <p className="text-[10px] text-error mt-1.5 font-bold">{bidError}</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
