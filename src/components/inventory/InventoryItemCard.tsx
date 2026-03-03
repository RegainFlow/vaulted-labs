import { motion } from "motion/react";
import { getFunkoById } from "../../data/funkos";
import { VAULTS } from "../../data/vaults";
import { CYBER_TRANSITIONS } from "../../lib/motion-presets";
import type { InventoryItemCardProps } from "../../types/inventory";
import {
  CollectibleDisplayCard,
  type CollectibleDisplayAction,
} from "../shared/CollectibleDisplayCard";
import { InlineStatusNotice } from "../shared/InlineStatusNotice";

export function InventoryItemCard({
  item,
  onCashout,
  onShip,
  onList,
  onOpenProof,
  isFirst = false,
}: InventoryItemCardProps & { isFirst?: boolean }) {
  const isInactive = item.status !== "held";
  const shippingLocked = item.status === "held" && !item.shippingEligible;
  const funko = item.funkoId ? getFunkoById(item.funkoId) : undefined;
  const vaultColor =
    VAULTS.find((vault) => vault.name === item.vaultTier)?.color ?? "#ff2d95";

  const statusBadge =
    item.status !== "held" ? (
      <span
        className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${
          item.status === "shipped"
            ? "border-accent/35 bg-accent/10 text-accent"
            : item.status === "cashed_out"
              ? "border-vault-gold/35 bg-vault-gold/10 text-vault-gold"
              : "border-white/12 bg-white/[0.06] text-white/70"
        }`}
      >
        {item.status === "cashed_out"
          ? "Cashed Out"
          : item.status === "shipped"
            ? "Shipped"
            : "Listed"}
      </span>
    ) : undefined;

  const actions: CollectibleDisplayAction[] =
    item.status === "held"
      ? [
          {
            label: "Ship",
            onClick: () => onShip(item.id),
            disabled: shippingLocked,
            color: vaultColor,
            tutorialId: isFirst ? "inventory-ship" : undefined,
          },
          {
            label: "Cashout",
            onClick: () => onCashout(item.id),
            tone: "gold",
            tutorialId: isFirst ? "inventory-cashout" : undefined,
          },
          {
            label: "List",
            onClick: () => onList(item.id),
            tone: "success",
            tutorialId: isFirst ? "inventory-list" : undefined,
          },
        ]
      : [];

  const proofDetail =
    item.provablyFairReceiptId && onOpenProof ? (
      <button
        type="button"
        onClick={() => onOpenProof(item.provablyFairReceiptId!)}
        className="system-rail px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white"
      >
        View Proof
      </button>
    ) : null;

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
        metrics={[
          { label: "Value", value: `$${item.value}`, tone: "gold" },
          {
            label: "Market",
            value: funko ? `~$${funko.baseValue}` : "--",
            tone: "default",
          },
        ]}
        detail={
          shippingLocked || proofDetail ? (
            <div className="space-y-3">
              {shippingLocked ? (
                <InlineStatusNotice
                  title="Shipping Locked"
                  tone="success"
                  body={
                    item.shippingLockReason ||
                    "This collectible can be held, equipped, listed, or cashed out, but it cannot ship yet."
                  }
                />
              ) : null}
              {proofDetail}
            </div>
          ) : undefined
        }
        actions={actions}
        topRightBadge={statusBadge}
        tutorialId={isFirst ? "inventory-item" : undefined}
        variant="feature"
        dimmed={isInactive}
      />
    </motion.div>
  );
}
