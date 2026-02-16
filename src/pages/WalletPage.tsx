import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/shared/Navbar";
import { WalletHeader } from "../components/wallet/WalletHeader";
import { TransactionList } from "../components/wallet/TransactionList";
import { PageTutorial } from "../components/shared/PageTutorial";
import { TutorialHelpButton } from "../components/shared/TutorialHelpButton";
import { Footer } from "../components/shared/Footer";
import { useGame } from "../context/GameContext";
import { WALLET_TUTORIAL_STEPS } from "../data/tutorial";

export function WalletPage() {
  const { balance, inventory, levelInfo, prestigeLevel, hasSeenWalletTutorial, setHasSeenWalletTutorial } = useGame();
  const navigate = useNavigate();
  const [tutorialActive, setTutorialActive] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!hasSeenWalletTutorial) {
      const timer = setTimeout(() => setTutorialActive(true), 600);
      return () => clearTimeout(timer);
    }
  }, [hasSeenWalletTutorial]);

  return (
    <>
      <Navbar
        showHUD
        balance={balance}
        inventoryCount={inventory.length}
        xp={levelInfo.currentXP}
        level={levelInfo.level}
        prestigeLevel={prestigeLevel}
      />
      <main className="min-h-screen bg-bg px-3 sm:px-4 md:px-6 pt-28 md:pt-28 pb-8 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-1 sm:mb-2">
              <span className="text-vault-gold">Wallet</span>
            </h1>
            <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto">
              Track your credits, transactions, and balances.
            </p>
            <div data-tutorial="wallet-actions" className="inline-flex gap-3 mt-4">
              <button
                onClick={() => {
                  navigate("/");
                  setTimeout(() => {
                    document
                      .getElementById("waitlist-form")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="inline-block px-6 py-2.5 bg-accent text-white text-xs font-black uppercase tracking-widest rounded-xl border-b-[3px] border-[#a01d5e] shadow-[0_4px_12px_rgba(255,45,149,0.3)] hover:shadow-[0_4px_16px_rgba(255,45,149,0.4)] active:border-b-[1px] transition-all duration-100 cursor-pointer"
              >
                Add Credits
              </button>
              <button
                onClick={() => {
                  navigate("/");
                  setTimeout(() => {
                    document
                      .getElementById("waitlist-form")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="inline-block px-6 py-2.5 bg-neon-green text-bg text-xs font-black uppercase tracking-widest rounded-xl border-b-[3px] border-[#2bcc10] shadow-[0_4px_12px_rgba(57,255,20,0.3)] hover:shadow-[0_4px_16px_rgba(57,255,20,0.4)] active:border-b-[1px] transition-all duration-100 cursor-pointer"
              >
                Cashout
              </button>
            </div>
          </div>
          <WalletHeader />
          <TransactionList />
        </div>
      </main>
      <Footer />
      <PageTutorial
        pageKey="wallet"
        steps={WALLET_TUTORIAL_STEPS}
        isActive={tutorialActive}
        onComplete={() => {
          setTutorialActive(false);
          setHasSeenWalletTutorial(true);
        }}
      />
      {hasSeenWalletTutorial && !tutorialActive && (
        <TutorialHelpButton onClick={() => setTutorialActive(true)} />
      )}
    </>
  );
}
