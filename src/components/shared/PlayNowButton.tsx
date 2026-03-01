import { Link } from "react-router-dom";
import { trackEvent, AnalyticsEvents } from "../../lib/analytics";

interface PlayNowButtonProps {
  to?: string;
  location?: string;
}

export function PlayNowButton({ to = "/vaults", location }: PlayNowButtonProps) {
  const handleClick = () => {
    trackEvent(AnalyticsEvents.CTA_CLICK, { cta_name: "open_now", location });
    trackEvent(AnalyticsEvents.PLAY_CLICK);
  };

  return (
    <Link
      to={to}
      state={to === "/vaults" ? { skipOpenTutorial: true } : undefined}
      className="command-button min-w-[182px] px-6 py-3 text-[11px] font-black uppercase tracking-[0.24em] sm:min-w-[210px] sm:px-8 sm:py-4 sm:text-xs"
      onClick={handleClick}
    >
      Open Vault
    </Link>
  );
}
