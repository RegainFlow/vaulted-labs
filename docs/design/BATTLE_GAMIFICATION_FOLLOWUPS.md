# Arena Combat and Forge Follow-ups

This document captures the next layer of Arena design direction after the current battle and forge UI refactors. It is intentionally forward-looking. It does not imply gameplay or provably fair contract changes unless explicitly called out below.

## Shared Arena System Principles

- Arena surfaces should feel like one connected hardware family:
  - battle
  - forge
  - rank up
  - quests
- The strongest action should always live in one dominant chamber, not in side panels competing for attention.
- Compact HUDs beat stacked dashboards.
- Results should resolve in centered overlays or compact resolution trays, not in long footer panels.
- Major Arena actions should use shared CTA/button patterns rather than one-off chrome.

## Battle Principles

- Keep battle focused on the confrontation:
  - active player unit
  - dominant boss
  - compact combat telemetry
- Future battle work should continue the “combat-first, stats-second” direction.
- Use authored boss presentation profiles to keep each encounter distinct without changing outcome logic.

### Battle follow-ups

- Full boss portrait art pipeline to replace or supplement the current boss icon chambers
- Real player ability choices with a fairness-versioned battle request/result contract
- Status effects that persist across rounds:
  - stun
  - shield
  - bleed
  - haste
- Boss telegraphs and interrupt windows
- Squad formation bonuses based on rarity mix or stat synergy
- Elite and seasonal bosses with unique presentation profiles
- Audio-reactive battle UI and announcer callouts

## Forge Principles

- Forge should read as a **crucible chamber**, not a management form.
- Keep one central focal point:
  - core crucible
  - compact linked inputs in an aligned row
  - concise outcome bias rail
  - clear bottom action rail
- Inputs should be identifiable, but smaller and more tactical than inventory cards.
- Odds and boosts should be compact telemetry, not large standalone panels.
- The result should resolve in a centered item-acquisition overlay with proof visibility.
- Standard desktop forge should bias toward one-viewport fit:
  - compact HUD
  - compact crucible
  - aligned 3-input row
  - unified low-height footer rail

### Current forge direction

- Keep the 3-item recipe system
- Keep free-spin boosts
- Keep the current forge phase structure:
  - dissolve
  - crucible
  - materialize
- Keep the current provably fair `forge_roll` model
- Continue surfacing `View Proof` from the forge result flow

### Forge follow-ups

- Forge-specific animation themes based on the rarity recipe or dominant input tier
- Recipe memory / forge codex showing past successful combinations
- Forge mastery ranks and chain rewards
- Quest-linked forge contracts
- Legendary ritual variants with bigger presentation but the same fairness discipline
- Shard infusion lanes or controlled rarity bias systems
- Forge-specific rank perks
- Forge+battle synergy bonuses where forged archetypes unlock encounter modifiers

## Cross-System Progression Hooks

- Forge synergies that unlock combat modifiers
- Quest-driven battle or forge mutators and encounter rules
- Rank Up perks that affect Arena-side presentation and progression goals
- XP streaks, combo-based mastery, and boss chain rewards
- Deeper inventory depth rewards:
  - collection set bonuses
  - rarity ladder bonuses
  - forge recipe discovery bonuses

## Social / Long-term

- Raid-style multi-stage encounters
- Co-op or asynchronous challenge bosses
- Shareable battle and forge proof summaries tied to the wallet proof model
- Seasonal Arena ladders with rotating forge/battle themes

## Fairness / System Notes

- Any move from cinematic battle abilities to real player battle inputs requires:
  - updating the provably fair `battle_sim` contract
  - updating verification docs and receipts
  - updating in-app proof explanations
  - versioning the battle fairness model explicitly
- Any move from the current one-click forge to interactive forge choices requires:
  - updating the provably fair `forge_roll` contract
  - updating forge receipt verification
  - updating in-app proof UX
  - updating `docs/legal/PROVABLY_FAIR.md`
- Presentation-only Arena refactors should preserve:
  - battle result values
  - forge odds math
  - receipt visibility
  - proof verification semantics
