import { motion } from "motion/react";
import type { Vault } from "../data/vaults";

interface VaultCardProps {
  vault: Vault;
  index: number;
}

const tierStyles: Record<string, {
  text: string;
  border: string;
  bg: string;
  hoverBorder: string;
  hoverBg: string;
  glow: string;
}> = {
  Bronze:  { text: "text-vault-bronze",  border: "border-vault-bronze",  bg: "bg-vault-bronze",  hoverBorder: "hover:border-vault-bronze",  hoverBg: "hover:bg-vault-bronze",  glow: "hover:shadow-[0_0_20px_rgba(205,127,50,0.25)]" },
  Silver:  { text: "text-vault-silver",  border: "border-vault-silver",  bg: "bg-vault-silver",  hoverBorder: "hover:border-vault-silver",  hoverBg: "hover:bg-vault-silver",  glow: "hover:shadow-[0_0_20px_rgba(192,192,192,0.25)]" },
  Gold:    { text: "text-vault-gold",    border: "border-vault-gold",    bg: "bg-vault-gold",    hoverBorder: "hover:border-vault-gold",    hoverBg: "hover:bg-vault-gold",    glow: "hover:shadow-[0_0_20px_rgba(255,215,0,0.25)]" },
  Diamond: { text: "text-vault-diamond", border: "border-vault-diamond", bg: "bg-vault-diamond", hoverBorder: "hover:border-vault-diamond", hoverBg: "hover:bg-vault-diamond", glow: "hover:shadow-[0_0_20px_rgba(185,242,255,0.25)]" },
};

export function VaultCard({ vault, index }: VaultCardProps) {
  const styles = tierStyles[vault.name];

  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className={`group overflow-hidden rounded-2xl border border-border bg-surface transition-all ${styles.hoverBorder} ${styles.glow}`}
    >
      {/* Tier accent stripe */}
      <div className={`h-1 ${styles.bg}`} />

      <div className="p-6">
        <p className={`mb-1 text-sm font-semibold uppercase tracking-wider ${styles.text}`}>
          {vault.name} Vault
        </p>

        <div className="mb-4">
          <span className={`text-4xl font-extrabold ${styles.text}`}>
            ${vault.price}
          </span>
          <span className="ml-1 text-sm text-text-dim">/vault</span>
        </div>

        <p className="mb-3 text-sm text-text-muted">{vault.tagline}</p>

        {/* Rarity breakdown */}
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-dim">
            Drop Rates
          </p>
          <div className="mb-2 flex h-2 overflow-hidden rounded-full">
            <div className="bg-rarity-common" style={{ width: `${vault.rarities.common}%` }} />
            <div className="bg-rarity-uncommon" style={{ width: `${vault.rarities.uncommon}%` }} />
            <div className="bg-rarity-rare" style={{ width: `${vault.rarities.rare}%` }} />
            <div className="bg-rarity-legendary" style={{ width: `${vault.rarities.legendary}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-rarity-common" />
              <span className="text-text-dim">Common</span>
              <span className="ml-auto tabular-nums text-text-muted">{vault.rarities.common}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-rarity-uncommon" />
              <span className="text-text-dim">Uncommon</span>
              <span className="ml-auto tabular-nums text-text-muted">{vault.rarities.uncommon}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-rarity-rare" />
              <span className="text-text-dim">Rare</span>
              <span className="ml-auto tabular-nums text-text-muted">{vault.rarities.rare}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 shrink-0 rounded-full bg-rarity-legendary" />
              <span className="text-text-dim">Legendary</span>
              <span className="ml-auto tabular-nums text-text-muted">{vault.rarities.legendary}%</span>
            </div>
          </div>
        </div>

        {/* Item range */}
        <div className="mb-4 flex items-center gap-2 text-sm text-text-muted">
          <svg className={`h-4 w-4 ${styles.text}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
          <span>{vault.itemRange}</span>
        </div>

        <button
          onClick={scrollToWaitlist}
          className={`w-full cursor-pointer rounded-lg border ${styles.border} bg-transparent px-4 py-2.5 text-sm font-semibold ${styles.text} transition-colors ${styles.hoverBg} hover:text-bg`}
        >
          Join Waitlist
        </button>
      </div>
    </motion.div>
  );
}
