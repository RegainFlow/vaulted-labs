import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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

export function CompactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 bg-bg">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.28em] text-accent mb-2">
            FAQ
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Common Questions
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface/45 divide-y divide-white/10 overflow-hidden">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
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
    </section>
  );
}
