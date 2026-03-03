import { motion } from "motion/react";
import { getFunkoById } from "../../data/funkos";
import { trackEvent, AnalyticsEvents } from "../../lib/analytics";
import { CYBER_TRANSITIONS } from "../../lib/motion-presets";
import type { MarketplaceListing } from "../../types/marketplace";
import { CollectibleDisplayCard } from "../shared/CollectibleDisplayCard";
import { InlineStatusNotice } from "../shared/InlineStatusNotice";

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
        detail={
          !canAfford ? (
            <InlineStatusNotice
              title="Insufficient Credits"
              tone="danger"
              body={`You need $${askingPrice - balance} more credits to buy this collectible.`}
            />
          ) : undefined
        }
        actionsSlot={
          <div className="system-rail flex items-center justify-center p-2">
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
              className={`command-segment min-h-[46px] w-100 rounded-[14px] border px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] ${
                canAfford
                  ? "cursor-pointer border-accent/30 bg-accent/10 text-accent"
                  : "cursor-not-allowed border-white/10 bg-white/[0.04] text-text-dim opacity-45"
              }`}
            >
              {canAfford ? `Buy $${askingPrice}` : "Insufficient"}
            </button>
          </div>
        }
        tutorialId={isFirst ? "shop-listing" : undefined}
        variant="feature"
      />
    </motion.div>
  );
}
