# Design System & Styling Guide

Source of truth: `src/index.css` `@theme` block.

## Typography
- **Primary Font:** `Inter` (sans-serif) via `--font-sans`
- **Weights:**
  - `font-black` (900): Main headers and large impact text.
  - `font-bold` (700): Subheaders and button text.
  - `font-medium` (500): Body text and descriptive paragraphs.
  - `font-mono`: Technical labels, stats, and prices for a "protocol/machine" aesthetic.

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
| Bronze | #cd7f32 | `vault-bronze` | $24 |
| Silver | #c0c0c0 | `vault-silver` | $38 |
| Gold | #ffd700 | `vault-gold` | $54 |
| Platinum | #79b5db | *(inline)* | $68 |
| Obsidian | #6c4e85 | *(inline)* | $78 |
| Diamond | #b9f2ff | `vault-diamond` | $86 |

### Rarity Colors
| Rarity | Color | Token | Value Multiplier |
|--------|-------|-------|------------------|
| Common | #9a9ab0 | `rarity-common` | 0.40x – 0.85x |
| Uncommon | #00f0ff | `rarity-uncommon` | 0.85x – 1.40x |
| Rare | #a855f7 | `rarity-rare` | 1.40x – 2.20x |
| Legendary | #ff2d95 | `rarity-legendary` | 2.20x – 3.50x |

### Semantic
| Token | Value | Usage |
|-------|-------|-------|
| `success` | #00f0ff | Success feedback |
| `error` | #ff3b5c | Error feedback |

## Custom Utility Classes

Defined in `src/index.css` `@layer utilities`:

- **Glow effects:** `.glow-magenta`, `.glow-cyan` (box-shadow), `.text-glow-magenta`, `.text-glow-cyan`, `.text-glow-white` (text-shadow)
- **Animations:** `.animate-gradient`, `.animate-vault-spin-slow`, `.animate-vault-glow-pulse`, `.animate-spin-slow`, `.animate-hud-shimmer`
- **Helpers:** `.bg-clip-text` (Firefox fix), `.bg-300%` (gradient sizing)
- **Buttons:** `.pushable` / `.pushable-shadow` / `.pushable-edge` / `.pushable-front` — 3D pushable button (Josh Comeau pattern), responsive padding (12px 28px mobile, 14px 42px at sm+)

## Components

### Buttons
- **Primary Action:** Rounded corners (`rounded-xl`), uppercase, bold tracking (`tracking-widest`).
- **Pushable CTA:** 3D depth effect with shadow/edge/front layers, magenta accent gradient.
- **Interactive:** Hover states include glow (`shadow-[0_0_20px_...]`) and scale transforms.

### Cards (Vaults)
- **Style:** "Cubic" / "Vault Door" aesthetic.
- **Header:** Metallic gradient background specific to tier, responsive height (`h-40 sm:h-44 md:h-48`).
- **Body:** Dark surface with rarity probability stat bars, responsive padding (`p-4 sm:p-5 md:p-6`).
- **Icons:** Custom SVG "Ore/Mineral" icons representing tier material (Bronze nugget, Silver ingot, Gold crystal, Platinum hexagonal prism, Obsidian shard, Diamond cut).

### Inline SVG Illustrations (HowItWorks)
- **Style:** Stroke-only neon outlines with `feGaussianBlur` glow filters.
- **Colors:** Step 1 magenta (#ff2d95), Step 2 cyan (#00f0ff), Step 3 green (#39ff14).
- **Size:** `viewBox="0 0 120 120"` rendered at 140x140px.

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
- **Layout:** Single column stacking on mobile, `sm:grid-cols-2` / `md:grid-cols-3` / `lg:grid-cols-2` for desktop
- **Vault door (Hero):** `w-[280px] sm:w-[350px] md:w-[500px]` to prevent overflow on narrow screens
- **Phone mockup:** `max-w-[280px] sm:max-w-[330px]` for small screens
- **Navbar:** `h-16 sm:h-20` with `px-4 sm:px-6`
