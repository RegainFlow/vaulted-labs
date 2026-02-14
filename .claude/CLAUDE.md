# CLAUDE.md — VaultedLabs Project Conventions

## Project Overview

VaultedLabs is a gamified commerce platform. Users open "Vaults" to reveal collectibles, manage inventory, trade on a marketplace, and progress through an XP/level system. The repo contains a landing page (waitlist), a demo game page (vault opening), and a marketplace page (inventory, listings, auctions, profile).

## Tech Stack

- **Build**: Vite 6 with `@tailwindcss/vite` plugin
- **Framework**: React 19 with TypeScript (strict mode)
- **Routing**: React Router DOM v7 — three routes: `/` (landing), `/play` (demo game), `/market` (marketplace)
- **State**: React Context (`GameProvider` in `src/context/GameContext.tsx`) wraps all routes — shared credits, inventory, XP, marketplace state
- **Styling**: Tailwind CSS v4 (CSS-native config via `@theme` in `index.css`)
- **Animations**: Motion (formerly Framer Motion) — import from `motion/react`
- **Typewriter**: Typed.js — hero subtitle typing animation
- **Backend**: Supabase (waitlist email capture + real-time count; marketplace schema designed for Phase 2)
- **Analytics**: PostHog (`posthog-js`) — page views, funnels, session replays, heatmaps, and custom event tracking (see `docs/POSTHOG_EVENTS.md`)
- **Anti-bot**: Cloudflare Turnstile (managed mode), server-side rate limiting (1/min + 3/hour per IP), honeypot field, timing check (3s minimum), disposable email blocklist (client + server-side)
- **Deployment target**: Vercel (SPA rewrite in `vercel.json`)

## Financial Model Constants

### Vault Levels (6 tiers)

| Level | Price | Common | Uncommon | Rare | Legendary |
|-------|-------|--------|----------|------|-----------|
| Bronze | $24 | 60.5% | 18.0% | 19.8% | 1.7% |
| Silver | $38 | 59.8% | 18.8% | 18.3% | 3.1% |
| Gold | $54 | 57.9% | 29.3% | 8.6% | 4.2% |
| Platinum | $68 | 56.5% | 28.3% | 10.9% | 4.3% |
| Obsidian | $78 | 55.8% | 27.8% | 12.0% | 4.4% |
| Diamond | $86 | 55.1% | 27.3% | 13.2% | 4.4% |

### Rarity Value Multipliers (of vault price)

| Tier | Min | Max |
|------|-----|-----|
| Common | 0.40x | 0.85x |
| Uncommon | 0.85x | 1.40x |
| Rare | 1.40x | 2.20x |
| Legendary | 2.20x | 3.50x |

### User Behavior Rates

- Hold (digital): 65% — no COGS
- Cashout (credits): 20% — 100% of item value as credit
- Ship (physical): 15% — triggers COGS (~50% of item value) + $8 shipping

## Gamification System

### XP Earning

- Vault purchase: XP = vault price (e.g. $24 Bronze → 24 XP)
- Marketplace buy: XP = price paid in credits
- Auction win: XP = winning bid amount
- No XP for cashouts, ships, or listing items

### Level Curve

Quadratic: `threshold(L) = 50L² + 50L`

| Level | Cumulative XP |
|-------|--------------|
| 1 | 100 |
| 3 | 600 |
| 5 | 1,500 |
| 8 | 3,600 |
| 10 | 5,500 |
| 12 | 7,800 |

### Boss Fights (4 placeholder encounters)

| Boss | Required Level |
|------|---------------|
| The Vault Keeper | 3 |
| Chrono Shard | 5 |
| Neon Hydra | 8 |
| Diamond Golem | 12 |

### Credit Ledger

Credits are typed: `incentive` (non-withdrawable, from waitlist), `earned` (from cashouts/reveals), `spent` (purchases). Balance = sum of all transaction amounts. Starting demo balance: +100 earned.

### Waitlist Incentive Tiers (4 tiers, 450 total spots)

| Tier | Positions | Credit | Color |
|------|-----------|--------|-------|
| Founder | 1–50 | $200 | Gold `#ffd700` |
| Early Access | 51–150 | $100 | Magenta `#ff2d95` |
| Beta | 151–350 | $50 | Cyan `#00f0ff` |
| Early Bird | 351–450 | $25 | Green `#39ff14` |

## Design Tokens (defined in src/index.css @theme)

Cyber synth aesthetic: magenta neon + green neon + cyan on dark blue-shifted backgrounds.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | #0a0a0f | Blue-shifted dark background |
| `--color-surface` | #111118 | Blue-tinted card surfaces |
| `--color-surface-elevated` | #1a1a24 | Cards, modals, elevated panels |
| `--color-border` | #2a2a3a | Default border color |
| `--color-accent` | #ff2d95 | Magenta neon — CTAs, headings |
| `--color-accent-hover` | #e0267f | Magenta hover state |
| `--color-neon-cyan` | #00f0ff | Cyan — input focus, Hold accent |
| `--color-neon-cyan-hover` | #00d8e6 | Cyan hover state |
| `--color-neon-green` | #39ff14 | Green neon — success, mint labels |
| `--color-text` | #f0f0f5 | Cool-tinted white |
| `--color-text-muted` | #9a9ab0 | Cool muted text |
| `--color-text-dim` | #6a6a80 | Dimmed labels, metadata |
| `--color-vault-bronze` | #cd7f32 | Bronze tier |
| `--color-vault-silver` | #c0c0c0 | Silver tier |
| `--color-vault-gold` | #ffd700 | Gold tier |
| `--color-vault-diamond` | #b9f2ff | Diamond tier |
| `--color-rarity-common` | #9a9ab0 | Common rarity |
| `--color-rarity-uncommon` | #00f0ff | Uncommon rarity |
| `--color-rarity-rare` | #a855f7 | Rare rarity |
| `--color-rarity-legendary` | #ff2d95 | Legendary rarity |
| `--color-success` | #00f0ff | Success states |
| `--color-error` | #ff3b5c | Error states |

## Custom Utility Classes (defined in src/index.css @layer utilities)

| Class | Effect |
|-------|--------|
| `.glow-magenta` | Magenta box-shadow glow |
| `.glow-cyan` | Cyan box-shadow glow |
| `.text-glow-magenta` | Magenta text-shadow |
| `.text-glow-cyan` | Cyan text-shadow |
| `.text-glow-white` | White text-shadow |
| `.bg-clip-text` | Background-clip text fix (Firefox) |
| `.animate-gradient` | Animated gradient background flow |
| `.bg-300%` | 300% background-size for gradient animations |
| `.animate-vault-spin-slow` | Slow 60s rotation (vault rings) |
| `.animate-vault-glow-pulse` | Pulsing opacity glow (vault door) |
| `.animate-spin-slow` | Moderate 8s rotation (reveal rays) |
| `.animate-hud-shimmer` | Subtle shimmer on HUD values |
| `.animate-urgency-pulse` | Pulsing opacity for auction countdown < 5min |
| `.pushable` | 3D pushable button (Josh Comeau pattern) |

## Page Structure

### Landing Page (`/`)
1. **Navbar** — Fixed nav with wordmark + contextual nav link (Market) + "Join" button (no HUD)
2. **Hero** — Full-viewport vault door visual with Typed.js subtitle + "Play Now" CTA
3. **HowItWorks** — 3 steps: Pick → Reveal → Choose (inline SVG illustrations)
4. **AppPreview** — Benefits list (left) + iPhone mockup (right)
5. **CTASection** — "Try the Demo" button linking to `/play`
6. **WaitlistSection** — IncentiveBanner (4-tier card grid) + WaitlistForm
7. **Footer** — Brand and copyright

### Mini Game Page (`/play`)
1. **Navbar** — Fixed nav with HUD (credits/loot/level) + contextual nav link (Market)
2. **VaultGrid** — 6 vault cards, full-screen reveal overlay with 4-stage flow
3. **Footer** — Brand and copyright

### Marketplace Page (`/market`)
1. **Navbar** — Fixed nav with HUD (credits/loot/level) + contextual nav link (Play)
2. **MarketplaceTabs** — 4 tabs:
   - **My Inventory** — Grid of owned items, Hold/Ship/Cashout actions, List action (Coming Soon)
   - **Marketplace** — Browse mock listings, buy with credits
   - **Auctions** — Browse mock auctions, place bids, countdown timers
   - **Profile** — XP bar, level, stats, boss fight cards (locked/unlocked)
3. **Footer** — Brand and copyright

## Component Files

| File | Description |
|------|-------------|
| `App.tsx` | Root — route shell + GameProvider wrapper + pageview tracking |
| `pages/LandingPage.tsx` | Landing page composition |
| `pages/PlayPage.tsx` | Game page (reads from GameContext) |
| `pages/MarketplacePage.tsx` | Marketplace page with tabs |
| `context/GameContext.tsx` | GameProvider + useGame hook — credits, inventory, XP, listings, auctions |
| `types/game.ts` | Shared types: InventoryItem, CreditTransaction, MarketplaceListing, Auction, BossFight, LevelInfo |
| `components/Navbar.tsx` | Fixed nav with optional HUD (`showHUD`, `balance`, `inventoryCount`, `level`) + contextual nav link |
| `components/Hero.tsx` | Hero with vault door + Typed.js subtitle + CTA |
| `components/HowItWorks.tsx` | 3-step explainer with inline SVG illustrations |
| `components/AppPreview.tsx` | Benefits + phone mockup two-column layout |
| `components/PhoneMockup.tsx` | iPhone frame with auto-playing 5-screen demo |
| `components/CTASection.tsx` | "Try the Demo" CTA linking to /play |
| `components/WaitlistSection.tsx` | Lifts useWaitlistCount, passes count/loading to IncentiveBanner + WaitlistForm |
| `components/IncentiveBanner.tsx` | 4-tier incentive card grid with per-tier colors and progress bars |
| `components/WaitlistForm.tsx` | Email form with tier-aware success messaging + Edge Function integration |
| `components/TurnstileWidget.tsx` | Cloudflare Turnstile CAPTCHA widget (managed mode, dark theme) |
| `components/VaultGrid.tsx` | Vault cards + full-screen 4-stage reveal overlay (uses GameContext) |
| `components/VaultCard.tsx` | Individual vault card with rarity bars |
| `components/VaultIcons.tsx` | SVG mineral/ore icons per tier |
| `components/PlayNowButton.tsx` | 3D pushable CTA button with analytics tracking |
| `components/Footer.tsx` | Footer with branding |
| `components/marketplace/MarketplaceTabs.tsx` | 4-tab navigation + active tab rendering |
| `components/marketplace/InventoryGrid.tsx` | Inventory grid with status filter |
| `components/marketplace/InventoryItemCard.tsx` | Item card with Hold/Ship/Cashout/List actions |
| `components/marketplace/ListingGrid.tsx` | Marketplace listings grid |
| `components/marketplace/ListingCard.tsx` | Listing card with Buy button |
| `components/marketplace/AuctionGrid.tsx` | Auctions grid with countdown timers |
| `components/marketplace/AuctionCard.tsx` | Auction card with bid input + timer |
| `components/marketplace/ProfilePanel.tsx` | XP bar, level, stats, boss fights grid |
| `components/marketplace/BossFightCard.tsx` | Locked/unlocked boss fight card |
| `data/vaults.ts` | Vault tiers, rarity config, pick helpers, incentive tiers |
| `data/gamification.ts` | XP formulas, level curve functions, boss fight config |
| `data/mock-data.ts` | Seed marketplace listings (8) + auctions (5) with mock sellers |
| `hooks/useWaitlistCount.ts` | Real-time waitlist count hook |
| `lib/supabase.ts` | Supabase client (null when unconfigured) |
| `lib/posthog.ts` | PostHog client init (graceful no-op when unconfigured) |
| `lib/analytics.ts` | Thin analytics wrapper — `trackEvent`, `trackPageView`, `AnalyticsEvents` |
| `lib/disposable-emails.ts` | Disposable email domain checker |
| `supabase/functions/waitlist-signup/index.ts` | Edge Function — Turnstile verify, rate limit, disposable check, insert |
| `supabase/migrations/005_spam_hardening.sql` | Migration — ip_address column, rate_limits table, drop anon INSERT |

## Documentation Lookup

- **Always check Context7** (via `resolve-library-id` → `query-docs`) before writing or modifying code that uses any library or framework. This ensures implementations use up-to-date APIs and best practices rather than relying on potentially outdated training data.

## Coding Conventions

- Functional components only (no class components)
- Named exports for components, default export only for App.tsx
- Props interfaces named `{ComponentName}Props`
- Tailwind utility classes directly on elements (no @apply except in index.css)
- Motion animations: keep lightweight — subtle hovers, gentle scroll reveals, polished form feedback
- Mobile-first responsive design: use `sm:`, `md:`, `lg:` breakpoints for progressive enhancement
- One hook per file in `hooks/`
- Relative imports (no path aliases configured)
- Game state accessed via `useGame()` hook from GameContext — never local state for credits/inventory/XP

## Commands

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
```

## Environment Variables

Supabase credentials in `.env` (not committed):

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_DEFAULT_API_KEY` — Supabase anon/public key
- `VITE_POSTHOG_KEY` — PostHog project API key
- `VITE_POSTHOG_HOST` — PostHog ingest host (e.g. `https://us.i.posthog.com`)
- `VITE_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key (widget hidden when missing)

Copy `.env.example` to `.env` and fill in values. PostHog and Turnstile gracefully no-op when env vars are missing.

Server-side secrets (set in Supabase Edge Function config, not in `.env`):
- `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile secret key (Turnstile validation skipped when missing)
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — auto-provided by Supabase Edge Functions runtime

## Supabase Schema

### Active: `waitlist` table

```sql
CREATE TABLE waitlist (
  id serial PRIMARY KEY,
  email text UNIQUE NOT NULL,
  credit_amount integer DEFAULT 0,
  tier text DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);
```

RLS: anonymous select enabled. Inserts go through the `waitlist-signup` Edge Function (service role key), not the anon key.

**Architecture**: `Browser → Edge Function (waitlist-signup) → supabase insert [service role key]`. The anon INSERT policy has been dropped; only the Edge Function can write to `waitlist`.

### Phase 2 (designed, not yet wired): Marketplace tables

Migration `004_marketplace_schema.sql` defines: `user_profiles`, `inventory_items`, `credit_transactions`, `marketplace_listings`, `auctions`, `auction_bids`. All with RLS policies for authenticated users. Currently, marketplace state is managed in-memory via GameContext with mock data.
