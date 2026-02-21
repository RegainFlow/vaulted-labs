import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { LandingPage } from "./pages/LandingPage";
import { PlayPage } from "./pages/PlayPage";
import { ShopPage } from "./pages/ShopPage";
import { InventoryPage } from "./pages/InventoryPage";
import { ProfilePage } from "./pages/ProfilePage";
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
          <Route path="/play" element={<PlayPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
        <QuestToastNotification />
      </GameProvider>
    </div>
  );
}

export default App;
