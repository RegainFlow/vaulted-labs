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
  isLocked?: boolean;
}

export function VaultTiers({ onSelect, isLocked = false }: VaultTiersProps) {
  return (
    <section id="protocol" className="py-24 px-6 bg-bg relative overflow-hidden min-h-[800px]">
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
          <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tight text-white">
            Vault <span className="text-accent">Protocol</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Select your containment tier. High-level vaults feature reinforced probability for Tier-1 legendary loot.        
          </p>
        </motion.div>

        <div className={`relative transition-all duration-1000 ease-in-out ${isLocked ? 'blur-2xl grayscale pointer-events-none scale-95 opacity-30' : 'blur-0 grayscale-0 scale-100 opacity-100'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {tiers.map((tier, i) => (
              <VaultCard key={tier.name} tier={tier} index={i} onSelect={onSelect} />
            ))}
          </div>
        </div>

        {isLocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full max-w-md px-4"
          >
            <div className="bg-surface/80 backdrop-blur-xl border-2 border-white/10 p-12 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)]">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                <span className="text-4xl">🔒</span>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-4">Protocol Offline</h3>
              <p className="text-text-muted text-sm leading-relaxed mb-8">
                The vault interface is currently locked. Please use your authorized access badge in the terminal above to initialize the system.
              </p>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-accent text-xs font-bold uppercase tracking-[0.3em] hover:text-white transition-colors cursor-pointer"
              >
                Return to Terminal ↑
              </button>
            </div>
          </motion.div>
        )}
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
      whileHover={{ y: -16 }}
      onClick={() => onSelect(tier)}
      className="group relative cursor-pointer"
    >
      {/* Main Vault Door Setup */}
      <div className="relative bg-[#0d0d12] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/5 h-full flex flex-col transition-all duration-500 group-hover:border-opacity-100 group-hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]" style={{ borderColor: `${tier.color}40` }}>

        {/* Metallic Header */}
        <div className={`h-40 bg-linear-to-br ${tier.gradient} relative flex items-center justify-center border-b-8 border-black/40`}>
          {/* Industrial Rivets */}
          <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-black/30 shadow-inner" />
          <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-black/30 shadow-inner" />        
          <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-black/30 shadow-inner" />      
          <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-black/30 shadow-inner" />     

          {/* Tier Icon/Logo */}
          <div className="w-24 h-24 bg-black/40 rounded-2xl rotate-45 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-2xl transition-transform duration-500 group-hover:rotate-[225deg]">
            <div className="-rotate-45 group-hover:-rotate-[225deg] transition-transform duration-500">
                <VaultIcon name={tier.name} color={tier.color} />
            </div>
          </div>

          <div className="absolute bottom-3 w-full text-center text-[10px] font-black uppercase tracking-[0.4em] text-black/60">
            Secure Entry // 0{index + 1}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-8 flex-1 flex flex-col bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex justify-between items-start mb-8">
            <div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{tier.name}</h3>
                <div className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] mt-1">Classification Unit</div>
            </div>
            <div className="text-right">
                <div className="text-3xl font-black italic" style={{ color: tier.color }}>
                ${tier.price}
                </div>
                <div className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">Per Sequence</div>
            </div>
          </div>

          {/* Stats with Probability Bars */}
          <div className="space-y-5 py-6 border-t border-white/5">
            {(Object.entries(tier.odds) as [string, number][]).map(([rarity, chance]) => {
              const rarityColor = getRarityColor(rarity);
              return (
                <div key={rarity} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: rarityColor }} />
                        <span className="capitalize text-xs font-bold text-text-muted tracking-widest">{rarity}</span>
                    </div>
                    <span className="font-mono text-sm font-bold" style={{ color: rarityColor }}>{chance}%</span>
                  </div>
                  {/* Progress Bar Container */}
                  <div className="h-2.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/5 p-[2px]">
                    {/* Fill */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${chance}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full rounded-full relative"
                      style={{ 
                        backgroundColor: rarityColor,
                        boxShadow: `0 0 10px ${rarityColor}40`
                      }}
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent" />
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-8">
            <button
              className="w-full py-5 rounded-xl border-2 font-black uppercase tracking-[0.2em] text-sm transition-all duration-500 overflow-hidden relative group/btn"
              style={{
                borderColor: tier.color,
                color: tier.color,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = tier.color;
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.boxShadow = `0 0 30px ${tier.color}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = tier.color;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span className="relative z-10">Initialize Sequence</span>
              {/* Internal glow effect */}
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Caution Stripes at bottom */}
        <div className="h-3 w-full bg-[repeating-linear-gradient(45deg,#000,#000_10px,transparent_10px,transparent_20px)] opacity-20" />
      </div>

      {/* Selection Glow */}
      <div className={`absolute inset-0 -z-10 rounded-2xl blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700`} style={{ backgroundColor: tier.color }} />
    </motion.div>
  )
}

function getRarityColor(rarity: string) {
  switch (rarity) {
    case 'common': return '#9a9ab0';
    case 'uncommon': return '#00f0ff';
    case 'rare': return '#a855f7';
    case 'legendary': return '#ff2d95';
    default: return 'white';
  }
}

function VaultIcon({ name, color }: { name: string; color: string }) {
  // Simple SVG icons for tiers
  switch (name) {
    case 'Bronze':
      return <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></svg>;
    case 'Silver':
      return <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18" /></svg>;
    case 'Gold':
      return <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
    case 'Diamond':
      return <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><path d="M6 3h12l4 6-10 13L2 9z" /><path d="M11 3v20M6 9h12" /></svg>;
    default:
      return null;
  }
}