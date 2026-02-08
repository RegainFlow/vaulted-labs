# CLAUDE.md — VaultedLabs Project Conventions

## Project Overview

VaultedLabs is a mystery-box / collectibles platform. This repo contains a "Fake Front Door" landing page to validate demand via a waitlist.

## Repository Structure

- `FFD_PLAN.md` — Original spec with financial analysis and technical plan
- `src/` — Vite + React 19 + TypeScript + Tailwind CSS v4 SPA

## Tech Stack

- **Build**: Vite 6 with `@tailwindcss/vite` plugin
- **Framework**: React 19 with TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (CSS-native config via `@theme` in `index.css`)
- **Animations**: Motion (formerly Framer Motion) — import from `motion/react`
- **Backend**: Supabase (email capture + waitlist count)
- **Deployment target**: Vercel

## Design Tokens (defined in src/index.css @theme)

Cyber synth aesthetic: magenta neon + green neon + cyan on dark blue-shifted backgrounds.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | #0a0a0f | Blue-shifted dark background |
| `--color-surface` | #111118 | Blue-tinted card surfaces |
| `--color-accent` | #ff2d95 | Magenta neon — CTAs, headings |
| `--color-neon-green` | #39ff14 | Green neon — stats, success |
| `--color-neon-cyan` | #00f0ff | Cyan — input focus, Hold accent |
| `--color-text` | #f0f0f5 | Cool-tinted white |
| `--color-text-muted` | #9a9ab0 | Cool muted |
| `--color-vault-bronze` | #cd7f32 | Bronze tier |
| `--color-vault-silver` | #c0c0c0 | Silver tier |
| `--color-vault-gold` | #ffd700 | Gold tier |
| `--color-vault-diamond` | #b9f2ff | Diamond tier |
| `--color-rarity-*` | various | Common, Uncommon, Rare, Legendary |

## Page Sections (top to bottom)

1. Navbar — Sticky nav with neon wordmark + CTA
2. Hero — Full-viewport hero with magenta/cyan radial glow
3. VaultExperience — Auto-playing 3-step vault→box→reveal flow
4. YourChoice — Hold / Ship / Cash Out options (cyan/green/magenta)
5. VaultTiers — 4 vault cards with rarity probability bars
6. IncentiveBanner — $100 credit offer + live progress bar
7. WaitlistForm — Email capture with success/error states
8. Footer — Brand, links, copyright

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
- `VITE_SUPABASE_DEFAULT_API_KEY` — Supabase default api key

Copy `.env.example` to `.env` and fill in values.

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
