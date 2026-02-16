import type { ItemStatus } from "../types/inventory";

export const FILTERS: { label: string; value: ItemStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Held", value: "held" },
  { label: "Shipped", value: "shipped" },
  { label: "Cashed Out", value: "cashed_out" }
];
