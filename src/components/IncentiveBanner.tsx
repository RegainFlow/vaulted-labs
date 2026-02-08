import { motion } from "motion/react";
import { useWaitlist } from "../hooks/useWaitlist";
import { WAITLIST_TOTAL_SPOTS } from "../data/vaults";

export function IncentiveBanner() {
  const { count, spotsRemaining, isLoading } = useWaitlist();
  const percentage = Math.min(100, (count / WAITLIST_TOTAL_SPOTS) * 100);

  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="border-y border-border bg-surface px-4 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-accent">
          Limited Offer
        </p>
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
          First 100 Members Get{" "}
          <span className="text-accent">$100 Free Credit</span>
        </h2>
        <p className="mb-10 text-text-muted">
          Sign up for the waitlist and claim your credit when we launch.
        </p>

        {/* Progress bar */}
        <div className="mx-auto mb-3 max-w-md">
          <div className="h-3 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <p className="mb-10 text-sm tabular-nums text-text-muted">
          {isLoading ? (
            <span className="text-text-dim">Loading...</span>
          ) : (
            <>
              <span className="font-bold text-neon-green text-glow-green">{spotsRemaining}</span> of{" "}
              {WAITLIST_TOTAL_SPOTS} spots remaining
            </>
          )}
        </p>

        <button
          onClick={scrollToWaitlist}
          className="cursor-pointer rounded-lg bg-accent px-8 py-4 text-lg font-bold text-bg transition-colors hover:bg-accent-hover"
        >
          Claim Your Spot
        </button>
      </motion.div>
    </section>
  );
}
