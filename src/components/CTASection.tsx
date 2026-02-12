import { motion } from "motion/react";
import { PlayNowButton } from "./PlayNowButton";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 bg-bg relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,45,149,0.06),transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto text-center relative z-10 space-y-5 md:space-y-8"
      >
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
          See It in <span className="text-accent">Action</span>
        </h2>
        <p className="text-text-muted text-base md:text-lg max-w-lg mx-auto">
          Choose your category, pick a vault, and reveal your loot.
        </p>
        <div className="flex justify-center pb-16">
          <PlayNowButton />
        </div>
      </motion.div>
    </section>
  );
}
