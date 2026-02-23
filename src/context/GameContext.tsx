import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef
} from "react";
import type { ReactNode } from "react";
import type {
  Collectible,
  CreditTransaction,
  CreditType,
  MarketplaceListing,
  Auction,
  Rarity,
  VaultTierName,
  LevelInfo,
  QuestToast,
  QuestProgress,
  QuestRequirementType,
  SquadStats,
  CombatResult
} from "../types/game";
import { getLevelInfo } from "../data/gamification";
import { BOSS_ENERGY_CONFIG, SHARD_CONFIG } from "../data/gamification";
import { SEED_LISTINGS, SEED_AUCTIONS } from "../data/mock-data";
import { QUESTS } from "../data/quests";
import { generateItemStats } from "../data/item-stats";
import { getForgeOdds, applyForgeBoost, rollForgeResult } from "../data/forge";
import { pickValue, pickProduct, RARITY_CONFIG } from "../data/vaults";
import { trackEvent, AnalyticsEvents } from "../lib/analytics";

// localStorage helpers
const STORAGE_KEY = "vaultedlabs-game-state";
const STATE_VERSION = 2;

interface PersistedState {
  creditTransactions: CreditTransaction[];
  inventory: Collectible[];
  xp: number;
  listings: MarketplaceListing[];
  auctions: Auction[];
  hasSeenTutorial: boolean;
  hasSeenWalletTutorial: boolean;
  hasSeenProfileTutorial: boolean;
  hasSeenInventoryTutorial: boolean;
  hasSeenShopTutorial: boolean;
  hasSeenBossFightTutorial: boolean;
  hasSeenArenaTutorial: boolean;
  hasSeenCollectionTutorial: boolean;
  questProgress: QuestProgress[];
  nextId: number;
  prestigeLevel: number;
  defeatedBosses: string[];
  freeSpins: number;
  cashoutStreak: number;
  // v2 fields
  bossEnergy: number;
  lastEnergyRegenAt: number;
  shards: number;
  equippedItemIds: string[];
  stateVersion: number;
}

const DEFAULT_TX: CreditTransaction = {
  id: "tx-init-1",
  type: "earned",
  amount: 100,
  description: "Demo starting credits",
  timestamp: Date.now()
};

function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function saveState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

/**
 * Migrate v1 state to v2: add stats to items, initialize new fields.
 */
function migrateState(state: PersistedState): PersistedState {
  if (state.stateVersion >= STATE_VERSION) return state;

  // Add stats & isEquipped to existing items
  const migratedInventory = state.inventory.map((item) => ({
    ...item,
    stats: item.stats ?? generateItemStats(item.rarity, item.vaultTier),
    isEquipped: item.isEquipped ?? false
  }));

  // Migrate listings/auctions items too
  const migratedListings = state.listings.map((l) => ({
    ...l,
    item: {
      ...l.item,
      stats: l.item.stats ?? generateItemStats(l.item.rarity, l.item.vaultTier),
      isEquipped: l.item.isEquipped ?? false
    }
  }));

  const migratedAuctions = state.auctions.map((a) => ({
    ...a,
    item: {
      ...a.item,
      stats: a.item.stats ?? generateItemStats(a.item.rarity, a.item.vaultTier),
      isEquipped: a.item.isEquipped ?? false
    }
  }));

  return {
    ...state,
    inventory: migratedInventory,
    listings: migratedListings,
    auctions: migratedAuctions,
    bossEnergy: state.bossEnergy ?? BOSS_ENERGY_CONFIG.maxEnergy,
    lastEnergyRegenAt: state.lastEnergyRegenAt ?? Date.now(),
    shards: state.shards ?? 0,
    equippedItemIds: state.equippedItemIds ?? [],
    hasSeenArenaTutorial: state.hasSeenArenaTutorial ?? false,
    hasSeenCollectionTutorial: state.hasSeenCollectionTutorial ?? false,
    stateVersion: STATE_VERSION
  };
}

// Context
interface GameContextValue {
  creditTransactions: CreditTransaction[];
  inventory: Collectible[];
  xp: number;
  listings: MarketplaceListing[];
  auctions: Auction[];
  balance: number;
  levelInfo: LevelInfo;
  hasSeenTutorial: boolean;
  hasSeenWalletTutorial: boolean;
  hasSeenProfileTutorial: boolean;
  hasSeenInventoryTutorial: boolean;
  hasSeenShopTutorial: boolean;
  hasSeenBossFightTutorial: boolean;
  hasSeenArenaTutorial: boolean;
  hasSeenCollectionTutorial: boolean;
  questProgress: QuestProgress[];
  questToast: QuestToast | null;
  dismissQuestToast: () => void;
  addCredits: (amount: number, type: CreditType, description: string) => void;
  spendCredits: (amount: number, description: string) => boolean;
  addItem: (
    product: string,
    vaultTier: VaultTierName,
    rarity: Rarity,
    value: number,
    funkoId?: string,
    funkoName?: string
  ) => Collectible;
  cashoutItem: (itemId: string) => void;
  shipItem: (itemId: string) => void;
  listItem: (itemId: string) => void;
  purchaseVault: (vaultName: string, price: number) => boolean;
  claimCreditsFromReveal: (value: number) => void;
  buyListing: (listingId: string) => boolean;
  placeBid: (auctionId: string, amount: number) => boolean;
  addXP: (amount: number) => void;
  tutorialOpenVault: (vaultName: string, price: number) => void;
  setHasSeenTutorial: (seen: boolean) => void;
  setHasSeenWalletTutorial: (seen: boolean) => void;
  setHasSeenProfileTutorial: (seen: boolean) => void;
  setHasSeenInventoryTutorial: (seen: boolean) => void;
  setHasSeenShopTutorial: (seen: boolean) => void;
  setHasSeenBossFightTutorial: (seen: boolean) => void;
  setHasSeenArenaTutorial: (seen: boolean) => void;
  setHasSeenCollectionTutorial: (seen: boolean) => void;
  seedDemoItem: () => void;
  removeDemoItem: () => void;
  resetDemo: () => void;
  prestigeLevel: number;
  canPrestige: boolean;
  prestige: () => void;
  defeatedBosses: string[];
  /** @deprecated Use completeBattle instead */
  defeatBoss: (
    bossId: string,
    creditReward: number,
    xpReward: number,
    specialItem?: { product: string; rarity: Rarity; value: number }
  ) => void;
  freeSpins: number;
  grantFreeSpins: (count: number) => void;
  useFreeSpinForVault: (vaultName: string, price: number) => boolean;
  cashoutFlashTimestamp: number;
  cashoutStreak: number;
  // v2 — Arena economy
  bossEnergy: number;
  maxBossEnergy: number;
  spendBossEnergy: (cost?: number) => boolean;
  grantBossEnergy: (count: number) => void;
  shards: number;
  grantShards: (count: number) => void;
  grantBonusShards: (count: number) => void;
  convertShardsToFreeSpin: () => boolean;
  equippedItemIds: string[];
  equippedItems: Collectible[];
  squadStats: SquadStats;
  equipItem: (itemId: string) => boolean;
  unequipItem: (itemId: string) => void;
  forgeItems: (itemIds: [string, string, string], freeSpinsUsed: number) => Collectible | null;
  completeBattle: (bossId: string, result: CombatResult) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

// Hydrate nextId from persisted state to avoid collisions
const saved = loadState();
const migrated = saved ? migrateState(saved) : null;
let nextId = migrated?.nextId ?? 2;

function uid(prefix: string) {
  return `${prefix}-${nextId++}-${Date.now()}`;
}

// Initial quest progress for level 1 quests
function initQuestProgress(): QuestProgress[] {
  return QUESTS.filter((q) => q.requiredLevel <= 1).map((q) => ({
    questId: q.id,
    status: "active" as const,
    progress: 0
  }));
}

export function GameProvider({ children }: { children: ReactNode }) {
  const initial = migrated;

  const [creditTransactions, setCreditTransactions] = useState<
    CreditTransaction[]
  >(initial?.creditTransactions ?? [DEFAULT_TX]);
  const [inventory, setInventory] = useState<Collectible[]>(
    initial?.inventory ?? []
  );
  const [xp, setXP] = useState(initial?.xp ?? 0);
  const [listings, setListings] = useState<MarketplaceListing[]>(
    initial?.listings ?? SEED_LISTINGS
  );
  const [auctions, setAuctions] = useState<Auction[]>(
    initial?.auctions ?? SEED_AUCTIONS
  );
  const [hasSeenTutorial, setHasSeenTutorial] = useState(
    initial?.hasSeenTutorial ?? false
  );
  const [hasSeenWalletTutorial, setHasSeenWalletTutorial] = useState(
    initial?.hasSeenWalletTutorial ?? false
  );
  const [hasSeenProfileTutorial, setHasSeenProfileTutorial] = useState(
    initial?.hasSeenProfileTutorial ?? false
  );
  const [hasSeenInventoryTutorial, setHasSeenInventoryTutorial] = useState(
    initial?.hasSeenInventoryTutorial ?? false
  );
  const [hasSeenShopTutorial, setHasSeenShopTutorial] = useState(
    initial?.hasSeenShopTutorial ?? false
  );
  const [hasSeenBossFightTutorial, setHasSeenBossFightTutorial] = useState(
    initial?.hasSeenBossFightTutorial ?? false
  );
  const [hasSeenArenaTutorial, setHasSeenArenaTutorial] = useState(
    initial?.hasSeenArenaTutorial ?? false
  );
  const [hasSeenCollectionTutorial, setHasSeenCollectionTutorial] = useState(
    initial?.hasSeenCollectionTutorial ?? false
  );
  const [questProgress, setQuestProgress] = useState<QuestProgress[]>(
    initial?.questProgress ?? initQuestProgress()
  );
  const [questToast, setQuestToast] = useState<QuestToast | null>(null);
  const [prestigeLevel, setPrestigeLevel] = useState(
    initial?.prestigeLevel ?? 0
  );
  const [defeatedBosses, setDefeatedBosses] = useState<string[]>(
    initial?.defeatedBosses ?? []
  );
  const [freeSpins, setFreeSpins] = useState(initial?.freeSpins ?? 0);
  const [cashoutStreak, setCashoutStreak] = useState(initial?.cashoutStreak ?? 0);
  const [cashoutFlashTimestamp, setCashoutFlashTimestamp] = useState(0);

  // v2 state
  const [bossEnergy, setBossEnergy] = useState(
    initial?.bossEnergy ?? BOSS_ENERGY_CONFIG.maxEnergy
  );
  const [lastEnergyRegenAt, setLastEnergyRegenAt] = useState(
    initial?.lastEnergyRegenAt ?? Date.now()
  );
  const [shards, setShards] = useState(initial?.shards ?? 0);
  const [equippedItemIds, setEquippedItemIds] = useState<string[]>(
    initial?.equippedItemIds ?? []
  );

  // Ref to track toast auto-dismiss timer
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissQuestToast = useCallback(() => {
    setQuestToast(null);
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  // Set data-prestige attribute on html element
  useEffect(() => {
    if (prestigeLevel > 0) {
      document.documentElement.setAttribute(
        "data-prestige",
        String(prestigeLevel)
      );
    } else {
      document.documentElement.removeAttribute("data-prestige");
    }
  }, [prestigeLevel]);

  // Energy regen on mount — catch up on missed regen ticks
  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastEnergyRegenAt;
    const ticksToGrant = Math.floor(elapsed / BOSS_ENERGY_CONFIG.regenIntervalMs);
    if (ticksToGrant > 0) {
      setBossEnergy((prev) =>
        Math.min(BOSS_ENERGY_CONFIG.maxEnergy, prev + ticksToGrant)
      );
      setLastEnergyRegenAt(
        lastEnergyRegenAt + ticksToGrant * BOSS_ENERGY_CONFIG.regenIntervalMs
      );
    }
  // Only run on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Energy regen interval during session
  useEffect(() => {
    const interval = setInterval(() => {
      setBossEnergy((prev) => {
        if (prev >= BOSS_ENERGY_CONFIG.maxEnergy) return prev;
        return prev + 1;
      });
      setLastEnergyRegenAt(Date.now());
    }, BOSS_ENERGY_CONFIG.regenIntervalMs);
    return () => clearInterval(interval);
  }, []);

  // Persist on every state change
  useEffect(() => {
    saveState({
      creditTransactions,
      inventory,
      xp,
      listings,
      auctions,
      hasSeenTutorial,
      hasSeenWalletTutorial,
      hasSeenProfileTutorial,
      hasSeenInventoryTutorial,
      hasSeenShopTutorial,
      hasSeenBossFightTutorial,
      hasSeenArenaTutorial,
      hasSeenCollectionTutorial,
      questProgress,
      nextId,
      prestigeLevel,
      defeatedBosses,
      freeSpins,
      cashoutStreak,
      bossEnergy,
      lastEnergyRegenAt,
      shards,
      equippedItemIds,
      stateVersion: STATE_VERSION
    });
  }, [
    creditTransactions, inventory, xp, listings, auctions,
    hasSeenTutorial, hasSeenWalletTutorial, hasSeenProfileTutorial,
    hasSeenInventoryTutorial, hasSeenShopTutorial, hasSeenBossFightTutorial,
    hasSeenArenaTutorial, hasSeenCollectionTutorial,
    questProgress, prestigeLevel, defeatedBosses, freeSpins, cashoutStreak,
    bossEnergy, lastEnergyRegenAt, shards, equippedItemIds
  ]);

  const balance = useMemo(
    () => creditTransactions.reduce((sum, tx) => sum + tx.amount, 0),
    [creditTransactions]
  );

  const levelInfo = useMemo(() => getLevelInfo(xp), [xp]);

  // Derived: equipped items resolved from IDs
  const equippedItems = useMemo(
    () => equippedItemIds
      .map((id) => inventory.find((item) => item.id === id))
      .filter((item): item is Collectible => item != null && item.status === "held"),
    [equippedItemIds, inventory]
  );

  // Derived: squad stats from equipped items
  const squadStats = useMemo<SquadStats>(() => {
    const stats = equippedItems.reduce(
      (acc, item) => ({
        totalAtk: acc.totalAtk + item.stats.atk,
        totalDef: acc.totalDef + item.stats.def,
        totalAgi: acc.totalAgi + item.stats.agi,
        memberCount: acc.memberCount + 1
      }),
      { totalAtk: 0, totalDef: 0, totalAgi: 0, memberCount: 0 }
    );
    return stats;
  }, [equippedItems]);

  // Auto-unlock quests when level increases
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuestProgress((prev) => {
        const existingIds = new Set(prev.map((qp) => qp.questId));
        const newQuests = QUESTS.filter(
          (q) => q.requiredLevel <= levelInfo.level && !existingIds.has(q.id)
        ).map((q) => ({ questId: q.id, status: "active" as const, progress: 0 }));

        if (newQuests.length === 0) return prev;
        return [...prev, ...newQuests];
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [levelInfo.level]);

  // Quest progress helper
  const advanceQuests = useCallback(
    (type: QuestRequirementType, incrementBy: number) => {
      const completedQuests: typeof QUESTS = [];

      setQuestProgress((prev) => {
        let changed = false;
        const updated = prev.map((qp) => {
          if (qp.status !== "active") return qp;
          const quest = QUESTS.find((q) => q.id === qp.questId);
          if (!quest || quest.requirement.type !== type) return qp;

          const newProgress = qp.progress + incrementBy;
          if (newProgress >= quest.requirement.target) {
            changed = true;
            completedQuests.push(quest);
            return {
              ...qp,
              status: "completed" as const,
              progress: quest.requirement.target
            };
          }

          changed = true;
          return { ...qp, progress: newProgress };
        });
        return changed ? updated : prev;
      });

      if (completedQuests.length > 0) {
        setTimeout(() => {
          for (const quest of completedQuests) {
            setXP((prev) => prev + quest.xpReward);
            if (quest.creditReward) {
              setCreditTransactions((prev) => [
                ...prev,
                {
                  id: uid("tx"),
                  type: "earned",
                  amount: quest.creditReward!,
                  description: `Quest reward: ${quest.title}`,
                  timestamp: Date.now()
                }
              ]);
            }
            trackEvent(AnalyticsEvents.QUEST_COMPLETED, {
              quest_id: quest.id,
              quest_title: quest.title
            });
            setQuestToast({
              questTitle: quest.title,
              xpReward: quest.xpReward,
              creditReward: quest.creditReward
            });
            if (toastTimer.current) clearTimeout(toastTimer.current);
            toastTimer.current = setTimeout(() => setQuestToast(null), 4000);
          }
        }, 0);
      }
    },
    []
  );

  const addCredits = useCallback(
    (amount: number, type: CreditType, description: string) => {
      setCreditTransactions((prev) => [
        ...prev,
        { id: uid("tx"), type, amount, description, timestamp: Date.now() }
      ]);
    },
    []
  );

  const spendCredits = useCallback(
    (amount: number, description: string): boolean => {
      if (balance < amount) return false;
      setCreditTransactions((prev) => [
        ...prev,
        {
          id: uid("tx"),
          type: "spent",
          amount: -amount,
          description,
          timestamp: Date.now()
        }
      ]);
      return true;
    },
    [balance]
  );

  const addItem = useCallback(
    (
      product: string,
      vaultTier: VaultTierName,
      rarity: Rarity,
      value: number,
      funkoId?: string,
      funkoName?: string
    ): Collectible => {
      const item: Collectible = {
        id: uid("item"),
        product,
        vaultTier,
        rarity,
        value,
        status: "held",
        acquiredAt: Date.now(),
        stats: generateItemStats(rarity, vaultTier),
        isEquipped: false,
        ...(funkoId ? { funkoId } : {}),
        ...(funkoName ? { funkoName } : {})
      };
      setInventory((prev) => [...prev, item]);
      setCashoutStreak(0);
      advanceQuests("hold_item", 1);
      return item;
    },
    [advanceQuests]
  );

  const cashoutItem = useCallback(
    (itemId: string) => {
      // Auto-unequip if equipped
      setEquippedItemIds((prev) => prev.filter((id) => id !== itemId));
      setInventory((prev) =>
        prev.map((item) => {
          if (item.id !== itemId || item.status !== "held") return item;
          setCreditTransactions((txs) => [
            ...txs,
            {
              id: uid("tx"),
              type: "earned",
              amount: item.value,
              description: `Cashout: ${item.rarity} ${item.product}`,
              timestamp: Date.now()
            }
          ]);
          advanceQuests("cashout_item", 1);
          setCashoutFlashTimestamp(Date.now());
          setCashoutStreak((prev) => prev + 1);
          return { ...item, status: "cashed_out" as const, isEquipped: false };
        })
      );
    },
    [advanceQuests]
  );

  const shipItem = useCallback(
    (itemId: string) => {
      // Auto-unequip if equipped
      setEquippedItemIds((prev) => prev.filter((id) => id !== itemId));
      setInventory((prev) =>
        prev.map((item) => {
          if (item.id === itemId && item.status === "held") {
            advanceQuests("ship_item", 1);
            setCashoutStreak(0);
            return { ...item, status: "shipped" as const, isEquipped: false };
          }
          return item;
        })
      );
    },
    [advanceQuests]
  );

  const listItem = useCallback(
    (itemId: string) => {
      const item = inventory.find(i => i.id === itemId && i.status === "held");
      if (!item) return;

      // Auto-unequip if equipped
      setEquippedItemIds((prev) => prev.filter((id) => id !== itemId));
      setInventory(prev => prev.map(i =>
        i.id === itemId ? { ...i, status: "listed" as const, isEquipped: false } : i
      ));

      setListings(prev => [...prev, {
        id: uid("listing"),
        item: { ...item, status: "listed" as const, isEquipped: false },
        sellerName: "You",
        askingPrice: item.value,
        listedAt: Date.now()
      }]);

      advanceQuests("marketplace_list", 1);
    },
    [inventory, advanceQuests]
  );

  const purchaseVault = useCallback(
    (vaultName: string, price: number): boolean => {
      if (balance < price) return false;
      setCreditTransactions((prev) => [
        ...prev,
        {
          id: uid("tx"),
          type: "spent",
          amount: -price,
          description: `${vaultName} Vault purchase`,
          timestamp: Date.now()
        }
      ]);
      setXP((prev) => prev + price);
      // Grant boss energy on vault open
      setBossEnergy((prev) =>
        Math.min(BOSS_ENERGY_CONFIG.maxEnergy, prev + BOSS_ENERGY_CONFIG.grantPerVaultOpen)
      );
      advanceQuests("vault_purchase", 1);
      advanceQuests("spend_amount", price);
      return true;
    },
    [balance, advanceQuests]
  );

  const claimCreditsFromReveal = useCallback((value: number) => {
    setCreditTransactions((prev) => [
      ...prev,
      {
        id: uid("tx"),
        type: "earned",
        amount: value,
        description: "Vault reveal credit claim",
        timestamp: Date.now()
      }
    ]);
    setCashoutFlashTimestamp(Date.now());
    setCashoutStreak((prev) => prev + 1);
  }, []);

  const buyListing = useCallback(
    (listingId: string): boolean => {
      const listing = listings.find((l) => l.id === listingId);
      if (!listing || balance < listing.askingPrice) return false;

      setCreditTransactions((prev) => [
        ...prev,
        {
          id: uid("tx"),
          type: "spent",
          amount: -listing.askingPrice,
          description: `Marketplace: ${listing.item.rarity} ${listing.item.product}`,
          timestamp: Date.now()
        }
      ]);
      setInventory((prev) => [
        ...prev,
        {
          ...listing.item,
          id: uid("item"),
          status: "held",
          acquiredAt: Date.now(),
          isEquipped: false,
          stats: listing.item.stats ?? generateItemStats(listing.item.rarity, listing.item.vaultTier)
        }
      ]);
      setListings((prev) => prev.filter((l) => l.id !== listingId));
      setXP((prev) => prev + listing.askingPrice);
      advanceQuests("marketplace_buy", 1);
      return true;
    },
    [listings, balance, advanceQuests]
  );

  const placeBid = useCallback(
    (auctionId: string, amount: number): boolean => {
      const auction = auctions.find((a) => a.id === auctionId);
      if (!auction || amount <= auction.currentBid || balance < amount)
        return false;

      setAuctions((prev) =>
        prev.map((a) =>
          a.id === auctionId
            ? { ...a, currentBid: amount, currentBidder: "You" }
            : a
        )
      );
      advanceQuests("auction_bid", 1);
      return true;
    },
    [auctions, balance, advanceQuests]
  );

  const addXP = useCallback((amount: number) => {
    setXP((prev) => prev + amount);
  }, []);

  const tutorialOpenVault = useCallback(
    (_vaultName: string, price: number) => {
      setXP((prev) => prev + price);
      // Grant boss energy on tutorial vault open
      setBossEnergy((prev) =>
        Math.min(BOSS_ENERGY_CONFIG.maxEnergy, prev + BOSS_ENERGY_CONFIG.grantPerVaultOpen)
      );
      advanceQuests("vault_purchase", 1);
      advanceQuests("spend_amount", price);
    },
    [advanceQuests]
  );

  const grantFreeSpins = useCallback((count: number) => {
    setFreeSpins((prev) => prev + count);
  }, []);

  const useFreeSpinForVault = useCallback(
    (vaultName: string, price: number): boolean => {
      if (freeSpins <= 0) return false;
      setFreeSpins((prev) => prev - 1);
      setXP((prev) => prev + price);
      // Grant boss energy on free spin vault open
      setBossEnergy((prev) =>
        Math.min(BOSS_ENERGY_CONFIG.maxEnergy, prev + BOSS_ENERGY_CONFIG.grantPerVaultOpen)
      );
      setCreditTransactions((prev) => [
        ...prev,
        {
          id: uid("tx"),
          type: "earned",
          amount: 0,
          description: `Free Spin: ${vaultName} Vault`,
          timestamp: Date.now()
        }
      ]);
      advanceQuests("vault_purchase", 1);
      advanceQuests("spend_amount", price);
      return true;
    },
    [freeSpins, advanceQuests]
  );

  const canPrestige = levelInfo.level >= 10 && prestigeLevel < 3;

  const prestige = useCallback(() => {
    if (levelInfo.level < 10 || prestigeLevel >= 3) return;
    setPrestigeLevel((prev) => prev + 1);
    setXP(0);
    setDefeatedBosses([]);
    // Keep shards and energy across rank-ups (intentional)
  }, [levelInfo.level, prestigeLevel]);

  /** @deprecated Use completeBattle instead */
  const defeatBoss = useCallback(
    (
      bossId: string,
      creditReward: number,
      xpReward: number,
      specialItem?: { product: string; rarity: Rarity; value: number }
    ) => {
      if (!defeatedBosses.includes(bossId)) {
        setDefeatedBosses((prev) => [...prev, bossId]);
      }

      setCreditTransactions((prev) => [
        ...prev,
        {
          id: uid("tx"),
          type: "earned",
          amount: creditReward,
          description: `Boss defeated: ${bossId}`,
          timestamp: Date.now()
        }
      ]);
      setXP((prev) => prev + xpReward);

      if (specialItem) {
        setInventory((prev) => [
          ...prev,
          {
            id: uid("item"),
            product: specialItem.product,
            vaultTier: "Bronze" as VaultTierName,
            rarity: specialItem.rarity,
            value: specialItem.value,
            status: "held",
            acquiredAt: Date.now(),
            stats: generateItemStats(specialItem.rarity, "Bronze"),
            isEquipped: false
          }
        ]);
      }
    },
    [defeatedBosses]
  );

  // ─── v2 Arena Economy Methods ───

  const spendBossEnergy = useCallback((cost: number = BOSS_ENERGY_CONFIG.costPerFight): boolean => {
    if (bossEnergy < cost) return false;
    setBossEnergy((prev) => prev - cost);
    return true;
  }, [bossEnergy]);

  const grantBossEnergy = useCallback((count: number) => {
    setBossEnergy((prev) =>
      Math.min(BOSS_ENERGY_CONFIG.maxEnergy, prev + count)
    );
  }, []);

  const grantShards = useCallback((count: number) => {
    setShards((prev) => prev + count);
  }, []);

  const grantBonusShards = useCallback((count: number) => {
    setShards((prev) => prev + count);
  }, []);

  const convertShardsToFreeSpin = useCallback((): boolean => {
    if (shards < SHARD_CONFIG.freeSpinConversionCost) return false;
    setShards((prev) => prev - SHARD_CONFIG.freeSpinConversionCost);
    setFreeSpins((prev) => prev + 1);
    return true;
  }, [shards]);

  const equipItem = useCallback((itemId: string): boolean => {
    const item = inventory.find((i) => i.id === itemId && i.status === "held");
    if (!item) return false;
    if (equippedItemIds.length >= 3) return false;
    if (equippedItemIds.includes(itemId)) return false;
    setEquippedItemIds((prev) => [...prev, itemId]);
    setInventory((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, isEquipped: true } : i))
    );
    return true;
  }, [inventory, equippedItemIds]);

  const unequipItem = useCallback((itemId: string) => {
    setEquippedItemIds((prev) => prev.filter((id) => id !== itemId));
    setInventory((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, isEquipped: false } : i))
    );
  }, []);

  const forgeItems = useCallback(
    (itemIds: [string, string, string], freeSpinsUsed: number): Collectible | null => {
      const items = itemIds.map((id) =>
        inventory.find((i) => i.id === id && i.status === "held")
      );
      if (items.some((i) => !i)) return null;
      const validItems = items as Collectible[];

      // Spend free spins if used for boost
      if (freeSpinsUsed > 0) {
        if (freeSpins < freeSpinsUsed) return null;
        setFreeSpins((prev) => prev - freeSpinsUsed);
      }

      // Calculate forge odds
      const baseOdds = getForgeOdds(
        validItems[0].rarity,
        validItems[1].rarity,
        validItems[2].rarity
      );
      const finalOdds = applyForgeBoost(baseOdds, freeSpinsUsed);
      const resultRarity = rollForgeResult(finalOdds);

      // Pick a vault tier from the highest-tier input
      const tierOrder: VaultTierName[] = ["Bronze", "Silver", "Gold", "Platinum", "Obsidian", "Diamond"];
      const highestTier = validItems.reduce((best, item) => {
        const bestIdx = tierOrder.indexOf(best);
        const itemIdx = tierOrder.indexOf(item.vaultTier);
        return itemIdx > bestIdx ? item.vaultTier : best;
      }, "Bronze" as VaultTierName);

      const rarityConfig = RARITY_CONFIG[resultRarity];
      const avgPrice = validItems.reduce((sum, i) => sum + i.value, 0) / 3;
      const resultValue = pickValue(avgPrice, rarityConfig);

      const newItem: Collectible = {
        id: uid("item"),
        product: pickProduct(),
        vaultTier: highestTier,
        rarity: resultRarity,
        value: resultValue,
        status: "held",
        acquiredAt: Date.now(),
        stats: generateItemStats(resultRarity, highestTier),
        isEquipped: false
      };

      // Remove input items, unequip if needed
      const idsToRemove = new Set(itemIds);
      setEquippedItemIds((prev) => prev.filter((id) => !idsToRemove.has(id)));
      setInventory((prev) => [
        ...prev.filter((i) => !idsToRemove.has(i.id)),
        newItem
      ]);

      return newItem;
    },
    [inventory, freeSpins]
  );

  const completeBattle = useCallback(
    (bossId: string, result: CombatResult) => {
      if (result.victory && !defeatedBosses.includes(bossId)) {
        setDefeatedBosses((prev) => [...prev, bossId]);
      }
      // Grant shards + XP only — no credits, no items
      if (result.shardsEarned > 0) {
        setShards((prev) => prev + result.shardsEarned);
      }
      setXP((prev) => prev + result.xpEarned);
    },
    [defeatedBosses]
  );

  const DEMO_ITEM_ID = "tutorial-demo-item";

  const seedDemoItem = useCallback(() => {
    setInventory((prev) => {
      if (prev.some((item) => item.id === DEMO_ITEM_ID)) return prev;
      return [
        {
          id: DEMO_ITEM_ID,
          product: "Funko Pop!",
          vaultTier: "Bronze" as VaultTierName,
          rarity: "uncommon" as Rarity,
          value: 24,
          status: "held" as const,
          acquiredAt: Date.now(),
          stats: generateItemStats("uncommon", "Bronze"),
          isEquipped: false
        },
        ...prev
      ];
    });
  }, []);

  const removeDemoItem = useCallback(() => {
    setInventory((prev) => prev.filter(i => i.id !== DEMO_ITEM_ID));
  }, []);

  const resetDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    nextId = 2;
    setCreditTransactions([DEFAULT_TX]);
    setInventory([]);
    setXP(0);
    setListings(SEED_LISTINGS);
    setAuctions(SEED_AUCTIONS);
    setHasSeenTutorial(false);
    setHasSeenWalletTutorial(false);
    setHasSeenProfileTutorial(false);
    setHasSeenInventoryTutorial(false);
    setHasSeenShopTutorial(false);
    setHasSeenBossFightTutorial(false);
    setHasSeenArenaTutorial(false);
    setHasSeenCollectionTutorial(false);
    setQuestProgress(initQuestProgress());
    setQuestToast(null);
    setPrestigeLevel(0);
    setDefeatedBosses([]);
    setFreeSpins(0);
    setCashoutStreak(0);
    setBossEnergy(BOSS_ENERGY_CONFIG.maxEnergy);
    setLastEnergyRegenAt(Date.now());
    setShards(0);
    setEquippedItemIds([]);
    document.documentElement.removeAttribute("data-prestige");
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      creditTransactions,
      inventory,
      xp,
      listings,
      auctions,
      balance,
      levelInfo,
      hasSeenTutorial,
      hasSeenWalletTutorial,
      hasSeenProfileTutorial,
      hasSeenInventoryTutorial,
      hasSeenShopTutorial,
      hasSeenBossFightTutorial,
      hasSeenArenaTutorial,
      hasSeenCollectionTutorial,
      questProgress,
      questToast,
      dismissQuestToast,
      addCredits,
      spendCredits,
      addItem,
      cashoutItem,
      shipItem,
      listItem,
      purchaseVault,
      claimCreditsFromReveal,
      buyListing,
      placeBid,
      addXP,
      tutorialOpenVault,
      setHasSeenTutorial,
      setHasSeenWalletTutorial,
      setHasSeenProfileTutorial,
      setHasSeenInventoryTutorial,
      setHasSeenShopTutorial,
      setHasSeenBossFightTutorial,
      setHasSeenArenaTutorial,
      setHasSeenCollectionTutorial,
      seedDemoItem,
      removeDemoItem,
      resetDemo,
      prestigeLevel,
      canPrestige,
      prestige,
      defeatedBosses,
      defeatBoss,
      freeSpins,
      grantFreeSpins,
      useFreeSpinForVault,
      cashoutFlashTimestamp,
      cashoutStreak,
      // v2
      bossEnergy,
      maxBossEnergy: BOSS_ENERGY_CONFIG.maxEnergy,
      spendBossEnergy,
      grantBossEnergy,
      shards,
      grantShards,
      grantBonusShards,
      convertShardsToFreeSpin,
      equippedItemIds,
      equippedItems,
      squadStats,
      equipItem,
      unequipItem,
      forgeItems,
      completeBattle
    }),
    [
      creditTransactions, inventory, xp, listings, auctions, balance, levelInfo,
      hasSeenTutorial, hasSeenWalletTutorial, hasSeenProfileTutorial,
      hasSeenInventoryTutorial, hasSeenShopTutorial, hasSeenBossFightTutorial,
      hasSeenArenaTutorial, hasSeenCollectionTutorial,
      questProgress, questToast, dismissQuestToast,
      addCredits, spendCredits, addItem, cashoutItem, shipItem, listItem,
      purchaseVault, claimCreditsFromReveal, buyListing, placeBid, addXP,
      tutorialOpenVault, seedDemoItem, removeDemoItem, resetDemo,
      prestigeLevel, canPrestige, prestige, defeatedBosses, defeatBoss,
      freeSpins, grantFreeSpins, useFreeSpinForVault,
      cashoutFlashTimestamp, cashoutStreak,
      bossEnergy, spendBossEnergy, grantBossEnergy,
      shards, grantShards, grantBonusShards, convertShardsToFreeSpin,
      equippedItemIds, equippedItems, squadStats, equipItem, unequipItem,
      forgeItems, completeBattle
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
}
