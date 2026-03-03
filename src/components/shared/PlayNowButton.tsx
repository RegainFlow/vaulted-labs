import { trackEvent, AnalyticsEvents } from "../../lib/analytics";
import { ArcadeButton } from "./ArcadeButton";

interface PlayNowButtonProps {
  to?: string;
  location?: string;
  size?: "hero" | "primary";
  showIcon?: boolean;
}

export function PlayNowButton({
  to = "/vaults",
  location,
  size = "primary",
}: PlayNowButtonProps) {
  const handleClick = () => {
    trackEvent(AnalyticsEvents.CTA_CLICK, { cta_name: "open_now", location });
    trackEvent(AnalyticsEvents.PLAY_CLICK);
  };

  return (
    <ArcadeButton
      as="link"
      to={to}
      state={to === "/vaults" ? { skipOpenTutorial: true } : undefined}
      onClick={handleClick}
      size={size}
      tone="accent"
      fillMode="sweep"
      className={
        size === "hero"
          ? "min-w-[220px] sm:min-w-[260px]"
          : "min-w-[188px] sm:min-w-[214px]"
      }
    >
      Open Vault
    </ArcadeButton>
  );
}
