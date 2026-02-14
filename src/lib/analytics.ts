import { posthog, isPostHogEnabled } from "./posthog";

export const AnalyticsEvents = {
  CTA_CLICK: "cta_click",
  PLAY_CLICK: "play_click",
  WAITLIST_SUBMIT: "waitlist_submit",
  WAITLIST_SUBMIT_SUCCESS: "waitlist_submit_success",
  WAITLIST_SUBMIT_ERROR: "waitlist_submit_error",
  VAULT_OVERLAY_OPENED: "vault_overlay_opened",
  VAULT_OVERLAY_CLOSED: "vault_overlay_closed",
  VAULT_OPENED: "vault_opened",
  VAULT_RESULT: "vault_result",
  ITEM_ACTION: "item_action",
  TAB_SWITCH: "tab_switch",
  MARKETPLACE_BUY: "marketplace_buy",
  AUCTION_BID: "auction_bid",
  QUEST_COMPLETED: "quest_completed",
  TUTORIAL_STARTED: "tutorial_started",
  TUTORIAL_STEP_COMPLETED: "tutorial_step_completed",
  TUTORIAL_COMPLETED: "tutorial_completed",
} as const;

export function trackEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  if (!isPostHogEnabled) return;
  posthog.capture(event, properties);
}

export function trackPageView(url: string) {
  if (!isPostHogEnabled) return;
  posthog.capture("$pageview", { $current_url: url });
}
