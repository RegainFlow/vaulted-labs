import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { LandingPage } from "./pages/LandingPage";
import { VaultsPage } from "./pages/VaultsPage";
import { LockerPage } from "./pages/LockerPage";
import { ArenaBattlesPage } from "./pages/ArenaBattlesPage";
import { ArenaForgePage } from "./pages/ArenaForgePage";
import { ArenaQuestsPage } from "./pages/ArenaQuestsPage";
import { WalletPage } from "./pages/WalletPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { QuestToastNotification } from "./components/shared/QuestToast";
import { trackPageView } from "./lib/analytics";
import { applySeo } from "./lib/apply-seo";

function App() {
  const location = useLocation();

  useEffect(() => {
    applySeo(location.pathname);
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent/30 font-sans">
      <GameProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/vaults" element={<VaultsPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/locker" element={<Navigate to="/locker/inventory" replace />} />
          <Route path="/locker/:section" element={<LockerPage />} />
          <Route path="/arena/battles" element={<ArenaBattlesPage />} />
          <Route path="/arena/forge" element={<ArenaForgePage />} />
          <Route path="/arena/quests" element={<ArenaQuestsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          {/* Redirects from old routes */}
          <Route path="/open" element={<Navigate to="/vaults" replace />} />
          <Route path="/play" element={<Navigate to="/vaults" replace />} />
          <Route path="/collection" element={<Navigate to="/locker/inventory" replace />} />
          <Route path="/shop" element={<Navigate to="/locker/market" replace />} />
          <Route path="/market" element={<Navigate to="/locker/market" replace />} />
          <Route path="/inventory" element={<Navigate to="/locker/inventory" replace />} />
          <Route path="/profile" element={<Navigate to="/locker/arena" replace />} />
          <Route path="/arena" element={<Navigate to="/locker/arena" replace />} />
        </Routes>
        <QuestToastNotification />
      </GameProvider>
    </div>
  );
}

export default App;
