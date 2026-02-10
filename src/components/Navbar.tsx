import { motion } from "motion/react";

type NavbarProps = {
  balance?: number;
  inventoryCount?: number;
};

export function Navbar({ balance = 0, inventoryCount = 0 }: NavbarProps) {
  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between px-6 backdrop-blur-md bg-bg/90 border-b border-white/5"
    >
      {/* Wordmark */}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
          Vaulted<span className="text-accent">Labs</span>
        </span>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        {/* User Stats (Gamified HUD) */}
        <div className="hidden md:flex items-center bg-black/60 border border-white/10 rounded-full p-1 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">   
          <div className="flex items-center gap-2 px-4 py-1.5 border-r border-white/10">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 stat-icon-credits">
                <span className="text-[10px] text-accent">⚡</span>
            </div>
            <span className="text-lg font-mono font-bold text-white drop-shadow-[0_0_8px_rgba(255,45,149,0.3)] balance-text">${balance.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5">
            <div className="w-6 h-6 rounded-full bg-neon-cyan/20 flex items-center justify-center border border-neon-cyan/30 stat-icon-inventory">
                <span className="text-[10px] text-neon-cyan">📦</span>
            </div>
            <span className="text-lg font-mono font-bold text-white drop-shadow-[0_0_8px_rgba(0,240,255,0.3)] inventory-text">{inventoryCount}</span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={scrollToWaitlist}
          className="group relative overflow-hidden rounded-full bg-white text-black px-8 py-2.5 font-black uppercase tracking-widest text-xs transition-all hover:bg-accent hover:text-white hover:shadow-[0_0_30px_rgba(255,45,149,0.5)] active:scale-95"
        >
          <span className="relative z-10">Join Waitlist</span>
          <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>
    </motion.nav>
  );
}