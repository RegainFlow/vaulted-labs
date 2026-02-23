import posthog, { isPostHogEnabled } from "./posthog";

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
  BONUS_SPIN_TRIGGERED: "bonus_spin_triggered",
  VAULT_LOCK_COMPLETE: "vault_lock_complete",
  FREE_SPIN_USED: "free_spin_used",
  FEEDBACK_BUTTON_CLICK: "feedback_button_click",
  BATTLE_STARTED: "battle_started",
  BATTLE_COMPLETED: "battle_completed",
  FORGE_COMPLETED: "forge_completed",
  SHARDS_CONVERTED: "shards_converted",
  SQUAD_SELECTED: "squad_selected",
  TUTORIAL_SHOWN: "tutorial_shown",
  TUTORIAL_SKIPPED: "tutorial_skipped",
  VAULT_OPEN_STARTED: "vault_open_started",
  SPIN_STARTED: "spin_started",
  REVEAL_SHOWN: "reveal_shown",
  ACTION_CASHOUT: "action_cashout",
  ACTION_EQUIP: "action_equip",
  ACTION_SHIP: "action_ship",
  FEATURE_LOCKED_CLICKED: "feature_locked_clicked",
  XP_AWARDED: "xp_awarded",
  XP_THRESHOLD_REACHED: "xp_threshold_reached"
} as const;

type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

function withPagePath(properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return properties;
  return {
    ...properties,
    page_path: window.location.pathname
  };
}

function toAbsoluteUrl(url: string) {
  if (typeof window === "undefined") return url;
  return new URL(url, window.location.origin).toString();
}

export function trackEvent(
  event: AnalyticsEventName | string,
  properties?: Record<string, unknown>
) {
  if (!isPostHogEnabled) return;
  posthog.capture(event, withPagePath(properties));
}

export function trackPageView(url: string) {
  if (!isPostHogEnabled) return;
  posthog.capture("$pageview", {
    $current_url: toAbsoluteUrl(url),
    page_path: typeof window !== "undefined" ? window.location.pathname : url
  });
}
