import { motion } from "motion/react";
import type { Vault } from "../data/vaults";
import { VaultIcon } from "./VaultIcons";

interface VaultCardProps {
  vault: Vault;
  index: number;
  locked: boolean;
  onSelect: (vault: Vault) => void;
  onLockedAttempt: () => void;
}

export function VaultCard({ vault, index, locked, onSelect, onLockedAttempt }: VaultCardProps) {
  const handleSelect = () => {
    if (locked) {
        onLockedAttempt();
    } else {
        onSelect(vault);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={locked ? {} : { y: -10 }}
      onClick={handleSelect}
      className="group relative cursor-pointer h-full"
    >
      {/* Main Vault Structure - Cubic Feel */}
      <div className="relative bg-[#0d0d12] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/5 h-full flex flex-col transition-all duration-500 hover:border-opacity-100 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]" style={{ borderColor: `${vault.color}40` }}>

        {/* Metallic Header */}
        <div className={`relative h-48 bg-linear-to-br ${vault.gradient} flex flex-col items-center justify-center border-b-8 border-black/40 overflow-hidden`}>
          
          {/* Industrial Rivets */}
          <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-black/30 shadow-inner" />
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-black/30 shadow-inner" />
          
          {/* Price Tag in Header (Top Right) */}
          <div className="absolute top-4 right-8 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 z-10">
             <span className="font-black italic text-xl text-white">${vault.price}</span>
          </div>

          {/* Sequence Number (Top Left) */}
          <div className="absolute top-4 left-8 text-[10px] font-black uppercase tracking-[0.2em] text-black/50 z-10">
             SEQ // 0{index + 1}
          </div>

          {/* Ore Icon Container */}
          <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-110">
             <div className="drop-shadow-2xl filter">
                <VaultIcon name={vault.name} color={vault.color} />
             </div>
          </div>

          {/* Background pattern for texture */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,black_1px,transparent_0)] bg-[length:10px_10px]" />
        </div>

        {/* Body Content */}
        <div className="p-6 bg-gradient-to-b from-white/5 to-transparent flex-1 flex flex-col">
          
          {/* Title Section */}
          <div className="text-center mb-6">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{vault.name}</h3>
            <p className="text-xs font-mono text-text-muted uppercase tracking-[0.3em]">{vault.tagline}</p>
          </div>

          {/* Stats Section - Always Visible */}
          <div className="pt-6 space-y-4 border-t border-white/5">
            {(Object.entries(vault.rarities) as [string, number][]).map(([rarity, chance]) => {
            const rarityColor = getRarityColor(rarity);
            return (
                <div key={rarity} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
                        <span style={{ color: rarityColor }}>{rarity}</span>
                        <span className="text-white">{chance}%</span>
                    </div>
                    {/* Wide Stat Bar with Ticks */}
                    <div className="h-4 w-full bg-black/60 rounded-sm overflow-hidden border border-white/5 relative">
                        {/* Tick Marks Overlay */}
                        <div 
                            className="absolute inset-0 z-20 pointer-events-none opacity-20" 
                            style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 19%, #000 19%, #000 20%)" }} 
                        />
                        
                        {/* Fill */}
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${chance}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full relative"
                            style={{
                                backgroundColor: rarityColor,
                                boxShadow: `0 0 10px ${rarityColor}40`
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                        </motion.div>
                    </div>
                </div>
            );
            })}
          </div>
             
          <div className="mt-8 text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest animate-pulse" style={{ color: locked ? 'var(--color-text-dim)' : vault.color }}>
                {locked ? "Sector Locked" : "Click to Initialize"}
            </span>
          </div>

        </div>

        {/* Caution Stripes at bottom */}
        <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#000,#000_10px,transparent_10px,transparent_20px)] opacity-20" />    
      </div>

      {/* Selection Glow */}
      {!locked && <div className={`absolute inset-0 -z-10 rounded-2xl blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700`} style={{ backgroundColor: vault.color }} />}
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
