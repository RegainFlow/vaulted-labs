import { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { ShopTabs } from "../components/shop/ShopTabs";
import { Footer } from "../components/Footer";
import { useGame } from "../context/GameContext";

export function ShopPage() {
  const { balance, inventory, levelInfo } = useGame();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar showHUD balance={balance} inventoryCount={inventory.length} xp={levelInfo.currentXP} level={levelInfo.level} />
      <main className="min-h-screen bg-bg px-3 sm:px-4 md:px-6 pt-28 md:pt-28 pb-8 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-1 sm:mb-2">
              The <span className="text-accent">Shop</span>
            </h1>
            <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto">
              Buy collectibles and bid on auctions.
            </p>
          </div>
          <ShopTabs />
        </div>
      </main>
      <Footer />
    </>
  );
}
