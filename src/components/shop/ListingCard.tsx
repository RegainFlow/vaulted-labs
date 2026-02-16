import { motion } from "motion/react";
import { RARITY_CONFIG } from "../../data/vaults";
import { trackEvent, AnalyticsEvents } from "../../lib/analytics";
import type { MarketplaceListing } from "../../types/marketplace";
import { VaultIcon } from "../vault/VaultIcons";

interface ListingCardProps {
  listing: MarketplaceListing;
  balance: number;
  onBuy: (listingId: string) => void;
}

const VAULT_COLORS: Record<string, string> = {
  Bronze: "#cd7f32",
  Silver: "#e0e0e0",
  Gold: "#ffd700",
  Platinum: "#79b5db",
  Obsidian: "#6c4e85",
  Diamond: "#b9f2ff"
};

export function ListingCard({ listing, balance, onBuy }: ListingCardProps) {
  const { item, sellerName, askingPrice } = listing;
  const rarityConfig = RARITY_CONFIG[item.rarity];
  const vaultColor = VAULT_COLORS[item.vaultTier] || "#ffffff";
  const canAfford = balance >= askingPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border bg-surface-elevated/50 backdrop-blur-sm overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
      style={{ borderColor: `${vaultColor}20` }}
    >
      {/* Header gradient */}
      <div
        className="h-2 w-full"
        style={{
          background: `linear-gradient(90deg, ${vaultColor}40, ${vaultColor}10)`
        }}
      />

      <div className="p-3 sm:p-4">
        {/* Icon + info */}
        <div className="flex items-center gap-2.5 sm:gap-3 mb-3">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center border shrink-0"
            style={{
              borderColor: `${vaultColor}30`,
              backgroundColor: `${vaultColor}08`
            }}
          >
            <VaultIcon name={item.vaultTier} color={vaultColor} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-bold text-white truncate">
              {item.product}
            </p>
            <p
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: vaultColor }}
            >
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
              backgroundColor: `${rarityConfig.color}10`
            }}
          >
            {item.rarity}
          </span>
          <span className="text-[10px] text-text-dim">@{sellerName}</span>
        </div>

        {/* Price + buy */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="text-vault-gold"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5s-2 .5-2 1.5 1 1.5 2 2 2 1 2 2-1 1.5-2 1.5-2-.5-2.5-1.5M12 7v1m0 8v1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-base sm:text-lg font-mono font-black text-vault-gold">
              ${askingPrice}
            </span>
          </div>
          <button
            onClick={() => {
              if (!canAfford) return;
              trackEvent(AnalyticsEvents.MARKETPLACE_BUY, {
                listing_id: listing.id,
                item_rarity: item.rarity,
                vault_tier: item.vaultTier,
                price: askingPrice
              });
              onBuy(listing.id);
            }}
            disabled={!canAfford}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest border transition-all shrink-0 ${
              canAfford
                ? "bg-accent/10 border-accent/30 text-accent hover:bg-accent hover:text-white cursor-pointer"
                : "bg-white/5 border-white/10 text-text-dim cursor-not-allowed"
            }`}
          >
            {canAfford ? "Buy" : "Insufficient"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
