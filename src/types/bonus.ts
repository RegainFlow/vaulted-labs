import type { VaultTierName } from "./vault";

export type VaultLockPhase =
  | "announce"
  | "materialize"
  | "spin-1"
  | "lock-1"
  | "spin-2"
  | "lock-2"
  | "spin-3"
  | "lock-3"
  | "evaluate"
  | "done";

export interface VaultLockSlot {
  tier: VaultTierName;
  color: string;
}

export interface VaultLockBonusStageProps {
  purchasedTierName: VaultTierName;
  prestigeLevel?: number;
  onComplete: (shardsAwarded: number) => void;
}

export const SHARD_REWARDS: Record<VaultTierName, number> = {
  Bronze: 1,
  Silver: 1,
  Gold: 2,
  Platinum: 2,
  Obsidian: 3,
  Diamond: 3
};

/** @deprecated Use SHARD_REWARDS instead */
export const FREE_SPIN_REWARDS = SHARD_REWARDS;
