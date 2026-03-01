import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getFunkoById } from "../../data/funkos";
import { trackEvent, AnalyticsEvents } from "../../lib/analytics";
import { CYBER_TRANSITIONS } from "../../lib/motion-presets";
import type { AuctionCardProps } from "../../types/marketplace";
import { CollectibleDisplayCard } from "../shared/CollectibleDisplayCard";

function formatTimeLeft(ms: number): string {
  if (ms <= 0) return "Ended";
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function AuctionCard({
  auction,
  balance,
  onBid,
  isFirst = false,
}: AuctionCardProps & { isFirst?: boolean }) {
  const { item, sellerName, currentBid, currentBidder, endsAt } = auction;
  const funko = item.funkoId ? getFunkoById(item.funkoId) : undefined;

  const [timeLeft, setTimeLeft] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");

  const isUrgent = timeLeft > 0 && timeLeft < 5 * 60 * 1000;
  const isEnded = timeLeft <= 0;
  const isWinning = currentBidder === "You";

  useEffect(() => {
    const updateTimeLeft = () => {
      setTimeLeft(endsAt - Date.now());
    };
    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  const handleBid = () => {
    const amount = parseFloat(bidAmount);
    if (Number.isNaN(amount) || amount <= 0) {
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
    trackEvent(AnalyticsEvents.AUCTION_BID, {
      auction_id: auction.id,
      bid_amount: amount,
      item_rarity: item.rarity,
      vault_tier: item.vaultTier,
      current_bid: currentBid,
    });
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
      transition={CYBER_TRANSITIONS.default}
    >
      <CollectibleDisplayCard
        name={item.funkoName || item.product}
        rarity={item.rarity}
        imagePath={funko?.imagePath}
        stats={item.stats}
        subtitle={`Auction by @${sellerName}`}
        metrics={[
          { label: "Value", value: `$${item.value}`, tone: "gold" },
          {
            label: "Market",
            value: funko ? `~$${funko.baseValue}` : "--",
          },
        ]}
        detail={
          <div className="space-y-2.5">
            <div
              {...(isFirst ? { "data-tutorial": "shop-timer" } : {})}
              className={`system-rail flex items-center justify-between px-3 py-2.5 ${
                isUrgent ? "animate-urgency-pulse" : isEnded ? "opacity-70" : ""
              }`}
              style={
                isUrgent ? { borderColor: "rgba(255,59,92,0.35)" } : undefined
              }
            >
              <span className="system-label">Time Left</span>
              <span
                className={`text-sm font-mono font-bold ${
                  isUrgent
                    ? "text-error"
                    : isEnded
                      ? "text-text-dim"
                      : "text-white"
                }`}
              >
                {formatTimeLeft(timeLeft)}
              </span>
            </div>

            {isWinning && !isEnded && (
              <div
                className="rounded-[16px] border px-3 py-2 text-center"
                style={{
                  borderColor: "rgba(105,231,160,0.3)",
                  backgroundColor: "rgba(105,231,160,0.08)",
                }}
              >
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-neon-green">
                  You&apos;re winning
                </span>
              </div>
            )}
          </div>
        }
        actionsSlot={
          isEnded ? (
            <div className="system-rail px-3 py-3 text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-text-dim">
                Auction Ended
              </span>
            </div>
          ) : (
            <div
              className="system-rail space-y-2.5 p-3"
              {...(isFirst ? { "data-tutorial": "shop-bid" } : {})}
            >
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-dim">
                    Current Bid
                  </p>
                  <p className="mt-1 text-lg font-mono font-black text-vault-gold">
                    ${currentBid}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleBid}
                  className="command-segment min-h-[44px] shrink-0 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-accent cursor-pointer"
                >
                  Bid
                </button>
              </div>
              <input
                type="number"
                value={bidAmount}
                onChange={(event) => {
                  setBidAmount(event.target.value);
                  setBidError("");
                }}
                placeholder={`Min $${currentBid + 1}`}
                className="system-input w-full px-3 py-2.5 text-sm font-mono text-white placeholder:text-text-dim"
              />
              {bidError && (
                <p className="text-[10px] font-bold text-error">{bidError}</p>
              )}
            </div>
          )
        }
        topRightBadge={
          isEnded ? (
            <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
              Ended
            </span>
          ) : undefined
        }
        tutorialId={isFirst ? "shop-auction" : undefined}
        dimmed={isEnded}
      />
    </motion.div>
  );
}
