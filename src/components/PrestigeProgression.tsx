import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VAULTS, RARITY_CONFIG, getPrestigeOdds } from "../data/vaults";
import { CYBER_TRANSITIONS } from "../lib/motion-presets";
import { PrestigeShieldIcon } from "../assets/prestige-icons";

const BRONZE = VAULTS[0];

const PRESTIGE_TABS = [
  { label: "Base", short: "Base", level: 0, color: "#f0f0f5" },
  { label: "Prestige I", short: "I", level: 1, color: "#ff8c00" },
  { label: "Prestige II", short: "II", level: 2, color: "#9945ff" },
  { label: "Prestige III", short: "III", level: 3, color: "#ff2d95" },
] as const;

const MILESTONES = [
  {
    level: 1 as const,
    title: "Gold Ascension",
    shift: "+4%",
    description: "First prestige at Level 10",
    color: "#ff8c00",
  },
  {
    level: 2 as const,
    title: "Violet Ascension",
    shift: "+8%",
    description: "Second prestige at Level 10",
    color: "#9945ff",
  },
  {
    level: 3 as const,
    title: "Prismatic Ascension",
    shift: "+12%",
    description: "Final prestige at Level 10",
    color: "#ff2d95",
  },
] as const;

const RARITY_ORDER = ["common", "uncommon", "rare", "legendary"] as const;

export function PrestigeProgression() {
  const [selected, setSelected] = useState(0);

  const baseOdds = BRONZE.rarities;
  const currentOdds = getPrestigeOdds(baseOdds, selected);
  const activeTab = PRESTIGE_TABS[selected];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 bg-bg relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-block px-6 sm:px-10 md:px-16 py-3 md:py-4.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm sm:text-base md:text-[20px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-6">
            Prestige System
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight mb-4">
            The More You Play,
            <br />
            <span className="text-accent">the Better Your Odds</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Reach Level 10 and prestige to permanently shift your vault odds.
            Each prestige moves 4% from Common toward rarer tiers across{" "}
            <span className="text-white font-bold">every vault you open</span>.
          </p>
        </motion.div>

        {/* Tab Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center gap-2 sm:gap-3 mb-10"
        >
          {PRESTIGE_TABS.map((tab) => {
            const isActive = selected === tab.level;
            return (
              <button
                key={tab.level}
                onClick={() => setSelected(tab.level)}
                className="relative px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 border cursor-pointer"
                style={{
                  borderColor: isActive ? `${tab.color}80` : "rgba(255,255,255,0.1)",
                  backgroundColor: isActive ? `${tab.color}15` : "transparent",
                  color: isActive ? tab.color : "#9a9ab0",
                  boxShadow: isActive ? `0 0 20px ${tab.color}25` : "none",
                }}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.level === 0 ? "Base" : `P${tab.level}`}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Odds Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-surface rounded-2xl border border-white/5 p-5 sm:p-8 mb-10"
        >
          {/* Vault badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: BRONZE.color }}
            />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-text-dim">
              Bronze Vault Odds
            </span>
          </div>

          {/* Rarity bars */}
          <div className="space-y-4">
            {RARITY_ORDER.map((rarity) => {
              const chance = currentOdds[rarity];
              const base = baseOdds[rarity];
              const delta = +(chance - base).toFixed(1);
              const rarityColor =
                RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG].color;

              return (
                <div key={rarity} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm uppercase font-bold tracking-wider">
                    <span style={{ color: rarityColor }}>{rarity}</span>
                    <span className="text-white font-mono">
                      {chance}%
                      <AnimatePresence mode="wait">
                        {selected > 0 && delta !== 0 && (
                          <motion.span
                            key={`${rarity}-${selected}`}
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 4 }}
                            transition={{ duration: 0.2 }}
                            className="ml-1.5 text-[10px] sm:text-xs font-black"
                            style={{ color: activeTab.color }}
                          >
                            {delta > 0 ? "+" : ""}
                            {delta}%
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </div>
                  <div className="h-4 w-full bg-black/60 rounded-sm overflow-hidden border border-white/5 relative">
                    {/* Tick overlay */}
                    <div
                      className="absolute inset-0 z-20 pointer-events-none opacity-20"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(90deg, transparent, transparent 19%, #000 19%, #000 20%)",
                      }}
                    />
                    <motion.div
                      animate={{ width: `${chance}%` }}
                      transition={CYBER_TRANSITIONS.default}
                      className="h-full relative"
                      style={{
                        backgroundColor: rarityColor,
                        boxShadow: `0 0 10px ${rarityColor}40`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Highlight stat for selected prestige */}
          <AnimatePresence mode="wait">
            {selected > 0 && (
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mt-6 pt-5 border-t border-white/5 text-center"
              >
                <p className="text-text-muted text-xs sm:text-sm">
                  Legendary odds:{" "}
                  <span className="text-white font-black">
                    {baseOdds.legendary}%
                  </span>{" "}
                  <span className="text-text-dim mx-1">&rarr;</span>{" "}
                  <span
                    className="font-black"
                    style={{ color: activeTab.color }}
                  >
                    {currentOdds.legendary}%
                  </span>
                  <span className="text-text-dim ml-2 text-[10px] sm:text-xs">
                    (+
                    {Math.round(
                      ((currentOdds.legendary - baseOdds.legendary) /
                        baseOdds.legendary) *
                        100
                    )}
                    % improvement)
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Milestone Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {MILESTONES.map((milestone, i) => (
            <motion.div
              key={milestone.level}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...CYBER_TRANSITIONS.default, delay: i * 0.1 }}
              className="relative p-5 sm:p-6 rounded-2xl bg-surface border border-white/5 hover:border-white/10 transition-colors text-center group"
            >
              <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform">
                <PrestigeShieldIcon level={milestone.level} size={40} />
              </div>
              <h3
                className="text-sm sm:text-base font-black uppercase tracking-wide mb-1"
                style={{ color: milestone.color }}
              >
                {milestone.title}
              </h3>
              <p className="text-text-dim text-[10px] sm:text-xs font-mono uppercase tracking-widest mb-2">
                {milestone.description}
              </p>
              <div
                className="text-lg sm:text-xl font-black font-mono"
                style={{ color: milestone.color }}
              >
                {milestone.shift}
                <span className="text-text-dim text-xs ml-1 font-normal tracking-normal">
                  rarity shift
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fine print */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-text-dim text-[10px] sm:text-xs tracking-wide"
        >
          Prestige resets your level and defeated bosses. Maximum 3 prestige
          levels. Odds shift applies to all vault tiers.
        </motion.p>
      </div>
    </section>
  );
}
