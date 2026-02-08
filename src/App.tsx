import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { VaultExperience } from "./components/VaultExperience";
import { YourChoice } from "./components/YourChoice";
import { VaultTiers } from "./components/VaultTiers";
import { IncentiveBanner } from "./components/IncentiveBanner";
import { WaitlistForm } from "./components/WaitlistForm";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />
      <main>
        <Hero />
        <VaultExperience />
        <YourChoice />
        <VaultTiers />
        <IncentiveBanner />
        <WaitlistForm />
      </main>
      <Footer />
    </div>
  );
}
