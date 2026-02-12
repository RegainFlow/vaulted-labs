import { createContext, useContext, useState, useMemo, useCallback } from "react";
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
} from "../types/game";
import { getLevelInfo } from "../data/gamification";
import { SEED_LISTINGS, SEED_AUCTIONS } from "../data/mock-data";

interface GameContextValue {
  creditTransactions: CreditTransaction[];
  inventory: InventoryItem[];
  xp: number;
  listings: MarketplaceListing[];
  auctions: Auction[];
  balance: number;
  levelInfo: LevelInfo;
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
}

const GameContext = createContext<GameContextValue | null>(null);

let nextId = 1;
function uid(prefix: string) {
  return `${prefix}-${nextId++}-${Date.now()}`;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([
    {
      id: uid("tx"),
      type: "earned",
      amount: 100,
      description: "Demo starting credits",
      timestamp: Date.now(),
    },
  ]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [xp, setXP] = useState(0);
  const [listings, setListings] = useState<MarketplaceListing[]>(SEED_LISTINGS);
  const [auctions, setAuctions] = useState<Auction[]>(SEED_AUCTIONS);

  const balance = useMemo(
    () => creditTransactions.reduce((sum, tx) => sum + tx.amount, 0),
    [creditTransactions]
  );

  const levelInfo = useMemo(() => getLevelInfo(xp), [xp]);

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
      return item;
    },
    []
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
          return { ...item, status: "cashed_out" as const };
        })
      );
    },
    []
  );

  const shipItem = useCallback((itemId: string) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId && item.status === "held"
          ? { ...item, status: "shipped" as const }
          : item
      )
    );
  }, []);

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
      return true;
    },
    [balance]
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
      return true;
    },
    [listings, balance]
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
      return true;
    },
    [auctions, balance]
  );

  const addXP = useCallback((amount: number) => {
    setXP((prev) => prev + amount);
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
    }),
    [
      creditTransactions,
      inventory,
      xp,
      listings,
      auctions,
      balance,
      levelInfo,
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
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
}
