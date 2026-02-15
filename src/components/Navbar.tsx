import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { trackEvent, AnalyticsEvents } from "../lib/analytics";

interface NavbarProps {
  showHUD?: boolean;
  balance?: number;
  inventoryCount?: number;
  xp?: number;
  level?: number;
}

export function Navbar({
  showHUD = false,
  balance = 0,
  inventoryCount = 0,
  level
}: NavbarProps) {
  const location = useLocation();

  const scrollToWaitlist = () => {
    trackEvent(AnalyticsEvents.CTA_CLICK, {
      cta_name: "join_waitlist",
      location: "navbar"
    });
    document
      .getElementById("waitlist-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `group relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-all duration-300 cursor-pointer ${
      isActive(path)
        ? "text-accent bg-accent/10 border border-accent/30"
        : "text-white bg-surface-elevated border border-white/15 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(255,45,149,0.15)]"
    }`;

  const handleNavClick = (label: string) => {
    trackEvent(AnalyticsEvents.CTA_CLICK, {
      cta_name: label,
      location: "navbar"
    });
    if (label === "Play") {
      trackEvent(AnalyticsEvents.PLAY_CLICK);
    }
  };

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
        <div className="shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg sm:text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">
              Vaulted<span className="text-accent text-glow-magenta">Labs</span>
            </span>
          </Link>
        </div>

        {/* Center: Nav links — always visible on HUD pages */}
        {showHUD && (
          <div className="flex items-center gap-2 sm:gap-2.5 relative z-10">
            <Link
              to="/play"
              onClick={() => handleNavClick("Play")}
              className={navLinkClass("/play")}
            >
              Play
            </Link>
            <Link
              to="/shop"
              onClick={() => handleNavClick("Shop")}
              className={navLinkClass("/shop")}
            >
              Shop
            </Link>
          </div>
        )}

        {/* Right side */}
        {showHUD ? (
          <>
            {/* Desktop: HUD — clickable links */}
            <div
              className="relative shrink-0 hidden md:block"
              data-tutorial="hud-desktop"
            >
              <div className="relative flex items-center bg-surface/80 backdrop-blur-xl rounded-xl border border-white/10">
                {/* Credits → Wallet */}
                <Link
                  to="/wallet"
                  aria-label="View wallet"
                  className={`flex items-center gap-2.5 px-4 py-2.5 border-r border-white/10 transition-colors hover:bg-white/5 rounded-l-xl ${isActive("/wallet") ? "bg-white/5" : ""}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-vault-gold shrink-0"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5s-2 .5-2 1.5 1 1.5 2 2 2 1 2 2-1 1.5-2 1.5-2-.5-2.5-1.5M12 7v1m0 8v1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider leading-none">
                      Credits
                    </span>
                    <span className="text-sm font-mono font-bold text-vault-gold animate-hud-shimmer">
                      ${balance.toLocaleString()}
                    </span>
                  </div>
                </Link>

                {/* Loot → Inventory */}
                <Link
                  to="/inventory"
                  aria-label="View inventory"
                  className={`flex items-center gap-2.5 px-4 py-2.5 border-r border-white/10 transition-colors hover:bg-white/5 ${isActive("/inventory") ? "bg-white/5" : ""}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-neon-cyan shrink-0"
                  >
                    <path
                      d="M21 8V21H3V8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M23 3H1V8H23V3Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 12H14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider leading-none">
                      Loot
                    </span>
                    <span
                      className="text-sm font-mono font-bold text-neon-cyan animate-hud-shimmer"
                      style={{ animationDelay: "0.5s" }}
                    >
                      {inventoryCount}
                    </span>
                  </div>
                </Link>

                {/* Level → Profile */}
                {level !== undefined && (
                  <Link
                    to="/profile"
                    aria-label="View profile"
                    className={`flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-white/5 rounded-r-xl ${isActive("/profile") ? "bg-white/5" : ""}`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-accent shrink-0"
                    >
                      <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider leading-none">
                        Level
                      </span>
                      <span
                        className="text-sm font-mono font-bold text-accent animate-hud-shimmer"
                        style={{ animationDelay: "1s" }}
                      >
                        {level}
                      </span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Landing page — Play + Shop + Join on the right */
          <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 relative z-10">
            <Link
              to="/play"
              onClick={() => handleNavClick("Play")}
              className={navLinkClass("/play")}
            >
              Play
            </Link>
            <Link
              to="/shop"
              onClick={() => handleNavClick("Shop")}
              className={navLinkClass("/shop")}
            >
              Shop
            </Link>

            {/* Mobile Join CTA */}
            <button
              onClick={scrollToWaitlist}
              className="md:hidden relative overflow-hidden rounded-lg bg-accent/10 border border-accent/30 text-accent px-3 py-1.5 font-black uppercase tracking-widest text-[10px] transition-all hover:bg-accent hover:text-white cursor-pointer"
            >
              Join
            </button>

            {/* Desktop Join CTA */}
            <button
              onClick={scrollToWaitlist}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-accent bg-surface/80 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-accent/10 transition-all cursor-pointer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Join</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile HUD — below nav bar, clickable */}
      {showHUD && (
        <div
          className="md:hidden flex items-center justify-center gap-1 px-3 pb-2"
          data-tutorial="hud"
        >
          <div className="flex items-center bg-surface/60 backdrop-blur-xl rounded-lg border border-white/10 w-full">
            {/* Credits → Wallet */}
            <Link
              to="/wallet"
              aria-label="View wallet"
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 border-r border-white/10 transition-colors ${isActive("/wallet") ? "bg-white/5" : ""}`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                className="text-vault-gold shrink-0"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5s-2 .5-2 1.5 1 1.5 2 2 2 1 2 2-1 1.5-2 1.5-2-.5-2.5-1.5M12 7v1m0 8v1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-[10px] font-mono font-bold text-vault-gold">
                ${balance.toLocaleString()}
              </span>
            </Link>

            {/* Loot → Inventory */}
            <Link
              to="/inventory"
              aria-label="View inventory"
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 border-r border-white/10 transition-colors ${isActive("/inventory") ? "bg-white/5" : ""}`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                className="text-neon-cyan shrink-0"
              >
                <path
                  d="M21 8V21H3V8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23 3H1V8H23V3Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 12H14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[10px] font-mono font-bold text-neon-cyan">
                {inventoryCount}
              </span>
            </Link>

            {/* Level → Profile */}
            {level !== undefined && (
              <Link
                to="/profile"
                aria-label="View profile"
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors ${isActive("/profile") ? "bg-white/5" : ""}`}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-accent shrink-0"
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[10px] font-mono font-bold text-accent">
                  Lv.{level}
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
    </motion.nav>
  );
}
