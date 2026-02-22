import type { FunkoItem } from "../types/funko";
import type { Rarity, VaultTierName } from "../types/vault";

export const FUNKO_CATALOG: FunkoItem[] = [
  // ─── Common (15) — baseValue $5–$25 ───
  { id: "pop-rusty-sentinel-001", name: "Rusty Sentinel", rarity: "common", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 8 },
  { id: "pop-scrap-bot-002", name: "Scrap Bot", rarity: "common", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 6 },
  { id: "pop-dust-walker-003", name: "Dust Walker", rarity: "common", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 10 },
  { id: "pop-cave-dweller-004", name: "Cave Dweller", rarity: "common", vaultTiers: ["Bronze", "Silver", "Gold"], imagePath: "", baseValue: 5 },
  { id: "pop-wire-frame-005", name: "Wire Frame", rarity: "common", vaultTiers: ["Bronze", "Silver", "Gold"], imagePath: "", baseValue: 7 },
  { id: "pop-tin-soldier-006", name: "Tin Soldier", rarity: "common", vaultTiers: ["Bronze", "Silver"], imagePath: "", baseValue: 5 },
  { id: "pop-pixel-grunt-007", name: "Pixel Grunt", rarity: "common", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum"], imagePath: "", baseValue: 12 },
  { id: "pop-iron-cub-008", name: "Iron Cub", rarity: "common", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum"], imagePath: "", baseValue: 9 },
  { id: "pop-clay-golem-009", name: "Clay Golem", rarity: "common", vaultTiers: ["Bronze", "Silver", "Gold"], imagePath: "", baseValue: 6 },
  { id: "pop-smoke-wisp-010", name: "Smoke Wisp", rarity: "common", vaultTiers: ["Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 18 },
  { id: "pop-sandstone-sprite-011", name: "Sandstone Sprite", rarity: "common", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 11 },
  { id: "pop-copper-drake-012", name: "Copper Drake", rarity: "common", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 14 },
  { id: "pop-ash-hound-013", name: "Ash Hound", rarity: "common", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 15 },
  { id: "pop-bolt-runner-014", name: "Bolt Runner", rarity: "common", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 20 },
  { id: "pop-fog-lurker-015", name: "Fog Lurker", rarity: "common", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 25 },

  // ─── Uncommon (15) — baseValue $25–$50 ───
  { id: "pop-neon-knight-016", name: "Neon Knight", rarity: "uncommon", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 30 },
  { id: "pop-frost-warden-017", name: "Frost Warden", rarity: "uncommon", vaultTiers: ["Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 35 },
  { id: "pop-storm-caller-018", name: "Storm Caller", rarity: "uncommon", vaultTiers: ["Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 28 },
  { id: "pop-shadow-dancer-019", name: "Shadow Dancer", rarity: "uncommon", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 32 },
  { id: "pop-flame-sprite-020", name: "Flame Sprite", rarity: "uncommon", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 27 },
  { id: "pop-steel-samurai-021", name: "Steel Samurai", rarity: "uncommon", vaultTiers: ["Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 42 },
  { id: "pop-crystal-fox-022", name: "Crystal Fox", rarity: "uncommon", vaultTiers: ["Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 38 },
  { id: "pop-thunder-hawk-023", name: "Thunder Hawk", rarity: "uncommon", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 25 },
  { id: "pop-void-scout-024", name: "Void Scout", rarity: "uncommon", vaultTiers: ["Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 48 },
  { id: "pop-ember-witch-025", name: "Ember Witch", rarity: "uncommon", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 33 },
  { id: "pop-silver-fang-026", name: "Silver Fang", rarity: "uncommon", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 29 },
  { id: "pop-plasma-punk-027", name: "Plasma Punk", rarity: "uncommon", vaultTiers: ["Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 45 },
  { id: "pop-moss-titan-028", name: "Moss Titan", rarity: "uncommon", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 36 },
  { id: "pop-circuit-mage-029", name: "Circuit Mage", rarity: "uncommon", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 40 },
  { id: "pop-tide-shaper-030", name: "Tide Shaper", rarity: "uncommon", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 50 },

  // ─── Rare (15) — baseValue $50–$85 ───
  { id: "pop-chrono-blade-031", name: "Chrono Blade", rarity: "rare", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 55 },
  { id: "pop-phantom-king-032", name: "Phantom King", rarity: "rare", vaultTiers: ["Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 62 },
  { id: "pop-astral-witch-033", name: "Astral Witch", rarity: "rare", vaultTiers: ["Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 70 },
  { id: "pop-hyper-dragon-034", name: "Hyper Dragon", rarity: "rare", vaultTiers: ["Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 75 },
  { id: "pop-quantum-wolf-035", name: "Quantum Wolf", rarity: "rare", vaultTiers: ["Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 80 },
  { id: "pop-nova-phoenix-036", name: "Nova Phoenix", rarity: "rare", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 58 },
  { id: "pop-glitch-reaper-037", name: "Glitch Reaper", rarity: "rare", vaultTiers: ["Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 65 },
  { id: "pop-prism-guardian-038", name: "Prism Guardian", rarity: "rare", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 52 },
  { id: "pop-venom-empress-039", name: "Venom Empress", rarity: "rare", vaultTiers: ["Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 82 },
  { id: "pop-solar-knight-040", name: "Solar Knight", rarity: "rare", vaultTiers: ["Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 68 },
  { id: "pop-nebula-thief-041", name: "Nebula Thief", rarity: "rare", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 50 },
  { id: "pop-frost-queen-042", name: "Frost Queen", rarity: "rare", vaultTiers: ["Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 72 },
  { id: "pop-dark-paladin-043", name: "Dark Paladin", rarity: "rare", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 60 },
  { id: "pop-plasma-oracle-044", name: "Plasma Oracle", rarity: "rare", vaultTiers: ["Obsidian", "Diamond"], imagePath: "", baseValue: 85 },
  { id: "pop-titanium-beast-045", name: "Titanium Beast", rarity: "rare", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 56 },

  // ─── Legendary (15) — baseValue $90–$140 ───
  { id: "pop-void-emperor-046", name: "Void Emperor", rarity: "legendary", vaultTiers: ["Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 120 },
  { id: "pop-celestial-dragon-047", name: "Celestial Dragon", rarity: "legendary", vaultTiers: ["Diamond"], imagePath: "", baseValue: 140 },
  { id: "pop-omega-sentinel-048", name: "Omega Sentinel", rarity: "legendary", vaultTiers: ["Obsidian", "Diamond"], imagePath: "", baseValue: 130 },
  { id: "pop-eternal-phoenix-049", name: "Eternal Phoenix", rarity: "legendary", vaultTiers: ["Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 105 },
  { id: "pop-neon-overlord-050", name: "Neon Overlord", rarity: "legendary", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 90 },
  { id: "pop-prismatic-titan-051", name: "Prismatic Titan", rarity: "legendary", vaultTiers: ["Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 125 },
  { id: "pop-shadow-monarch-052", name: "Shadow Monarch", rarity: "legendary", vaultTiers: ["Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 98 },
  { id: "pop-chrono-god-053", name: "Chrono God", rarity: "legendary", vaultTiers: ["Diamond"], imagePath: "", baseValue: 140 },
  { id: "pop-inferno-king-054", name: "Inferno King", rarity: "legendary", vaultTiers: ["Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 110 },
  { id: "pop-quantum-empress-055", name: "Quantum Empress", rarity: "legendary", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 95 },
  { id: "pop-cyber-shogun-056", name: "Cyber Shogun", rarity: "legendary", vaultTiers: ["Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 100 },
  { id: "pop-astral-deity-057", name: "Astral Deity", rarity: "legendary", vaultTiers: ["Obsidian", "Diamond"], imagePath: "", baseValue: 135 },
  { id: "pop-storm-sovereign-058", name: "Storm Sovereign", rarity: "legendary", vaultTiers: ["Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 115 },
  { id: "pop-diamond-golem-059", name: "Diamond Golem", rarity: "legendary", vaultTiers: ["Diamond"], imagePath: "", baseValue: 138 },
  { id: "pop-vault-breaker-060", name: "Vault Breaker", rarity: "legendary", vaultTiers: ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"], imagePath: "", baseValue: 92 },
];

/** Get all funko items available in a given vault tier */
export function getVaultItems(vaultTier: VaultTierName): FunkoItem[] {
  return FUNKO_CATALOG.filter((f) => f.vaultTiers.includes(vaultTier));
}

/** Get items of a specific rarity available in a vault tier */
export function getVaultItemsByRarity(vaultTier: VaultTierName, rarity: Rarity): FunkoItem[] {
  return FUNKO_CATALOG.filter((f) => f.rarity === rarity && f.vaultTiers.includes(vaultTier));
}

/** Look up a funko item by ID */
export function getFunkoById(id: string): FunkoItem | undefined {
  return FUNKO_CATALOG.find((f) => f.id === id);
}

/** Look up a funko item by name */
export function getFunkoByName(name: string): FunkoItem | undefined {
  return FUNKO_CATALOG.find((f) => f.name === name);
}

/** Pick a random funko item for a given vault tier and won rarity */
export function pickFunko(vaultTier: VaultTierName, rarity: Rarity): FunkoItem {
  const candidates = getVaultItemsByRarity(vaultTier, rarity);
  if (candidates.length === 0) {
    // Fallback: pick any item of that rarity
    const fallback = FUNKO_CATALOG.filter((f) => f.rarity === rarity);
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}
