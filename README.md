# VaultedLabs - Gamified Commerce Platform

VaultedLabs is a next-generation commerce platform that turns shopping into a high-stakes, high-reward experience. Users unlock "Vaults" to reveal curated products, with a guaranteed value mechanism ensuring every spin is a win.

## Features

- **Gamified Unboxing:** Interactive vault opening experience with tiered rarity systems.
- **Provably Fair:** Transparent odds displayed for every vault tier.
- **Tier System:** 4 vault levels (Bronze $24, Silver $38, Gold $54, Diamond $86) with unique visual themes and probability curves.
- **Rarity Tiers:** Common, Uncommon, Rare, Legendary — each with value multipliers relative to vault price.
- **Guaranteed Liquidity:** Instant buyback option for platform credits or global shipping for physical items.
- **Three Liquidity Options:** Hold in your digital collection, ship to your door, or cash out for credits.

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite 6
- **Routing:** React Router DOM v7 (`/` landing, `/play` demo game)
- **Styling:** Tailwind CSS v4 (CSS-native `@theme` config)
- **Animation:** Motion (formerly Framer Motion) — `motion/react`
- **Typewriter:** Typed.js — hero subtitle typing animation
- **Icons:** Custom SVG mineral/ore iconography per tier + inline SVG illustrations
- **Backend:** Supabase (waitlist email capture + real-time count)
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
  App.tsx                  # Root — route shell (/ → LandingPage, /play → PlayPage)
  index.css                # Tailwind v4 @theme tokens and custom utilities
  main.tsx                 # Entry point
  pages/
    LandingPage.tsx        # Landing page composition
    PlayPage.tsx           # Game page with balance/inventory state
  components/
    Navbar.tsx             # Fixed nav with optional HUD (showHUD prop)
    Hero.tsx               # Vault door hero with Typed.js subtitle + "Play Now" CTA
    HowItWorks.tsx         # 3-step explainer with inline SVG illustrations
    AppPreview.tsx         # Benefits + phone mockup two-column layout
    PhoneMockup.tsx        # iPhone frame with auto-playing 5-screen demo
    CTASection.tsx         # "Try the Demo" CTA linking to /play
    WaitlistSection.tsx    # Wrapper for IncentiveBanner + WaitlistForm
    IncentiveBanner.tsx    # $100 credit banner with progress bar
    WaitlistForm.tsx       # Email capture form with Supabase integration
    PlayNowButton.tsx      # 3D pushable CTA button
    VaultGrid.tsx          # Mini game: vault cards + inline reveal panel
    VaultCard.tsx          # Individual vault card with rarity bars
    VaultIcons.tsx         # SVG mineral icons per tier (Bronze/Silver/Gold/Diamond)
    Footer.tsx             # Brand and copyright
  data/
    vaults.ts              # Vault tier definitions (4 tiers), rarity config, helpers
  hooks/
    useWaitlistCount.ts    # Real-time Supabase waitlist count
  lib/
    supabase.ts            # Supabase client initialization
    disposable-emails.ts   # Disposable email domain checker
docs/
  STYLES.md                # Design system and style guide
```

## Financial Model Constants

| Vault Level | Price | Common | Uncommon | Rare | Legendary |
|-------------|-------|--------|----------|------|-----------|
| Bronze      | $24   | 60.5%  | 18.0%    | 19.8%| 1.7%     |
| Silver      | $38   | 59.8%  | 18.8%    | 18.3%| 3.1%     |
| Gold        | $54   | 57.9%  | 29.3%    | 8.6% | 4.2%     |
| Diamond     | $86   | 55.1%  | 27.3%    | 13.2%| 4.4%     |

**Rarity Value Multipliers** (of vault price):
- Common: 0.40x – 0.85x
- Uncommon: 0.85x – 1.40x
- Rare: 1.40x – 2.20x
- Legendary: 2.20x – 3.50x

**User Behavior Rates:** Hold 65%, Cashout 20%, Ship 15%
