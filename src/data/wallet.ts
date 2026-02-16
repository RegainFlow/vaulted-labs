import type { CreditType } from "../types/wallet";

export const FILTERS: { label: string; value: CreditType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Earned", value: "earned" },
  { label: "Spent", value: "spent" },
  { label: "Incentive", value: "incentive" }
];

export const TYPE_CONFIG: Record<
  string,
  { icon: string; color: string; bgColor: string }
> = {
  earned: { icon: "+", color: "text-neon-cyan", bgColor: "bg-neon-cyan/10" },
  spent: { icon: "-", color: "text-accent", bgColor: "bg-accent/10" },
  incentive: {
    icon: "+",
    color: "text-vault-gold",
    bgColor: "bg-vault-gold/10"
  }
};
