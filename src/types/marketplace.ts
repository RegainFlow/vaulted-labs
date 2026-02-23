import type { Collectible } from "./collectible";

export interface MarketplaceListing {
  id: string;
  item: Collectible;
  sellerName: string;
  askingPrice: number;
  listedAt: number;
}

export interface Auction {
  id: string;
  item: Collectible;
  sellerName: string;
  startingBid: number;
  currentBid: number;
  currentBidder: string | null;
  endsAt: number;
  listedAt: number;
}

export interface AuctionCardProps {
  auction: Auction;
  balance: number;
  onBid: (auctionId: string, amount: number) => boolean;
}
