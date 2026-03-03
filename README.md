# VaultedLabs - Gamified Commerce Platform

VaultedLabs is a gamified commerce demo where players open vaults, reveal collectible outcomes, and choose to hold, ship, or cashout.

## Product Snapshot

- 6 fixed vault tiers with transparent rarity odds.
- Reveal outcomes with 3 actions: Cashout, Equip, Ship.
- Locker hub with Inventory, Market (with Auctions inside), and Arena Home.
- Arena loop with Battles, Forge, Quests, energy/shard economy, XP progression, and Rank Up odds bonuses.
- Battles now use a cinematic `YOU vs BOSS` presentation layer that replays the already-resolved combat result with authored boss profiles, battle feed, and ability-bar visuals.
- Wallet with typed credit history (earned, incentive, spent).
- Waitlist and prelaunch incentive flow on landing page.

## Routes

- `/` - Landing (join-first funnel)
- `/vaults` - Vault opening loop and first-run micro tutorial
- `/wallet` - Balance and transaction history
- `/locker` - Redirects to `/locker/inventory`
- `/locker/inventory` - Inventory items (active items only)
- `/locker/market` - Market + Auctions
- `/locker/arena` - Arena Home menu
- `/arena/battles`, `/arena/forge`, `/arena/quests` - Arena sub-screens
- `/provably-fair` - Public fairness/legal transparency page
- `/privacy`, `/terms`

Legacy redirects:

- `/open`, `/play` -> `/vaults`
- `/collection`, `/inventory` -> `/locker/inventory`
- `/shop`, `/market` -> `/locker/market`
- `/profile`, `/arena` -> `/locker/arena`

## Navigation Model

- Landing navbar: `Join` CTA only.
- App pages (`/vaults`, `/wallet`, `/locker/*`, `/arena/*`):
- Top bar: centered wordmark on mobile + HUD resources.
- Global primary nav: fixed bottom dock (`Wallet`, `Vaults`, `Locker`) on all breakpoints.
- Dock auto-hides during full-screen overlays/modals (e.g. vault open flow, arena battle flow).
- HUD is informational only (Credits, Energy, XP/Lv), not navigation. Arena resource decks surface Rank Up as the progression action.

## Tutorials

- Tutorials now run through one shared vault-tech overlay system with a common controller, spotlight, and instruction rail.
- `/vaults`: auto-runs once for new users, guiding the full open -> spin -> bonus -> reveal loop, replayable via floating `?` button.
- `/locker`: guided walkthrough across Inventory, Market, and Arena sections on first eligible unlock, then replayable.
- `/wallet`: replayable via floating `?` button.
- Tutorials use shared target resolution, viewport-safe placement, and mobile-safe safe-area handling.

## Financial Model Constants

### Vault tiers

| Tier | Price | Common | Uncommon | Rare | Legendary |
| --- | ---: | ---: | ---: | ---: | ---: |
| Bronze | $12 | 50.0% | 27.0% | 19.0% | 4.0% |
| Silver | $25 | 47.0% | 28.0% | 19.5% | 5.5% |
| Gold | $40 | 43.0% | 30.0% | 20.0% | 7.0% |
| Platinum | $55 | 40.0% | 30.0% | 21.5% | 8.5% |
| Obsidian | $75 | 37.0% | 29.0% | 23.0% | 11.0% |
| Diamond | $90 | 33.0% | 28.0% | 25.0% | 14.0% |

### Premium bonus round chance (Vault Lock)

Only premium tiers show bonus percentages and can trigger Vault Lock:

- Platinum: 45%
- Obsidian: 55%
- Diamond: 65%

### Rarity value multipliers

- Common: 0.40x - 0.85x
- Uncommon: 0.85x - 1.40x
- Rare: 1.40x - 2.20x
- Legendary: 2.20x - 3.50x

## Tech Stack

- React 19 + TypeScript + Vite 6
- React Router DOM v7
- Tailwind CSS v4 (token-driven)
- Motion (`motion/react`)
- Supabase (waitlist, anti-spam baseline, provably fair edge functions + Postgres tables)
- PostHog analytics wrappers (`trackEvent`, `trackPageView`)

## Key Source Areas

- `src/context/GameContext.tsx` - shared game state and progression logic
- `src/data/vaults.ts` - vault config, rarity helpers, premium bonus chances
- `src/data/tutorial.ts` - open/page tutorial definitions
- `src/lib/provably-fair-core.ts` - canonical payload hashing, digest derivation, and local verification
- `src/lib/provably-fair-api.ts` - client calls into Supabase fairness functions
- `src/components/shared/Navbar.tsx` - HUD + unified bottom dock navigation
- `src/components/shared/SegmentedTabs.tsx` - shared segmented control used by Locker tabs and other section rails
- `src/pages/ProvablyFairPage.tsx` - public fairness and verification guide
- `supabase/functions/_shared/provably-fair*.ts` - Deno-safe shared fairness runtime used by edge functions
- `supabase/migrations/20260302120000_add_provably_fair.sql` - fairness tables
- `supabase/migrations/20260302123000_enable_rls_on_provably_fair.sql` - RLS + access restrictions for fairness tables
- `src/pages/*` - route-level composition

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
npx supabase start
npx supabase functions deploy
```

## Validation Before Merge

- Run `npm run lint`
- Run `npm run build`
- Note intentional deviations from docs in your change summary

## Provably Fair RNG

VaultedLabs now routes outcome RNG through a wallet-scoped provably fair flow backed by Supabase edge functions.

### Covered systems

- Vault opens, including rarity, collectible selection, value/stat rolls, and premium bonus trigger
- Bonus Lock channel resolution
- Forge outcome rolls
- Battle simulation variance and reward rolls

### Battle presentation note

- The battle overlay can show boss-specific abilities, combat feed entries, impact flashes, and animated HUD events.
- Those battle visuals are representational only in the current version.
- Actual battle outcome, exchange values, and rewards still come from the existing provably fair `battle_sim` result.
- If battle abilities ever become real player inputs, that must be treated as a fairness-model and contract change.

Decorative particles, filler strip order, and other non-outcome visuals are not part of the receipt model.

### Session model

- Each local wallet gets a persistent `walletId` and an auto-generated `fairnessClientSeed`
- Supabase maintains one active committed server-seed hash per wallet
- Each fair event consumes the next nonce on that active commit
- Commits auto-rotate after `25` events or `24h`, and can also be rotated manually from Wallet
- Receipts start as `pending_reveal` and become locally verifiable after the related commit rotates and reveals its server seed

### Supabase fairness stack

- Edge functions:
  - `provably-fair-session`
  - `provably-fair-roll`
  - `provably-fair-rotate`
- Shared edge runtime:
  - `supabase/functions/_shared/provably-fair-core.ts`
  - `supabase/functions/_shared/provably-fair-games.ts`
  - `supabase/functions/_shared/provably-fair.ts`
- Storage:
  - `public.provably_fair_commits`
  - `public.provably_fair_receipts`
- Access model:
  - both fairness tables have RLS enabled
  - `anon` and `authenticated` are revoked
  - edge functions use the service role for read/write access

### Important implementation notes

- Supabase function config uses top-level `[functions.*]` entries in `supabase/config.toml`
- Each fairness function uses its own local `deno.json`; do not rely on deprecated `import_map` flags
- Edge functions must stay Deno-safe and should not import frontend-only app modules like `src/data/*`
- Vault fairness requests currently pass rarity candidate pools (`funkoPools`) in the payload so the server can deterministically select collectibles without importing frontend catalog modules

### Documentation sync rule

If the fairness algorithm, covered RNG systems, request payloads, receipt shape, Supabase function layout, or table access model changes, update all of the following together:

- `docs/legal/PROVABLY_FAIR.md`
- `src/pages/ProvablyFairPage.tsx`
- `README.md`
- `docs/STYLES.md`
- `.codex/AGENTS.md`
- the relevant Supabase migrations, edge functions, and `supabase/config.toml`
