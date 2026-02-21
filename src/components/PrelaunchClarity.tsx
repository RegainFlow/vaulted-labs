import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const LIVE_NOW_ITEMS = [
  "Playable demo at /play with visible drop odds per vault.",
  "Vault reveal loop with Hold, Ship, or Cashout actions in the demo.",
  "Waitlist signup with tiered early-access credits.",
  "Product feedback channel for early users.",
];

const IN_PROGRESS_ITEMS = [
  "Real-money deposits and full checkout flows.",
  "Production shipping/fulfillment and tracking workflows.",
  "Expanded marketplace depth and broader listing volume.",
  "Deeper progression systems and boss content expansion.",
];

const FAQ_ITEMS = [
  {
    question: "Is VaultedLabs gambling?",
    answer:
      "VaultedLabs is chance-based collectible commerce. You open a vault for a real collectible outcome, with odds shown before reveal.",
  },
  {
    question: "Are the odds visible?",
    answer:
      "Yes. Every vault tier shows explicit Common, Uncommon, Rare, and Legendary probabilities before you open.",
  },
  {
    question: "What do early users get?",
    answer:
      "Priority access, tiered credits, and direct input on product direction before full public launch.",
  },
  {
    question: "Who is this for?",
    answer:
      "Collectors and gamers 18+ who want transparent odds, collectible outcomes, and post-reveal choice.",
  },
];

function ScopeCard({
  title,
  label,
  items,
}: {
  title: string;
  label: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface-elevated/60 p-6 sm:p-7">
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-dim mb-3">
        {label}
      </p>
      <h3 className="text-xl font-black uppercase tracking-tight text-white mb-4">
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-text-muted">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PrelaunchClarity() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="pt-8 pb-14 sm:pt-10 sm:pb-20 md:pt-12 md:pb-24 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-[#120a1f]/70 via-bg to-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,45,149,0.06),transparent_50%),radial-gradient(circle_at_80%_100%,rgba(0,240,255,0.06),transparent_55%)]" />

      <div className="relative max-w-6xl mx-auto space-y-8 sm:space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.28em] text-accent mb-3">
            Current Beta Scope
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
            What Is Live <span className="text-accent">Now</span> vs What Is
            Next
          </h2>
          <p className="mt-4 text-sm sm:text-base text-text-muted">
            VaultedLabs is in beta. You can test the core loop now and join
            early access while production systems are finalized.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <ScopeCard
            label="Available Today"
            title="Live In Beta"
            items={LIVE_NOW_ITEMS}
          />
          <ScopeCard
            label="In Development"
            title="Coming At Launch"
            items={IN_PROGRESS_ITEMS}
          />
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.28em] text-accent mb-2">
              FAQ
            </p>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              Common Questions
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-surface/45 divide-y divide-white/10 overflow-hidden">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left px-5 sm:px-6 py-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-black uppercase tracking-wide text-white">
                      {item.question}
                    </span>
                    <span
                      className={`text-accent text-lg leading-none transition-transform ${
                        isOpen ? "rotate-45" : "rotate-0"
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 sm:px-6 pb-5 text-sm text-text-muted leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
