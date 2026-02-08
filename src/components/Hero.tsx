import { motion } from "motion/react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Hero() {
  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-4">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,45,149,0.08)_0%,_rgba(0,240,255,0.03)_40%,_transparent_70%)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        <motion.p
          variants={fadeUp}
          className="mb-4 text-sm font-medium uppercase tracking-widest text-accent text-glow-magenta"
        >
          Mystery Boxes Reimagined
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mb-6 text-5xl font-extrabold leading-tight sm:text-6xl lg:text-7xl"
        >
          Unbox the Extraordinary
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mb-10 max-w-xl text-lg text-text-muted sm:text-xl"
        >
          Pick your vault. Reveal your item. Hold it, ship it, or cash out
          — your choice.
        </motion.p>

        <motion.div variants={fadeUp}>
          <button
            onClick={scrollToWaitlist}
            className="cursor-pointer rounded-lg bg-accent px-8 py-4 text-lg font-bold text-bg transition-colors hover:bg-accent-hover"
          >
            Claim Your Spot
          </button>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-sm text-text-dim"
        >
          First 100 members get $100 in free credit
        </motion.p>
      </motion.div>
    </section>
  );
}
