import { useState } from "react";
import { motion } from "motion/react";
import { MOCKUP_PROMPTS } from "../data/mockupPrompts";

const MOCKUP_IMAGE_SRC = "/images/game-mockup-phone.png";

export function ProductMockupSection() {
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-surface/60 px-6 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(185,242,255,0.12)_0%,rgba(17,17,24,0)_52%)]" />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            Mobile Preview
          </p>
          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
            Built for quick vault runs on iPhone.
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-text-muted">
            This section is wired for your final gameplay mockup. Drop the image
            in <code>public/images/game-mockup-phone.png</code> and it renders
            automatically.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {MOCKUP_PROMPTS.map((prompt) => (
              <span
                key={prompt.id}
                className="rounded-full border border-white/20 bg-surface-elevated px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted"
              >
                {prompt.tool}
              </span>
            ))}
          </div>

          <p className="mt-5 text-sm text-text-dim">
            Prompt pack source: <code>src/data/mockupPrompts.ts</code>
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mx-auto w-full max-w-[330px]"
        >
          <div className="relative rounded-[44px] border border-white/20 bg-black p-3 shadow-[0_26px_90px_rgba(0,0,0,0.6)]">
            <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
            <div className="overflow-hidden rounded-[34px] border border-white/10 bg-surface-elevated">
              {!showPlaceholder ? (
                <img
                  src={MOCKUP_IMAGE_SRC}
                  alt="iPhone gameplay mockup"
                  className="h-[640px] w-full object-cover"
                  loading="lazy"
                  onError={() => setShowPlaceholder(true)}
                />
              ) : (
                <div className="flex h-[640px] items-center justify-center bg-[linear-gradient(155deg,rgba(185,242,255,0.18),rgba(17,17,24,0.95))] p-6 text-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                      Mockup Pending
                    </p>
                    <p className="mt-3 text-sm text-text-muted">
                      Add <code>game-mockup-phone.png</code> to <code>public/images</code>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}