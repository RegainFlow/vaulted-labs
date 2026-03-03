# Provably Fair

VaultedLabs uses a commit-and-reveal fairness model for outcome-affecting RNG. The implementation is split between a local wallet-scoped client session and Supabase edge functions that authoritatively resolve fair outcomes.

## Coverage

The current receipt system covers:

- vault opens
- premium bonus trigger rolls
- Bonus Lock channel results
- forge outcome rolls
- battle simulation variance and reward rolls

Battle overlays may present those results through richer authored combat UI, including ability names, status labels, and battle-feed messaging. Those presentation details are derived from the resolved battle receipt and do not change combat outcome in the current version.

Excluded from the receipt model:

- decorative particles
- reel filler ordering that does not affect the result
- visual-only motion noise

## Wallet-Scoped Session Model

- Each local wallet gets a persistent `walletId`
- Each wallet also gets an auto-generated persistent `clientSeed`
- Supabase maintains one active committed `serverSeedHash` per wallet
- Each fair event consumes the next nonce on that active commit
- Commits auto-rotate after `25` fair events or after `24 hours`
- Wallet can also force a manual seed rotation to reveal older receipts sooner

Receipts start in `pending_reveal` state and become `revealed` once the related commit rotates and its server seed is disclosed.

## Supabase Architecture

### Edge functions

- `provably-fair-session`
- `provably-fair-roll`
- `provably-fair-rotate`

### Shared edge runtime

- `supabase/functions/_shared/provably-fair-core.ts`
- `supabase/functions/_shared/provably-fair-games.ts`
- `supabase/functions/_shared/provably-fair.ts`

These files are Deno-safe and are the source of truth for the runtime used by Supabase functions.

### Database tables

- `public.provably_fair_commits`
- `public.provably_fair_receipts`

### Access model

- RLS is enabled on both fairness tables
- `anon` and `authenticated` roles are revoked from both tables
- only service-role edge functions access the fairness tables directly

This is intentional. The client reads fairness state from edge-function responses and local persisted receipts, not from direct PostgREST table access.

## Request / Result Model

Each fair action produces one receipt containing:

- commit id
- server seed hash
- optional revealed server seed
- client seed
- nonce
- payload hash
- request payload
- result payload
- roll trace
- linked transaction / item / parent receipt ids when relevant

Current wallet proof surfaces:

- vault overlay fairness strip
- vault, forge, battle, and bonus result surfaces
- wallet header proof module
- wallet transaction proof pills

Forge-specific note:

- the forge chamber, linked-input layout, and result overlay are presentation-only layers over the existing resolved `forge_roll` receipt
- no forge UI surface is allowed to introduce new randomness or alter the receipt-backed result without a fairness-model update

- the in-combat HUD and ability bar are cinematic presentation layers over the resolved `battle_sim` receipt
- no client-side battle UI element is allowed to add new RNG or alter exchange values without a corresponding fairness-model update

## Vault Candidate Pool Note

Vault collectible selection is currently resolved fairly by sending candidate rarity pools in the fair request payload. This lets the edge runtime choose deterministically without importing frontend-only catalog modules inside Supabase functions.

If the vault candidate-pool payload shape changes, update:

- `src/lib/provably-fair-games.ts`
- `supabase/functions/_shared/provably-fair-games.ts`
- this document
- `src/pages/ProvablyFairPage.tsx`

## Verification

Once a commit rotates, the previous server seed is revealed. Receipts tied to that commit can be verified locally against:

1. the revealed server seed
2. the stored client seed
3. the nonce
4. the payload hash
5. the roll trace digests and derived units

Verification is exposed in the in-app receipt modal and uses the shared fair core.

## Algorithm

- Version: `pf_v1`
- Payload hash: `SHA-256(canonicalJson(requestPayload))`
- Digest: `HMAC-SHA256(serverSeed, clientSeed:nonce:cursor:gameType:payloadHash:pf_v1)`
- Unit: first 52 bits of the digest divided by `2^52`

Every fair event uses:

- one event nonce
- one or more cursor values within that nonce

This allows one receipt per action while still exposing readable trace steps.

## Source of Truth

### Client

- `src/lib/provably-fair-core.ts`
- `src/lib/provably-fair-api.ts`
- `src/lib/provably-fair-games.ts`
- `src/context/GameContext.tsx`

### Supabase

- `supabase/functions/provably-fair-session/index.ts`
- `supabase/functions/provably-fair-roll/index.ts`
- `supabase/functions/provably-fair-rotate/index.ts`
- `supabase/functions/_shared/provably-fair-core.ts`
- `supabase/functions/_shared/provably-fair-games.ts`
- `supabase/functions/_shared/provably-fair.ts`
- `supabase/migrations/20260302120000_add_provably_fair.sql`
- `supabase/migrations/20260302123000_enable_rls_on_provably_fair.sql`

## Supabase Runtime Notes

- Function entries live in `supabase/config.toml` under top-level `[functions.*]` sections
- Each fairness function uses its own local `deno.json`
- Do not rely on deprecated `import_map` flags for Supabase function deploys
- Do not import frontend-only `src/data/*` modules into Supabase edge functions

## Change Management Rule

If provably fair coverage, request payloads, receipt fields, algorithm version, Supabase tables, RLS policy, function layout, or wallet proof UX changes, update all of the following in the same pass:

- `docs/legal/PROVABLY_FAIR.md`
- `src/pages/ProvablyFairPage.tsx`
- `README.md`
- `docs/STYLES.md`
- `.codex/AGENTS.md`
- the relevant Supabase migrations, edge functions, and `supabase/config.toml`
