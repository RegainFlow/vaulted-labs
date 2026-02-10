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
        <div className="hidden md:flex items-center bg-black/40 border border-white/10 rounded-lg p-1">
          <div className="flex items-center gap-3 px-4 py-1.5 border-r border-white/10">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Credits</span>
            <span className="text-lg font-mono font-bold text-neon-green text-glow-green">${balance.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-1.5">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Loot</span>
            <span className="text-lg font-mono font-bold text-neon-cyan text-glow-cyan">{inventoryCount}</span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={scrollToWaitlist}
          className="group relative overflow-hidden rounded-md bg-white text-black px-6 py-2.5 font-black uppercase tracking-widest text-xs transition-all hover:bg-accent hover:text-white hover:shadow-[0_0_20px_rgba(255,45,149,0.5)] skew-x-[-10deg]"
        >
          <span className="relative z-10 block skew-x-[10deg]">Join Waitlist</span>
        </button>
      </div>
    </motion.nav>
  );
}
