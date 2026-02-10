import { motion } from "motion/react";

export type VaultTierData = {
  name: string;
  price: number;
  color: string;
  gradient: string;
  odds: { common: number; uncommon: number; rare: number; legendary: number };
};

const tiers: VaultTierData[] = [
  {
    name: "Bronze",
    price: 24,
    color: "#cd7f32",
    gradient: "from-[#8B4513] to-[#cd7f32]",
    odds: { common: 60, uncommon: 30, rare: 8.3, legendary: 1.7 },
  },
  {
    name: "Silver",
    price: 38,
    color: "#e0e0e0",
    gradient: "from-[#757575] to-[#e0e0e0]",
    odds: { common: 40, uncommon: 40, rare: 16.9, legendary: 3.1 },
  },
  {
    name: "Gold",
    price: 54,
    color: "#ffd700",
    gradient: "from-[#b8860b] to-[#ffd700]",
    odds: { common: 20, uncommon: 45, rare: 30.8, legendary: 4.2 },
  },
  {
    name: "Diamond",
    price: 86,
    color: "#b9f2ff",
    gradient: "from-[#00bfff] to-[#b9f2ff]",
    odds: { common: 5, uncommon: 30, rare: 60.6, legendary: 4.4 },
  },
];

interface VaultTiersProps {
  onSelect: (tier: VaultTierData) => void;
}

export function VaultTiers({ onSelect }: VaultTiersProps) {
  return (
    <section id="protocol" className="py-24 px-6 bg-bg relative overflow-hidden">
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tight">
            Loot <span className="text-accent">Tier System</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Choose your vault level. Higher tiers unlock better probabilities for legendary drops.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <VaultCard key={tier.name} tier={tier} index={i} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VaultCard({ tier, index, onSelect }: { tier: VaultTierData; index: number; onSelect: (t: VaultTierData) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -12, scale: 1.02 }}
      onClick={() => onSelect(tier)}
      className="group relative cursor-pointer"
    >
      {/* Main Vault Door Setup */}
      <div className="relative bg-surface rounded-xl overflow-hidden shadow-2xl border border-white/5 h-full flex flex-col transition-all duration-300 group-hover:border-opacity-50" style={{ borderColor: tier.color }}>

        {/* Metallic Header */}
        <div className={`h-36 bg-linear-to-br ${tier.gradient} relative flex items-center justify-center border-b-4 border-black/20`}>
          {/* Industrial Rivets */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-black/20 shadow-inner" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-black/20 shadow-inner" />
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-black/20 shadow-inner" />
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-black/20 shadow-inner" />

          {/* Tier Icon/Logo */}
          <div className="w-20 h-20 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-inner">
            <VaultIcon name={tier.name} color={tier.color} />
          </div>

          <div className="absolute bottom-2 w-full text-center text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
            Level 0{index + 1} Access
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 flex-1 flex flex-col bg-surface-elevated/50 backdrop-blur-sm">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-black text-white uppercase tracking-wider">{tier.name}</h3>
            <div className="text-3xl font-bold mt-2" style={{ color: tier.color }}>
              ${tier.price}
            </div>
          </div>

          {/* Stats with Probability Bars */}
          <div className="space-y-4 py-4 border-t border-dashed border-white/10">
            {(Object.entries(tier.odds) as [string, number][]).map(([rarity, chance]) => {
              const rarityColor = getRarityColor(rarity);
              // Safe lookup for CSS variable or strictly hex/string
              // Since getRarityColor returns var(...), we can use it directly in style
              return (
                <div key={rarity} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="capitalize text-text-muted font-bold">{rarity}</span>
                    <span className="font-mono text-white opacity-80">{chance}%</span>
                  </div>
                  {/* Progress Bar Container */}
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                    {/* Fill */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${chance}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: rarityColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-6">
            <button
              className="w-full py-4 rounded-lg bg-bg border-2 font-black uppercase tracking-widest text-xs transition-all duration-300 group-hover:scale-105"
              style={{
                borderColor: tier.color,
                color: tier.color,
                boxShadow: `0 0 0 rgba(0,0,0,0)` // start empty
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = tier.color;
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.boxShadow = `0 0 20px ${tier.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = tier.color;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              CRACK OPEN
            </button>
          </div>
        </div>

        {/* Caution Stripes at bottom */}
        <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.5),rgba(0,0,0,0.5)_10px,transparent_10px,transparent_20px)] bg-black/40" />
      </div>

      {/* Selection Glow */}
      <div className={`absolute inset-0 -z-10 rounded-2xl blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`} style={{ backgroundColor: tier.color }} />
    </motion.div>
  )
}

function getRarityColor(rarity: string) {
  switch (rarity) {
    case 'common': return 'var(--color-text-muted)';
    case 'uncommon': return 'var(--color-neon-green)';
    case 'rare': return 'var(--color-neon-cyan)';
    case 'legendary': return 'var(--color-accent)';
    default: return 'white';
  }
}

function VaultIcon({ name, color }: { name: string; color: string }) {
  // Simple SVG icons for tiers
  switch (name) {
    case 'Bronze':
      return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v12M6 12h12" /></svg>;
    case 'Silver':
      return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 12h18M12 3v18" /></svg>;
    case 'Gold':
      return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
    case 'Diamond':
      return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M6 3h12l4 6-10 13L2 9z" /><path d="M11 3v20M6 9h12" /></svg>;
    default:
      return null;
  }
}
