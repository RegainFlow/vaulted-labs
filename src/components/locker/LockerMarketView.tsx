import { ShopTabs } from "../shop/ShopTabs";

export function LockerMarketView() {
  return (
    <div>
      <div className="mb-4 sm:mb-5 text-center">
        <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-white">
          Market
        </h2>
        <p className="text-xs sm:text-sm text-text-muted">
          Buy now listings or jump into auctions in one place.
        </p>
      </div>
      <ShopTabs />
    </div>
  );
}
