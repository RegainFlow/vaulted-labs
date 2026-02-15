import { trackEvent } from "../lib/analytics";

const FEEDBACK_PREFILL_URL = import.meta.env.VITE_FEEDBACK_FORM_PREFILL_URL as
  | string
  | undefined;
const FEEDBACK_ENTRY_PAGE_URL = import.meta.env.VITE_FEEDBACK_ENTRY_PAGE_URL as
  | string
  | undefined;
const FEEDBACK_ENTRY_UTM = import.meta.env.VITE_FEEDBACK_ENTRY_UTM as
  | string
  | undefined;

interface FeedbackButtonProps {
  className?: string;
  label?: string;
}

function getUtmParams(): string {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content"
  ];
  return utmKeys
    .map((key) => params.get(key))
    .filter(Boolean)
    .join(",");
}

function buildFeedbackUrl(): string | null {
  if (!FEEDBACK_PREFILL_URL) return null;

  const url = new URL(FEEDBACK_PREFILL_URL);

  if (FEEDBACK_ENTRY_PAGE_URL) {
    url.searchParams.set(FEEDBACK_ENTRY_PAGE_URL, window.location.href);
  }

  const utm = getUtmParams();
  if (FEEDBACK_ENTRY_UTM && utm) {
    url.searchParams.set(FEEDBACK_ENTRY_UTM, utm);
  }

  return url.toString();
}

export function FeedbackButton({
  className,
  label = "Give Feedback"
}: FeedbackButtonProps) {
  const feedbackUrl = buildFeedbackUrl();
  if (!feedbackUrl) return null;

  const handleClick = () => {
    trackEvent("feedback_button_click", { page: window.location.pathname });
    window.open(feedbackUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {label}
    </button>
  );
}
