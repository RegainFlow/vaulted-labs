import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../components/shared/Navbar";
import { Hero } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import { FeatureHighlights } from "../components/FeatureHighlights";
import { CTASection } from "../components/CTASection";
import { WaitlistSection } from "../components/WaitlistSection";
import { CompactFAQ } from "../components/CompactFAQ";
import { Footer } from "../components/shared/Footer";

export function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state as { scrollToWaitlist?: boolean } | null;
    if (!state?.scrollToWaitlist) return;

    const timeoutId = window.setTimeout(() => {
      document
        .getElementById("waitlist-form")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      navigate(location.pathname, { replace: true, state: null });
    }, 80);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.state, navigate]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <FeatureHighlights />
        <CTASection />
        <WaitlistSection />
        <CompactFAQ />
      </main>
      <Footer />
    </>
  );
}
