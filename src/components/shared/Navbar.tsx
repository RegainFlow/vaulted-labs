import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { trackEvent, AnalyticsEvents } from "../../lib/analytics";
import { isFeatureUnlocked } from "../../lib/unlocks";
import { LockedOverlay } from "./LockedOverlay";
import type { NavbarProps } from "../../types/landing";

export function Navbar({
  showHUD = false,
  balance = 0,
  xp = 0,
  level = 0,
  cashoutFlashTimestamp = 0,
  bossEnergy = 0,
  maxBossEnergy = 5,
  hideDock = false,
  tutorialActive = false
}: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLockerLocked, setShowLockerLocked] = useState(false);

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

    navigate("/", { state: { scrollToWaitlist: true } });
  };

  const isVaultsRoute = useMemo(
    () => location.pathname.startsWith("/vaults") || location.pathname === "/open",
    [location.pathname]
  );
  const isWalletRoute = useMemo(
    () => location.pathname.startsWith("/wallet"),
    [location.pathname]
  );
  const isLockerRoute = useMemo(
    () =>
      location.pathname.startsWith("/locker") ||
      location.pathname.startsWith("/arena") ||
      location.pathname === "/collection",
    [location.pathname]
  );

  const dockLinkClass = (isActive: boolean) =>
    `flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-lg border transition-all cursor-pointer ${
      isActive
        ? "bg-accent/15 border-accent/40 text-accent"
        : "bg-transparent border-transparent text-text-muted hover:text-white"
    }`;

  const handleDockClick = (target: "wallet" | "vaults" | "locker") => {
    if (target === "locker") {
      if (!isFeatureUnlocked("locker", xp)) {
        trackEvent(AnalyticsEvents.FEATURE_LOCKED_CLICKED, { featureKey: "locker" });
        setShowLockerLocked(true);
        return;
      }
      trackEvent(AnalyticsEvents.CTA_CLICK, { cta_name: "locker", location: "dock" });
      navigate("/locker/inventory");
      return;
    }

    if (target === "wallet") {
      trackEvent(AnalyticsEvents.CTA_CLICK, { cta_name: "wallet", location: "dock" });
      navigate("/wallet");
      return;
    }

    trackEvent(AnalyticsEvents.CTA_CLICK, { cta_name: "vaults", location: "dock" });
    trackEvent(AnalyticsEvents.PLAY_CLICK);
    navigate("/vaults");
  };

  const dockButtons = (
    <>
      <button
        type="button"
        onClick={() => handleDockClick("wallet")}
        className={dockLinkClass(isWalletRoute)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="16" cy="12" r="1.6" fill="currentColor" />
        </svg>
        <span className="text-[9px] font-black uppercase tracking-wider">Wallet</span>
      </button>

      <button
        type="button"
        onClick={() => handleDockClick("vaults")}
        className={dockLinkClass(isVaultsRoute)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M4 7h16v10H4z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 11h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="text-[9px] font-black uppercase tracking-wider">Vaults</span>
      </button>

      <button
        type="button"
        onClick={() => handleDockClick("locker")}
        className={dockLinkClass(isLockerRoute)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 11h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="text-[9px] font-black uppercase tracking-wider">Locker</span>
      </button>
    </>
  );

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
              <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-dim">
                  Credits
                </span>
                <span
                  key={cashoutFlashTimestamp}
                  className={`text-[11px] font-mono font-bold text-vault-gold ${cashoutFlashTimestamp ? "animate-balance-flash" : ""}`}
                >
                  ${balance.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-dim">
                  Energy
                </span>
                <span className="text-[11px] font-mono font-bold text-neon-green">
                  {bossEnergy}/{maxBossEnergy}
                </span>
              </div>

              <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-dim">
                  XP
                </span>
                <span className="text-[11px] font-mono font-bold text-accent">
                  {xp} · Lv {level}
                </span>
              </div>
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
            <div className="grid grid-cols-3 gap-1.5 w-full rounded-lg border border-white/10 bg-surface/65 p-1.5">
              <div className="rounded-md px-2 py-1.5 text-center">
                <p className="text-[8px] font-bold uppercase tracking-wider text-text-dim">
                  Credits
                </p>
                <p
                  key={cashoutFlashTimestamp}
                  className={`text-[10px] font-mono font-bold text-vault-gold ${cashoutFlashTimestamp ? "animate-balance-flash" : ""}`}
                >
                  ${balance.toLocaleString()}
                </p>
              </div>

              <div className="rounded-md px-2 py-1.5 text-center">
                <p className="text-[8px] font-bold uppercase tracking-wider text-text-dim">
                  Energy
                </p>
                <p className="text-[10px] font-mono font-bold text-neon-green">
                  {bossEnergy}/{maxBossEnergy}
                </p>
              </div>

              <div className="rounded-md px-2 py-1.5 text-center">
                <p className="text-[8px] font-bold uppercase tracking-wider text-text-dim">
                  XP / Lv
                </p>
                <p className="text-[10px] font-mono font-bold text-accent">
                  {xp} / {level}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.nav>

      {showHUD && !hideDock && !tutorialActive && (
        <>
          <div
            className="fixed bottom-0 left-0 right-0 z-[45] sm:hidden"
            data-tutorial="dashboard-nav-mobile"
          >
            <div className="flex items-center gap-1 border-t border-white/15 bg-surface/95 backdrop-blur-xl px-2 py-2 shadow-[0_-10px_20px_rgba(0,0,0,0.35)]">
              {dockButtons}
            </div>
          </div>
          <div className="hidden sm:block fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl z-[45]">
            <div className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-surface/90 backdrop-blur-xl p-1.5 shadow-[0_0_24px_rgba(0,0,0,0.45)]">
              {dockButtons}
            </div>
          </div>
        </>
      )}

      <LockedOverlay
        isOpen={showLockerLocked}
        featureKey="locker"
        xp={xp}
        onClose={() => setShowLockerLocked(false)}
      />
    </>
  );
}
