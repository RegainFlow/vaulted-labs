import { FUNKO_CATALOG, getFunkoById, getFunkoByName } from "../data/funkos";
import type { Collectible } from "../types/collectible";
import type { FunkoItem } from "../types/funko";

function normalizeName(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

export function resolveCollectibleCatalogEntry(
  item: Collectible
): FunkoItem | undefined {
  const byId = item.funkoId ? getFunkoById(item.funkoId) : undefined;
  if (byId) return byId;

  const byFunkoName = item.funkoName ? getFunkoByName(item.funkoName) : undefined;
  if (byFunkoName) return byFunkoName;

  const byProduct = getFunkoByName(item.product);
  if (byProduct) return byProduct;

  const targetNames = new Set(
    [item.funkoName, item.product].map(normalizeName).filter(Boolean)
  );

  if (targetNames.size === 0) return undefined;

  return FUNKO_CATALOG.find((entry) =>
    targetNames.has(normalizeName(entry.name))
  );
}

export function resolveCollectibleImagePath(
  item: Collectible
): string | undefined {
  return item.imagePath ?? resolveCollectibleCatalogEntry(item)?.imagePath;
}
