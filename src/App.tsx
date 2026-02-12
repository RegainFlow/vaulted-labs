import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { GameProvider } from "./context/GameContext";
import { LandingPage } from "./pages/LandingPage";
import { PlayPage } from "./pages/PlayPage";
import { MarketplacePage } from "./pages/MarketplacePage";

function App() {
  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent/30 font-sans">
      <Analytics />
      <GameProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/market" element={<MarketplacePage />} />
        </Routes>
      </GameProvider>
    </div>
  );
}

export default App;
