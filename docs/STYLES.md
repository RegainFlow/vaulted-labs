# Vaulted Labs Styling Guide

Source of truth: [src/index.css](/mnt/c/Users/lrami/Desktop/Code/vaulted-labs/src/index.css)

## Global Visual Language

### Vault-Tech System UI
The product follows a premium vault-tech visual language across all major core surfaces.

This means:
- major views should feel like engineered chambers, not stacked generic cards
- interfaces should favor framed containment zones over nested rounded panels
- active areas should feel like control rails, lock chambers, or sealed system modules
- glow and motion should feel like controlled routed energy, not decorative neon

### Composition Rules
- prefer one dominant framed container over multiple nested containers
- avoid card-inside-card structures unless the inner layer adds real UX value
- primary interactive zones should read as containment chambers, floating reel stages, command rails, or reveal bays
- keep hierarchy strong: one primary chamber, then secondary controls

### Panel Philosophy
- large panels should feel like vault system housings
- use reinforced borders, inset rails, subtle edge lighting, and layered surfaces
- avoid decorative wrappers that reduce usable space or make content feel cramped

## Theme Foundation

### Core Tokens
The app uses a neutral vault-tech base by default:
- `bg`, `surface`, `surface-elevated`, `border`
- `shell`, `shell-elevated`, `shell-deep`
- `frame`, `frame-strong`, `rail`, `rail-glow`, `command`
- `text`, `text-muted`, `text-dim`

### Accent Policy
- non-tier surfaces default to neon pink command accents with neutral dark framing
- tier colors take over in vault-aware contexts
- rarity colors stay local to collectible identity and payoff moments
- magenta remains a legacy compatibility color, not the default system accent

### Tier Behavior
- Bronze: warm copper / amber energy
- Silver: cool silver-white energy
- Gold: radiant warm gold energy
- Platinum: pale steel-blue energy
- Obsidian: dark violet / magenta energy
- Diamond: icy cyan / white crystalline energy

## Components

### Cards

#### Global Card Rule
- cards are content units, not unnecessary wrapper layers around already-contained systems
- if a section is already a framed system panel, do not place the primary interaction inside another large rounded card

#### Vault Cards
- style: premium vault-tech display module
- header: use header imagery from `public/images/vaults/headers`
- body: structured dark chamber with minimal clutter
- identity comes from material treatment, tier color, and header art before badges or pills

Header image mapping:
- Bronze: `/images/vaults/headers/bronze_vl_header.png`
- Silver: `/images/vaults/headers/silver_vl_header.png`
- Gold: `/images/vaults/headers/gold_vl_header.png`
- Platinum: `/images/vaults/headers/platium_vl_header.png`
- Obsidian: `/images/vaults/headers/obsidian_vl_header.png`
- Diamond: `/images/vaults/headers/diamond_vl_header.png`

#### Reel / Reveal Cards
- reel cards should appear as premium reveal assets inside a chamber
- avoid excessive floating overlay tags on top of the card art
- selected card emphasis should come from glow, rim light, lock treatment, and chamber integration
- do not use large detached overlay boxes floating over the selected card

#### Module Cards
- inventory, marketplace, and wallet cards should read as contained system modules
- use framed edges, structured data zones, and command rails for actions
- avoid bright pill clutter when art, hierarchy, and placement already communicate status

## Reveal Chamber System

### Primary Reveal Container
For vault opening and reveal flows:
- the main system section acts as the primary reveal chamber
- the reel sits directly inside that chamber
- do not wrap the reel in an additional large inner card
- the chamber should feel like a floating reveal stage or lock chamber

### Reveal Chamber Styling
- use a single large framed container
- support depth with subtle inset rails, edge framing, and restrained internal boundaries
- avoid full secondary inner shells that visually shrink the reel

### Center Lock Zone
The selected center position must feel like a built-in lock zone.

Use:
- restrained corner brackets
- tight rim glow
- subtle pulse / lock-on effect
- thick enough bracket geometry to visibly focus the selection

Avoid:
- oversized translucent rounded overlays
- debug-looking targeting boxes
- beam-line overlays that obscure the card art

The lock zone must feel integrated into the chamber itself.

### Bonus Lock Stage
- bonus rounds should feel like a continuation of the main vault reel, not a separate mini-game
- use one dominant chamber for the full 3-channel bonus stage
- bonus channels should render image-first tier medallions from `public/images/vaults/bonus-spinner`
- do not use the older vault SVG glyphs inside the bonus lock reels
- keep the active channel centered under a fixed lock frame with restrained neon pink brackets
- preserve the `LOCK` cadence, but present it with the shared arcade button family
- bonus evaluate states should keep the locked channels visible and resolve inside the same chamber

## Buttons

### Command Buttons
Primary buttons should feel like vault actuators or command rails, not generic web buttons.

### Shared Button Patterns
- use `ArcadeButton` for standalone high-emphasis actions:
  - hero CTAs
  - vault `SPIN`
  - card entry actions like `Enter`
- use `size="hero"` for landing-primary CTAs
- use `size="primary"` for major flow actions
- use `size="compact"` for in-card actions and secondary entry buttons
- use `tone="accent"` as the default cross-system action tone unless the action is explicitly semantic like success or gold
- do not invent one-off button chrome when an existing shared button pattern fits the use case

### Card Entry Rule
- informational cards with a visible CTA should not make the whole card the click target
- if a card says `Enter`, `Open`, `Buy`, or similar, the button should own the action
- reserve whole-card click behavior for selection cards where the entire card is the selection affordance
- avoid duplicate action signals like a clickable card plus a decorative CTA rail

### Reveal Action Button
For primary vault actions:
- prefer a single-word centered label
- default action language should be short and forceful
- recommended default: `SPIN`

### Bonus Round Action Button
- `LOCK` is the only primary action in the bonus round
- use `ArcadeButton` for `LOCK`
- keep it larger than secondary controls but smaller than landing hero CTAs

### Primary Action Behavior
- use one-tap command actions when the interaction does not require skillful charging
- keep labels centered and immediately understandable
- glow can breathe subtly, but the control should not require hold-to-fill affordances unless the mechanic truly depends on them

## Shared Primitives

### Utility Classes
Defined in `src/index.css`:
- `.system-shell`
- `.system-shell-strong`
- `.module-card`
- `.system-rail`
- `.command-segment`
- `.system-readout`
- `.system-label`
- `.system-kicker`
- `.specimen-frame`

### Usage Rules
- use `system-shell` for dominant housings and modals
- use `module-card` for content tiles and list rows
- use `system-rail` for tab bars, command rows, and compact control surfaces
- use `command-segment` for integrated rail buttons, not standalone pill buttons
- use `system-readout` for compact stat blocks and metadata chips

### Arena Status Decks
- Arena status decks are shared across Arena Home and Arena sub-pages
- include core resources plus Rank Up in the same visual family
- Rank Up should appear as a dedicated status card, not a detached button below the page
- Rank Up cards should explain the concrete vault-odds shift, not vague prestige wording
- visible product language should be `Rank Up` / `Rank` even if internal compatibility names remain `prestige*`

## Color & Glow System

### Tier-Synced Accents
Active interactive states should inherit the current vault tier color wherever possible:
- chamber edge glow
- selected lock-zone glow
- button fill
- button active border
- reveal accents
- focused lock details

### Glow Guidance
- use glows as contained system energy
- keep glow close to edges, borders, lock points, and focal zones
- avoid broad soft bloom that makes the UI feel blurry or washed out

## UI Cleanup Rules

### Reduce Redundant Overlay Chrome
- remove labels, wrappers, and micro-panels that duplicate what art, position, color, or surrounding context already communicates

### Prioritize Scale
- make the primary interaction larger by removing unnecessary container layers
- when in doubt, increase the actual interactive content instead of adding another frame around it

### Immersion Rule
UI should feel like one connected vault system:
- chamber
- reel
- lock zone
- action bar
- glow states

All parts should look designed from the same hardware family.

## Core Rollout Scope

### Included in first pass
- global theme and utilities in `src/index.css`
- shared top rail and tabs
- vault cards and vault open / reveal surfaces
- locker / inventory cards and modals
- marketplace cards and tab rail
- wallet header and ledger surfaces

### Deferred to later pass
- landing marketing sections
- hero illustrations and phone mockup framing
- hero marketing sections still outside the app shell

## Implementation Notes
- preserve existing logic and handler behavior while replacing wrapper-heavy visual structure
- prefer utility-driven restyling over introducing new wrapper components
- keep tier-aware accents contextual rather than global
- use the on-disk Platinum header filename `platium_vl_header.png` unless the asset is renamed
## Provably Fair UX

- Keep proof UI compact and system-driven.
- Primary fairness touchpoints: vault overlay, result surfaces, wallet header, wallet transaction rows, and `/provably-fair`.
- Use readable monospace hashes with restrained pink accents.
- Proof actions should reuse shared button or rail patterns rather than introducing a separate visual language.
- Proof UI should expose:
  - shortened server hash
  - shortened client seed
  - next nonce
  - reveal state
- Wallet proof modules should read like system telemetry, not marketing cards.
- Transaction proof pills should use clear state styling:
  - `pending_reveal`: neutral or pink-outline system pill
  - `revealed`: verified green state
- Receipt modals should prioritize:
  - result summary
  - server hash / revealed seed
  - client seed
  - nonce
  - payload hash
  - roll trace
  - local verification result
- Fairness browse cards should stay clean. Put proof access near the action flow or the recorded result, not on list/grid cards.
- If RNG/fairness architecture changes, update this guide with the new proof touchpoints and states in the same pass as the implementation.
