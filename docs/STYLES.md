# Vaulted Labs Styling Guide

Source of truth: [src/index.css](/mnt/c/Users/lrami/Desktop/Code/vaulted-labs/src/index.css)

## Global Visual Language

### Vault-Tech System UI
The product follows a premium tactical-futuristic vault-tech visual language across all major core surfaces.

This means:
- major views should feel like engineered chambers, not stacked generic cards
- interfaces should favor framed containment zones over nested rounded panels
- active areas should feel like scan bays, control rails, or sealed system modules
- glow and motion should feel like controlled routed energy, not decorative neon

### Composition Rules
- prefer one dominant framed container over multiple nested containers
- avoid card-inside-card structures unless the inner layer adds real UX value
- primary interactive zones should read as containment chambers, scan lanes, command rails, or reveal bays
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
- `frame`, `frame-strong`, `rail`, `rail-glow`, `scan`, `command`
- `text`, `text-muted`, `text-dim`

### Accent Policy
- non-tier surfaces default to steel-blue / scan-cyan system accents
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
- selected card emphasis should come from glow, rim light, lock-on scan treatment, and chamber integration
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
- the chamber should feel like a scan bay, containment lane, or reveal chamber

### Reveal Chamber Styling
- use a single large framed container
- support depth with subtle inset rails, edge framing, and restrained internal boundaries
- avoid full secondary inner shells that visually shrink the reel

### Center Lock Zone
The selected center position must feel like a built-in scan / lock zone.

Use:
- faint vertical beam lines
- restrained corner brackets
- tight focused glow bloom
- subtle pulse / lock-on effect
- thick enough bracket geometry to visibly focus the selection

Avoid:
- oversized translucent rounded overlays
- debug-looking targeting boxes
- detached cyan frames floating above the reel

The lock zone must feel integrated into the chamber itself.

## Buttons

### Command Buttons
Primary buttons should feel like vault actuators or command rails, not generic web buttons.

### Reveal Action Button
For hold-to-activate actions:
- prefer a single-word centered label
- default action language should be short and forceful
- recommended default: `SCAN`

### Charge Fill Behavior
For hold interactions:
- the entire button body acts as the progress indicator
- progress fills left-to-right across the whole control surface
- do not use a detached loader pill, bottom bar, or side meter
- the fill should read like routed system energy charging the control bar

### Charge Visual Rules
- label remains centered and readable while charging
- fill may include a subtle internal light sweep
- rim glow intensifies as progress increases
- at full charge, the button should feel fully armed

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

## Color & Glow System

### Tier-Synced Accents
Active interactive states should inherit the current vault tier color wherever possible:
- chamber edge glow
- selected lock-zone glow
- button fill
- button active border
- reveal accents
- focused scan details

### Glow Guidance
- use glows as contained system energy
- keep glow close to edges, borders, scan points, and focal zones
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
- scan zone
- action bar
- glow states

All parts should look designed from the same hardware family.

## Core Rollout Scope

### Included in first pass
- global theme and utilities in `src/index.css`
- shared top rail and tabs
- vault cards and vault open / reveal surfaces
- locker / collection cards and modals
- marketplace cards and tab rail
- wallet header and ledger surfaces

### Deferred to later pass
- landing marketing sections
- hero illustrations and phone mockup framing
- deep arena combat and forge-specific layouts

## Implementation Notes
- preserve existing logic and handler behavior while replacing wrapper-heavy visual structure
- prefer utility-driven restyling over introducing new wrapper components
- keep tier-aware accents contextual rather than global
- use the on-disk Platinum header filename `platium_vl_header.png` unless the asset is renamed
