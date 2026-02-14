# PostHog Events Reference

All analytics events fired by VaultedLabs. Events are defined in `src/lib/analytics.ts` (`AnalyticsEvents` const) and fired via the `trackEvent` / `trackPageView` helpers. Components never import `posthog-js` directly.

## Setup

| Env Var             | Description                                           |
| ------------------- | ----------------------------------------------------- |
| `VITE_POSTHOG_KEY`  | PostHog project API key                               |
| `VITE_POSTHOG_HOST` | PostHog ingest host (e.g. `https://us.i.posthog.com`) |

When either var is missing, all tracking calls silently no-op. No runtime errors.

## PostHog Config

Configured in `src/lib/posthog.ts`:

- `capture_pageview: false` — manual `$pageview` on SPA route changes
- `capture_pageleave: true` — automatic page leave tracking
- `autocapture: true` — automatic click/input/form events
- `session_recording` — enabled with password-only input masking
- `enable_heatmaps: true` — click/scroll heatmap data collection

## Events

### Page Views

| Event       | Source    | Properties     | Notes                                                                                            |
| ----------- | --------- | -------------- | ------------------------------------------------------------------------------------------------ |
| `$pageview` | `App.tsx` | `$current_url` | Fired on every route change via `useLocation`. UTM params auto-captured by PostHog from the URL. |

### CTA & Navigation

| Event        | Source                    | Properties             | Notes                                                                   |
| ------------ | ------------------------- | ---------------------- | ----------------------------------------------------------------------- |
| `cta_click`  | `PlayNowButton`, `Navbar` | `cta_name`, `location` | Tracks all CTA interactions with context.                               |
| `play_click` | `PlayNowButton`, `Navbar` | —                      | Dedicated event for navigating to `/play`. Fired alongside `cta_click`. |

**`cta_click` values:**

| `cta_name`             | `location`      | Trigger                          |
| ---------------------- | --------------- | -------------------------------- |
| `"play_now"`           | `"hero"`        | Hero PlayNowButton click         |
| `"play_now"`           | `"cta_section"` | CTA section PlayNowButton click  |
| `"join_waitlist"`      | `"navbar"`      | Navbar "Join" button click       |
| `"Play"` or `"Market"` | `"navbar"`      | Navbar contextual nav link click |

### Waitlist

| Event                     | Source         | Properties              | Notes                                                  |
| ------------------------- | -------------- | ----------------------- | ------------------------------------------------------ |
| `waitlist_submit`         | `WaitlistForm` | —                       | Fired at start of form submission (before validation). |
| `waitlist_submit_success` | `WaitlistForm` | `tier`, `credit_amount` | Email successfully added to waitlist.                  |
| `waitlist_submit_error`   | `WaitlistForm` | `reason`                | Submission failed.                                     |

**`waitlist_submit_error` reasons:**

| `reason`             | Trigger                                         |
| -------------------- | ----------------------------------------------- |
| `"invalid_email"`    | Email fails regex validation                    |
| `"disposable_email"` | Email domain is on disposable blocklist         |
| `"duplicate_email"`  | Email already exists in Supabase (code `23505`) |
| `"system_error"`     | Any other server/network error                  |
| `"rate_limited"`     | IP exceeded rate limit (1/min or 3/hour)        |
| `"bot_detected"`     | Cloudflare Turnstile verification failed        |

Honeypot and timing trap rejections intentionally do not fire events.

### Vault Opening

| Event          | Source                | Properties                                     | Notes                                                         |
| -------------- | --------------------- | ---------------------------------------------- | ------------------------------------------------------------- |
| `vault_opened` | `VaultGrid`           | `vault_tier`, `vault_price`                    | Fired after credits are deducted and vault is selected.       |
| `vault_result` | `VaultGrid` (overlay) | `vault_tier`, `rarity`, `value`, `vault_price` | Fired when the reveal animation completes (stage = "result"). |
| `item_action`  | `VaultGrid`           | `action`, `vault_tier`, `rarity`, `value`      | Fired when user chooses what to do with their revealed item.  |

**`item_action` values:**

| `action`    | Description                     |
| ----------- | ------------------------------- |
| `"hold"`    | Store item in digital inventory |
| `"ship"`    | Request physical shipment       |
| `"cashout"` | Convert item value to credits   |

### Marketplace

| Event             | Source            | Properties                                                             | Notes                                                                 |
| ----------------- | ----------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `tab_switch`      | `MarketplaceTabs` | `tab`                                                                  | Tab ID: `"inventory"`, `"marketplace"`, `"auctions"`, or `"profile"`. |
| `marketplace_buy` | `ListingCard`     | `listing_id`, `item_rarity`, `vault_tier`, `price`                     | Fired when user clicks Buy on a marketplace listing.                  |
| `auction_bid`     | `AuctionCard`     | `auction_id`, `bid_amount`, `item_rarity`, `vault_tier`, `current_bid` | Fired after bid validation passes, before `onBid` callback.           |

## Funnel Suggestions

These events are designed to support the following PostHog funnels:

1. **Landing → Play**: `$pageview (/)` → `cta_click (play_now)` → `$pageview (/play)` → `vault_opened`
2. **Vault Flow**: `vault_opened` → `vault_result` → `item_action`
3. **Waitlist Conversion**: `$pageview (/)` → `cta_click (join_waitlist)` → `waitlist_submit` → `waitlist_submit_success`
4. **Marketplace Engagement**: `tab_switch (marketplace)` → `marketplace_buy` / `tab_switch (auctions)` → `auction_bid`

## Architecture

```
Component → trackEvent() → posthog.capture()
                ↓ (if unconfigured)
              no-op
```

- `src/lib/posthog.ts` — PostHog SDK init with graceful degradation
- `src/lib/analytics.ts` — Thin wrapper; all components import from here
- `src/main.tsx` — Side-effect import triggers init at boot
