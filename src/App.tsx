import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { LandingPage } from "./pages/LandingPage";
import { OpenPage } from "./pages/OpenPage";
import { CollectionPage } from "./pages/CollectionPage";
import { ArenaPage } from "./pages/ArenaPage";
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
          <Route path="/open" element={<OpenPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/arena" element={<ArenaPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          {/* Redirects from old routes */}
          <Route path="/play" element={<Navigate to="/open" replace />} />
          <Route path="/shop" element={<Navigate to="/collection" replace />} />
          <Route path="/inventory" element={<Navigate to="/collection" replace />} />
          <Route path="/profile" element={<Navigate to="/arena" replace />} />
        </Routes>
        <QuestToastNotification />
      </GameProvider>
    </div>
  );
}

export default App;
