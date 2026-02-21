import { Navbar } from "../components/shared/Navbar";
import { Hero } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import { AppPreview } from "../components/AppPreview";
import { PrestigeProgression } from "../components/PrestigeProgression";
import { CTASection } from "../components/CTASection";
import { PrelaunchClarity } from "../components/PrelaunchClarity";
import { WaitlistSection } from "../components/WaitlistSection";
import { Footer } from "../components/shared/Footer";

export function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <AppPreview />
        <PrestigeProgression />
        <CTASection />
        <PrelaunchClarity />
        <WaitlistSection />
      </main>
      <Footer />
    </>
  );
}
