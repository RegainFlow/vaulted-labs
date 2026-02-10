import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { VaultTiers, type VaultTierData } from "./components/VaultTiers";
import { VaultOverlay } from "./components/VaultOverlay";
import { IncentiveBanner } from "./components/IncentiveBanner";
import { GuaranteedWins } from "./components/GuaranteedWins";
import { WaitlistForm } from "./components/WaitlistForm";
import { Footer } from "./components/Footer";

// Helper for simple "fly" animations
const animateFly = (symbol: string, targetSelector: string) => {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const flyer = document.createElement("div");
  flyer.innerText = symbol;
  flyer.style.position = "fixed";
  flyer.style.left = "50%";
  flyer.style.top = "50%";
  flyer.style.fontSize = "3rem";
  flyer.style.zIndex = "9999";
  flyer.style.pointerEvents = "none";
  flyer.style.transition = "all 0.8s ease-in-out";
  document.body.appendChild(flyer);

  // Force reflow
  flyer.getBoundingClientRect();

  flyer.style.left = `${rect.left + 10}px`;
  flyer.style.top = `${rect.top + 10}px`;
  flyer.style.opacity = "0";
  flyer.style.transform = "scale(0.5)";

  setTimeout(() => {
    document.body.removeChild(flyer);
  }, 800);
};

function App() {
  const [selectedVault, setSelectedVault] = useState<VaultTierData | null>(null);
  const [balance, setBalance] = useState(100);
  const [inventoryCount, setInventoryCount] = useState(0);

  const handleClaim = (amount: number) => {
    animateFly("💰", ".text-lg:first-child"); // Target the coin icon in Navbar
    setTimeout(() => setBalance(prev => prev + amount), 600);
  };

  const handleStore = () => {
    animateFly("📦", ".text-lg:last-child"); // Target the box icon in Navbar
    setTimeout(() => setInventoryCount(prev => prev + 1), 600);
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent/30 font-sans">
      <Navbar balance={balance} inventoryCount={inventoryCount} />
      <main>
        <Hero />
        {/* VaultExperience removed - merged into interactive flow */}
        <VaultTiers onSelect={setSelectedVault} />
        <GuaranteedWins />
        <IncentiveBanner />
        <WaitlistForm />
      </main>
      <Footer />

      <AnimatePresence>
        {selectedVault && (
          <VaultOverlay
            tier={selectedVault}
            onClose={() => setSelectedVault(null)}
            onClaim={handleClaim}
            onStore={handleStore}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


export default App;
