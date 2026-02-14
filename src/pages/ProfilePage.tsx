import { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { ProfilePanel } from "../components/profile/ProfilePanel";
import { QuestList } from "../components/profile/QuestList";
import { Footer } from "../components/Footer";
import { useGame } from "../context/GameContext";

export function ProfilePage() {
  const { balance, inventory, levelInfo, resetDemo } = useGame();

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
              Operator <span className="text-accent">Profile</span>
            </h1>
            <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto">
              Track your XP, level, quests, and boss fights.
            </p>
          </div>
          <ProfilePanel />

          {/* Quests */}
          <div className="mt-6 sm:mt-8">
            <QuestList />
          </div>

          {/* Reset Demo */}
          <div className="mt-12 pt-6 border-t border-white/5 text-center">
            <button
              onClick={resetDemo}
              className="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-text-dim hover:text-error hover:border-error/30 transition-all cursor-pointer"
            >
              Reset Demo
            </button>
            <p className="text-[10px] text-text-dim mt-2">Clears all progress and resets to starting state.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
