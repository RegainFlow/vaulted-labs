export type QuestStatus = "locked" | "active" | "completed";
export type QuestCategory = "onboarding" | "engagement" | "milestone";
export type QuestRequirementType =
  | "vault_purchase"
  | "spend_amount"
  | "hold_item"
  | "ship_item"
  | "cashout_item"
  | "marketplace_buy"
  | "auction_bid"
  | "marketplace_list";

export interface QuestRequirement {
  type: QuestRequirementType;
  target: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  requiredLevel: number;
  xpReward: number;
  creditReward?: number;
  requirement: QuestRequirement;
  category: QuestCategory;
}

export interface QuestToast {
  questTitle: string;
  xpReward: number;
  creditReward?: number;
}

export interface QuestProgress {
  questId: string;
  status: QuestStatus;
  progress: number;
}

export interface QuestCardProps {
  quest: Quest;
  progress: QuestProgress;
}
