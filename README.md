# VaultedLabs - Gamified Commerce Platform

VaultedLabs is a next-generation commerce platform that turns shopping into a high-stakes, high-reward experience. Users unlock "Vaults" to reveal curated products, with a guaranteed value mechanism ensuring every spin is a win.

## Features

- **Gamified Unboxing:** Interactive vault opening experience with tiered rarity systems.
- **Provably Fair:** Transparent odds displayed for every vault tier.
- **Tier System:** 6 tiers from Bronze to Diamond, each with unique visual themes and probability curves.
- **Guaranteed Liquidity:** Instant buyback option for platform credits or global shipping for physical items.
- **Three Liquidity Options:** Hold in your digital collection, ship to your door, or cash out for credits.

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite 6
- **Styling:** Tailwind CSS v4 (CSS-native `@theme` config)
- **Animation:** Motion (formerly Framer Motion) — `motion/react`
- **Icons:** Custom SVG mineral/ore iconography per tier
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
  App.tsx                  # Root component and state management
  index.css                # Tailwind v4 @theme tokens and custom utilities
  main.tsx                 # Entry point
  components/
    Navbar.tsx             # Fixed nav with Credits/Loot HUD
    Hero.tsx               # Vault door hero with access key CTA
    ProductMockupSection.tsx # Auto-playing mobile app preview
    VaultTiers.tsx         # Vault card grid with lock gate
    VaultCard.tsx          # Individual vault card with rarity bars
    VaultOverlay.tsx       # Full-screen unboxing modal (4 stages)
    VaultIcons.tsx         # SVG mineral icons per tier
    GuaranteedWins.tsx     # Trust/value proposition section
    YourChoice.tsx         # Hold / Ship / Cash Out options
    IncentiveBanner.tsx    # $100 credit incentive with progress bar
    WaitlistForm.tsx       # Email capture form
    Footer.tsx             # Brand and copyright
  data/
    vaults.ts              # Vault tier definitions (6 tiers)
  hooks/
    useWaitlistCount.ts    # Real-time Supabase waitlist count
  lib/
    supabase.ts            # Supabase client initialization
    disposable-emails.ts   # Disposable email domain checker
docs/
  STYLES.md                # Design system and style guide
```
