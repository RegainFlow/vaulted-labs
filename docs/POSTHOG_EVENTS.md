# PostHog Events Reference

Canonical analytics event map for VaultedLabs.

- Event names are defined in `src/lib/analytics.ts`.
- Components must use `trackEvent` and `trackPageView` only.
- SDK init lives in `src/lib/posthog.ts`.

## Setup

| Env Var                    | Description                                           |
| -------------------------- | ----------------------------------------------------- |
| `VITE_PUBLIC_POSTHOG_KEY`  | PostHog project API key                               |
| `VITE_PUBLIC_POSTHOG_HOST` | PostHog ingest host (for example `https://us.i.posthog.com`) |
| `VITE_PUBLIC_POSTHOG_SESSION_REPLAY` | Enable replay capture (`true` by default) |
| `VITE_PUBLIC_POSTHOG_HEATMAPS` | Enable heatmap capture (`true` by default) |
| `VITE_PUBLIC_POSTHOG_REPLAY_CONSOLE_LOGS` | Include browser console logs in replay (`false` by default) |

When either var is missing, analytics calls no-op.

## Current SDK Config

Configured in `src/lib/posthog.ts`:

- `autocapture: true`
- `capture_pageview: false` (manual SPA pageviews)
- `capture_pageleave: true`
- `capture_heatmaps: true` (configurable via env)
- `disable_session_recording: false` (configurable via env)
- `session_recording.maskAllInputs: true`
- `session_recording.strictMinimumDuration: true`

## Event Inventory

### Page Views

| Event       | Source    | Properties |
| ----------- | --------- | ---------- |
| `$pageview` | `App.tsx` | `$current_url`, `page_path` |

### CTA / Navigation

| Event | Source | Properties |
| ----- | ------ | ---------- |
| `cta_click` | `PlayNowButton`, `Navbar`, `VaultGrid` | `cta_name`, `location`, `page_path` |
| `play_click` | `PlayNowButton`, `Navbar` | `page_path` |

### Waitlist

| Event | Source | Properties |
| ----- | ------ | ---------- |
| `waitlist_submit` | `WaitlistForm` | `page_path` |
| `waitlist_submit_success` | `WaitlistForm` | `tier`, `credit_amount`, `page_path` |
| `waitlist_submit_error` | `WaitlistForm` | `reason`, `page_path` |

`waitlist_submit_error.reason` values currently include:

- `invalid_email`
- `disposable_email`
- `captcha_missing`
- `validation_error`
- `bot_detected`
- `rate_limited`
- `system_error`

### Vault / Gameplay Loop

| Event | Source | Properties |
| ----- | ------ | ---------- |
| `vault_overlay_opened` | `VaultGrid` | `vault_tier`, `vault_price`, `page_path` |
| `vault_overlay_closed` | `VaultGrid` | `vault_tier`, `vault_price`, `page_path` |
| `vault_opened` | `VaultGrid` | `vault_tier`, `vault_price`, `is_tutorial?`, `free_spin?`, `page_path` |
| `bonus_spin_triggered` | `VaultGrid` | `vault_tier`, `vault_price`, `first_rarity`, `page_path` |
| `vault_lock_complete` | `VaultGrid` | `vault_tier`, `free_spins_awarded`, `awarded`, `page_path` |
| `free_spin_used` | `VaultGrid` | `vault_tier`, `vault_price`, `free_spins_before`, `free_spins_after`, `page_path` |
| `vault_result` | `VaultGrid` | `vault_tier`, `rarity`, `value`, `vault_price`, `bonus_triggered`, `free_spin`, `page_path` |
| `item_action` | `VaultGrid` | `action`, `vault_tier`, `rarity`, `value`, `vault_price`, `free_spin`, `page_path` |

`item_action.action` values:

- `hold`
- `ship`
- `cashout`

### Tutorial / Progression

| Event | Source | Properties |
| ----- | ------ | ---------- |
| `tutorial_started` | `PlayPage` | `page_path` |
| `tutorial_step_completed` | `PlayPage` | `step`, `page_path` |
| `tutorial_completed` | `PlayPage` | `action`, `page_path` |
| `quest_completed` | `GameContext` | `quest_id`, `quest_title`, `page_path` |

### Marketplace / Shop

| Event | Source | Properties |
| ----- | ------ | ---------- |
| `tab_switch` | `ShopTabs` | `tab`, `page_path` |
| `marketplace_buy` | `ListingCard` | `listing_id`, `item_rarity`, `vault_tier`, `price`, `page_path` |
| `auction_bid` | `AuctionCard` | `auction_id`, `bid_amount`, `item_rarity`, `vault_tier`, `current_bid`, `page_path` |

### Feedback

| Event | Source | Properties |
| ----- | ------ | ---------- |
| `feedback_button_click` | `FeedbackButton` | `page`, `page_path` |

## Funnel Definitions

1. Landing to Play
- `$pageview` where `page_path = "/"`
- `cta_click` where `cta_name = "play_now"`
- `$pageview` where `page_path = "/play"`
- `vault_opened`

2. Core Vault Completion
- `vault_overlay_opened`
- `vault_opened`
- `vault_result`
- `item_action`

3. Bonus Round Yield
- `bonus_spin_triggered`
- `vault_lock_complete`
- `free_spin_used`
- `vault_result` where `free_spin = true`

4. Tutorial Completion to First Real Open
- `tutorial_started`
- `tutorial_completed`
- `vault_opened` where `is_tutorial` is not set

5. Landing to Waitlist
- `$pageview` where `page_path = "/"`
- `waitlist_submit`
- `waitlist_submit_success`
