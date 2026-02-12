import { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { VaultGrid } from "../components/VaultGrid";
import { Footer } from "../components/Footer";
import { useGame } from "../context/GameContext";

export function PlayPage() {
  const { balance, inventory, levelInfo } = useGame();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar showHUD balance={balance} inventoryCount={inventory.length} xp={levelInfo.currentXP} level={levelInfo.level} />
      <main>
        <VaultGrid />
      </main>
      <Footer />
    </>
  );
}
