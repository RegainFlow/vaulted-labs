import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { VaultGrid } from "../components/VaultGrid";
import { Footer } from "../components/Footer";

export function PlayPage() {
  const [balance, setBalance] = useState(100);
  const [inventoryCount, setInventoryCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar showHUD balance={balance} inventoryCount={inventoryCount} />
      <main>
        <VaultGrid
          balance={balance}
          onBalanceChange={setBalance}
          onLootAdd={() => setInventoryCount((prev) => prev + 1)}
        />
      </main>
      <Footer />
    </>
  );
}
