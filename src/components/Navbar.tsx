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

  // Contextual nav: on /market show Play, everywhere else show Market
  const navLink = location.pathname === "/market"
    ? { to: "/play", label: "Play" }
    : { to: "/market", label: "Market" };

  const navLinkButton = (
    <Link
      to={navLink.to}
      className="group relative px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 text-white bg-surface-elevated border border-white/15 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(255,45,149,0.15)] cursor-pointer"
    >
      <span className="relative z-10">{navLink.label}</span>
      <div className="absolute inset-0 rounded-xl bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300" />
    </Link>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-bg/90 border-b border-white/5"
    >
      {/* Main bar */}
      <div className="flex h-14 md:h-20 items-center justify-between px-4 md:px-6 relative">
        {/* Left: Wordmark */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">
            Vaulted<span className="text-accent text-glow-magenta">Labs</span>
          </span>
        </Link>

        {/* Right side */}
        {showHUD ? (
          <>
            {/* Center: Nav link — desktop only, only on HUD pages */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
              {navLinkButton}
            </div>

            {/* Mobile: nav link on the right */}
            <div className="md:hidden">
              {navLinkButton}
            </div>

            {/* Desktop: HUD */}
            <div className="relative shrink-0 hidden md:block">
              <div className="relative flex items-center bg-surface/80 backdrop-blur-xl rounded-xl border border-white/10">
                {/* Credits slot */}
                <div className="flex items-center gap-2.5 px-4 py-2.5 border-r border-white/10">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-vault-gold shrink-0">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5s-2 .5-2 1.5 1 1.5 2 2 2 1 2 2-1 1.5-2 1.5-2-.5-2.5-1.5M12 7v1m0 8v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider leading-none">Credits</span>
                    <span className="text-sm font-mono font-bold text-vault-gold animate-hud-shimmer">
                      ${balance.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Loot slot */}
                <div className="flex items-center gap-2.5 px-4 py-2.5 border-r border-white/10">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-neon-cyan shrink-0">
                    <path d="M21 8V21H3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M23 3H1V8H23V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider leading-none">Loot</span>
                    <span className="text-sm font-mono font-bold text-neon-cyan animate-hud-shimmer" style={{ animationDelay: "0.5s" }}>
                      {inventoryCount}
                    </span>
                  </div>
                </div>

                {/* Level slot */}
                {level !== undefined && (
                  <div className="flex items-center gap-2.5 px-4 py-2.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-accent shrink-0">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider leading-none">Level</span>
                      <span className="text-sm font-mono font-bold text-accent animate-hud-shimmer" style={{ animationDelay: "1s" }}>
                        {level}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Landing page — nav link + Join on the right only */
          <div className="flex items-center gap-3">
            {navLinkButton}

            {/* Mobile Join CTA */}
            <button
              onClick={scrollToWaitlist}
              className="md:hidden relative overflow-hidden rounded-lg bg-accent/10 border border-accent/30 text-accent px-4 py-2 font-black uppercase tracking-widest text-[10px] transition-all hover:bg-accent hover:text-white cursor-pointer"
            >
              Join
            </button>

            {/* Desktop Join CTA */}
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
          </div>
        )}
      </div>

      {/* Mobile HUD — below nav bar, only on mobile when HUD is active */}
      {showHUD && (
        <div className="md:hidden flex items-center justify-center gap-1 px-3 pb-2">
          <div className="flex items-center bg-surface/60 backdrop-blur-xl rounded-lg border border-white/10 w-full">
            {/* Credits */}
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2 border-r border-white/10">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-vault-gold shrink-0">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5s-2 .5-2 1.5 1 1.5 2 2 2 1 2 2-1 1.5-2 1.5-2-.5-2.5-1.5M12 7v1m0 8v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] font-mono font-bold text-vault-gold">${balance.toLocaleString()}</span>
            </div>

            {/* Loot */}
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2 border-r border-white/10">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-neon-cyan shrink-0">
                <path d="M21 8V21H3V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M23 3H1V8H23V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[10px] font-mono font-bold text-neon-cyan">{inventoryCount}</span>
            </div>

            {/* Level */}
            {level !== undefined && (
              <div className="flex-1 flex items-center justify-center gap-1.5 py-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-accent shrink-0">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[10px] font-mono font-bold text-accent">Lv.{level}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.nav>
  );
}
