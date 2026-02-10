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
    <section id="protocol" className="relative overflow-hidden bg-bg px-6 py-24 min-h-[800px]">
      {/* Background industrial pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px"
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">
            Vault <span className="text-accent">Protocol</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted">
            Select your containment tier. High-level vaults feature reinforced probability for Tier-1 legendary loot.
          </p>
        </motion.div>

        <div className={`relative transition-all duration-1000 ease-in-out ${locked ? 'blur-2xl grayscale pointer-events-none scale-95 opacity-30' : 'blur-0 grayscale-0 scale-100 opacity-100'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 gap-y-16 max-w-5xl mx-auto">
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

        {locked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full max-w-md px-4"
          >
            <div className="bg-surface/80 backdrop-blur-xl border-2 border-white/10 p-12 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)]">   
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">      
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-4">Sector Locked</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-8">
                The vault interface is currently locked. Please use your authorized access badge in the hero section to initialize the system.
              </p>
              <button
                onClick={() => {
                    onLockedAttempt?.();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-accent text-xs font-bold uppercase tracking-[0.3em] hover:text-white transition-colors cursor-pointer"      
              >
                Insert Access Key &rarr;
              </button>
            </div>
          </motion.div>
        )}

        {showLockHint && locked && (
          <p className="mt-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-accent animate-pulse">
            Security authorization required to proceed
          </p>
        )}
      </div>
    </section>
  );
}