import { motion } from "motion/react";
import type { Vault } from "../data/vaults";

interface VaultCardProps {
  vault: Vault;
  index: number;
  locked: boolean;
  onSelect: (vault: Vault) => void;
  onLockedAttempt: () => void;
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

export function VaultCard({ vault, index, locked, onSelect, onLockedAttempt }: VaultCardProps) {
  const styles = tierStyles[vault.name];

  const handleSelect = () => {
    if (locked) {
        onLockedAttempt();
    } else {
        onSelect(vault);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={locked ? {} : { y: -4 }}
      className={`group overflow-hidden rounded-2xl border border-border bg-surface transition-all ${!locked && styles.hoverBorder} ${!locked && styles.glow}`}   
    >
      {/* Tier accent stripe */}
      <div className={`h-1 ${styles.bg}`} />

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
            <p className={`text-sm font-semibold uppercase tracking-wider ${styles.text}`}>
            {vault.name} Vault
            </p>
            <div className={`p-1.5 rounded-full bg-white/5 border border-white/10`}>
                <VaultIcon name={vault.name} color={vault.color} />
            </div>
        </div>

        <div className="mb-4">
          <span className={`text-4xl font-extrabold ${styles.text}`}>
            ${vault.price}
          </span>
          <span className="ml-1 text-sm text-text-dim">/vault</span>
        </div>

        <p className="mb-6 text-sm text-text-muted">{vault.tagline}</p>

        {/* Item range */}
        <div className="mb-6 flex items-center gap-2 text-sm text-text-muted">
          <svg className={`h-4 w-4 ${styles.text}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
          <span>{vault.itemRange}</span>
        </div>

        <button
          onClick={handleSelect}
          className={`w-full cursor-pointer rounded-lg border ${styles.border} bg-transparent px-4 py-2.5 text-sm font-semibold ${styles.text} transition-colors ${!locked && styles.hoverBg} hover:text-bg`}
        >
          {locked ? "Locked" : "Join Waitlist"}
        </button>
      </div>
    </motion.div>
  );
}

function VaultIcon({ name, color }: { name: string; color: string }) {
  switch (name) {
    case "Bronze":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7v10M7 12h10" />
        </svg>
      );
    case "Silver":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
        >
          <rect x="5" y="5" width="14" height="14" rx="2" />
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "Gold":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
        >
          <path d="M12 3l2.6 5.25L20 9l-4 3.9.9 5.5L12 15.8 7.1 18.4 8 12.9 4 9l5.4-.75L12 3z" />
        </svg>
      );
    case "Diamond":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
        >
          <path d="M6 4h12l3 5-9 11L3 9z" />
          <path d="M6 4l6 16M18 4l-6 16M3 9h18" />
        </svg>
      );
    default:
      return null;
  }
}
