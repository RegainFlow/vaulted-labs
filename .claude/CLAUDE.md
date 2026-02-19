# CLAUDE.md — VaultedLabs Project Conventions

## Project Overview

VaultedLabs is a gamified commerce platform. Users open "Vaults" to reveal collectibles, manage inventory, trade on a marketplace, and progress through an XP/level/prestige system. The repo contains a landing page (waitlist), a demo game page (vault opening with guided tutorial, Vault Lock bonus mini-game), and dedicated pages for shop, inventory, profile (with boss fights and prestige), and wallet.

## Tech Stack

- **Build**: Vite 6 with `@tailwindcss/vite` plugin
- **Framework**: React 19 with TypeScript (strict mode)
- **Routing**: React Router DOM v7 — six routes: `/` (landing), `/play` (demo game), `/shop` (listings & auctions), `/inventory` (loot management), `/profile` (XP, quests, boss fights, prestige), `/wallet`
- **State**: React Context (`GameProvider` in `src/context/GameContext.tsx`) wraps all routes — shared credits, inventory, XP, marketplace, prestige, boss fights, free spins state
- **Styling**: Tailwind CSS v4 (CSS-native config via `@theme` in `index.css`)
- **Animations**: Motion (formerly Framer Motion) — import from `motion/react`
- **Typewriter**: Typed.js — hero subtitle typing animation
- **Backend**: Supabase (waitlist email capture + real-time count via Edge Functions; marketplace schema designed for Phase 2)
- **Analytics**: PostHog (`posthog-js`) — page views, funnels, session replays, heatmaps, and custom event tracking (see `docs/POSTHOG_EVENTS.md`)
- **Anti-bot**: Cloudflare Turnstile (managed mode), server-side rate limiting (1/min + 3/hour per IP), honeypot field, timing check (3s minimum), disposable email blocklist (client + server-side)
- **Deployment target**: Vercel (SPA rewrite in `vercel.json`)

## Financial Model Constants

### Vault Levels (6 tiers)

| Level    | Price  | Common | Uncommon | Rare  | Legendary |
| -------- | ------ | ------ | -------- | ----- | --------- |
| Bronze   | $19.99 | 55.0%  | 25.0%    | 17.0% | 3.0%      |
| Silver   | $29.99 | 52.0%  | 26.0%    | 17.5% | 4.5%      |
| Gold     | $44.99 | 48.0%  | 28.0%    | 18.0% | 6.0%      |
| Platinum | $59.99 | 45.0%  | 28.0%    | 19.5% | 7.5%      |
| Obsidian | $74.99 | 42.0%  | 27.0%    | 21.0% | 10.0%     |
| Diamond  | $89.99 | 38.0%  | 26.0%    | 23.0% | 13.0%     |

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
| Platinum   | 20%          |
| Obsidian   | 30%          |
| Diamond    | 40%          |

Bronze, Silver, and Gold do not trigger the bonus round.

### User Behavior Rates

- Hold (digital): 65% — no COGS
- Cashout (credits): 20% — 100% of item value as credit
- Ship (physical): 15% — triggers COGS (~50% of item value) + $8 shipping

## Gamification System

### XP Earning

- Vault purchase: XP = vault price (e.g. $19.99 Bronze -> 19.99 XP)
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

### Boss Fights (4 encounters with reel-based combat)

| Boss             | Required Level | Credit Reward | XP Reward | Special Item   |
| ---------------- | -------------- | ------------- | --------- | -------------- |
| The Vault Keeper | 3              | 50            | 100       | Keeper's Badge |
| Chrono Shard     | 5              | 100           | 200       | Time Fragment  |
| Neon Hydra       | 8              | 200           | 400       | Hydra Scale    |
| Diamond Golem    | 12             | 500           | 1000      | Diamond Core   |

Boss fights use a reel-based combat system:
- Player and boss each have independent slot reels with rarity outcomes
- Player HP: 120; Boss HP: 120 + (requiredLevel - 3) * 8
- Attack timing window determines quality: Perfect (center), Good, Miss
- Damage = base rarity damage + quality modifier
- Player reel odds: 30% common, 35% uncommon, 25% rare, 10% legendary (constant)
- Boss reel odds: per-boss config, scaled harder by prestige level

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
1. **Navbar** — Fixed nav with wordmark + nav links + "Join" button (no HUD)
2. **Hero** — Full-viewport vault door visual with Typed.js subtitle + "Play Now" CTA + neon scroll indicator
3. **HowItWorks** — 6 steps (2 rows of 3): The Vault (Pick, Reveal, Choose) + The Platform (Shop, Level Up, Credits) with styled images
4. **AppPreview** — Benefits list (left) + iPhone mockup (right)
5. **CTASection** — "Try the Demo" button linking to `/play`
6. **WaitlistSection** — IncentiveBanner (4-tier card grid) + WaitlistForm (with post-signup feedback CTA)
7. **Footer** — Brand + feedback link + copyright

### Demo Game Page (`/play`)
1. **Navbar** — Fixed nav with HUD (credits/loot/level/free spins)
2. **VaultGrid** — Category selector, 6 vault cards, full-screen multi-stage reveal overlay, Vault Lock bonus stage
3. **Tutorial** — Guided first-time onboarding overlay (welcome -> HUD -> categories -> open vault -> pick box -> result actions) with skip support
4. **TutorialHelpButton** — Floating "?" to replay tutorial (visible after completion)
5. **Footer** — Brand + feedback link + copyright

### Shop Page (`/shop`)
1. **Navbar** — Fixed nav with HUD
2. **ShopTabs** — Listings + Auctions tabs with buy/bid functionality
3. **PageTutorial** — First-time shop tutorial
4. **Footer**

### Inventory Page (`/inventory`)
1. **Navbar** — Fixed nav with HUD
2. **InventoryGrid** — Owned items grid with status filter, Hold/Ship/Cashout/List actions
3. **PageTutorial** — First-time inventory tutorial
4. **Footer**

### Profile Page (`/profile`)
1. **Navbar** — Fixed nav with HUD
2. **ProfilePanel** — XP bar, level, stats, boss fight cards with BossFightOverlay
3. **PrestigeButton** — Shown when level >= 10 and prestige < 3; triggers PrestigeOverlay
4. **QuestList** — Active quests with progress tracking
5. **Reset Demo** — Button to clear all progress
6. **PageTutorial** — First-time profile tutorial
7. **Footer**

### Wallet Page (`/wallet`)
1. **Navbar** — Fixed nav with HUD
2. **WalletHeader** — Credit balance summary
3. **TransactionList** — Filterable credit transaction history
4. **PageTutorial** — First-time wallet tutorial
5. **Footer**

## Source Files

### Pages

| File                      | Description                                                                |
| ------------------------- | -------------------------------------------------------------------------- |
| `App.tsx`                 | Root — route shell + GameProvider wrapper + QuestToast + pageview tracking |
| `pages/LandingPage.tsx`   | Landing page composition                                                   |
| `pages/PlayPage.tsx`      | Game page with tutorial integration                                        |
| `pages/ShopPage.tsx`      | Shop page — listings + auctions via ShopTabs                               |
| `pages/InventoryPage.tsx` | Inventory page — loot grid with status filter                              |
| `pages/ProfilePage.tsx`   | Profile page — XP, quests, boss fights, prestige, demo reset               |
| `pages/WalletPage.tsx`    | Wallet page — credit balance + transaction history                         |

### Components — Shared (`components/shared/`)

| File                              | Description                                                             |
| --------------------------------- | ----------------------------------------------------------------------- |
| `shared/Navbar.tsx`               | Fixed nav with optional HUD (credits/loot/level) + contextual nav links |
| `shared/Footer.tsx`               | Footer with branding + feedback link                                    |
| `shared/PlayNowButton.tsx`        | 3D pushable CTA button with analytics tracking                          |
| `shared/FeedbackButton.tsx`       | Google Form feedback button (graceful no-op when env var missing)       |
| `shared/QuestToast.tsx`           | Quest completion toast notification                                     |
| `shared/PageTutorial.tsx`         | Reusable page tutorial overlay with welcome/spotlight/complete steps + skip + viewport-clamped tooltips |
| `shared/TutorialHelpButton.tsx`   | Floating "?" button to replay a page tutorial                           |

### Components — Landing

| File                             | Description                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| `components/Hero.tsx`            | Hero with vault door + Typed.js subtitle + CTA + neon scroll indicator                  |
| `components/HowItWorks.tsx`      | 6-step explainer (2 rows) with styled images                                            |
| `components/AppPreview.tsx`      | Benefits + phone mockup two-column layout                                               |
| `components/PhoneMockup.tsx`     | iPhone frame with auto-playing 5-screen demo                                            |
| `components/CTASection.tsx`      | "Try the Demo" CTA linking to /play                                                     |
| `components/WaitlistSection.tsx` | Lifts useWaitlistCount, passes count/loading to IncentiveBanner + WaitlistForm          |
| `components/IncentiveBanner.tsx` | 4-tier incentive card grid with per-tier colors and progress bars                       |
| `components/WaitlistForm.tsx`    | Email form with tier-aware success messaging + Edge Function integration + feedback CTA |
| `components/TurnstileWidget.tsx` | Cloudflare Turnstile CAPTCHA widget (managed mode, dark theme)                          |

### Components — Vault (`components/vault/`)

| File                              | Description                                                                            |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| `vault/VaultGrid.tsx`             | Category selector, vault cards + full-screen reveal overlay + bonus stage integration  |
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

### Components — Profile (`components/profile/`)

| File                            | Description                                                              |
| ------------------------------- | ------------------------------------------------------------------------ |
| `profile/ProfilePanel.tsx`      | XP bar, level, stats, boss fights grid                                   |
| `profile/BossFightCard.tsx`     | Locked/unlocked boss fight card                                          |
| `profile/BossFightOverlay.tsx`  | Full-screen reel-based combat UI with HP bars, attack timing, tutorials  |
| `profile/PrestigeButton.tsx`    | Prestige trigger button (shown at Level 10+, max prestige 3)            |
| `profile/PrestigeOverlay.tsx`   | Prestige celebration with particle effects, benefit badges, phase reveal |
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
| `types/gamification.ts` | `PrestigeLevel`, `LevelInfo`, `BossFight`, `BossFightCardProps`, `AttackQuality`, `DamageResult`            |
| `types/quest.ts`        | `Quest`, `QuestProgress`, `QuestToast`, `QuestCardProps`, `QuestRequirement` + related union types          |
| `types/landing.ts`      | `Step`, `IncentiveTier`, `IncentiveBannerProps`, `WaitlistFormProps`, `TurnstileWidget*`, `NavbarProps`     |
| `types/tutorial.ts`     | `TutorialStep`, `TutorialProps` (with `onSkip`), `TargetRect`, `PageTutorialStepConfig`, `PageTutorialProps` |
| `types/bonus.ts`        | `VaultLockPhase`, `VaultLockSlot`, `VaultLockBonusStageProps`, `FREE_SPIN_REWARDS`                          |

### Data (`data/`)

| File                   | Description                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `data/vaults.ts`       | Vault tiers, rarity config, pick helpers, incentive tiers, product types, vault lock strip generation, prestige odds |
| `data/gamification.ts` | XP formulas, level curve functions, boss fight config + odds, prestige boss scaling   |
| `data/mock-data.ts`    | Seed marketplace listings + auctions with mock sellers                               |
| `data/quests.ts`       | Quest definitions (onboarding, engagement, milestone categories)                     |
| `data/tutorial.ts`     | Tutorial step flow, overlay/tooltip step configs, page tutorial steps (play, wallet, profile, inventory, shop, boss fight) |
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
- One hook per file in `hooks/`
- Relative imports (no path aliases configured)
- Game state accessed via `useGame()` hook from GameContext — never local state for credits/inventory/XP/prestige/boss fights
- Types organized by domain in `types/` — import from domain file in new code (e.g. `types/vault`, `types/quest`, `types/bonus`); `types/game.ts` barrel re-export maintained for backwards compatibility
- Components organized by domain: `shared/`, `vault/`, `shop/`, `inventory/`, `profile/`, `wallet/`
- SVG icon assets in `assets/` (vault-icons, step-icons, benefits-icons, boss-icons), not inline in components
- Static images in `public/` for production-safe paths (not `src/assets/`)
- All page tutorials follow the PageTutorial pattern: welcome step -> spotlight steps -> complete step, with skip support and localStorage persistence via GameContext

## GameContext State Shape

Persisted to `localStorage` key `vaultedlabs-game-state`:

```typescript
interface PersistedState {
  creditTransactions: CreditTransaction[];
  inventory: InventoryItem[];
  xp: number;
  listings: MarketplaceListing[];
  auctions: Auction[];
  questProgress: QuestProgress[];
  hasSeenTutorial: boolean;          // /play vault tutorial
  hasSeenWalletTutorial: boolean;
  hasSeenProfileTutorial: boolean;
  hasSeenInventoryTutorial: boolean;
  hasSeenShopTutorial: boolean;
  hasSeenBossFightTutorial: boolean;
  prestigeLevel: number;             // 0-3
  defeatedBosses: string[];          // ["boss-1", ...]
  freeSpins: number;                 // from Vault Lock bonus
  nextId: number;
}
```

Key context methods: `purchaseVault`, `addItem`, `cashoutItem`, `shipItem`, `listItem`, `buyListing`, `placeBid`, `prestige`, `defeatBoss`, `grantFreeSpins`, `useFreeSpinForVault`, `tutorialOpenVault`, `seedDemoItem`, `removeDemoItem`, `resetDemo`.

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
