import { motion } from "motion/react";
import { getFunkoById } from "../../data/funkos";
import { trackEvent, AnalyticsEvents } from "../../lib/analytics";
import { CYBER_TRANSITIONS } from "../../lib/motion-presets";
import type { MarketplaceListing } from "../../types/marketplace";
import { CollectibleDisplayCard } from "../shared/CollectibleDisplayCard";

interface ListingCardProps {
  listing: MarketplaceListing;
  balance: number;
  onBuy: (listingId: string) => void;
  isFirst?: boolean;
}

export function ListingCard({
  listing,
  balance,
  onBuy,
  isFirst = false,
}: ListingCardProps) {
  const { item, sellerName, askingPrice } = listing;
  const canAfford = balance >= askingPrice;
  const funko = item.funkoId ? getFunkoById(item.funkoId) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={CYBER_TRANSITIONS.default}
    >
      <CollectibleDisplayCard
        name={item.funkoName || item.product}
        rarity={item.rarity}
        imagePath={funko?.imagePath}
        stats={item.stats}
        subtitle={`Listed by @${sellerName}`}
        metrics={[
          { label: "Value", value: `$${item.value}`, tone: "gold" },
          {
            label: "Market",
            value: funko ? `~$${funko.baseValue}` : "--",
          },
        ]}
        actionsSlot={
          <div className="system-rail flex items-center justify-between gap-3 p-2">
            <div className="rounded-[14px] border border-white/10 bg-black/20 px-3 py-2">
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-text-dim">
                Buy Now
              </p>
              <p className="mt-1 text-lg font-mono font-black text-vault-gold">
                ${askingPrice}
              </p>
            </div>
            <button
              {...(isFirst ? { "data-tutorial": "shop-buy" } : {})}
              type="button"
              onClick={() => {
                if (!canAfford) return;
                trackEvent(AnalyticsEvents.MARKETPLACE_BUY, {
                  listing_id: listing.id,
                  item_rarity: item.rarity,
                  vault_tier: item.vaultTier,
                  price: askingPrice,
                });
                onBuy(listing.id);
              }}
              disabled={!canAfford}
              className={`command-segment min-h-[46px] shrink-0 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] ${
                canAfford
                  ? "cursor-pointer text-accent"
                  : "cursor-not-allowed text-text-dim opacity-45"
              }`}
            >
              {canAfford ? "Buy" : "Insufficient"}
            </button>
          </div>
        }
        tutorialId={isFirst ? "shop-listing" : undefined}
      />
    </motion.div>
  );
}
