import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  showHUD?: boolean;
  balance?: number;
  inventoryCount?: number;
  xp?: number;
  level?: number;
}

export function Navbar({ showHUD = false, balance = 0, inventoryCount = 0, level }: NavbarProps) {
  const location = useLocation();
  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { to: "/play", label: "Play" },
    { to: "/market", label: "Market" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-bg/90 border-b border-white/5"
    >
      {/* Main bar */}
      <div className="flex h-14 sm:h-16 md:h-20 items-center justify-between px-3 sm:px-4 md:px-6">
        {/* Left: Wordmark + Nav Links */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-lg sm:text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">
              Vaulted<span className="text-accent text-glow-magenta">Labs</span>
            </span>
          </Link>

          <div className="flex items-center gap-0.5 sm:gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                    isActive
                      ? "text-accent bg-accent/10 border border-accent/30"
                      : "text-text-muted hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {showHUD ? (
          /* Game HUD Bar — compact on mobile, full on desktop */
          <div className="relative shrink-0">
            <div className="relative flex items-center bg-surface/80 backdrop-blur-xl rounded-lg sm:rounded-xl border border-white/10">
              {/* Credits slot */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2.5 border-r border-white/10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-vault-gold shrink-0 sm:w-4 sm:h-4">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5s-2 .5-2 1.5 1 1.5 2 2 2 1 2 2-1 1.5-2 1.5-2-.5-2.5-1.5M12 7v1m0 8v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <div className="flex flex-col">
                  <span className="hidden sm:block text-[10px] font-bold text-text-dim uppercase tracking-wider leading-none">Credits</span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-vault-gold animate-hud-shimmer">
                    ${balance.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Loot slot */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2.5 border-r border-white/10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-neon-cyan shrink-0 sm:w-4 sm:h-4">
                  <path d="M21 8V21H3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M23 3H1V8H23V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex flex-col">
                  <span className="hidden sm:block text-[10px] font-bold text-text-dim uppercase tracking-wider leading-none">Loot</span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-neon-cyan animate-hud-shimmer" style={{ animationDelay: "0.5s" }}>
                    {inventoryCount}
                  </span>
                </div>
              </div>

              {/* Level slot */}
              {level !== undefined && (
                <div className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-accent shrink-0 sm:w-4 sm:h-4">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="hidden sm:block text-[10px] font-bold text-text-dim uppercase tracking-wider leading-none">Level</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-accent animate-hud-shimmer" style={{ animationDelay: "1s" }}>
                      {level}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Landing page: simple Join button */
          <>
            {/* Mobile CTA */}
            <button
              onClick={scrollToWaitlist}
              className="md:hidden relative overflow-hidden rounded-lg bg-accent/10 border border-accent/30 text-accent px-4 py-2 font-black uppercase tracking-widest text-[10px] transition-all hover:bg-accent hover:text-white cursor-pointer"
            >
              Join
            </button>

            {/* Desktop CTA */}
            <button
              onClick={scrollToWaitlist}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-accent bg-surface/80 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-accent/10 transition-all cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Join</span>
            </button>
          </>
        )}
      </div>
    </motion.nav>
  );
}
