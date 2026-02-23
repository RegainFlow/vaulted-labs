export type UnlockFeatureKey =
  | "locker"
  | "market"
  | "arena"
  | "battles"
  | "forge"
  | "quests";

export const FEATURE_UNLOCK_XP: Record<UnlockFeatureKey, number> = {
  locker: 50,
  market: 150,
  arena: 200,
  battles: 200,
  forge: 250,
  quests: 300
};

export const FEATURE_UNLOCK_LABEL: Record<UnlockFeatureKey, string> = {
  locker: "Locker",
  market: "Market",
  arena: "Arena",
  battles: "Battles",
  forge: "Forge",
  quests: "Quests"
};

export function getUnlockXP(featureKey: UnlockFeatureKey): number {
  return FEATURE_UNLOCK_XP[featureKey];
}

export function isFeatureUnlocked(featureKey: UnlockFeatureKey, xp: number): boolean {
  return xp >= FEATURE_UNLOCK_XP[featureKey];
}

export function getRemainingXP(featureKey: UnlockFeatureKey, xp: number): number {
  return Math.max(FEATURE_UNLOCK_XP[featureKey] - xp, 0);
}
