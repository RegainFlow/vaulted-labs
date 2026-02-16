export type CreditType = "incentive" | "earned" | "spent";

export interface CreditTransaction {
  id: string;
  type: CreditType;
  amount: number;
  description: string;
  timestamp: number;
}

export interface TransactionRowProps {
  transaction: CreditTransaction;
  isLast: boolean;
}
