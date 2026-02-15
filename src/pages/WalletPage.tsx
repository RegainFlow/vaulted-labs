import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { WalletHeader } from "../components/wallet/WalletHeader";
import { TransactionList } from "../components/wallet/TransactionList";
import { Footer } from "../components/Footer";
import { useGame } from "../context/GameContext";

export function WalletPage() {
  const { balance, inventory, levelInfo } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar
        showHUD
        balance={balance}
        inventoryCount={inventory.length}
        xp={levelInfo.currentXP}
        level={levelInfo.level}
      />
      <main className="min-h-screen bg-bg px-3 sm:px-4 md:px-6 pt-28 md:pt-28 pb-8 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-1 sm:mb-2">
              Credit <span className="text-vault-gold">Ledger</span>
            </h1>
            <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto">
              Track your credits, transactions, and balances.
            </p>
            <button
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  document
                    .getElementById("waitlist-form")
                    ?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="mt-4 inline-block px-6 py-2.5 bg-accent text-white text-xs font-black uppercase tracking-widest rounded-xl border-b-[3px] border-[#a01d5e] shadow-[0_4px_12px_rgba(255,45,149,0.3)] hover:shadow-[0_4px_16px_rgba(255,45,149,0.4)] active:border-b-[1px] transition-all duration-100 cursor-pointer"
            >
              Add Credits
            </button>
          </div>
          <WalletHeader />
          <TransactionList />
        </div>
      </main>
      <Footer />
    </>
  );
}
