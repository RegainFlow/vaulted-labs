import type { Collectible } from "../types/collectible";
import type { Battle, CombatExchange, CombatResult } from "../types/gamification";
import {
  BATTLE_PRESENTATION_PROFILES,
  type BattleAbilityPresentation,
  type BattlePresentationProfile,
  type BattleTone,
} from "../data/battle-presentation";

export interface BattleFeedEntry {
  id: string;
  side: "player" | "boss" | "system";
  tone: BattleTone;
  text: string;
}

export interface BattleTimelineFrame {
  id: string;
  round: number;
  exchange: CombatExchange;
  activeSquadIndex: number;
  playerAbility: BattleAbilityPresentation;
  bossAbility: BattleAbilityPresentation;
  playerFeed: BattleFeedEntry;
  bossFeed: BattleFeedEntry;
  systemFeed?: BattleFeedEntry;
  crit: boolean;
  bossStatus: string;
}

export function getBattlePresentationProfile(battleId: Battle["id"]): BattlePresentationProfile {
  return BATTLE_PRESENTATION_PROFILES[battleId] ?? BATTLE_PRESENTATION_PROFILES["boss-1"];
}

function getPlayerAbility(
  profile: BattlePresentationProfile,
  exchange: CombatExchange
): BattleAbilityPresentation {
  if (exchange.quality === "critical") {
    return profile.playerAbilities[2] ?? profile.playerAbilities[0];
  }
  if (exchange.quality === "weak") {
    return profile.playerAbilities[1] ?? profile.playerAbilities[0];
  }
  return profile.playerAbilities[(exchange.round - 1) % profile.playerAbilities.length] ?? profile.playerAbilities[0];
}

function getBossAbility(
  profile: BattlePresentationProfile,
  exchange: CombatExchange
): BattleAbilityPresentation {
  if (exchange.bossHeal) {
    return profile.bossAbilities.find((ability) => ability.label.toLowerCase().includes("regen")) ?? profile.bossAbilities[0];
  }
  return profile.bossAbilities[(exchange.round - 1) % profile.bossAbilities.length] ?? profile.bossAbilities[0];
}

function buildPlayerFeed(
  exchange: CombatExchange,
  playerAbility: BattleAbilityPresentation
): BattleFeedEntry {
  if (exchange.quality === "critical") {
    return {
      id: `player-${exchange.round}`,
      side: "player",
      tone: "gold",
      text: `${playerAbility.label} CRITICAL -${exchange.squadDamage}`,
    };
  }

  return {
    id: `player-${exchange.round}`,
    side: "player",
    tone: "cyan",
    text: `${playerAbility.label} -${exchange.squadDamage}`,
  };
}

function buildBossFeed(
  exchange: CombatExchange,
  bossAbility: BattleAbilityPresentation
): BattleFeedEntry {
  return {
    id: `boss-${exchange.round}`,
    side: "boss",
    tone: exchange.bossDamage >= exchange.squadDamage ? "magenta" : "neutral",
    text: `${bossAbility.label} -${exchange.bossDamage}`,
  };
}

export function buildBattleTimeline({
  battle,
  squadItems,
  combatResult,
}: {
  battle: Battle;
  squadItems: Collectible[];
  combatResult: CombatResult;
}): BattleTimelineFrame[] {
  const profile = getBattlePresentationProfile(battle.id);
  const squadCount = Math.max(1, squadItems.length);

  return combatResult.exchanges.map((exchange) => {
    const playerAbility = getPlayerAbility(profile, exchange);
    const bossAbility = getBossAbility(profile, exchange);
    const systemFeed = exchange.bossHeal
      ? {
          id: `system-${exchange.round}`,
          side: "system" as const,
          tone: "green" as const,
          text: `${profile.bossTitle} regenerates +${exchange.bossHeal}`,
        }
      : undefined;

    return {
      id: `frame-${exchange.round}`,
      round: exchange.round,
      exchange,
      activeSquadIndex: (exchange.round - 1) % squadCount,
      playerAbility,
      bossAbility,
      playerFeed: buildPlayerFeed(exchange, playerAbility),
      bossFeed: buildBossFeed(exchange, bossAbility),
      systemFeed,
      crit: exchange.quality === "critical",
      bossStatus: exchange.bossHeal
        ? "Regenerating"
        : profile.bossStatuses[(exchange.round - 1) % profile.bossStatuses.length] ?? profile.threatLabel,
    };
  });
}
