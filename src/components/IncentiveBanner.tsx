import { motion } from "motion/react";
import { useWaitlistCount } from "../hooks/useWaitlistCount";

export function IncentiveBanner() {
  const { count, loading } = useWaitlistCount();
  const maxSpots = 100;
  const remaining = Math.max(0, maxSpots - count);
  const progress = Math.min(100, (count / maxSpots) * 100);

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden bg-surface-elevated border border-accent/30 p-5 sm:p-8 md:p-12 text-center"
        >
          {/* Animated glow background */}
          <div className="absolute inset-0 bg-accent/5 animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-1 bg-accent shadow-[0_0_20px_rgba(255,45,149,0.5)]" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
              First 100 Users Get <span className="text-accent text-glow-magenta">$100 Credit</span>    
            </h2>

            <p className="text-base md:text-lg text-text-muted">
              Join the beta to claim your founding member bonus. Risk-free.
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-accent">{loading ? "..." : `${remaining} spots left`}</span>    
                <span className="text-text-muted">{maxSpots} total</span>
              </div>
              <div className="h-4 bg-bg rounded-full overflow-hidden border border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-accent shadow-[0_0_15px_rgba(255,45,149,0.5)]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
