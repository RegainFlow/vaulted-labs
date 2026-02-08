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
      className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-6 backdrop-blur-md bg-bg/80 border-b border-border"
    >
      {/* Wordmark */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tighter text-white">
          Vaulted<span className="text-accent">Labs</span>
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* User Stats (Simulated) */}
        <div className="hidden md:flex items-center gap-4 text-sm font-semibold">
          <div className="flex items-center gap-2 text-text-muted">
            <span className="text-lg">💰</span>
            <span className="text-white">${balance.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-text-muted">
            <span className="text-lg">📦</span>
            <span className="text-white">{inventoryCount} Items</span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={scrollToWaitlist}
          className="group relative overflow-hidden rounded-full bg-surface-elevated px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-surface-elevated/80 border border-white/10 hover:border-accent/50 cursor-pointer"
        >
          <span className="relative z-10 group-hover:text-accent transition-colors">Join Waitlist</span>
          <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </motion.nav>
  );
}
