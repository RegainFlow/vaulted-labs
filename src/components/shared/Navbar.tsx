import { motion } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { trackEvent, AnalyticsEvents } from "../../lib/analytics";
import type { NavbarProps } from "../../types/landing";

export function Navbar({
  showHUD = false,
  balance = 0,
  level,
  prestigeLevel = 0,
  freeSpins = 0,
  cashoutFlashTimestamp = 0,
  bossEnergy = 0,
  maxBossEnergy = 5,
  shards = 0,
  hideDock = false
}: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (label: string) => {
    trackEvent(AnalyticsEvents.CTA_CLICK, {
      cta_name: label,
      location: "navbar"
    });

    if (label === "Open") {
      trackEvent(AnalyticsEvents.PLAY_CLICK);
    }
  };

  const scrollToWaitlist = () => {
    trackEvent(AnalyticsEvents.CTA_CLICK, {
      cta_name: "join_waitlist",
      location: "navbar"
    });

    const waitlist = document.getElementById("waitlist-form");
    if (waitlist) {
      waitlist.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    navigate("/", { state: { scrollToWaitlist: true, sourcePath: location.pathname } });
  };

  const dockLinkClass = (path: string) =>
    `flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg border transition-all ${
      isActive(path)
        ? "bg-accent/15 border-accent/40 text-accent"
        : "bg-transparent border-transparent text-text-muted hover:text-white"
    }`;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-bg/90 border-b border-white/5"
      >
        <div
          className={`flex h-14 md:h-20 items-center px-4 md:px-6 relative ${
            showHUD ? "justify-center md:justify-between" : "justify-between"
          }`}
        >
          <div
            className={
              showHUD ? "w-full md:w-auto flex justify-center md:block" : "shrink-0"
            }
          >
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl md:text-2xl font-black tracking-tighter text-white uppercase italic">
                Vaulted
                <span className="text-accent text-glow-magenta">Labs</span>
              </span>
            </Link>
          </div>

          {showHUD ? (
            <div
              className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-surface/70 px-2 py-1.5"
              data-tutorial="hud-desktop"
            >
              <Link
                to="/wallet"
                aria-label="View wallet"
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors ${
                  isActive("/wallet") ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-dim">
                  Credits
                </span>
                <span
                  key={cashoutFlashTimestamp}
                  className={`text-[11px] font-mono font-bold text-vault-gold ${cashoutFlashTimestamp ? "animate-balance-flash" : ""}`}
                >
                  ${balance.toLocaleString()}
                </span>
              </Link>

              <Link
                to="/arena"
                aria-label="View arena"
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors ${
                  isActive("/arena") ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-dim">
                  Energy
                </span>
                <span className="text-[11px] font-mono font-bold text-neon-green">
                  {bossEnergy}/{maxBossEnergy}
                </span>
              </Link>

              <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-dim">
                  Shards
                </span>
                <span className="text-[11px] font-mono font-bold text-rarity-rare">
                  {shards}
                </span>
              </div>

              {level !== undefined && (
                <Link
                  to="/arena"
                  aria-label="View rank"
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors ${
                    isActive("/arena") ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <span className="text-[9px] font-bold uppercase tracking-wider text-text-dim">
                    Level
                  </span>
                  <span className="text-[11px] font-mono font-bold text-accent flex items-center gap-1">
                    {level}
                    {prestigeLevel > 0 && (
                      <span className="flex gap-0.5">
                        {Array.from({ length: prestigeLevel }).map((_, index) => (
                          <span key={index} className="text-vault-gold text-[9px]">
                            &#9733;
                          </span>
                        ))}
                      </span>
                    )}
                  </span>
                </Link>
              )}

              {freeSpins > 0 && (
                <Link
                  to="/open"
                  aria-label="Use free spins"
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors ${
                    isActive("/open") ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <span className="text-[9px] font-bold uppercase tracking-wider text-text-dim">
                    Spins
                  </span>
                  <span className="text-[11px] font-mono font-bold text-vault-gold">
                    {freeSpins}
                  </span>
                </Link>
              )}
            </div>
          ) : (
            <button
              onClick={scrollToWaitlist}
              className="relative overflow-hidden rounded-lg bg-accent/10 border border-accent/30 text-accent px-4 py-2 font-black uppercase tracking-widest text-[10px] transition-all hover:bg-accent hover:text-white cursor-pointer"
            >
              Join
            </button>
          )}
        </div>

        {showHUD && (
          <div
            className="md:hidden flex items-center justify-center gap-1 px-3 pb-2"
            data-tutorial="hud"
          >
            <div className="grid grid-cols-4 gap-1.5 w-full rounded-lg border border-white/10 bg-surface/65 p-1.5">
              <Link
                to="/wallet"
                aria-label="View wallet"
                className={`rounded-md px-2 py-1.5 text-center transition-colors ${
                  isActive("/wallet") ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <p className="text-[8px] font-bold uppercase tracking-wider text-text-dim">
                  Credits
                </p>
                <p
                  key={cashoutFlashTimestamp}
                  className={`text-[10px] font-mono font-bold text-vault-gold ${cashoutFlashTimestamp ? "animate-balance-flash" : ""}`}
                >
                  ${balance.toLocaleString()}
                </p>
              </Link>

              <Link
                to="/arena"
                aria-label="View arena energy"
                className={`rounded-md px-2 py-1.5 text-center transition-colors ${
                  isActive("/arena") ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <p className="text-[8px] font-bold uppercase tracking-wider text-text-dim">
                  Energy
                </p>
                <p className="text-[10px] font-mono font-bold text-neon-green">
                  {bossEnergy}
                </p>
              </Link>

              <div className="rounded-md px-2 py-1.5 text-center">
                <p className="text-[8px] font-bold uppercase tracking-wider text-text-dim">
                  Shards
                </p>
                <p className="text-[10px] font-mono font-bold text-rarity-rare">
                  {shards}
                </p>
              </div>

              <Link
                to="/arena"
                aria-label="View level"
                className={`rounded-md px-2 py-1.5 text-center transition-colors ${
                  isActive("/arena") ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <p className="text-[8px] font-bold uppercase tracking-wider text-text-dim">
                  Level
                </p>
                <p className="text-[10px] font-mono font-bold text-accent">
                  {level ?? 0}
                </p>
              </Link>
            </div>
          </div>
        )}
      </motion.nav>

      {showHUD && !hideDock && (
        <div
          className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl z-[45]"
          data-tutorial="dashboard-nav-mobile"
        >
          <div className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-surface/90 backdrop-blur-xl p-1.5 shadow-[0_0_24px_rgba(0,0,0,0.45)]">
            <Link
              to="/open"
              onClick={() => handleNavClick("Open")}
              className={dockLinkClass("/open")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M4 7h16v10H4z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M9 11h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="text-[9px] font-black uppercase tracking-wider">Open</span>
            </Link>

            <Link
              to="/collection"
              onClick={() => handleNavClick("Collection")}
              className={dockLinkClass("/collection")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.6" />
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.6" />
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.6" />
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <span className="text-[9px] font-black uppercase tracking-wider">
                Collection
              </span>
            </Link>

            <Link
              to="/arena"
              onClick={() => handleNavClick("Arena")}
              className={dockLinkClass("/arena")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[9px] font-black uppercase tracking-wider">Arena</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
