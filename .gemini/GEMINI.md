# GEMINI.md — VaultedLabs Project Conventions

## Project Overview

VaultedLabs is a gamified commerce platform. Users open "Vaults" to reveal collectibles, manage inventory, trade on a marketplace, and progress through an XP/level/prestige system. The repo contains a landing page (waitlist), a demo game page (vault opening with guided tutorial), and dedicated pages for shop, inventory, profile, and wallet.

## Tech Stack

- **Build**: Vite 6 with `@tailwindcss/vite` plugin
- **Framework**: React 19 with TypeScript (strict mode)
- **Routing**: React Router DOM v7 — routes: `/` (landing), `/play` (demo game), `/shop` (listings & auctions), `/inventory` (loot management), `/profile` (XP, quests, boss fights), `/wallet`
- **State**: React Context (`GameProvider` in `src/context/GameContext.tsx`) — shared credits, inventory, XP, marketplace state
- **Styling**: Tailwind CSS v4 (CSS-native config via `@theme` in `index.css`)
- **Animations**: Motion (formerly Framer Motion) — import from `motion/react`
- **Typewriter**: Typed.js — hero subtitle typing animation
- **Backend**: Supabase (waitlist email capture + real-time count; marketplace schema designed for Phase 2)
- **Analytics**: 
  - **PostHog**: Custom events, funnels, heatmaps (see `docs/POSTHOG_EVENTS.md`). Use `trackEvent` from `src/lib/analytics.ts`.
  - **Vercel Analytics**: Page views and custom conversion events.
- **Anti-bot**: Cloudflare Turnstile, server-side rate limiting, honeypot field, timing check, disposable email blocklist
- **Deployment target**: Vercel (SPA rewrite in `vercel.json`)

## Documentation Lookup (CRITICAL)

- **Always check Context7** (via `resolve-library-id` → `query-docs`) before writing or modifying code that uses any library or framework. This ensures implementations use up-to-date APIs and best practices.

## Financial Model Constants

### Vault Levels (6 tiers)

| Level    | Price  | Common | Uncommon | Rare  | Legendary | Token |
| -------- | ------ | ------ | -------- | ----- | --------- | ----- |
| Bronze   | $19.99 | 55.0%  | 25.0%    | 17.0% | 3.0%      | `vault-bronze` |
| Silver   | $29.99 | 52.0%  | 26.0%    | 17.5% | 4.5%      | `vault-silver` |
| Gold     | $44.99 | 48.0%  | 28.0%    | 18.0% | 6.0%      | `vault-gold` |
| Platinum | $59.99 | 45.0%  | 28.0%    | 19.5% | 7.5%      | *(inline)* |
| Obsidian | $74.99 | 42.0%  | 27.0%    | 21.0% | 10.0%     | *(inline)* |
| Diamond  | $89.99 | 38.0%  | 26.0%    | 23.0% | 13.0%     | `vault-diamond` |

### Rarity Value Multipliers (of vault price)

- **Common**: 0.40x – 0.85x (`rarity-common`: #6B7280)
- **Uncommon**: 0.85x – 1.40x (`rarity-uncommon`: #3B82F6)
- **Rare**: 1.40x – 2.20x (`rarity-rare`: #a855f7)
- **Legendary**: 2.20x – 3.50x (`rarity-legendary`: #FFD700)

### User Behavior Rates

- **Hold (digital)**: 65% — no COGS
- **Cashout (credits)**: 20% — 100% of item value as credit
- **Ship (physical)**: 15% — triggers COGS (~50% of item value) + $8 shipping

## Gamification & Prestige

### XP & Levels
- **XP Earning**: Vault purchase (XP = price), Marketplace buy (XP = price).
- **Level Curve**: Quadratic `threshold(L) = 50L² + 50L`.
- **Prestige**: Resetting at max level (or milestone) to gain permanent odds buffs. 
  - Each prestige level shifts 4% from common → higher rarities.
  - Boss fights scale in difficulty (+5% enemy legendary odds per prestige).

### Boss Fights (4 encounters)
| Boss | Level | Reward |
| --- | --- | --- |
| The Vault Keeper | 3 | Keeper's Badge + 50 CR |
| Chrono Shard | 5 | Time Fragment + 100 CR |
| Neon Hydra | 8 | Hydra Scale + 200 CR |
| Diamond Golem | 12 | Diamond Core + 500 CR |

### Wallet
- **Credits**: `incentive` (non-withdrawable), `earned` (cashouts/reveals), `spent` (purchases).

## Design System (Cyber Synth Aesthetic)

Detailed in `docs/STYLES.md`.

### Core Palette
| Token | Value | Usage |
| --- | --- | --- |
| `--color-bg` | #0a0a0f | Dark background |
| `--color-surface` | #111118 | Card surfaces |
| `--color-surface-elevated` | #1a1a24 | Elevated panels |
| `--color-accent` | #ff2d95 | Magenta neon (Primary CTA) |
| `--color-neon-cyan` | #00f0ff | Cyan neon (Focus/Hold) |
| `--color-neon-green` | #39ff14 | Green neon (Success/Mint) |

### Typography
- **Primary**: `Inter` (sans-serif)
- **Monospace**: `font-mono` for stats, prices, countdowns.

### Custom Utilities
- `.glow-magenta`, `.glow-cyan`: Box-shadow glows.
- `.text-glow-magenta`, `.text-glow-cyan`, `.text-glow-white`: Text-shadow glows.
- `.pushable`: 3D pushable button pattern (shadow/edge/front).
- `.animate-vault-spin-slow`: 60s rotation for vault rings.

## Coding Conventions

- **Components**: Functional only. Named exports. Props: `{ComponentName}Props`.
- **Styling**: Tailwind v4 utility classes. No `@apply` except in `index.css`.
- **Animations**: `motion/react`. Lightweight, subtle hovers/reveals.
- **State**: Access via `useGame()`. Never use local state for global game values.
- **Responsive**: Mobile-first (`sm:`, `md:`, `lg:`).
- **Icons**: Shared SVG components in `assets/`. Do not inline unless unique.
- **Analytics**: Always use `trackEvent(AnalyticsEvents.EVENT_NAME, { ...props })` from `src/lib/analytics.ts`. Never import `posthog-js` directly into components.
- **Verification**: Run `npm run lint`, `tsc -b`, and `npm run build` after major changes.

## Source Files & Directory Structure

- `src/components/shared/`: Reusable UI (Navbar, Footer, PageTutorial, etc.).
- `src/components/[domain]/`: Domain-specific components (vault, shop, inventory, profile, wallet).
- `src/data/`: Game constants, mock data, curves, and definitions.
- `src/hooks/`: Business logic hooks (e.g., `useTutorial`, `useWaitlistCount`).
- `src/lib/`: Client initializations (Supabase, PostHog, Analytics).
- `src/types/`: Domain-specific TypeScript interfaces.

## Environment Variables

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase endpoint |
| `VITE_SUPABASE_DEFAULT_API_KEY` | Supabase public key |
| `VITE_POSTHOG_KEY` | PostHog API key |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile key |
| `VITE_FEEDBACK_FORM_PREFILL_URL` | Google Form link |
