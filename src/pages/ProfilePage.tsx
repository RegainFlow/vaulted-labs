import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/shared/Navbar";
import { ProfilePanel } from "../components/profile/ProfilePanel";
import { QuestList } from "../components/profile/QuestList";
import { PageTutorial } from "../components/shared/PageTutorial";
import { TutorialHelpButton } from "../components/shared/TutorialHelpButton";
import { Footer } from "../components/shared/Footer";
import { useGame } from "../context/GameContext";
import { PROFILE_TUTORIAL_STEPS } from "../data/tutorial";

export function ProfilePage() {
  const { balance, inventory, levelInfo, resetDemo, prestigeLevel, freeSpins, addXP, hasSeenProfileTutorial, setHasSeenProfileTutorial } = useGame();
  const navigate = useNavigate();
  const [tutorialActive, setTutorialActive] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!hasSeenProfileTutorial) {
      const timer = setTimeout(() => setTutorialActive(true), 600);
      return () => clearTimeout(timer);
    }
  }, [hasSeenProfileTutorial]);

  return (
    <>
      <Navbar
        showHUD
        balance={balance}
        inventoryCount={inventory.length}
        xp={levelInfo.currentXP}
        level={levelInfo.level}
        prestigeLevel={prestigeLevel}
        freeSpins={freeSpins}
      />
      <main className="min-h-screen bg-bg px-3 sm:px-4 md:px-6 pt-28 md:pt-28 pb-8 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-1 sm:mb-2">
              Player <span className="text-accent">Profile</span>
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

          {/* Debug Tools */}
          <div className="mt-12 pt-6 border-t border-white/5 text-center" data-tutorial="profile-reset">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => addXP(6000)}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20 hover:border-neon-cyan/50 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Grant 6000 XP
              </button>
              <button
                onClick={() => { resetDemo(); navigate("/"); }}
                className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest bg-error/10 border border-error/30 text-error hover:bg-error/20 hover:border-error/50 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Reset Demo
              </button>
            </div>
            <p className="text-[11px] text-text-muted mt-2">
              Debug tools for testing demo progression.
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <PageTutorial
        pageKey="profile"
        steps={PROFILE_TUTORIAL_STEPS}
        isActive={tutorialActive}
        onComplete={() => {
          setTutorialActive(false);
          setHasSeenProfileTutorial(true);
        }}
      />
      {hasSeenProfileTutorial && !tutorialActive && (
        <TutorialHelpButton onClick={() => setTutorialActive(true)} />
      )}
    </>
  );
}
