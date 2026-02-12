import { motion } from "motion/react";
import { PhoneMockup } from "./PhoneMockup";

const benefits = [
  {
    title: "100% Real Items",
    description:
      "Every vault contains a real collectible. Definite chance of winning a physical item.",
    color: "text-neon-cyan",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-neon-cyan"
      >
        <path d="M6 3h12l4 6-10 13L2 9z" />
      </svg>
    )
  },
  {
    title: "Sell It",
    description: "Don't want it? Sell it back to us.",
    color: "text-accent",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-accent"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M14.5 9a3.5 3.5 0 0 0-5 0M12 7v1M9.5 15a3.5 3.5 0 0 0 5 0M12 16v1M9 12h6" />
      </svg>
    )
  },
  {
    title: "Guaranteed",
    description:
      "All odds are transparent and verified. What you see is what you get.",
    color: "text-vault-gold",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-vault-gold"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    )
  },
  {
    title: "Mobile-First",
    description:
      "Built for quick vault runs anywhere. Seamless on every device.",
    color: "text-neon-green",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-neon-green"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    )
  }
];

export function AppPreview() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-surface/60 px-4 sm:px-6 py-12 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(185,242,255,0.12)_0%,rgba(17,17,24,0)_52%)]" />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 md:gap-16 lg:grid-cols-2">
        {/* LEFT: Benefits */}
        <div className="space-y-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Why VaultedLabs
            </p>
            <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
              Every vault is a{" "}
              <span className="text-accent">guaranteed win</span>.
            </h2>
          </div>

          <div className="space-y-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 items-start"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-surface-elevated border border-white/10 flex items-center justify-center">
                  {b.icon}
                </div>
                <div>
                  <h3
                    className={`font-bold uppercase tracking-wide ${b.color}`}
                  >
                    {b.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed mt-1">
                    {b.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT: Phone Mockup */}
        <PhoneMockup />
      </div>
    </section>
  );
}
