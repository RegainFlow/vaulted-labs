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

interface TooltipAnchor {
  top: number;
  left: number;
}

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
  const [tooltipAnchor, setTooltipAnchor] = useState<TooltipAnchor | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const tooltipTargetRef = useRef<HTMLElement | null>(null);

  const toggleTooltip = useCallback((key: HudTooltipKey, element: HTMLElement) => {
    setActiveTooltip((prev) => {
      if (prev === key) {
        tooltipTargetRef.current = null;
        setTooltipAnchor(null);
        return null;
      }

      tooltipTargetRef.current = element;
      const rect = element.getBoundingClientRect();
      setTooltipAnchor({
        top: rect.bottom + 18,
        left: rect.left + rect.width / 2,
      });
      return key;
    });
  }, []);

  useEffect(() => {
    if (!activeTooltip) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setActiveTooltip(null);
        setTooltipAnchor(null);
        tooltipTargetRef.current = null;
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeTooltip]);

  useEffect(() => {
    if (!activeTooltip) return;

    const updateAnchor = () => {
      const element = tooltipTargetRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      setTooltipAnchor({
        top: rect.bottom + 18,
        left: rect.left + rect.width / 2,
      });
    };

    updateAnchor();
    window.addEventListener("resize", updateAnchor);
    window.addEventListener("scroll", updateAnchor, true);
    return () => {
      window.removeEventListener("resize", updateAnchor);
      window.removeEventListener("scroll", updateAnchor, true);
    };
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
    wallet: { active: "border-vault-gold/35 text-vault-gold bg-vault-gold/[0.08]", hover: "hover:text-vault-gold" },
    vaults: { active: "border-accent/35 text-white bg-accent/[0.10]", hover: "hover:text-white" },
    locker: { active: "border-white/14 text-white bg-white/[0.06]", hover: "hover:text-accent" }
  } as const;

  const dockLinkClass = (isActive: boolean, route: "wallet" | "vaults" | "locker") =>
    `command-segment flex-1 flex flex-col items-center justify-center gap-1 py-3 ${
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
      <div ref={tooltipRef}>
        <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/6 bg-bg/92 backdrop-blur-xl shadow-[0_18px_42px_rgba(0,0,0,0.32)]"
      >
        <div
          className={`relative flex h-16 md:h-20 items-center px-4 md:px-6 ${
            showHUD ? "justify-center md:justify-between" : "justify-between"
          }`}
        >
          <div
            className={
              showHUD ? "w-full md:w-auto flex justify-center md:block" : "shrink-0"
            }
          >
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl md:text-2xl font-black tracking-[0.08em] text-white uppercase">
                Vaulted
                <span
                  className="ml-1 text-accent"
                  style={{ textShadow: "0 0 18px rgba(255,45,149,0.32)" }}
                >
                  Labs
                </span>
              </span>
            </Link>
          </div>

          {showHUD ? (
            <div
              className="system-rail relative hidden items-center gap-2 px-2.5 py-2 md:flex"
              data-tutorial="hud-desktop"
            >
              <button
                type="button"
                onClick={(event) => toggleTooltip("credits", event.currentTarget)}
                className="command-segment flex items-center gap-1.5 px-3 py-2 cursor-pointer"
              >
                <span className="system-kicker">
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
                onClick={(event) => toggleTooltip("shards", event.currentTarget)}
                className="command-segment flex items-center gap-1.5 px-3 py-2 cursor-pointer"
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
                onClick={(event) => toggleTooltip("level", event.currentTarget)}
                className="command-segment flex items-center gap-1.5 px-3 py-2 cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-accent shrink-0">
                  <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8 2.4-7.2-6-4.8h7.6z" fill="currentColor" stroke="currentColor" strokeWidth="1" />
                </svg>
                <span className="text-[11px] font-mono font-bold text-accent">
                  Lv {level}
                </span>
              </button>

            </div>
          ) : (
            <button
              onClick={scrollToWaitlist}
              className="system-rail relative overflow-hidden border-accent/30 px-4 py-2 font-black uppercase tracking-[0.28em] text-[10px] text-accent transition-all hover:text-white cursor-pointer"
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
            <div className="system-rail grid w-full grid-cols-3 gap-1.5 p-1.5">
              <button
                type="button"
                onClick={(event) => toggleTooltip("credits", event.currentTarget)}
                className="command-segment px-2 py-1.5 text-center cursor-pointer"
              >
                <p className="system-kicker">
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
                onClick={(event) => toggleTooltip("shards", event.currentTarget)}
                className="command-segment px-2 py-1.5 text-center cursor-pointer"
              >
                <p className="system-kicker">
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
                onClick={(event) => toggleTooltip("level", event.currentTarget)}
                className="command-segment px-2 py-1.5 text-center cursor-pointer"
              >
                <p className="system-kicker">
                  Level
                </p>
                <p className="text-[10px] font-mono font-bold text-accent">
                  Lv {level}
                </p>
              </button>
            </div>

          </div>
        )}
      </motion.nav>
        <AnimatePresence>
          {activeTooltip && tooltipAnchor && (() => {
            const tip = HUD_TOOLTIPS[activeTooltip];
            const viewportWidth =
              typeof window !== "undefined" ? window.innerWidth : 1280;
            const tooltipWidth = Math.min(
              viewportWidth - 24,
              viewportWidth < 640 ? 260 : 320
            );
            const left = Math.max(
              12,
              Math.min(
                tooltipAnchor.left - tooltipWidth / 2,
                viewportWidth - tooltipWidth - 12
              )
            );

            return (
              <motion.div
                key={`hud-tooltip-${activeTooltip}`}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.16 }}
                className={`fixed z-[80] ${tip.borderColor}`}
                style={{
                  top: tooltipAnchor.top,
                  left,
                  width: tooltipWidth,
                }}
              >
                <div className="pointer-events-none absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-white/10 bg-[#080d1b]/96 shadow-[0_0_24px_rgba(255,45,149,0.12)]" />
                <div className="module-card relative border-l-2 px-3.5 py-3">
                  <p className={`mb-1 text-[10px] font-black uppercase tracking-wider ${tip.color}`}>
                    {tip.title}
                  </p>
                  <p className="text-[11px] leading-relaxed text-text-muted">{tip.text}</p>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>

      {showHUD && !hideDock && !tutorialActive && (
        <>
          <div
            className="fixed bottom-0 left-0 right-0 z-[45] sm:hidden"
            data-tutorial="dashboard-nav-mobile"
          >
            <div className="system-rail flex items-center gap-1 rounded-none border-x-0 border-b-0 px-2 py-2">
              {dockButtons}
            </div>
          </div>
          <div className="hidden sm:block fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl z-[45]">
            <div className="system-rail flex items-center gap-1.5 p-1.5">
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
