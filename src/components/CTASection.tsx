import { motion } from "motion/react";
import { PlayNowButton } from "./shared/PlayNowButton";

export function CTASection() {
  return (
    <section className="pt-16 pb-8 md:pt-20 md:pb-10 px-4 sm:px-6 bg-bg relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,45,149,0.06),transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-b from-transparent to-[#120a1f]/70 pointer-events-none" />

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
        <div className="flex justify-center">
          <PlayNowButton location="cta_section" />
        </div>
      </motion.div>
    </section>
  );
}
