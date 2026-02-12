# CLAUDE.md — VaultedLabs Project Conventions

## Project Overview

VaultedLabs is a mystery-box / collectibles platform. This repo contains a "Fake Front Door" landing page to validate demand via a waitlist.

## Repository Structure

- `FFD_PLAN.md` — Original spec with financial analysis and technical plan
- `src/` — Vite + React 19 + TypeScript + Tailwind CSS v4 SPA
- `docs/STYLES.md` — Design system and styling reference

## Tech Stack

- **Build**: Vite 6 with `@tailwindcss/vite` plugin
- **Framework**: React 19 with TypeScript (strict mode)
- **Routing**: React Router DOM v7 (`react-router-dom`) — two routes: `/` (landing) and `/play` (demo game)
- **Styling**: Tailwind CSS v4 (CSS-native config via `@theme` in `index.css`)
- **Animations**: Motion (formerly Framer Motion) — import from `motion/react`
- **Backend**: Supabase (email capture + waitlist count)
- **Analytics**: Vercel Analytics (`@vercel/analytics`) — page views + custom conversion events
- **Anti-bot**: Honeypot field, timing check (3s minimum), disposable email blocklist (`disposable-email-domains`)
- **Deployment target**: Vercel (SPA rewrite in `vercel.json`)

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
| `--color-rarity-common`    | #9a9ab0 | Common rarity                     |
| `--color-rarity-uncommon`  | #00f0ff | Uncommon rarity                   |
| `--color-rarity-rare`      | #a855f7 | Rare rarity                       |
| `--color-rarity-legendary` | #ff2d95 | Legendary rarity                  |
| `--color-success`          | #00f0ff | Success states                    |
| `--color-error`            | #ff3b5c | Error states                      |

## Custom Utility Classes (defined in src/index.css @layer utilities)

| Class                       | Effect                                       |
| --------------------------- | -------------------------------------------- |
| `.glow-magenta`             | Magenta box-shadow glow                      |
| `.glow-cyan`                | Cyan box-shadow glow                         |
| `.text-glow-magenta`        | Magenta text-shadow                          |
| `.text-glow-cyan`           | Cyan text-shadow                             |
| `.text-glow-white`          | White text-shadow                            |
| `.bg-clip-text`             | Background-clip text fix (Firefox)           |
| `.animate-gradient`         | Animated gradient background flow            |
| `.bg-300%`                  | 300% background-size for gradient animations |
| `.animate-vault-spin-slow`  | Slow 60s rotation (vault rings)              |
| `.animate-vault-glow-pulse` | Pulsing opacity glow (vault door)            |
| `.animate-spin-slow`        | Moderate 8s rotation (reveal rays)           |
| `.animate-hud-shimmer`      | Subtle shimmer on HUD values                 |

## Page Structure

### Landing Page (`/`)
1. **Navbar** — Fixed nav with neon wordmark + "Join" button (no HUD)
2. **Hero** — Full-viewport vault door visual with "Join Now" CTA
3. **HowItWorks** — 3 steps: Pick → Reveal → Choose
4. **AppPreview** — Benefits list (left) + iPhone mockup (right)
5. **CTASection** — "Try the Demo" button linking to `/play`
6. **WaitlistSection** — IncentiveBanner + WaitlistForm
7. **Footer** — Brand and copyright

### Mini Game Page (`/play`)
1. **Navbar** — Fixed nav with HUD (credits/loot)
2. **VaultGrid** — 6 vault cards, inline reveal panel (no overlay)
3. **Footer** — Brand and copyright

## Component Files

| File                                  | Description                                                       |
| ------------------------------------- | ----------------------------------------------------------------- |
| `App.tsx`                             | Root — route shell (`/` → LandingPage, `/play` → PlayPage)  |
| `pages/LandingPage.tsx`              | Landing page composition                                     |
| `pages/PlayPage.tsx`                 | Game page with balance/inventory state                        |
| `components/Navbar.tsx`              | Fixed nav with optional HUD (`showHUD` prop)                  |
| `components/Hero.tsx`                | Hero section with vault door + "Join Now" CTA                 |
| `components/HowItWorks.tsx`          | 3-step explainer section                                      |
| `components/AppPreview.tsx`          | Benefits + phone mockup two-column layout                     |
| `components/PhoneMockup.tsx`         | iPhone frame with auto-playing 5-screen demo                  |
| `components/CTASection.tsx`          | "Try the Demo" CTA linking to /play                           |
| `components/WaitlistSection.tsx`     | Wrapper for IncentiveBanner + WaitlistForm                    |
| `components/VaultGrid.tsx`           | Mini game: vault cards + inline reveal panel                  |
| `components/VaultCard.tsx`           | Individual vault card with rarity bars                        |
| `components/VaultIcons.tsx`          | SVG mineral/ore icons per tier                                |
| `components/IncentiveBanner.tsx`     | $100 credit banner with progress bar                          |
| `components/WaitlistForm.tsx`        | Email form with Supabase integration                          |
| `components/Footer.tsx`              | Footer with branding                                          |
| `data/vaults.ts`                     | Vault tier data (6 tiers, interfaces)                         |
| `hooks/useWaitlistCount.ts`          | Real-time waitlist count hook                                 |
| `lib/supabase.ts`                    | Supabase client (null when unconfigured)                      |
| `lib/disposable-emails.ts`           | Disposable email domain checker                               |

## Documentation Lookup

- **Always check Context7** (via `resolve-library-id` → `query-docs`) before writing or modifying code that uses any library or framework. This ensures implementations use up-to-date APIs and best practices rather than relying on potentially outdated training data.

## Coding Conventions

- Functional components only (no class components)
- Named exports for components, default export only for App.tsx
- Props interfaces named `{ComponentName}Props`
- Tailwind utility classes directly on elements (no @apply except in index.css)
- Motion animations: keep lightweight — subtle hovers, gentle scroll reveals, polished form feedback
- One hook per file in `hooks/`
- Relative imports (no path aliases configured)

## Commands

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
```

## Environment Variables

Supabase credentials in `.env` (not committed):

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_DEFAULT_API_KEY=` — Supabase anon/public key

Copy `.env.example` to `.env` and fill in values. Vercel Analytics requires no env vars — it auto-detects when deployed to Vercel.

## Supabase Schema

Table: `waitlist`

```sql
CREATE TABLE waitlist (
  id serial PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON waitlist
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous select count" ON waitlist
  FOR SELECT TO anon USING (true);
```
