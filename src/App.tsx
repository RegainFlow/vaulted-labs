import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { LandingPage } from "./pages/LandingPage";
import { PlayPage } from "./pages/PlayPage";

function App() {
  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent/30 font-sans">
      <Analytics />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/play" element={<PlayPage />} />
      </Routes>
    </div>
  );
}

export default App;
