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
    <Link to={to} className="pushable" onClick={handleClick}>
      <span className="pushable-shadow" />
      <span className="pushable-edge" />
      <span className="pushable-front">OPEN NOW</span>
    </Link>
  );
}
