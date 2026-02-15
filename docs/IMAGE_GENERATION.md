# IMAGE_GENERATION.md — VaultedLabs 3D Render System

## Purpose

This document defines the official rendering system for all VaultedLabs 3D imagery.

The goal is to ensure:

- One cohesive sci-fi industrial universe
- Consistent lighting and materials
- Clear product storytelling
- Prestige + gamified energy
- No visual drift between scenes

All renders must exist in the same world.

---

## Visual Universe (Locked Canon)

### Environment (Non-Negotiable)

Every scene must include:

- Dark hexagonal sci-fi floor
- Subtle cyan inset circuitry lines in floor
- Slightly reflective surface
- Magenta rim bounce lighting
- Subtle volumetric atmospheric glow
- Dark environment falloff in distance

**No plain studio backgrounds.**
**No white backdrops.**
**No abstract floating renders.**

VaultedLabs exists inside a contained digital industrial platform world.

---

## Material System

### Base Structure

- Dark gunmetal industrial chassis
- Hard-surface sci-fi geometry
- Heavy mechanical construction
- Precision panel seams

### Accent Colors

- Cyan (`#00E5FF` range) for circuitry and energy
- Subtle magenta rim accents
- Warm gold only for credits and rewards

### Strict Rules

- No green
- No random colors
- No rainbow glow
- No flat cartoon lighting
- No generic UI icon style

---

## Lighting System

All scenes must use:

- Cinematic high-contrast lighting
- Controlled rim highlights
- Cyan glow spill on floor
- Magenta bounce on metal edges
- Subtle volumetric haze in energy beams
- Slight reflective surface interaction

### Camera

- Consistent 3/4 isometric angle
- Slight depth of field
- Medium focal distance

---

## Master Prompt Block (Prepend to All Prompts)

Use this before every scene description:

> Ultra-detailed isometric 3D hard-surface sci-fi render in the VaultedLabs industrial universe. Dark hexagonal sci-fi floor with subtle cyan inset lines and soft reflective surface. Dark gunmetal mechanical construction with glowing cyan circuitry lines and subtle magenta rim lighting. Cinematic high-contrast lighting with subtle volumetric atmosphere. Unreal Engine quality, realistic PBR materials, consistent 3/4 isometric camera angle and depth of field.

Then add scene-specific description below.
