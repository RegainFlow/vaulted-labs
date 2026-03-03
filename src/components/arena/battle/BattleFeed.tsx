import { AnimatePresence, motion } from "motion/react";
import type { BattleFeedEntry } from "../../../lib/battle-presentation";

const FEED_TONE_CLASS: Record<string, string> = {
  cyan: "text-[#7ff9ff]",
  magenta: "text-[#ff7ae4]",
  gold: "text-vault-gold",
  green: "text-neon-green",
  neutral: "text-white/72",
};

interface CombatFeedProps {
  entries: BattleFeedEntry[];
}

export function CombatFeed({ entries }: CombatFeedProps) {
  const visibleEntries = entries.slice(-3).reverse();

  return (
    <div className="rounded-[20px] border border-white/10 bg-black/18 px-3 py-3 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[9px] font-black uppercase tracking-[0.26em] text-white/40">
          Combat Feed
        </div>
        <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/28">
          Last 3
        </div>
      </div>

      <div className="mt-2.5 space-y-1.5">
        <AnimatePresence initial={false}>
          {visibleEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1], delay: index * 0.02 }}
              className="flex items-center gap-2.5 rounded-[14px] border border-white/8 bg-black/18 px-3 py-2"
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  background:
                    entry.tone === "cyan"
                      ? "#00eaff"
                      : entry.tone === "magenta"
                        ? "#ff2bd6"
                        : entry.tone === "gold"
                          ? "#ffd700"
                          : entry.tone === "green"
                            ? "#39ff14"
                            : "rgba(255,255,255,0.52)",
                }}
              />
              <div
                className={`truncate text-[11px] font-black uppercase tracking-[0.12em] ${FEED_TONE_CLASS[entry.tone] ?? FEED_TONE_CLASS.neutral}`}
              >
                {entry.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
