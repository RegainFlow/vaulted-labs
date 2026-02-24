# CLAUDE.md — VaultedLabs Project Conventions

## Project Overview

VaultedLabs is a gamified commerce platform. Users open "Vaults" to reveal collectibles, manage a collection, trade on a marketplace, battle bosses in the Arena, forge new items from shards, and progress through an XP/level/rank-up system. The repo contains a landing page (waitlist), a vault opening page (guided tutorial, Vault Lock bonus mini-game), a collection page (inventory + marketplace), an arena page (battles, forge, quests), and a wallet page.

## Tech Stack

- **Build**: Vite 6 with `@tailwindcss/vite` plugin
- **Framework**: React 19 with TypeScript (strict mode)
- **Routing**: React Router DOM v7 — routes: `/` (landing), `/open` (vault opening), `/collection` (inventory + marketplace), `/arena` (battles, forge, quests), `/wallet`, `/privacy`, `/terms`
- **State**: React Context (`GameProvider` in `src/context/GameContext.tsx`) wraps all routes — shared credits, inventory, XP, marketplace, prestige, boss energy, shards, equipped items, free spins state
- **Styling**: Tailwind CSS v4 (CSS-native config via `@theme` in `index.css`)
- **Animations**: Motion (formerly Framer Motion) — import from `motion/react`
- **Typewriter**: Typed.js — hero subtitle typing animation
- **Backend**: Supabase (waitlist email capture + real-time count via Edge Functions; marketplace schema designed for Phase 2)
- **Analytics**: PostHog (`posthog-js`) — page views, funnels, session replays, heatmaps, and custom event tracking (see `docs/POSTHOG_EVENTS.md`)
- **Anti-bot**: Cloudflare Turnstile (managed mode), server-side rate limiting (1/min + 3/hour per IP), honeypot field, timing check (3s minimum), disposable email blocklist (client + server-side)
- **Deployment target**: Vercel (SPA rewrite in `vercel.json`)

## Financial Model Constants

### Vault Levels (6 tiers)

| Level    | Price | Common | Uncommon | Rare  | Legendary |
| -------- | ----- | ------ | -------- | ----- | --------- |
| Bronze   | $12   | 50.0%  | 27.0%    | 19.0% | 4.0%      |
| Silver   | $25   | 47.0%  | 28.0%    | 19.5% | 5.5%      |
| Gold     | $40   | 43.0%  | 30.0%    | 20.0% | 7.0%      |
| Platinum | $55   | 40.0%  | 30.0%    | 21.5% | 8.5%      |
| Obsidian | $75   | 37.0%  | 29.0%    | 23.0% | 11.0%     |
| Diamond  | $90   | 33.0%  | 28.0%    | 25.0% | 14.0%     |

### Rarity Value Multipliers (of vault price)

| Tier      | Min   | Max   |
| --------- | ----- | ----- |
| Common    | 0.40x | 0.85x |
| Uncommon  | 0.85x | 1.40x |
| Rare      | 1.40x | 2.20x |
| Legendary | 2.20x | 3.50x |

### Premium Bonus Chance (Vault Lock mini-game trigger)

| Vault Tier | Bonus Chance |
| ---------- | ------------ |
| Platinum   | 45%          |
| Obsidian   | 55%          |
| Diamond    | 65%          |

Bronze, Silver, and Gold do not trigger the bonus round.

### User Behavior Rates

- Hold (digital): 65% — no COGS
- Cashout (credits): 20% — 100% of item value as credit
- Ship (physical): 15% — triggers COGS (~50% of item value) + $8 shipping

## Gamification System

### XP Earning

- Vault purchase: XP = vault price (e.g. $12 Bronze -> 12 XP)
- Marketplace buy: XP = price paid in credits
- Auction win: XP = winning bid amount
- Boss fight win: XP = boss xpReward
- Quest completion: XP = quest xpReward
- No XP for cashouts, ships, or listing items

### Level Curve

Quadratic: `threshold(L) = 50L^2 + 50L`

| Level | Cumulative XP |
| ----- | ------------- |
| 1     | 100           |
| 3     | 600           |
| 5     | 1,500         |
| 8     | 3,600         |
| 10    | 5,500         |
| 12    | 7,800         |

### Prestige System (3 levels)

Players can prestige at Level 10, resetting XP to 0 and defeated bosses. Each prestige level:
- Improves vault odds: shifts 4% per level from Common to Uncommon/Rare/Legendary (30%/30%/40% split)
- Scales boss difficulty: shifts 5% per level from Common to Legendary in boss odds
- Unlocks a new UI color scheme applied via `html[data-prestige="N"]` CSS attribute

| Prestige Level | Theme Color | Accent       |
| -------------- | ----------- | ------------ |
| 1              | Gold        | #ff8c00      |
| 2              | Violet      | #9945ff      |
| 3              | Prismatic   | #ff2d95 cyan |

Max prestige level is 3.

### Battles (4 encounters with stat-based combat)

| Boss             | Required Level | Energy Cost | Shard Reward | XP Reward |
| ---------------- | -------------- | ----------- | ------------ | --------- |
| The Vault Keeper | 3              | 1           | 2-3          | 100       |
| Chrono Shard     | 5              | 1           | 2-3          | 200       |
| Neon Hydra       | 8              | 2           | 2-3          | 400       |
| Diamond Golem    | 12             | 3           | 3-4          | 1000      |

Battles use a stat-based combat system:
- Player selects up to 3 collectibles as a squad (each has ATK/DEF/AGI stats)
- Squad HP: 120; Boss HP: per-boss config, scaled +15% per rank level
- Combat auto-resolves exchanges: squad attacks boss, boss attacks squad
- Damage = (ATK * variance * AGI bonus) - DEF * 0.4
- Max 20 rounds; victory = boss HP reaches 0
- Neon Hydra special mechanic: regenerates 5 HP per round
- Per-boss `energyCost` field determines energy spent to initiate battle

### Vault Lock Bonus Mini-Game

Triggered after vault reveal for Platinum/Obsidian/Diamond tiers (chance-based). Three independent reel spinners showing vault tier icons. Player locks each spinner sequentially. Match all 3 for free spins:

| Matched Tier        | Free Spins Awarded |
| ------------------- | ------------------ |
| Bronze or Silver    | 1                  |
| Gold or Platinum    | 2                  |
| Obsidian or Diamond | 3                  |

Free spins allow vault opens without spending credits (XP still awarded).

### Quests

Quest categories: `onboarding` (cyan), `engagement` (magenta), `milestone` (gold). Quests unlock at specific player levels. Completion awards XP and optional credits. Quest types track: `vault_purchase`, `hold_item`, `cashout_item`, `ship_item`, `marketplace_buy`, `marketplace_list`, `auction_bid`, `spend_amount`.

### Wallet

Credits are typed: `incentive` (non-withdrawable, from waitlist), `earned` (from cashouts/reveals/boss rewards), `spent` (purchases). Balance = sum of all transaction amounts. Starting demo balance: +100 earned.

### Waitlist Incentive Tiers (4 tiers, 400 total spots)

| Tier         | Positions | Credit | Color             |
| ------------ | --------- | ------ | ----------------- |
| Founder      | 1-25      | $100   | Gold `#ffd700`    |
| Early Access | 26-50     | $75    | Magenta `#ff2d95` |
| Beta         | 51-75     | $50    | Cyan `#00f0ff`    |
| Early Bird   | 76-100    | $25    | Green `#39ff14`   |

Credits are applied to vault purchases and cannot be withdrawn as cash.

## Design Tokens (defined in src/index.css @theme)

Cyber synth aesthetic: magenta neon + green neon + cyan on dark blue-shifted backgrounds.

| Token                      | Value   | Usage                             |
| -------------------------- | ------- | --------------------------------- |
| `--color-bg`               | #0a0a0f | Blue-shifted dark background      |
| `--color-surface`          | #111118 | Blue-tinted card surfaces         |
| `--color-surface-elevated` | #1a1a24 | Cards, modals, elevated panels    |
| `--color-border`           | #2a2a3a | Default border color              |
| `--color-accent`           | #ff2d95 | Magenta neon — CTAs, headings     |
| `--color-accent-hover`     | #e0267f | Magenta hover state               |
| `--color-neon-cyan`        | #00f0ff | Cyan — input focus, Hold accent   |
| `--color-neon-cyan-hover`  | #00d8e6 | Cyan hover state                  |
| `--color-neon-green`       | #39ff14 | Green neon — success, mint labels |
| `--color-text`             | #f0f0f5 | Cool-tinted white                 |
| `--color-text-muted`       | #9a9ab0 | Cool muted text                   |
| `--color-text-dim`         | #6a6a80 | Dimmed labels, metadata           |
| `--color-vault-bronze`     | #cd7f32 | Bronze tier                       |
| `--color-vault-silver`     | #c0c0c0 | Silver tier                       |
| `--color-vault-gold`       | #ffd700 | Gold tier                         |
| `--color-vault-diamond`    | #b9f2ff | Diamond tier                      |
| `--color-rarity-common`    | #6B7280 | Common rarity                     |
| `--color-rarity-uncommon`  | #3B82F6 | Uncommon rarity                   |
| `--color-rarity-rare`      | #a855f7 | Rare rarity                       |
| `--color-rarity-legendary` | #FFD700 | Legendary rarity                  |
| `--color-success`          | #00f0ff | Success states                    |
| `--color-error`            | #ff3b5c | Error states                      |

### Prestige Theme Overrides

Applied via `html[data-prestige="N"]` in CSS. Each prestige level overrides `--color-accent`, `--color-accent-hover`, and related tokens to shift the entire UI palette.

## Custom Utility Classes (defined in src/index.css @layer utilities)

| Class                        | Effect                                                   |
| ---------------------------- | -------------------------------------------------------- |
| `.glow-magenta`              | Magenta box-shadow glow                                  |
| `.glow-cyan`                 | Cyan box-shadow glow                                     |
| `.text-glow-magenta`         | Magenta text-shadow                                      |
| `.text-glow-cyan`            | Cyan text-shadow                                         |
| `.text-glow-green`           | Green text-shadow                                        |
| `.text-glow-white`           | White text-shadow                                        |
| `.bg-clip-text`              | Background-clip text fix (Firefox)                       |
| `.animate-gradient`          | Animated gradient background flow                        |
| `.bg-300%`                   | 300% background-size for gradient animations             |
| `.animate-vault-spin-slow`   | Slow 60s rotation (vault rings)                          |
| `.animate-vault-glow-pulse`  | Pulsing opacity glow (vault door)                        |
| `.animate-spin-slow`         | Moderate 8s rotation (reveal rays)                       |
| `.animate-hud-shimmer`       | Subtle shimmer on HUD values                             |
| `.animate-urgency-pulse`     | Pulsing opacity for auction countdown < 5min             |
| `.animate-legendary-breathe` | Breathing glow for legendary items                       |
| `.animate-rainbow-border`    | Rainbow cycling border for Vault Lock escalation         |
| `.animate-edge-lightning`    | Edge lightning effect for Vault Lock jackpot             |
| `.glow-rarity-*`             | Per-rarity glow effects (common/uncommon/rare/legendary) |
| `.shake-light`               | Light screen shake (boss fight moderate damage)          |
| `.shake-heavy`               | Heavy screen shake (boss fight high damage)              |
| `.pushable`                  | 3D pushable button (Josh Comeau pattern)                 |

## Page Structure

### Landing Page (`/`)
1. **Navbar** — Fixed nav with wordmark + Join button only (no landing Play/Shop links)
2. **Hero** — Full-viewport vault door visual with Typed.js subtitle + "Open Now" CTA + neon scroll indicator
3. **HowItWorks** — 6 steps (2 rows of 3): The Vault (Pick, Reveal, Choose) + The Platform (Collection, Arena, Credits) with styled images
4. **FeatureHighlights** — 4 compact clickable cards (Collection, Arena, Rank Up, Forge + Quests) linking to game pages
5. **CTASection** — "Try the Demo" button linking to `/open`
6. **WaitlistSection** — IncentiveBanner (4-tier card grid) + WaitlistForm (with post-signup feedback CTA)
7. **CompactFAQ** — Expandable FAQ accordion
8. **Footer** — Brand + feedback link + copyright

### Open Page (`/open`)
1. **Navbar** — Fixed nav with HUD plus global bottom dock navigation (`Open`, `Collection`, `Arena`)
2. **VaultGrid** — Category selector, 6 vault cards, full-screen multi-stage reveal overlay (3 result options: Keep/Ship/Cashout), Vault Lock bonus stage
3. **Tutorial** — Guided first-time onboarding overlay (auto-triggers on first visit; welcome -> HUD -> categories -> odds -> contents -> open vault -> spin -> result actions) with skip support
4. **TutorialHelpButton** — Floating "?" to replay tutorial
5. **Footer** — Brand + feedback link + copyright

### Collection Page (`/collection`)
1. **Navbar** — Fixed nav with HUD plus global bottom dock navigation
2. **SegmentedTabs** — My Collection / Market / Auctions
3. **InventoryGrid** — Owned items grid with status filter, Hold/Ship/Cashout/List actions
4. **ListingGrid + AuctionGrid** — Marketplace listings or auctions based on selected tab
5. **TutorialHelpButton** — Floating "?" to trigger tutorial (no auto-popup)
6. **Footer**

### Arena Page (`/arena`)
1. **Navbar** — Fixed nav with HUD plus global bottom dock navigation
2. **ResourceBar** — Energy + Shards + Free Spins display
3. **SegmentedTabs** — Battles / Forge / Quests
4. **BattleCard grid** — 4 boss encounters with per-boss energy cost, locked/unlocked/defeated states
5. **BattleSetupModal** — Squad selection (up to 3 collectibles) with stat comparison
6. **BattleOverlay** — Full-screen combat animation with round-by-round exchange display
7. **ForgePanel** — Combine 3 items into 1 new item with rarity odds + optional free spin boost
8. **QuestList** — Active quests with progress tracking (in Quests tab)
9. **PrestigeButton** — Shown when level >= 10 and prestige < 3; triggers PrestigeOverlay ("Rank Up")
10. **Reset Demo** — Button to clear all progress
11. **TutorialHelpButton** — Floating "?" to replay Arena tutorial (no auto-popup)
12. **Footer**

### Wallet Page (`/wallet`)
1. **Navbar** — Fixed nav with HUD plus global bottom dock navigation (including energy/shards)
2. **WalletHeader** — Credit balance summary
3. **TransactionList** — Filterable credit transaction history
4. **TutorialHelpButton** — Floating "?" to trigger tutorial (no auto-popup)
5. **Footer**

## Source Files

### Pages

| File                        | Description                                                                |
| --------------------------- | -------------------------------------------------------------------------- |
| `App.tsx`                   | Root — route shell + GameProvider wrapper + QuestToast + pageview tracking |
| `pages/LandingPage.tsx`     | Landing page composition                                                   |
| `pages/OpenPage.tsx`        | Vault opening page with tutorial integration                               |
| `pages/CollectionPage.tsx`  | Collection page — inventory + market + auctions via shared segmented tabs |
| `pages/ArenaPage.tsx`       | Arena page — battles, forge, quests, rank-up, demo reset                   |
| `pages/WalletPage.tsx`      | Wallet page — credit balance + transaction history                         |

### Components — Shared (`components/shared/`)

| File                              | Description                                                             |
| --------------------------------- | ----------------------------------------------------------------------- |
| `shared/Navbar.tsx`               | Fixed nav with optional HUD + unified bottom dock nav on all breakpoints |
| `shared/SegmentedTabs.tsx`        | Reusable segmented control used by Collection and Arena section switching |
| `shared/Footer.tsx`               | Footer with branding + feedback link                                    |
| `shared/PlayNowButton.tsx`        | 3D pushable "OPEN NOW" CTA button linking to `/open` with analytics tracking |
| `shared/CollectionModal.tsx`      | Reusable modal for selecting collectibles (used in squad selection)      |
| `shared/FeedbackButton.tsx`       | Google Form feedback button (graceful no-op when env var missing)       |
| `shared/QuestToast.tsx`           | Quest completion toast notification                                     |
| `shared/PageTutorial.tsx`         | Reusable page tutorial overlay with welcome/spotlight/complete steps + skip + viewport-clamped tooltips |
| `shared/TutorialHelpButton.tsx`   | Floating "?" button to replay a page tutorial                           |

### Components — Landing

| File                              | Description                                                                             |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| `components/Hero.tsx`             | Hero with vault door + Typed.js subtitle + CTA + neon scroll indicator                  |
| `components/HowItWorks.tsx`       | 6-step explainer (2 rows) with styled images                                            |
| `components/FeatureHighlights.tsx` | 4 compact clickable feature cards (Collection, Arena, Rank Up, Forge + Quests)          |
| `components/CTASection.tsx`       | "Try the Demo" CTA linking to /open                                                     |
| `components/WaitlistSection.tsx`  | Lifts useWaitlistCount, passes count/loading to IncentiveBanner + WaitlistForm          |
| `components/IncentiveBanner.tsx`  | 4-tier incentive card grid with per-tier colors and progress bars                       |
| `components/WaitlistForm.tsx`     | Email form with tier-aware success messaging + Edge Function integration + feedback CTA |
| `components/CompactFAQ.tsx`       | FAQ accordion with expandable Q&A items                                                  |
| `components/TurnstileWidget.tsx`  | Cloudflare Turnstile CAPTCHA widget (managed mode, dark theme)                          |
| `components/AppPreview.tsx`       | (archived) Benefits + phone mockup — not rendered on landing                            |
| `components/PhoneMockup.tsx`      | iPhone frame with auto-playing 5-screen demo (used by AppPreview)                       |
| `components/PrelaunchClarity.tsx` | (archived) Scope cards + FAQ — content relocated to CompactFAQ                          |

### Components — Vault (`components/vault/`)

| File                              | Description                                                                            |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| `vault/VaultGrid.tsx`             | Category selector, vault cards + full-screen reveal overlay (3 options: Keep/Ship/Cashout) + bonus stage integration |
| `vault/VaultCard.tsx`             | Individual vault card with rarity bars                                                 |
| `vault/VaultIcons.tsx`            | SVG mineral/ore icon mapper per tier (delegates to `assets/vault-icons.tsx`)           |
| `vault/VaultLockBonusStage.tsx`   | 3-reel Vault Lock mini-game with cascading lock, escalating effects, free spin rewards |

### Components — Shop (`components/shop/`)

| File                   | Description                         |
| ---------------------- | ----------------------------------- |
| `shop/ShopTabs.tsx`    | Listings + Auctions tab navigation  |
| `shop/ListingGrid.tsx` | Marketplace listings grid           |
| `shop/ListingCard.tsx` | Listing card with Buy button        |
| `shop/AuctionGrid.tsx` | Auctions grid with countdown timers |
| `shop/AuctionCard.tsx` | Auction card with bid input + timer |

### Components — Inventory (`components/inventory/`)

| File                              | Description                                   |
| --------------------------------- | --------------------------------------------- |
| `inventory/InventoryGrid.tsx`     | Inventory grid with status filter             |
| `inventory/InventoryItemCard.tsx` | Item card with Hold/Ship/Cashout/List actions |

### Components — Arena (`components/arena/`)

| File                            | Description                                                              |
| ------------------------------- | ------------------------------------------------------------------------ |
| `arena/ResourceBar.tsx`         | Energy + Shards + Free Spins resource display bar                        |
| `arena/BattleCard.tsx`          | Locked/unlocked battle card with per-boss energy cost display            |
| `arena/BattleSetupModal.tsx`    | Squad selection modal (up to 3 collectibles) with stat comparison        |
| `arena/BattleOverlay.tsx`       | Full-screen stat-based combat UI with round-by-round exchange display    |
| `arena/ForgePanel.tsx`          | Forge UI: select 3 items, optional free spin boost, rarity odds preview  |
| `arena/SquadPanel.tsx`          | (archived) Squad management panel — no longer rendered                   |

### Components — Profile (`components/profile/`)

| File                            | Description                                                              |
| ------------------------------- | ------------------------------------------------------------------------ |
| `profile/PrestigeButton.tsx`    | "Rank Up" trigger button (shown at Level 10+, max prestige 3)           |
| `profile/PrestigeOverlay.tsx`   | Rank-up celebration with particle effects, benefit badges, phase reveal  |
| `profile/QuestCard.tsx`         | Quest card with progress bar                                             |
| `profile/QuestList.tsx`         | Quest list with category filter                                          |

### Components — Wallet (`components/wallet/`)

| File                         | Description                           |
| ---------------------------- | ------------------------------------- |
| `wallet/WalletHeader.tsx`    | Credit balance summary card           |
| `wallet/TransactionList.tsx` | Filterable credit transaction history |
| `wallet/TransactionRow.tsx`  | Individual transaction row            |

### Components — Tutorial

| File                      | Description                                                              |
| ------------------------- | ------------------------------------------------------------------------ |
| `components/Tutorial.tsx` | Guided first-time vault tutorial with spotlight + tooltips + skip support |

### Types (`types/`)

| File                    | Description                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| `types/game.ts`         | Barrel re-export — all domain types accessible from one import                                              |
| `types/vault.ts`        | `VaultTierName`, `Rarity`, `RarityBreakdown`, `Vault`, `VaultCardProps`, `VaultGridProps`, `VaultIconProps` |
| `types/inventory.ts`    | `ItemStatus`, `InventoryItem`, `InventoryItemCardProps`                                                     |
| `types/marketplace.ts`  | `MarketplaceListing`, `Auction`, `AuctionCardProps`                                                         |
| `types/wallet.ts`       | `CreditType`, `CreditTransaction`, `TransactionRowProps`                                                    |
| `types/gamification.ts` | `PrestigeLevel`, `LevelInfo`, `Battle` (with `energyCost`), `BattleCardProps`, `BossEnergyConfig`, `SquadStats`, `CombatExchange`, `CombatResult`, `ShardConfig` |
| `types/collectible.ts`  | `Collectible`, `ItemStats` — collectible items with ATK/DEF/AGI stats                                      |
| `types/forge.ts`        | `ForgeOdds`, `ForgeResult` — forge system types                                                             |
| `types/quest.ts`        | `Quest`, `QuestProgress`, `QuestToast`, `QuestCardProps`, `QuestRequirement` + related union types          |
| `types/landing.ts`      | `Step`, `IncentiveTier`, `IncentiveBannerProps`, `WaitlistFormProps`, `TurnstileWidget*`, `NavbarProps`     |
| `types/tutorial.ts`     | `TutorialStep`, `TutorialProps` (with `onSkip`), `TargetRect`, `PageTutorialStepConfig`, `PageTutorialProps` |
| `types/bonus.ts`        | `VaultLockPhase`, `VaultLockSlot`, `VaultLockBonusStageProps`, `FREE_SPIN_REWARDS`                          |

### Data (`data/`)

| File                   | Description                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `data/vaults.ts`       | Vault tiers, rarity config, pick helpers, incentive tiers, product types, vault lock strip generation, prestige odds |
| `data/gamification.ts` | XP formulas, level curve functions, battle config (BATTLES with `energyCost`), boss energy config, shard economy, stat-based combat engine, prestige battle scaling |
| `data/item-stats.ts`   | Item stat generation (ATK/DEF/AGI) based on rarity and vault tier                    |
| `data/forge.ts`        | Forge odds calculation, boost application, result rolling                             |
| `data/mock-data.ts`    | Seed marketplace listings + auctions with mock sellers                               |
| `data/quests.ts`       | Quest definitions (onboarding, engagement, milestone categories)                     |
| `data/tutorial.ts`     | Tutorial step flow, overlay/tooltip step configs, page tutorial steps (open, wallet, arena, collection, boss fight) |
| `data/inventory.ts`    | Inventory status filter config                                                       |
| `data/wallet.ts`       | Wallet/credit type display config                                                    |

### Assets (`assets/`)

| File                        | Description                                                    |
| --------------------------- | -------------------------------------------------------------- |
| `assets/vault-icons.tsx`    | SVG mineral/ore icon functions per tier                        |
| `assets/step-icons.tsx`     | SVG illustrations + icons for HowItWorks steps                 |
| `assets/benefits-icons.tsx` | SVG icons for AppPreview benefits list                         |
| `assets/boss-icons.tsx`     | SVG icons for 4 boss fights (Vault Keeper, Chrono Shard, Neon Hydra, Diamond Golem) |

### Hooks

| File                        | Description                                        |
| --------------------------- | -------------------------------------------------- |
| `hooks/useWaitlistCount.ts` | Real-time waitlist count hook                      |
| `hooks/useTutorial.ts`      | Tutorial state machine (step flow, advance, reset) |

### Lib

| File                       | Description                                                               |
| -------------------------- | ------------------------------------------------------------------------- |
| `lib/supabase.ts`          | Supabase client (null when unconfigured)                                  |
| `lib/posthog.ts`           | PostHog client init (graceful no-op when unconfigured)                    |
| `lib/analytics.ts`         | Thin analytics wrapper — `trackEvent`, `trackPageView`, `AnalyticsEvents` |
| `lib/disposable-emails.ts` | Disposable email domain checker                                           |
| `lib/motion-presets.ts`    | Shared Motion transition presets, glow constants, rarity configs, celebration springs |

### Supabase

| File                                          | Description                                                            |
| --------------------------------------------- | ---------------------------------------------------------------------- |
| `supabase/functions/waitlist-signup/index.ts`  | Edge Function — Turnstile verify, rate limit, disposable check, insert |
| `supabase/functions/waitlist-count/index.ts`   | Edge Function — GET endpoint returning current waitlist count with 15s cache |
| `supabase/migrations/20260218052432_init.sql`  | Squashed baseline schema — waitlist + rate_limits tables               |
| `supabase/seed/waitlist.sql`                   | Seed data for local development                                        |

### Static Assets

| Path                          | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| `public/images/how-it-works/` | 6 HowItWorks step images (served as static assets) |

## Documentation

| File                                   | Description                                            |
| -------------------------------------- | ------------------------------------------------------ |
| `docs/STYLES.md`                       | Design system and style guide                          |
| `docs/POSTHOG_EVENTS.md`              | Analytics event reference with funnel suggestions      |
| `docs/IMAGE_GENERATION.md`            | 3D render system specs for consistent visual universe  |
| `docs/how-it-works-prompts/*.md`       | 6 Midjourney/3D prompts for HowItWorks step images    |
| `docs/marketing/MARKETING_PLAN.md`    | 14-day content sprint with daily schedule              |
| `docs/marketing/ICP.md`               | Ideal customer profiles                                |
| `docs/marketing/MESSAGING.md`         | Positioning, headlines, CTAs                           |
| `docs/marketing/ANALYTICS.md`         | UTM convention, PostHog event mapping, funnels, dashboard |
| `docs/marketing/EXPERIMENTS.md`       | ICE-scored growth experiments                          |

## Documentation Lookup

- **Always check Context7** (via `resolve-library-id` -> `query-docs`) before writing or modifying code that uses any library or framework. This ensures implementations use up-to-date APIs and best practices rather than relying on potentially outdated training data.

## Coding Conventions

- Functional components only (no class components)
- Named exports for components, default export only for App.tsx
- Props interfaces named `{ComponentName}Props`
- Tailwind utility classes directly on elements (no @apply except in index.css)
- Motion animations: keep lightweight — subtle hovers, gentle scroll reveals, polished form feedback
- `useReducedMotion()` from Motion used in complex animations (boss fights, prestige, vault lock) for accessibility
- Mobile-first responsive design: use `sm:`, `md:`, `lg:` breakpoints for progressive enhancement
- Primary app navigation pattern: unified fixed bottom dock on all breakpoints; hide dock during blocking overlays/modals
- One hook per file in `hooks/`
- Relative imports (no path aliases configured)
- Game state accessed via `useGame()` hook from GameContext — never local state for credits/inventory/XP/prestige/boss fights
- Types organized by domain in `types/` — import from domain file in new code (e.g. `types/vault`, `types/quest`, `types/bonus`); `types/game.ts` barrel re-export maintained for backwards compatibility
- Components organized by domain: `shared/`, `vault/`, `shop/`, `inventory/`, `arena/`, `profile/`, `wallet/`
- SVG icon assets in `assets/` (vault-icons, step-icons, benefits-icons, boss-icons), not inline in components
- Static images in `public/` for production-safe paths (not `src/assets/`)
- Only `/open` auto-triggers its tutorial on first visit. All other pages show a "?" help button to manually trigger tutorials (no auto-popup)
- All page tutorials follow the PageTutorial pattern: welcome step -> spotlight steps -> complete step, with skip support and localStorage persistence via GameContext

## GameContext State Shape

Persisted to `localStorage` key `vaultedlabs-game-state`:

```typescript
interface PersistedState {
  creditTransactions: CreditTransaction[];
  inventory: Collectible[];
  xp: number;
  listings: MarketplaceListing[];
  auctions: Auction[];
  questProgress: QuestProgress[];
  hasSeenTutorial: boolean;            // /open vault tutorial
  hasSeenWalletTutorial: boolean;
  hasSeenProfileTutorial: boolean;
  hasSeenInventoryTutorial: boolean;
  hasSeenShopTutorial: boolean;
  hasSeenBossFightTutorial: boolean;
  hasSeenArenaTutorial: boolean;
  hasSeenCollectionTutorial: boolean;
  prestigeLevel: number;               // 0-3
  defeatedBosses: string[];            // ["boss-1", ...]
  freeSpins: number;                   // from Vault Lock bonus
  cashoutStreak: number;
  nextId: number;
  // v2 fields
  bossEnergy: number;                  // current energy (max 5)
  lastEnergyRegenAt: number;           // timestamp for regen tracking
  shards: number;                      // earned from battles
  equippedItemIds: string[];           // squad item IDs
  stateVersion: number;                // migration version (currently 2)
}
```

Key context methods: `purchaseVault`, `addItem`, `cashoutItem`, `shipItem`, `listItem`, `buyListing`, `placeBid`, `prestige`, `completeBattle`, `spendBossEnergy` (accepts optional cost param), `grantBossEnergy`, `grantShards`, `convertShardsToFreeSpin`, `equipItem`, `unequipItem`, `forgeItems`, `grantFreeSpins`, `useFreeSpinForVault`, `tutorialOpenVault`, `seedDemoItem`, `removeDemoItem`, `resetDemo`.

## Commands

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # tsc -b && vite build — production build to dist/
npm run lint     # ESLint
npm run preview  # Preview production build locally
```

## Environment Variables

Client-side in `.env` (not committed):

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_DEFAULT_API_KEY` — Supabase anon/public key
- `VITE_POSTHOG_KEY` — PostHog project API key
- `VITE_POSTHOG_HOST` — PostHog ingest host (e.g. `https://us.i.posthog.com`)
- `VITE_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key (widget hidden when missing)
- `VITE_FEEDBACK_FORM_PREFILL_URL` — Google Form prefill URL (feedback button hidden when missing)
- `VITE_FEEDBACK_ENTRY_PAGE_URL` — Google Form entry ID for page URL field
- `VITE_FEEDBACK_ENTRY_UTM` — Google Form entry ID for UTM params field

Copy `.env.example` to `.env` and fill in values. PostHog, Turnstile, and Feedback gracefully no-op when env vars are missing.

Server-side secrets (set in Supabase Edge Function config, not in `.env`):
- `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile secret key (Turnstile validation skipped when missing)
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — auto-provided by Supabase Edge Functions runtime

## Supabase Schema

### Active Tables

```sql
-- Waitlist
CREATE TABLE waitlist (
  id serial PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  credit_amount integer DEFAULT 0,
  tier text DEFAULT NULL,
  ip_address text DEFAULT NULL
);

-- Rate limiting (service-role only)
CREATE TABLE waitlist_rate_limits (
  id serial PRIMARY KEY,
  ip_address text NOT NULL,
  attempted_at timestamptz DEFAULT now()
);
```

Both tables have RLS enabled. Anonymous select on `waitlist` only. Inserts go through Edge Functions (service role key).

**Architecture**: `Browser -> Edge Function (waitlist-signup) -> supabase insert [service role key]`. The anon INSERT policy has been dropped; only the Edge Function can write to `waitlist`. Count retrieved via `waitlist-count` Edge Function (GET, 15s cache).

### Phase 2 (designed, not yet wired): Marketplace tables

Planned: `user_profiles`, `inventory_items`, `credit_transactions`, `marketplace_listings`, `auctions`, `auction_bids`. All with RLS policies for authenticated users. Currently, marketplace state is managed in-memory via GameContext with mock data.

## Current Navigation and Tutorial Baseline (2026-02-24)

- Default gameplay route is `/vaults`.
- Bottom dock has exactly three items: `Wallet`, `Vaults`, `Locker`.
- Locker is the only tabbed hub (`/locker/inventory`, `/locker/market`, `/locker/arena`).
- Arena uses card-based menu from Locker and separate routes: `/arena/battles`, `/arena/forge`, `/arena/quests`.
- XP gates: Locker `50`, Market `150`, Arena/Battles `200`, Forge `250`, Quests `300`.
- Locked interactions use `LockedOverlay` with CTA back to `/vaults`.
- Global HUD is informational only: Credits, Energy, XP/Lv.
- Open flow reveal actions are `Cashout`, `Equip`, `Ship`; equip saves to inventory and shows green unlock/saved dialogs.
- Open micro tutorial: pick vault, spin stage, bonus stage (when triggered), reveal actions; persisted by `vaultedlabs_open_tutorial_completed`.


