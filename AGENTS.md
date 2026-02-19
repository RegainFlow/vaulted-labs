# AGENTS.md

## Purpose
Repository guidance for coding agents working on VaultedLabs.

## Context Sources (Read First)
1. `README.md` (product + architecture + data model overview)
2. `docs/` (design system, analytics events, image generation canon, marketing context)
3. Code itself (`src/`, `supabase/`)

## Context7 Rule (Going Forward)
- Use Context7 for third-party library/framework behavior before making non-trivial API changes.
- Resolve library ID first, then query docs.
- Prioritize local repo docs for product rules; use Context7 for external API correctness (React, Router, Tailwind, Motion, Supabase, PostHog, Vite, etc.).
- If local implementation conflicts with external docs, preserve working local patterns unless a task explicitly requires refactor.

## Project Snapshot
- Product: Gamified commerce platform where users open vaults and get collectible outcomes.
- Frontend: React 19 + TypeScript + Vite 6.
- Routing: `react-router-dom` v7 (`/`, `/play`, `/market`).
- State: `GameProvider` in `src/context/GameContext.tsx`.
- Styling: Tailwind v4 + tokens/utilities in `src/index.css`.
- Animation: `motion/react`.
- Backend/data: Supabase (waitlist + anti-spam baseline schema in `supabase/migrations/20260218052432_init.sql`).
- Analytics: PostHog via wrappers in `src/lib/analytics.ts` and `src/lib/posthog.ts`.

## Core Product Invariants
- 6 vault tiers and fixed pricing bands are central to UX/economy (see `README.md` + `src/data/vaults.ts`).
- Rarity system: Common / Uncommon / Rare / Legendary with value multipliers.
- Post-reveal actions: Hold, Ship, Cashout.
- Waitlist incentives are tiered and position-based; messaging and UI should remain consistent with docs.

## Implementation Guardrails
- Keep shared game logic in context/data modules, not scattered across page components.
- Use design tokens/utilities from `src/index.css`; avoid introducing ad-hoc palette drift.
- Track analytics only through `trackEvent`/`trackPageView` helpers (never direct `posthog-js` usage in components).
- Keep tutorial, HUD, and marketplace interactions responsive and consistent with `docs/STYLES.md`.
- If editing imagery/prompt content, preserve the canonical VaultedLabs render universe from `docs/IMAGE_GENERATION.md`.

## Commands
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Preview: `npm run preview`

## Pre-PR Validation
- Run `npm run lint`.
- Run `npm run build`.
- Note any intentional deviations from docs in the change summary.
