# VaultedLabs - Gamified Commerce Platform

VaultedLabs is a next-generation commerce platform that turns shopping into a high-stakes, high-reward experience. Users unlock "Vaults" to reveal curated products, with a guaranteed value mechanism ensuring every spin is a win.

## Features

- **Gamified Unboxing:** Interactive vault opening experience with tiered rarity systems.
- **Provably Fair:** Transparent odds displayed for every vault tier.
- **Tier System:** 6 vault levels (Bronze $24, Silver $38, Gold $54, Platinum $68, Obsidian $78, Diamond $86) with unique visual themes and probability curves.
- **Rarity Tiers:** Common, Uncommon, Rare, Legendary — each with value multipliers relative to vault price.
- **Three Liquidity Options:** Hold in your digital collection, ship to your door, or cash out for platform credits.
- **Marketplace:** Browse and buy items from other users, or bid on auctions — all using platform credits.
- **Gamification:** XP earned from spending, level progression, and boss fight unlocks tied to player level.
- **Wallet:** Typed credit system (incentive / earned / spent) with non-withdrawable incentive credits.
- **Tiered Waitlist Incentives:** 4-tier descending credit rewards for early signups (Founder $200 → Early Bird $25).

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite 6
- **Routing:** React Router DOM v7 (`/` landing, `/play` demo game, `/market` marketplace)
- **State:** React Context (`GameProvider`) for shared game state across routes
- **Styling:** Tailwind CSS v4 (CSS-native `@theme` config)
- **Animation:** Motion (formerly Framer Motion) — `motion/react`
- **Typewriter:** Typed.js — hero subtitle typing animation
- **Icons:** Custom SVG mineral/ore iconography per tier + inline SVG illustrations
- **Backend:** Supabase (waitlist email capture + real-time count; marketplace schema designed for Phase 2)
- **Analytics:** Vercel Analytics (page views + custom conversion events)
- **Anti-bot:** Honeypot, timing gate, disposable email blocklist

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Configure Environment (optional):**
    ```bash
    cp .env.example .env
    # Fill in VITE_SUPABASE_URL and VITE_SUPABASE_DEFAULT_API_KEY
    ```
    The app works without Supabase configured (falls back to mock success).
    Vercel Analytics auto-activates when deployed to Vercel — no env vars needed.

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

4.  **Build for Production:**
    ```bash
    npm run build
    ```

## Project Structure

```
src/
  App.tsx                       # Root — route shell + GameProvider wrapper
  index.css                     # Tailwind v4 @theme tokens and custom utilities
  main.tsx                      # Entry point
  types/
    game.ts                     # Shared types: InventoryItem, CreditTransaction, Auction, etc.
  context/
    GameContext.tsx              # GameProvider — shared state (credits, inventory, XP, marketplace)
  pages/
    LandingPage.tsx             # Landing page composition
    PlayPage.tsx                # Game page (vault opening, reads from GameContext)
    MarketplacePage.tsx         # Marketplace page (inventory, listings, auctions, profile)
  components/
    Navbar.tsx                  # Fixed nav with contextual nav link + optional HUD (credits/loot/level)
    Hero.tsx                    # Vault door hero with Typed.js subtitle + "Play Now" CTA
    HowItWorks.tsx              # 3-step explainer with inline SVG illustrations
    AppPreview.tsx              # Benefits + phone mockup two-column layout
    PhoneMockup.tsx             # iPhone frame with auto-playing 5-screen demo
    CTASection.tsx              # "Try the Demo" CTA linking to /play
    WaitlistSection.tsx         # Wrapper: lifts useWaitlistCount, passes to children
    IncentiveBanner.tsx         # 4-tier incentive card grid with progress bars
    WaitlistForm.tsx            # Email capture with tier-aware success messaging
    PlayNowButton.tsx           # 3D pushable CTA button
    VaultGrid.tsx               # Vault cards + full-screen reveal overlay (reads from GameContext)
    VaultCard.tsx               # Individual vault card with rarity bars
    VaultIcons.tsx              # SVG mineral icons per tier
    Footer.tsx                  # Brand and copyright
    marketplace/
      MarketplaceTabs.tsx       # 4-tab navigation (Inventory, Marketplace, Auctions, Profile)
      InventoryGrid.tsx         # Grid of owned items with status filter
      InventoryItemCard.tsx     # Item card with Hold/Ship/Cashout actions
      ListingGrid.tsx           # Browse marketplace listings
      ListingCard.tsx           # Listing card with Buy button
      AuctionGrid.tsx           # Browse active auctions
      AuctionCard.tsx           # Auction card with countdown timer + bid input
      ProfilePanel.tsx          # XP bar, level display, stats, boss fights grid
      BossFightCard.tsx         # Locked/unlocked boss fight placeholder card
  data/
    vaults.ts                   # Vault tiers, rarity config, helpers, incentive tiers
    gamification.ts             # XP formulas, level curve, boss fight config
    mock-data.ts                # Seed marketplace listings + auctions
  hooks/
    useWaitlistCount.ts         # Real-time Supabase waitlist count
  lib/
    supabase.ts                 # Supabase client initialization
    disposable-emails.ts        # Disposable email domain checker
docs/
  STYLES.md                     # Design system and style guide
supabase/
  migrations/
    001_create_waitlist.sql     # Waitlist table + RLS
    002_waitlist_indexes.sql    # Email + created_at indexes
    003_waitlist_incentive_tier.sql  # credit_amount + tier columns
    004_marketplace_schema.sql  # Phase 2: inventory, credits, listings, auctions, profiles
```

## Financial Model Constants

| Vault Level | Price | Common | Uncommon | Rare  | Legendary |
| ----------- | ----- | ------ | -------- | ----- | --------- |
| Bronze      | $24   | 60.5%  | 18.0%    | 19.8% | 1.7%      |
| Silver      | $38   | 59.8%  | 18.8%    | 18.3% | 3.1%      |
| Gold        | $54   | 57.9%  | 29.3%    | 8.6%  | 4.2%      |
| Platinum    | $68   | 56.5%  | 28.3%    | 10.9% | 4.3%      |
| Obsidian    | $78   | 55.8%  | 27.8%    | 12.0% | 4.4%      |
| Diamond     | $86   | 55.1%  | 27.3%    | 13.2% | 4.4%      |

**Rarity Value Multipliers** (of vault price):
- Common: 0.40x – 0.85x
- Uncommon: 0.85x – 1.40x
- Rare: 1.40x – 2.20x
- Legendary: 2.20x – 3.50x

**User Behavior Rates:** Hold 65%, Cashout 20%, Ship 15%

## Gamification

- **XP:** Earned from vault purchases (XP = price) and marketplace buys. No XP for cashouts/ships.
- **Level Curve:** Quadratic — `threshold(L) = 50L² + 50L`. Level 1 at 100 XP, Level 5 at 1,500 XP, Level 10 at 5,500 XP.
- **Boss Fights:** 4 placeholder encounters unlocked at levels 3, 5, 8, and 12.

## Waitlist Incentive Tiers

| Tier         | Positions | Credit | Color   |
| ------------ | --------- | ------ | ------- |
| Founder      | 1–50      | $200   | Gold    |
| Early Access | 51–150    | $100   | Magenta |
| Beta         | 151–350   | $50    | Cyan    |
| Early Bird   | 351–450   | $25    | Green   |

Credits are applied to vault purchases and cannot be withdrawn as cash.
