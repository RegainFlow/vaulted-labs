# Analytics & Measurement Guide

## UTM Naming Convention

All inbound links use this structure:

```
https://vaultedlabs.com?utm_source={source}&utm_medium=organic&utm_campaign={campaign}&utm_content={content}
```

### Parameter Values

| Parameter | Format | Examples |
|-----------|--------|----------|
| `utm_source` | Platform name, lowercase | `tiktok`, `reddit`, `twitter`, `instagram`, `discord`, `facebook`, `youtube` |
| `utm_medium` | Channel type | `organic` (always, for this sprint) |
| `utm_campaign` | Sprint identifier | `launch_week1`, `launch_week2` |
| `utm_content` | Content descriptor slug | `unboxing_v1`, `odds_comparison`, `counter_day3`, `storytime_v1` |

### Examples

```
# TikTok unboxing video
?utm_source=tiktok&utm_medium=organic&utm_campaign=launch_week1&utm_content=unboxing_v1

# Reddit odds comparison post
?utm_source=reddit&utm_medium=organic&utm_campaign=launch_week1&utm_content=odds_comparison

# Twitter daily counter
?utm_source=twitter&utm_medium=organic&utm_campaign=launch_week1&utm_content=counter_day3

# Instagram reel repurpose
?utm_source=instagram&utm_medium=organic&utm_campaign=launch_week1&utm_content=reel_repurpose_v1
```

PostHog auto-captures UTM parameters from the URL on `$pageview` events — no additional code needed.

---

## PostHog Event Mapping

These are the actual events fired by the app (defined in `src/lib/analytics.ts`). Reference: `docs/POSTHOG_EVENTS.md`.

### Events That Matter for Marketing

| Event | What It Tells You | Key Properties |
|-------|-------------------|----------------|
| `$pageview` | Who's landing on the site and from where | `$current_url`, UTM params (auto-captured) |
| `cta_click` | Which CTAs are getting clicked | `cta_name`, `location` |
| `play_click` | How many visitors try the demo | — |
| `waitlist_submit` | How many attempt to sign up | — |
| `waitlist_submit_success` | Actual signups (the number that matters) | `tier`, `credit_amount` |
| `waitlist_submit_error` | Why signups fail | `reason` |
| `vault_opened` | Demo engagement depth | `vault_tier`, `vault_price` |

### Events Less Relevant for Marketing (But Useful Later)

| Event | Purpose |
|-------|---------|
| `vault_result` | Product engagement — what rarities are people pulling |
| `item_action` | Product engagement — hold vs ship vs cashout preferences |
| `tab_switch` | Marketplace engagement |
| `marketplace_buy` | Marketplace conversion |
| `auction_bid` | Auction engagement |

---

## Key Funnels

Build these funnels in PostHog (Insights > Funnels):

### Funnel 1: Landing to Play Conversion (by source)

```
Step 1: $pageview  (where $current_url = "/")
Step 2: cta_click  (where cta_name = "play_now")
Step 3: $pageview  (where $current_url = "/play")
Step 4: vault_opened
```

**Breakdown by**: `utm_source` (initial)

**What it tells you**: Which traffic sources produce visitors who actually engage with the demo. A source with high landing but low play conversion means the messaging isn't matched — they came expecting something else.

### Funnel 2: Landing to Waitlist Conversion (by source)

```
Step 1: $pageview          (where $current_url = "/")
Step 2: waitlist_submit
Step 3: waitlist_submit_success
```

**Breakdown by**: `utm_source` (initial)

**What it tells you**: Direct conversion rate from landing to signup, by channel. This is the primary metric — which channel drives actual signups, not just views.

### Funnel 3: Play to Waitlist Conversion

```
Step 1: $pageview          (where $current_url = "/play")
Step 2: vault_opened
Step 3: $pageview          (where $current_url = "/")
Step 4: waitlist_submit_success
```

**What it tells you**: Whether playing the demo increases waitlist conversion. If Play-to-Waitlist conversion is higher than Landing-to-Waitlist, the demo is working as a trust-builder and CTAs should push demo-first.

### Funnel 4: Signup Error Analysis

```
Step 1: waitlist_submit
Step 2a: waitlist_submit_success  (success path)
Step 2b: waitlist_submit_error    (failure path)
```

**Breakdown by**: `reason` property on error events

**What it tells you**: How many signup attempts fail and why. High `disposable_email` rate = bot traffic. High `duplicate_email` = returning visitors (good signal). High `rate_limited` = potential abuse.

---

## Minimal Dashboard (6 Tiles)

Build in PostHog (Dashboards > New):

### Tile 1: Daily Signups (Trend)

- **Type**: Trend
- **Event**: `waitlist_submit_success`
- **Display**: Line chart, daily
- **Purpose**: Are signups accelerating, flat, or declining?

### Tile 2: Cumulative Signups vs 450 Target

- **Type**: Trend
- **Event**: `waitlist_submit_success`
- **Display**: Cumulative line chart with 450 goal line
- **Purpose**: Progress toward the go/no-go target

### Tile 3: Conversion Rate by Source

- **Type**: Funnel
- **Steps**: `$pageview` → `waitlist_submit_success`
- **Breakdown**: `utm_source` (initial)
- **Purpose**: Which channel has the best signup rate (not just volume)

### Tile 4: Top Referrers

- **Type**: Trend
- **Event**: `$pageview`
- **Breakdown**: `utm_source` (initial) or `$referring_domain`
- **Display**: Bar chart
- **Purpose**: Where is traffic coming from, including non-UTM sources

### Tile 5: Play Click Rate

- **Type**: Trend
- **Event**: `play_click`
- **Display**: Line chart, daily
- **Formula** (optional): `play_click / $pageview` for click-through rate
- **Purpose**: Is the demo CTA working? What % of visitors try it?

### Tile 6: Signup Error Breakdown

- **Type**: Trend
- **Event**: `waitlist_submit_error`
- **Breakdown**: `reason`
- **Display**: Stacked bar chart
- **Purpose**: Monitor spam (bot_detected, disposable_email), UX issues (invalid_email), and system health (system_error)

---

## Weekly Review Checklist

Run this every Friday evening (15 minutes).

### Numbers to Record

| Metric | Where to Find It | Week 1 | Week 2 |
|--------|-------------------|--------|--------|
| Total signups | Tile 2 (cumulative) | ___ | ___ |
| This week's signups | Tile 1 (sum last 7 days) | ___ | ___ |
| Daily velocity (avg) | This week's signups / 7 | ___ | ___ |
| Top source (by signups) | Tile 3 (funnel breakdown) | ___ | ___ |
| Top source (by conversion %) | Tile 3 (funnel breakdown) | ___ | ___ |
| Play click rate | Tile 5 | ___ | ___ |
| Signup error rate | Tile 6 / Tile 1 | ___ | ___ |

### Questions to Answer

1. **Which channel drove the most signups this week?** Double down on it next week.
2. **Which channel had the highest conversion rate?** Even if volume is low, this might be worth more investment.
3. **Are people playing the demo before signing up?** Check Funnel 3. If play → signup conversion is high, push demo-first CTAs.
4. **What's the error breakdown?** If `disposable_email` or `bot_detected` is high, bots are hitting the waitlist — the anti-spam is working but it means those channels might have bot traffic.
5. **Is any experiment clearly not working?** If a channel has >100 pageviews and 0 signups, kill it.
6. **What content format performed best?** TikTok unboxing vs. comparison vs. storytime — which got the most views AND signups?

### When to Kill an Experiment

An experiment should be killed if:
- It has been running for 3+ days
- It has driven >50 pageviews (enough sample)
- It has 0 waitlist signups
- OR its conversion rate is <1% (compared to 3%+ target)

Redirect that time/effort to the top-performing channel.

### When to Scale an Experiment

An experiment should get more investment if:
- Conversion rate >5% (pageview to signup)
- It's the top source by volume AND by rate
- Content format is easily repeatable (e.g., TikTok screen records)

"Scale" at $0 budget means: post more frequently, try variations, cross-post the format to other platforms.
