# Analytics & Measurement Guide

## UTM Naming Convention

Use this structure on inbound links:

```
https://vaultedlabs.com?utm_source={source}&utm_medium=organic&utm_campaign={campaign}&utm_content={content}
```

| Parameter | Format | Examples |
| --------- | ------ | -------- |
| `utm_source` | Platform name (lowercase) | `tiktok`, `reddit`, `twitter`, `instagram`, `discord`, `facebook`, `youtube` |
| `utm_medium` | Channel type | `organic` |
| `utm_campaign` | Sprint identifier | `launch_week1`, `launch_week2` |
| `utm_content` | Content slug | `unboxing_v1`, `odds_comparison`, `counter_day3`, `storytime_v1` |

PostHog captures UTM params from pageview URLs.

## Core Marketing Events

Source of truth for event names: `src/lib/analytics.ts`.

| Event | Why it matters | Key properties |
| ----- | -------------- | -------------- |
| `$pageview` | Traffic volume and source | `$current_url`, `page_path`, UTMs |
| `cta_click` | CTA effectiveness | `cta_name`, `location`, `page_path` |
| `play_click` | Demo intent | `page_path` |
| `waitlist_submit` | Signup attempts | `page_path` |
| `waitlist_submit_success` | Actual conversion | `tier`, `credit_amount` |
| `waitlist_submit_error` | Conversion blockers | `reason` |
| `vault_opened` | Activation depth | `vault_tier`, `vault_price`, `is_tutorial?`, `free_spin?` |
| `vault_result` | Reveal completion | `rarity`, `value`, `bonus_triggered`, `free_spin` |
| `item_action` | Post-reveal conversion intent | `action` |
| `feedback_button_click` | Qualitative feedback intent | `page` |

## Funnels To Build

1. Landing to Play Activation

```
Step 1: $pageview  (page_path = "/")
Step 2: cta_click  (cta_name = "play_now")
Step 3: $pageview  (page_path = "/play")
Step 4: vault_opened
```

Breakdown: `utm_source` (initial)

2. Landing to Waitlist Conversion

```
Step 1: $pageview
Step 2: waitlist_submit
Step 3: waitlist_submit_success
```

Filter step 1 to `page_path = "/"`.
Breakdown: `utm_source` (initial)

3. Vault Completion Funnel

```
Step 1: vault_overlay_opened
Step 2: vault_opened
Step 3: vault_result
Step 4: item_action
```

This measures reveal completion and whether users choose hold/ship/cashout.

4. Bonus Spin Funnel

```
Step 1: bonus_spin_triggered
Step 2: vault_lock_complete
Step 3: free_spin_used
Step 4: vault_result (free_spin = true)
```

This measures whether the bonus mechanic drives repeat opens.

5. Signup Error Split

```
Step 1: waitlist_submit
Step 2a: waitlist_submit_success
Step 2b: waitlist_submit_error
```

Breakdown: `reason`

## Minimal Dashboard

1. Daily `waitlist_submit_success` trend
2. Cumulative `waitlist_submit_success` vs goal
3. Landing -> waitlist funnel by `utm_source`
4. Landing -> play activation funnel by `utm_source`
5. `waitlist_submit_error` stacked by `reason`
6. `item_action` split by `action`
