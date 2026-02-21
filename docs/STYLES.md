# Design System & Styling Guide

Source of truth: `src/index.css` `@theme` block.

## Typography
- **Primary Font:** `Inter` (sans-serif) via `--font-sans`
- **Weights:**
  - `font-black` (900): Main headers and large impact text.
  - `font-bold` (700): Subheaders and button text.
  - `font-medium` (500): Body text and descriptive paragraphs.
  - `font-mono`: Technical labels, stats, prices, countdowns for a "protocol/machine" aesthetic.

## Color Palette

### Backgrounds
| Token | Value | Usage |
|-------|-------|-------|
| `bg` | #0a0a0f | Blue-shifted dark background |
| `surface` | #111118 | Blue-tinted card/panel surfaces |
| `surface-elevated` | #1a1a24 | Cards, modals, elevated panels |
| `border` | #2a2a3a | Default border color |

### Accents
| Token | Value | Usage |
|-------|-------|-------|
| `accent` | #ff2d95 | Magenta neon — CTAs, headings, primary actions |
| `accent-hover` | #e0267f | Magenta hover state |
| `neon-cyan` | #00f0ff | Cyan — input focus, Hold accent, tech highlights |
| `neon-cyan-hover` | #00d8e6 | Cyan hover state |
| `neon-green` | #39ff14 | Green neon — success states, mint labels |

### Text
| Token | Value | Usage |
|-------|-------|-------|
| `text` | #f0f0f5 | Cool-tinted primary white |
| `text-muted` | #9a9ab0 | Cool muted descriptions |
| `text-dim` | #6a6a80 | Dimmed metadata and labels |

### Vault Tiers (6 levels)
| Tier | Color | Token | Price |
|------|-------|-------|-------|
| Bronze | #cd7f32 | `vault-bronze` | $12 |
| Silver | #c0c0c0 | `vault-silver` | $25 |
| Gold | #ffd700 | `vault-gold` | $40 |
| Platinum | #79b5db | *(inline)* | $55 |
| Obsidian | #6c4e85 | *(inline)* | $75 |
| Diamond | #b9f2ff | `vault-diamond` | $90 |

### Rarity Colors
| Rarity | Color | Token | Value Multiplier |
|--------|-------|-------|------------------|
| Common | #6B7280 | `rarity-common` | 0.40x – 0.85x |
| Uncommon | #3B82F6 | `rarity-uncommon` | 0.85x – 1.40x |
| Rare | #a855f7 | `rarity-rare` | 1.40x – 2.20x |
| Legendary | #FFD700 | `rarity-legendary` | 2.20x – 3.50x |

### Semantic
| Token | Value | Usage |
|-------|-------|-------|
| `success` | #00f0ff | Success feedback |
| `error` | #ff3b5c | Error feedback |

## Custom Utility Classes

Defined in `src/index.css` `@layer utilities`:

- **Glow effects:** `.glow-magenta`, `.glow-cyan` (box-shadow), `.text-glow-magenta`, `.text-glow-cyan`, `.text-glow-white` (text-shadow)
- **Animations:** `.animate-gradient`, `.animate-vault-spin-slow`, `.animate-vault-glow-pulse`, `.animate-spin-slow`, `.animate-hud-shimmer`, `.animate-urgency-pulse`
- **Helpers:** `.bg-clip-text` (Firefox fix), `.bg-300%` (gradient sizing)
- **Buttons:** `.pushable` / `.pushable-shadow` / `.pushable-edge` / `.pushable-front` — 3D pushable button (Josh Comeau pattern), responsive padding (12px 28px mobile, 14px 42px at sm+)

## Components

### Buttons
- **Primary Action:** Rounded corners (`rounded-xl`), uppercase, bold tracking (`tracking-widest`).
- **Pushable CTA:** 3D depth effect with shadow/edge/front layers, magenta accent gradient.
- **Interactive:** Hover states include glow (`shadow-[0_0_20px_...]`) and scale transforms.
- **Marketplace Actions:** Hold/Ship/Cashout buttons use tier-specific colors with `whileHover` Motion animation.

### Cards

#### Vault Cards
- **Style:** "Cubic" / "Vault Door" aesthetic.
- **Header:** Metallic gradient background specific to tier, responsive height (`h-40 sm:h-44 md:h-48`).
- **Body:** Dark surface with rarity probability stat bars, responsive padding (`p-4 sm:p-5 md:p-6`).
- **Icons:** Custom SVG "Ore/Mineral" icons representing tier material (Bronze nugget, Silver ingot, Gold crystal, Platinum hexagonal prism, Obsidian shard, Diamond cut).

#### Inventory Item Cards
- **Header:** Vault tier gradient stripe, rarity badge (colored per rarity token).
- **Body:** VaultIcon, product name, value in credits, status badge (held/shipped/cashed_out).
- **Actions:** Button row at bottom — Hold (passive), Ship, Cashout, List (Coming Soon badge).
- **States:** Held items are full color; shipped/cashed_out items are dimmed with `opacity-50`.

#### Listing Cards
- **Layout:** Item info + seller name (`@username` in muted text) + price in vault-gold.
- **Buy button:** Full-width accent button, disabled state when insufficient credits.

#### Auction Cards
- **Layout:** Item info + current bid display + countdown timer.
- **Timer:** Font-mono, turns `text-error` + `.animate-urgency-pulse` when < 5 minutes.
- **Bid input:** Number input with "Place Bid" button, validation feedback inline.
- **Winning indicator:** "You're winning!" badge in neon-green when player is highest bidder.

#### Boss Fight Cards
- **Locked:** Grayscale filter, padlock SVG icon, "Unlocks at Level N" text, `opacity-50`.
- **Unlocked:** Glow border (neon-cyan), "FIGHT" button with Coming Soon tooltip on click.
- **Content:** Boss name (font-black), description (text-muted), reward description.

#### Incentive Tier Cards
- **Layout:** 2x2 grid mobile, 4-col desktop. Each shows credit amount, tier label, spots info, mini progress bar.
- **Active tier:** Pulsing dot + glow border in tier color.
- **Completed tier:** Dimmed, strikethrough credit amount.
- **Locked tier:** Low opacity + lock icon.

### Inline SVG Illustrations (HowItWorks)
- **Style:** Stroke-only neon outlines with `feGaussianBlur` glow filters.
- **Colors:** Step 1 magenta (#ff2d95), Step 2 cyan (#00f0ff), Step 3 green (#39ff14).
- **Size:** `viewBox="0 0 120 120"` rendered at 140x140px.

### Navbar
- **Fixed positioning:** `fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-bg/90 border-b border-white/5`
- **Height:** `h-14 md:h-20` with mobile HUD bar below on HUD pages
- **Contextual nav link:** Shows "Market" on /play, "Play" on /market — styled as bordered rounded button with hover glow
- **HUD mode** (`showHUD=true`):
  - Desktop: glassmorphic bar with Credits (vault-gold), Loot (neon-cyan), Level (accent) slots
  - Mobile: compact bar below navbar with same 3 slots in a row
  - All values use `animate-hud-shimmer` with staggered delays
- **Landing mode** (`showHUD=false`):
  - Right side: contextual nav link + "Join" button (scrolls to #waitlist)

### Reel Glow
- **Spinning state:** Subtle ambient glow via `boxShadow: 0 0 60px ${accentColor}25, 0 0 120px ${accentColor}10`
- **Landed state:** Stronger glow using the landed rarity color: `0 0 50px ${landedColor}30, inset 0 0 25px ${landedColor}10`
- **Boss fight reels:** Same pattern — cyan (`#00f0ff`) for player, magenta (`#ff2d95`) for boss

### Boss Fight Layout
- **Desktop (md+):** Side-by-side layout — player reel (left), attack control panel (center), boss reel (right)
- **Mobile (< md):** Vertical stack — player on top, control panel, boss on bottom
- **Reel sizing:** `w-full max-w-60 sm:max-w-72 md:max-w-80` — flexes down on tight layouts

### Marketplace Tabs
- **Tab bar:** Horizontal, uppercase tracking-widest, `text-[10px] md:text-xs`
- **Active tab:** White text, accent underline (`border-b-2 border-accent`)
- **Inactive tab:** Muted text, transparent underline, hover brightens
- **Mobile:** Horizontally scrollable if needed

### Tutorial Overlays
- **Z-index:** `z-[200]` for all tutorial overlays (above navbar z-50 and modals)
- **Backdrop:** `bg-black/85 backdrop-blur-sm` for welcome/complete overlays
- **Spotlight:** SVG mask cutout with accent border glow (`animate-pulse`, `box-shadow: 0 0 30px rgba(255,45,149,0.4)`)
- **Tooltip:** `bg-surface-elevated border-accent/40` rounded card, viewport-clamped positioning (min 8px from edges)
- **Skip button:** Subtle `text-[10px] text-text-dim hover:text-text-muted uppercase tracking-widest` — not a primary action
- **Help button:** Fixed `bottom-6 right-6` floating circle with accent border glow, bold `?` text character
- **CTA buttons:** Same pushable style as other CTAs — accent background with `border-b-[4px] border-[#a01d5e]`

### Profile Panel
- **XP bar:** Full-width progress bar with gradient fill (accent to neon-cyan), rounded-full
- **Level display:** Large number with glow, "Level N" label
- **Stats:** Row of 3 stat cards (items collected, vaults opened, credits earned)

## Mobile Responsiveness

### Breakpoint Strategy
- **Base (< 640px):** Smallest viable layout — reduced padding, smaller text, single-column grids.
- **sm (640px+):** Intermediate sizing — slightly larger text and padding.
- **md (768px+):** Tablet — multi-column grids begin, full-size headings.
- **lg (1024px+):** Desktop — full layout with side-by-side sections.

### Responsive Patterns
- **Headings:** Progressive scaling, e.g. `text-2xl sm:text-3xl md:text-4xl lg:text-5xl`
- **Section padding:** `py-12 md:py-24` or `py-16 sm:py-24 md:py-32`
- **Card padding:** `p-4 sm:p-5 md:p-6` or `p-5 sm:p-6 md:p-8`
- **Grid gaps:** `gap-4 sm:gap-6 md:gap-8`
- **Layout:** Single column stacking on mobile, `sm:grid-cols-2` / `md:grid-cols-3` / `lg:grid-cols-4` for desktop
- **Vault door (Hero):** `w-[280px] sm:w-[350px] md:w-[500px]` to prevent overflow on narrow screens
- **Phone mockup:** `max-w-[280px] sm:max-w-[330px]` for small screens
- **Navbar:** `h-14 md:h-20` with `px-4 md:px-6`, mobile HUD as separate row below
- **Inventory/Listing/Auction grids:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- **Incentive cards:** `grid-cols-2 md:grid-cols-4`
- **Boss fight cards:** `grid-cols-1 sm:grid-cols-2` on mobile, `grid-cols-2 md:grid-cols-4` on desktop
