import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { trackEvent, AnalyticsEvents } from "../../lib/analytics";
import { isFeatureUnlocked } from "../../lib/unlocks";
import { LockedOverlay } from "./LockedOverlay";
import type { NavbarProps } from "../../types/landing";

const HUD_TOOLTIPS: Record<string, { title: string; text: string; color: string; borderColor: string }> = {
  credits: {
    title: "Credits",
    text: "Earned from cashouts, reveals, and rewards. Spend them on vaults and marketplace purchases.",
    color: "text-vault-gold",
    borderColor: "border-l-vault-gold"
  },
  shards: {
    title: "Shards & Free Spins",
    text: "Shards drop from boss battles. Collect 7 to convert into a Free Spin. Free Spins let you open vaults without spending credits.",
    color: "text-rarity-rare",
    borderColor: "border-l-rarity-rare"
  },
  level: {
    title: "Level",
    text: "Earn XP by opening vaults, winning battles, and completing quests. Level up to unlock new features.",
    color: "text-accent",
    borderColor: "border-l-accent"
  }
};

type HudTooltipKey = keyof typeof HUD_TOOLTIPS;

export function Navbar({
  showHUD = false,
  balance = 0,
  xp = 0,
  level = 0,
  cashoutFlashTimestamp = 0,
  shards = 0,
  freeSpins = 0,
  hideDock = false,
  tutorialActive = false
}: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLockerLocked, setShowLockerLocked] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<HudTooltipKey | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const toggleTooltip = useCallback((key: HudTooltipKey) => {
    setActiveTooltip((prev) => (prev === key ? null : key));
  }, []);

  useEffect(() => {
    if (!activeTooltip) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setActiveTooltip(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeTooltip]);

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

  const DOCK_COLORS = {
    wallet: { active: "bg-vault-gold/15 border-vault-gold/40 text-vault-gold", hover: "hover:text-vault-gold" },
    vaults: { active: "bg-accent/15 border-accent/40 text-accent", hover: "hover:text-accent" },
    locker: { active: "bg-neon-cyan/15 border-neon-cyan/40 text-neon-cyan", hover: "hover:text-neon-cyan" }
  } as const;

  const dockLinkClass = (isActive: boolean, route: "wallet" | "vaults" | "locker") =>
    `flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-lg border transition-all cursor-pointer ${
      isActive
        ? DOCK_COLORS[route].active
        : `bg-transparent border-transparent text-text-muted ${DOCK_COLORS[route].hover}`
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
        className={dockLinkClass(isWalletRoute, "wallet")}
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
        className={dockLinkClass(isVaultsRoute, "vaults")}
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
        className={dockLinkClass(isLockerRoute, "locker")}
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
              className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-surface/70 px-2 py-1.5 relative"
              data-tutorial="hud-desktop"
              ref={tooltipRef}
            >
              <button
                type="button"
                onClick={() => toggleTooltip("credits")}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 hover:bg-white/5 transition-colors cursor-pointer"
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
              </button>

              <button
                type="button"
                onClick={() => toggleTooltip("shards")}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-rarity-rare shrink-0">
                  <path d="M12 2L4 12l8 10 8-10L12 2z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <span className="text-[11px] font-mono font-bold text-rarity-rare">{shards}</span>
                <span className="text-text-dim text-[9px]">/</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-vault-gold shrink-0">
                  <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8 2.4-7.2-6-4.8h7.6z" fill="currentColor" />
                </svg>
                <span className="text-[11px] font-mono font-bold text-vault-gold">{freeSpins}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleTooltip("level")}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-accent shrink-0">
                  <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8 2.4-7.2-6-4.8h7.6z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
                </svg>
                <span className="text-[11px] font-mono font-bold text-accent">
                  Lv {level}
                </span>
              </button>

              <AnimatePresence>
                {activeTooltip && (() => {
                  const tip = HUD_TOOLTIPS[activeTooltip];
                  return (
                    <motion.div
                      key={activeTooltip}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-surface-elevated border border-white/10 border-l-2 ${tip.borderColor} rounded-lg px-3.5 py-3 max-w-[240px] z-[60] shadow-[0_8px_32px_rgba(0,0,0,0.5)]`}
                    >
                      <p className={`text-[10px] font-black uppercase tracking-wider ${tip.color} mb-1`}>{tip.title}</p>
                      <p className="text-[11px] text-text-muted leading-relaxed">{tip.text}</p>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
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
              <button
                type="button"
                onClick={() => toggleTooltip("credits")}
                className="rounded-md px-2 py-1.5 text-center hover:bg-white/5 transition-colors cursor-pointer"
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
              </button>

              <button
                type="button"
                onClick={() => toggleTooltip("shards")}
                className="rounded-md px-2 py-1.5 text-center hover:bg-white/5 transition-colors cursor-pointer"
              >
                <p className="text-[8px] font-bold uppercase tracking-wider text-text-dim">
                  Shards / Spins
                </p>
                <p className="text-[10px] font-mono font-bold">
                  <span className="text-rarity-rare">{shards}</span>
                  <span className="text-text-dim"> / </span>
                  <span className="text-vault-gold">{freeSpins}</span>
                </p>
              </button>

              <button
                type="button"
                onClick={() => toggleTooltip("level")}
                className="rounded-md px-2 py-1.5 text-center hover:bg-white/5 transition-colors cursor-pointer"
              >
                <p className="text-[8px] font-bold uppercase tracking-wider text-text-dim">
                  Level
                </p>
                <p className="text-[10px] font-mono font-bold text-accent">
                  Lv {level}
                </p>
              </button>
            </div>

            <AnimatePresence>
              {activeTooltip && (() => {
                const tip = HUD_TOOLTIPS[activeTooltip];
                return (
                  <motion.div
                    key={`mobile-${activeTooltip}`}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-surface-elevated border border-white/10 border-l-2 ${tip.borderColor} rounded-lg px-3.5 py-3 max-w-[240px] z-[60] shadow-[0_8px_32px_rgba(0,0,0,0.5)]`}
                  >
                    <p className={`text-[10px] font-black uppercase tracking-wider ${tip.color} mb-1`}>{tip.title}</p>
                    <p className="text-[11px] text-text-muted leading-relaxed">{tip.text}</p>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
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
