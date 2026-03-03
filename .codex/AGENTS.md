# AGENTS.md

## Purpose
Repository guidance for coding agents working on VaultedLabs.

## Context Sources (Read First)
1. `README.md` (product + architecture + data model overview)
2. `docs/` (design system, analytics events, image generation canon, marketing context)
3. Code itself (`src/`, `supabase/`)
4. ignore `/scripts` at the root dir

## Context7 Rule (Going Forward)
- Use Context7 for third-party library/framework behavior before making non-trivial API changes.
- Resolve library ID first, then query docs.
- Prioritize local repo docs for product rules; use Context7 for external API correctness (React, Router, Tailwind, Motion, Supabase, PostHog, Vite, etc.).
- If local implementation conflicts with external docs, preserve working local patterns unless a task explicitly requires refactor.

## Project Snapshot
- Product: Gamified commerce platform where users open vaults and get collectible outcomes.
- Frontend: React 19 + TypeScript + Vite 6.
- Routing: `react-router-dom` v7 (`/`, `/vaults`, `/locker/*`, `/arena/*`, `/wallet`).
- State: `GameProvider` in `src/context/GameContext.tsx`.
- Styling: Tailwind v4 + tokens/utilities in `src/index.css`.
- Animation: `motion/react`.
- Backend/data: Supabase (waitlist, provably fair edge functions, fairness tables behind RLS).
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
- Outcome RNG changes are cross-stack changes. Keep client fair-core behavior, edge-function fair-core behavior, legal docs, public fairness page, README, styles, and AGENTS in sync.
- Edge functions must stay Deno-safe. Do not import frontend-only modules like `src/data/*` into `supabase/functions/*`; use `_shared` Deno-safe modules or pass required candidate data in the request payload.
- Provably fair tables are service-role only behind RLS. Do not add direct client reads/writes to `provably_fair_commits` or `provably_fair_receipts`.
- Supabase function config now relies on top-level `[functions.*]` entries plus per-function `deno.json`. Do not reintroduce deprecated `import_map` flags.

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

## Current Implementation Notes (2026-02-23)
- Landing navbar is Join-only; do not reintroduce Play/Shop buttons on `/`.
- HUD navigation is unified:
- Global fixed bottom dock on all breakpoints for `Wallet`, `Vaults`, `Locker`.
- Dock is hidden during blocking overlays/modals (vault open overlay, arena battle/setup overlays, rank-up overlay).
- Open tutorial flow includes: dashboard, category, odds, contents, open, spin, and result-action guidance.
- Locker tutorial is inventory-first (seeded demo item) and then walks market + auctions.
- Locker section switching uses the shared segmented tab pattern.
- Arena tutorial is wired and replayable from help button, covering resources, section tabs, battles, forge, quests, and rank-up.
- Arena resource/status decks now include Rank Up alongside Energy, Shards, Level, and Free Spins; use that shared deck instead of separate one-off rank-up widgets.
- Bonus spin percentage UI is premium-only: Platinum, Obsidian, Diamond.

## Current Implementation Notes (2026-02-24)
- Primary app routes now center on `/vaults`, `/wallet`, `/locker/*`, and `/arena/*`.
- Bottom dock has exactly three items: `Wallet`, `Vaults`, `Locker`.
- Locker is the only tabbed surface (`Inventory`, `Market`, `Arena`).
- Arena tabs were removed; Arena Home cards route to `/arena/battles`, `/arena/forge`, `/arena/quests`.
- XP gating is enforced via `LockedOverlay` for Locker/Market/Arena/Battles/Forge/Quests.
- HUD is informational only: Credits, Energy, XP/Lv (no navigation actions).
- Inventory defaults to active items only (status `held`); non-held history is surfaced via wallet/market flows.
- Open reveal layout is constrained for mobile to prevent legendary overflow and floating rarity tags.
- Tutorial spotlight utilities now auto-scroll and clamp tooltips to safe viewport areas across desktop/mobile.
## Product Notes

- Use `Rank Up` for user-facing progression copy, not `Prestige`.
- Use `Spin` for the main vault action and `Lock` for the bonus round.
- Provably fair UX belongs in vault overlays, result surfaces, wallet receipts, and the `/provably-fair` legal page, not as random extra chrome on browse cards.
- Covered provably fair RNG currently includes vault opens, bonus lock, forge rolls, and battle simulation.
- Wallet proof state is local-wallet scoped: `walletId`, auto-generated `clientSeed`, active server hash, nonce, and stored receipts persist in `GameContext`.
- Vault fair requests currently pass collectible candidate pools to the edge runtime for deterministic selection; if that payload shape changes, update the legal/transparency docs too.
