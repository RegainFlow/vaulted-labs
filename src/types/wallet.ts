import type { ProvablyFairRevealStatus } from "./provably-fair";

export type CreditType = "incentive" | "earned" | "spent" | "activity";

export interface CreditTransaction {
  id: string;
  type: CreditType;
  amount: number;
  description: string;
  timestamp: number;
  provablyFairReceiptId?: string;
  provablyFairStatus?: ProvablyFairRevealStatus;
}

export interface TransactionRowProps {
  transaction: CreditTransaction;
  isLast: boolean;
  onOpenReceipt?: (receiptId: string) => void;
}
