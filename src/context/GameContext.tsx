import { createContext, useContext, useState, useMemo, useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type {
  InventoryItem,
  CreditTransaction,
  CreditType,
  MarketplaceListing,
  Auction,
  Rarity,
  VaultTierName,
  LevelInfo,
  QuestProgress,
  QuestRequirementType,
} from "../types/game";
import { getLevelInfo } from "../data/gamification";
import { SEED_LISTINGS, SEED_AUCTIONS } from "../data/mock-data";
import { QUESTS } from "../data/quests";
import { trackEvent, AnalyticsEvents } from "../lib/analytics";

/* ── localStorage helpers ─────────────────────────────────────────── */

const STORAGE_KEY = "vaultedlabs-game-state";

interface PersistedState {
  creditTransactions: CreditTransaction[];
  inventory: InventoryItem[];
  xp: number;
  listings: MarketplaceListing[];
  auctions: Auction[];
  hasSeenTutorial: boolean;
  questProgress: QuestProgress[];
  nextId: number;
}

const DEFAULT_TX: CreditTransaction = {
  id: "tx-init-1",
  type: "earned",
  amount: 100,
  description: "Demo starting credits",
  timestamp: Date.now(),
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

/* ── Quest completion toast ───────────────────────────────────────── */

export interface QuestToast {
  questTitle: string;
  xpReward: number;
  creditReward?: number;
}

/* ── Context ──────────────────────────────────────────────────────── */

interface GameContextValue {
  creditTransactions: CreditTransaction[];
  inventory: InventoryItem[];
  xp: number;
  listings: MarketplaceListing[];
  auctions: Auction[];
  balance: number;
  levelInfo: LevelInfo;
  hasSeenTutorial: boolean;
  questProgress: QuestProgress[];
  questToast: QuestToast | null;
  dismissQuestToast: () => void;
  addCredits: (amount: number, type: CreditType, description: string) => void;
  spendCredits: (amount: number, description: string) => boolean;
  addItem: (product: string, vaultTier: VaultTierName, rarity: Rarity, value: number) => InventoryItem;
  cashoutItem: (itemId: string) => void;
  shipItem: (itemId: string) => void;
  purchaseVault: (vaultName: string, price: number) => boolean;
  claimCreditsFromReveal: (value: number) => void;
  buyListing: (listingId: string) => boolean;
  placeBid: (auctionId: string, amount: number) => boolean;
  addXP: (amount: number) => void;
  tutorialOpenVault: (vaultName: string, price: number) => void;
  setHasSeenTutorial: (seen: boolean) => void;
  resetDemo: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

/* Hydrate nextId from persisted state to avoid collisions */
const saved = loadState();
let nextId = saved?.nextId ?? 2;

function uid(prefix: string) {
  return `${prefix}-${nextId++}-${Date.now()}`;
}

/* ── Initial quest progress for level 1 quests ────────────────────── */
function initQuestProgress(): QuestProgress[] {
  return QUESTS
    .filter((q) => q.requiredLevel <= 1)
    .map((q) => ({ questId: q.id, status: "active" as const, progress: 0 }));
}

export function GameProvider({ children }: { children: ReactNode }) {
  const initial = loadState();

  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>(
    initial?.creditTransactions ?? [DEFAULT_TX]
  );
  const [inventory, setInventory] = useState<InventoryItem[]>(initial?.inventory ?? []);
  const [xp, setXP] = useState(initial?.xp ?? 0);
  const [listings, setListings] = useState<MarketplaceListing[]>(initial?.listings ?? SEED_LISTINGS);
  const [auctions, setAuctions] = useState<Auction[]>(initial?.auctions ?? SEED_AUCTIONS);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(initial?.hasSeenTutorial ?? false);
  const [questProgress, setQuestProgress] = useState<QuestProgress[]>(
    initial?.questProgress ?? initQuestProgress()
  );
  const [questToast, setQuestToast] = useState<QuestToast | null>(null);

  // Ref to track toast auto-dismiss timer
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissQuestToast = useCallback(() => {
    setQuestToast(null);
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  /* ── Persist on every state change ─────────────────────────────── */
  useEffect(() => {
    saveState({
      creditTransactions,
      inventory,
      xp,
      listings,
      auctions,
      hasSeenTutorial,
      questProgress,
      nextId,
    });
  }, [creditTransactions, inventory, xp, listings, auctions, hasSeenTutorial, questProgress]);

  const balance = useMemo(
    () => creditTransactions.reduce((sum, tx) => sum + tx.amount, 0),
    [creditTransactions]
  );

  const levelInfo = useMemo(() => getLevelInfo(xp), [xp]);

  /* ── Auto-unlock quests when level increases ───────────────────── */
  useEffect(() => {
    setQuestProgress((prev) => {
      const existingIds = new Set(prev.map((qp) => qp.questId));
      const newQuests = QUESTS
        .filter((q) => q.requiredLevel <= levelInfo.level && !existingIds.has(q.id))
        .map((q) => ({ questId: q.id, status: "active" as const, progress: 0 }));

      if (newQuests.length === 0) return prev;
      return [...prev, ...newQuests];
    });
  }, [levelInfo.level]);

  /* ── Quest progress helper ─────────────────────────────────────── */
  const advanceQuests = useCallback((type: QuestRequirementType, incrementBy: number) => {
    setQuestProgress((prev) => {
      let changed = false;
      const updated = prev.map((qp) => {
        if (qp.status !== "active") return qp;
        const quest = QUESTS.find((q) => q.id === qp.questId);
        if (!quest || quest.requirement.type !== type) return qp;

        const newProgress = qp.progress + incrementBy;
        if (newProgress >= quest.requirement.target) {
          changed = true;
          // Award rewards asynchronously to avoid setState-in-setState
          setTimeout(() => {
            setXP((prev) => prev + quest.xpReward);
            if (quest.creditReward) {
              setCreditTransactions((prev) => [
                ...prev,
                {
                  id: uid("tx"),
                  type: "earned",
                  amount: quest.creditReward!,
                  description: `Quest reward: ${quest.title}`,
                  timestamp: Date.now(),
                },
              ]);
            }
            trackEvent(AnalyticsEvents.QUEST_COMPLETED, { quest_id: quest.id, quest_title: quest.title });
            // Show toast
            setQuestToast({ questTitle: quest.title, xpReward: quest.xpReward, creditReward: quest.creditReward });
            if (toastTimer.current) clearTimeout(toastTimer.current);
            toastTimer.current = setTimeout(() => setQuestToast(null), 4000);
          }, 0);
          return { ...qp, status: "completed" as const, progress: quest.requirement.target };
        }

        changed = true;
        return { ...qp, progress: newProgress };
      });
      return changed ? updated : prev;
    });
  }, []);

  const addCredits = useCallback((amount: number, type: CreditType, description: string) => {
    setCreditTransactions((prev) => [
      ...prev,
      { id: uid("tx"), type, amount, description, timestamp: Date.now() },
    ]);
  }, []);

  const spendCredits = useCallback(
    (amount: number, description: string): boolean => {
      if (balance < amount) return false;
      setCreditTransactions((prev) => [
        ...prev,
        { id: uid("tx"), type: "spent", amount: -amount, description, timestamp: Date.now() },
      ]);
      return true;
    },
    [balance]
  );

  const addItem = useCallback(
    (product: string, vaultTier: VaultTierName, rarity: Rarity, value: number): InventoryItem => {
      const item: InventoryItem = {
        id: uid("item"),
        product,
        vaultTier,
        rarity,
        value,
        status: "held",
        acquiredAt: Date.now(),
      };
      setInventory((prev) => [...prev, item]);
      advanceQuests("hold_item", 1);
      return item;
    },
    [advanceQuests]
  );

  const cashoutItem = useCallback(
    (itemId: string) => {
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
              timestamp: Date.now(),
            },
          ]);
          advanceQuests("cashout_item", 1);
          return { ...item, status: "cashed_out" as const };
        })
      );
    },
    [advanceQuests]
  );

  const shipItem = useCallback((itemId: string) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === itemId && item.status === "held") {
          advanceQuests("ship_item", 1);
          return { ...item, status: "shipped" as const };
        }
        return item;
      })
    );
  }, [advanceQuests]);

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
          timestamp: Date.now(),
        },
      ]);
      setXP((prev) => prev + price);
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
        timestamp: Date.now(),
      },
    ]);
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
          timestamp: Date.now(),
        },
      ]);
      setInventory((prev) => [
        ...prev,
        { ...listing.item, id: uid("item"), status: "held", acquiredAt: Date.now() },
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
      if (!auction || amount <= auction.currentBid || balance < amount) return false;

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

  /** Free vault open for tutorial — awards XP + quest progress, no credit charge */
  const tutorialOpenVault = useCallback((_vaultName: string, price: number) => {
    setXP((prev) => prev + price);
    advanceQuests("vault_purchase", 1);
    advanceQuests("spend_amount", price);
  }, [advanceQuests]);

  const resetDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    nextId = 2;
    setCreditTransactions([DEFAULT_TX]);
    setInventory([]);
    setXP(0);
    setListings(SEED_LISTINGS);
    setAuctions(SEED_AUCTIONS);
    setHasSeenTutorial(false);
    setQuestProgress(initQuestProgress());
    setQuestToast(null);
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
      questProgress,
      questToast,
      dismissQuestToast,
      addCredits,
      spendCredits,
      addItem,
      cashoutItem,
      shipItem,
      purchaseVault,
      claimCreditsFromReveal,
      buyListing,
      placeBid,
      addXP,
      tutorialOpenVault,
      setHasSeenTutorial,
      resetDemo,
    }),
    [
      creditTransactions,
      inventory,
      xp,
      listings,
      auctions,
      balance,
      levelInfo,
      hasSeenTutorial,
      questProgress,
      questToast,
      dismissQuestToast,
      addCredits,
      spendCredits,
      addItem,
      cashoutItem,
      shipItem,
      purchaseVault,
      claimCreditsFromReveal,
      buyListing,
      placeBid,
      addXP,
      tutorialOpenVault,
      resetDemo,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
}
