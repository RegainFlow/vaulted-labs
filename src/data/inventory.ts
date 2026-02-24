import type { ItemStatus } from "../types/collectible";

export const FILTERS: { label: string; value: ItemStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Items", value: "held" },
  { label: "Shipped", value: "shipped" },
  { label: "Cashed Out", value: "cashed_out" }
];
