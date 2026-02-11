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

### Vault Tiers
| Tier | Color | Token |
|------|-------|-------|
| Bronze | #cd7f32 | `vault-bronze` |
| Silver | #c0c0c0 | `vault-silver` |
| Gold | #ffd700 | `vault-gold` |
| Diamond | #b9f2ff | `vault-diamond` |

Note: Platinum (#79b5db) and Obsidian (#6c4e85) are defined in `data/vaults.ts` as inline colors, not as CSS tokens.

### Rarity Colors
| Rarity | Color | Token |
|--------|-------|-------|
| Common | #9a9ab0 | `rarity-common` |
| Uncommon | #00f0ff | `rarity-uncommon` |
| Rare | #a855f7 | `rarity-rare` |
| Legendary | #ff2d95 | `rarity-legendary` |

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

## Components

### Buttons
- **Primary Action:** Rounded corners (`rounded-xl`), uppercase, bold tracking (`tracking-widest`).
- **Interactive:** Hover states include glow (`shadow-[0_0_20px_...]`) and scale transforms.

### Cards (Vaults)
- **Style:** "Cubic" / "Vault Door" aesthetic.
- **Header:** Metallic gradient background specific to tier.
- **Body:** Dark surface with rarity probability stat bars.
- **Icons:** Custom SVG "Ore/Mineral" icons representing tier material.

### Modals
- **Backdrop:** Blurred (`backdrop-blur-xl`) with dark overlay.
- **Animation:** `motion` used for entrance/exit and internal state transitions (paying -> picking -> revealing -> result).

## Mobile Responsiveness
- **Layout:** Flex/Grid layouts switch from `flex-col` (mobile) to `flex-row` (desktop) or grid columns increase from 1 to 2/3.
- **Spacing:** Padding adjusts from `p-4` or `p-6` on mobile to `p-12` or `p-20` on desktop.
