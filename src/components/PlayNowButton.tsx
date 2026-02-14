import { Link } from "react-router-dom";
import { trackEvent, AnalyticsEvents } from "../lib/analytics";

interface PlayNowButtonProps {
  to?: string;
  location?: string;
}

export function PlayNowButton({ to = "/play", location }: PlayNowButtonProps) {
  const handleClick = () => {
    trackEvent(AnalyticsEvents.CTA_CLICK, { cta_name: "play_now", location });
    trackEvent(AnalyticsEvents.PLAY_CLICK);
  };

  return (
    <Link to={to} className="pushable" onClick={handleClick}>
      <span className="pushable-shadow" />
      <span className="pushable-edge" />
      <span className="pushable-front">
        PLAY NOW
      </span>
    </Link>
  );
}
