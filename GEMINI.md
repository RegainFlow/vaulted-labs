# GEMINI.md — VaultedLabs Project Guide for Gemini CLI

## Purpose
This document serves as a specialized guide for Gemini CLI (me) to ensure consistent, high-quality contributions to the VaultedLabs codebase. It complements README.md and CLAUDE.md with Gemini-specific workflows and mental models.

## Core Mandates & Alignment
- **Tech Stack:** React 19, TypeScript (Strict), Vite 6, Tailwind CSS v4, Motion (motion/react), Supabase.
- **Design System:** Follow docs/STYLES.md. Use the "Cyber Synth" aesthetic (Magenta/Cyan/Green on Dark Blue).
- **State Management:** Use GameContext (useGame hook) for all shared game state (credits, XP, inventory).
- **Routing:** React Router v7.

## Development Workflows

### 1. Understanding the Context
- **Always** check src/index.css for @theme tokens before adding new colors or styles.
- **Always** reference 	ypes/ for domain-specific interfaces (ault.ts, inventory.ts, etc.).
- **Always** check data/ for constants like XP curves, vault odds, and mock data.

### 2. Implementation Guidelines
- **Components:** Functional components only. Named exports. Use {ComponentName}Props.
- **Styling:** Use Tailwind v4 utility classes directly. Avoid @apply except in index.css.
- **Animations:** Use motion/react. Keep them subtle and high-performance.
- **Icons:** Use existing SVG components in ssets/. Do not inline SVGs in components unless they are unique illustrations.
- **Responsive:** Mobile-first approach (sm:, md:, lg:).

### 3. Verification & Quality
- **Linting:** Run 
pm run lint after changes.
- **Types:** Ensure 	sc -b passes.
- **Build:** Run 
pm run build to verify production readiness.

## Reference Material
- **Styles:** docs/STYLES.md (Colors, Typography, Components)
- **Conventions:** .claude/CLAUDE.md (Workflow, File Structure, Financial Model)
- **State:** src/context/GameContext.tsx
- **Analytics:** docs/POSTHOG_EVENTS.md (If applicable)

## Financial & Game Logic
- **Vault Tiers:** 6 tiers (Bronze to Diamond).
- **XP Curve:** 	hreshold(L) = 50L² + 50L.
- **Credits:** incentive (non-withdrawable), earned (reveals/cashouts), spent.
- **Behavior:** Hold (65%), Cashout (20%), Ship (15%).

## Quick Commands
- 
pm run dev - Start development server.
- 
pm run build - Build for production.
- 
pm run lint - Run ESLint.
- 	sc -b - Run type checks.
