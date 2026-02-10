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
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleClaim = (amount: number) => {
    animateFly("💰", ".stat-icon-credits"); 
    setTimeout(() => setBalance(prev => prev + amount), 600);
  };

  const handleStore = () => {
    animateFly("📦", ".stat-icon-inventory"); 
    setTimeout(() => setInventoryCount(prev => prev + 1), 600);
  };

  const handleUnlock = () => {
    console.log("System Unlocking...");
    setIsUnlocked(true);
    // Smooth scroll to vault tiers after a small delay for animation
    setTimeout(() => {
      const el = document.getElementById("protocol");
      if (el) {
          el.scrollIntoView({ behavior: "smooth" });
      } else {
          window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent/30 font-sans">
      <Navbar balance={balance} inventoryCount={inventoryCount} />
      <main>
        <Hero onUnlock={handleUnlock} isUnlocked={isUnlocked} />
        <VaultTiers onSelect={setSelectedVault} isLocked={!isUnlocked} />
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