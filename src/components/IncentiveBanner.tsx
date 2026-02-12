import { motion } from "motion/react";
import { INCENTIVE_TIERS, getActiveTierInfo } from "../data/vaults";

interface IncentiveBannerProps {
  count: number;
  loading: boolean;
}

export function IncentiveBanner({ count, loading }: IncentiveBannerProps) {
  const { activeTier, completedTiers } = getActiveTierInfo(count);
  const allClaimed = completedTiers === INCENTIVE_TIERS.length;

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden bg-surface-elevated border border-white/5 p-5 sm:p-8 md:p-10"
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            {allClaimed ? (
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-text-muted uppercase tracking-tight">
                All Founding Rewards Claimed
              </h2>
            ) : (
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
                Join Early. Earn{" "}
                <span style={{ color: activeTier?.color }} className="text-glow-magenta">
                  More.
                </span>
              </h2>
            )}
          </div>

          {/* Tier Card Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {INCENTIVE_TIERS.map((tier, i) => {
              const isFilled = i < completedTiers;
              const isActive = !isFilled && tier === activeTier;
              const isLocked = !isFilled && !isActive;

              const tierFillCount = isFilled
                ? tier.spots
                : isActive
                  ? Math.max(0, count - tier.startAt + 1)
                  : 0;
              const tierProgress = (tierFillCount / tier.spots) * 100;
              const remaining = tier.spots - tierFillCount;

              return (
                <motion.div
                  key={tier.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative rounded-xl p-4 sm:p-5 border transition-all ${
                    isActive
                      ? "bg-surface border-white/20"
                      : isFilled
                        ? "bg-surface/50 border-white/5 opacity-50"
                        : "bg-surface/30 border-white/5 opacity-40"
                  }`}
                  style={
                    isActive
                      ? { boxShadow: `0 0 25px ${tier.color}15, 0 0 50px ${tier.color}08` }
                      : undefined
                  }
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <span
                      className="absolute top-3 right-3 w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: tier.color, boxShadow: `0 0 8px ${tier.color}` }}
                    />
                  )}

                  {/* Lock icon for future tiers */}
                  {isLocked && (
                    <span className="absolute top-3 right-3 text-text-dim text-xs">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                    </span>
                  )}

                  {/* Credit amount */}
                  <div
                    className={`text-2xl sm:text-3xl font-black mb-1 ${isFilled ? "line-through" : ""}`}
                    style={{ color: isFilled ? "#6a6a80" : tier.color }}
                  >
                    ${tier.creditAmount}
                  </div>

                  {/* Tier label */}
                  <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${isFilled ? "text-text-dim" : "text-text-muted"}`}>
                    {tier.label}
                  </div>

                  {/* Spots info */}
                  <div className={`text-[10px] font-mono mb-2 ${isFilled ? "text-text-dim" : "text-text-muted"}`}>
                    {loading ? (
                      "..."
                    ) : isFilled ? (
                      "FILLED"
                    ) : isActive ? (
                      `${remaining} of ${tier.spots} left`
                    ) : (
                      `${tier.spots} spots`
                    )}
                  </div>

                  {/* Mini progress bar */}
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${tierProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: tier.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Withdrawal disclaimer */}
          <p className="text-center text-[10px] text-text-dim mt-5 sm:mt-6 font-mono uppercase tracking-wider">
            Credits are applied to vault purchases and cannot be withdrawn as cash.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
