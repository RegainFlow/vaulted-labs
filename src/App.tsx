import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Analytics } from "@vercel/analytics/react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProductMockupSection } from "./components/ProductMockupSection";
import { VaultTiers } from "./components/VaultTiers";
import { VaultOverlay } from "./components/VaultOverlay";
import { IncentiveBanner } from "./components/IncentiveBanner";
import { GuaranteedWins } from "./components/GuaranteedWins";
import { YourChoice } from "./components/YourChoice";
import { WaitlistForm } from "./components/WaitlistForm";
import { Footer } from "./components/Footer";
import type { Vault } from "./data/vaults";

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
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [balance, setBalance] = useState(100);
  const [inventoryCount, setInventoryCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleClaim = (amount: number) => {
    animateFly("≡ƒÆ░", ".stat-icon-credits");
    setTimeout(() => setBalance(prev => prev + amount), 600);
  };

  const handleStore = () => {
    animateFly("≡ƒôª", ".stat-icon-inventory");
    setTimeout(() => setInventoryCount(prev => prev + 1), 600);
  };

  const handleUnlock = () => {
    console.log("System Unlocking...");
    setIsUnlocked(true);
    // Smooth scroll handled by Hero component internally before calling this,
    // or we can ensure it here too. Hero scrolls to 'protocol'.
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent/30 font-sans">
      <Analytics />
      <Navbar balance={balance} inventoryCount={inventoryCount} />
      <main>
        <Hero onAccessKeyInsert={handleUnlock} />
        <ProductMockupSection />
        <VaultTiers 
          onSelect={setSelectedVault} 
          locked={!isUnlocked} 
          onLockedAttempt={() => document.getElementById("hero-access")?.scrollIntoView({ behavior: "smooth" })}
        />
        <GuaranteedWins />
        <YourChoice />
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