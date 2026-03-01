# VaultedLabs - Gamified Commerce Platform

VaultedLabs is a gamified commerce demo where players open vaults, reveal collectible outcomes, and choose to hold, ship, or cashout.

## Product Snapshot

- 6 fixed vault tiers with transparent rarity odds.
- Reveal outcomes with 3 actions: Cashout, Equip, Ship.
- Locker hub with Inventory, Market (with Auctions inside), and Arena Home.
- Arena loop with Battles, Forge, Quests, energy/shard economy, and XP progression.
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
- HUD is informational only (Credits, Energy, XP/Lv), not navigation.

## Tutorials

- Tutorials now run through one shared vault-tech overlay system with a common controller, spotlight, and instruction rail.
- `/vaults`: auto-runs once for new users, guiding the full open -> scan -> bonus -> reveal loop, replayable via floating `?` button.
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
- Supabase (waitlist + anti-spam baseline)
- PostHog analytics wrappers (`trackEvent`, `trackPageView`)

## Key Source Areas

- `src/context/GameContext.tsx` - shared game state and progression logic
- `src/data/vaults.ts` - vault config, rarity helpers, premium bonus chances
- `src/data/tutorial.ts` - open/page tutorial definitions
- `src/components/shared/Navbar.tsx` - HUD + unified bottom dock navigation
- `src/components/shared/SegmentedTabs.tsx` - shared segmented control used by Collection/Arena tabs
- `src/pages/*` - route-level composition

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Validation Before Merge

- Run `npm run lint`
- Run `npm run build`
- Note intentional deviations from docs in your change summary
