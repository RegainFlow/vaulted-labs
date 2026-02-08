import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VAULTS } from "../data/vaults";

type Step = 0 | 1 | 2;

const stepLabels = ["Pick Your Vault", "Open the Box", "Reveal Your Item"];

const vaultPills = VAULTS.map((v) => ({
  name: v.name,
  price: v.price,
  color: v.color,
}));

export function VaultExperience() {
  const [activeStep, setActiveStep] = useState<Step>(0);
  const [selectedVault, setSelectedVault] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Observe when section enters viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const advanceStep = useCallback(() => {
    setActiveStep((prev) => {
      if (prev === 2) {
        // Reset: cycle vault selection and restart
        setSelectedVault((v) => (v + 1) % VAULTS.length);
        return 0;
      }
      return ((prev + 1) as Step);
    });
  }, []);

  // Auto-play when in view
  useEffect(() => {
    if (!isInView) {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      return;
    }
    autoplayRef.current = setInterval(advanceStep, 3000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [isInView, advanceStep]);

  const handleStepClick = (step: Step) => {
    setActiveStep(step);
    // Pause autoplay for 10s on manual interaction
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      if (isInView) {
        autoplayRef.current = setInterval(advanceStep, 3000);
      }
    }, 10000);
  };

  return (
    <section ref={sectionRef} className="px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-center text-3xl font-bold sm:text-4xl">
          The Experience
        </h2>
        <p className="mx-auto mb-14 max-w-lg text-center text-text-muted">
          From vault to reveal in seconds.
        </p>

        {/* Step indicators */}
        <div className="mb-12 flex items-center justify-center gap-2 sm:gap-4">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => handleStepClick(i as Step)}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeStep === i
                    ? "bg-accent text-bg glow-magenta"
                    : "bg-surface border border-border text-text-muted hover:border-accent/40"
                }`}
              >
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{i + 1}</span>
              </button>
              {i < 2 && (
                <svg className="h-4 w-4 text-text-dim" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Content area */}
        <div className="relative mx-auto min-h-[240px] max-w-2xl">
          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <motion.div
                key="vault"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <p className="mb-6 text-sm text-text-muted">Choose your tier</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {vaultPills.map((v, i) => (
                    <div
                      key={v.name}
                      className={`rounded-xl border px-5 py-3 text-center transition-all ${
                        selectedVault === i
                          ? "border-accent bg-accent/10 glow-magenta scale-105"
                          : "border-border bg-surface"
                      }`}
                    >
                      <div
                        className="mb-1 text-lg font-bold"
                        style={{ color: v.color }}
                      >
                        {v.name}
                      </div>
                      <div className="text-sm text-text-dim">${v.price}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeStep === 1 && (
              <motion.div
                key="box"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <p className="mb-6 text-sm text-text-muted">Your vault is sealed. Ready to open?</p>
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(255,45,149,0.3), 0 0 60px rgba(255,45,149,0.1)",
                      "0 0 20px rgba(0,240,255,0.3), 0 0 60px rgba(0,240,255,0.1)",
                      "0 0 20px rgba(57,255,20,0.3), 0 0 60px rgba(57,255,20,0.1)",
                      "0 0 20px rgba(255,45,149,0.3), 0 0 60px rgba(255,45,149,0.1)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="flex h-32 w-32 items-center justify-center rounded-2xl border border-border bg-surface-elevated"
                >
                  <svg className="h-16 w-16 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                </motion.div>
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                className="flex flex-col items-center"
              >
                <p className="mb-6 text-sm text-text-muted">You got something special!</p>
                <div className="rounded-2xl border border-border bg-surface p-6 text-center glow-cyan">
                  <span className="mb-2 inline-block rounded-full bg-rarity-rare/20 px-3 py-1 text-xs font-semibold text-rarity-rare">
                    RARE
                  </span>
                  <p className="mb-1 text-lg font-bold text-neon-cyan">
                    Collectible Item
                  </p>
                  <p className="text-sm text-text-muted">
                    Hold, Ship, or Cash Out — your choice.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
