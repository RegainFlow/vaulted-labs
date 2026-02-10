import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { VAULTS, type Vault } from "../data/vaults";
import { VaultCard } from "./VaultCard";

interface VaultTiersProps {
  onSelect: (vault: Vault) => void;
  locked?: boolean;
  onLockedAttempt?: () => void;
}

export function VaultTiers({
  onSelect,
  locked = false,
  onLockedAttempt,
}: VaultTiersProps) {
  const [showLockHint, setShowLockHint] = useState(false);

  useEffect(() => {
    if (!showLockHint) return;
    const timer = setTimeout(() => setShowLockHint(false), 2200);
    return () => clearTimeout(timer);
  }, [showLockHint]);

  const handleLockedAttempt = () => {
    setShowLockHint(true);
    onLockedAttempt?.();
  };

  return (
    <section id="protocol" className="relative overflow-hidden bg-bg px-6 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_0%,rgba(185,242,255,0.10)_0%,rgba(10,10,15,0)_44%)]" />
      <div className="relative mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
            Vault <span className="text-vault-diamond">Tier System</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted">
            Choose your risk profile. Every tier clearly displays rarity probabilities
            before you open.
          </p>
        </motion.div>

        {locked && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-8 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-2xl border border-vault-gold/35 bg-vault-gold/10 px-5 py-4 text-center md:flex-row md:text-left"
          >
            <p className="text-sm font-medium text-vault-gold">
              Vaults are locked. Insert your access badge in the hero section to unlock.
            </p>
            <button
              onClick={handleLockedAttempt}
              className="rounded-full border border-vault-gold/55 bg-vault-gold/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-vault-gold transition hover:bg-vault-gold/30 cursor-pointer"
            >
              Go To Unlock
            </button>
          </motion.div>
        )}

        {showLockHint && locked && (
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-vault-gold">
            Badge required before opening vaults
          </p>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {VAULTS.map((vault, index) => (
            <VaultCard
              key={vault.name}
              vault={vault}
              index={index}
              locked={locked}
              onSelect={onSelect}
              onLockedAttempt={handleLockedAttempt}
            />
          ))}
        </div>
      </div>
    </section>
  );
}