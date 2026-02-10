# Design System & Styling Guide

## Typography
- **Primary Font:** `Inter` (sans-serif)
- **Weights:**
  - `font-black` (900): Used for main headers and large impact text.
  - `font-bold` (700): Used for subheaders and button text.
  - `font-medium` (500): Used for body text and descriptive paragraphs.
  - `font-mono`: Used for technical labels, stats, and prices to convey a "protocol/machine" aesthetic.

## Color Palette

### Core Colors
- **Background:** `bg-bg` (#050505) - Deep black/charcoal.
- **Surface:** `bg-surface` (#0a0a0f) - Slightly lighter panel color.
- **Surface Elevated:** `bg-surface-elevated` (#14141a) - Used for cards and modals.
- **Accent:** `text-accent` (#ff2d95) - Neon Pink/Magenta for primary actions and highlights.
- **Success:** `text-neon-green` (#39ff14) - For "Legendary" pulls and success states.
- **Highlight:** `text-neon-cyan` (#00f0ff) - For "Uncommon" items and tech accents.

### Vault Tiers
- **Bronze:** `#cd7f32`
- **Silver:** `#e0e0e0`
- **Gold:** `#ffd700`
- **Platinum:** `#e5e4e2`
- **Obsidian:** `#6c4e85`
- **Diamond:** `#b9f2ff`

## Components

### Buttons
- **Primary Action:** Rounded corners (`rounded-xl`), uppercase, bold tracking (`tracking-widest`).
- **Interactive:** Hover states include glow (`shadow-[0_0_20px_...]`) and scale transforms.

### Cards (Vaults)
- **Style:** "Cubic" / "Vault Door" aesthetic.
- **Header:** Metallic gradient background specific to tier.
- **Body:** Dark surface with collapsible probability stats.
- **Icons:** Custom SVG "Ore" icons representing the material source.

### Modals
- **Backdrop:** Blurred (`backdrop-blur-xl`) with dark overlay.
- **Animation:** `framer-motion` used for entrance/exit and internal state transitions (paying -> picking -> revealing -> result).

## Mobile Responsiveness
- **Layout:** Flex/Grid layouts switch from `flex-col` (mobile) to `flex-row` (desktop) or grid columns increase from 1 to 2/3.
- **Spacing:** Padding adjusts from `p-4` or `p-6` on mobile to `p-12` or `p-20` on desktop.
