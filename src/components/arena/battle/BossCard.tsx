import { motion } from "motion/react";
import type { Battle } from "../../../types/gamification";
import type { BattlePresentationProfile } from "../../../data/battle-presentation";
import { BossIcon } from "../../../assets/boss-icons";

interface BossDisplayProps {
  battle: Battle;
  profile: BattlePresentationProfile;
  statusLabel: string;
}

export function BossDisplay({
  battle,
  profile,
  statusLabel,
}: BossDisplayProps) {
  return (
    <motion.div
      animate={{ scale: 1.02, y: -3 }}
      transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
      className="relative mx-auto w-full max-w-[200px] sm:max-w-[260px]"
    >
      <div
        className="module-card relative overflow-hidden px-4 py-4"
        style={{
          borderColor: "rgba(255,43,214,0.22)",
          boxShadow:
            "0 22px 48px rgba(0,0,0,0.34), 0 0 26px rgba(255,43,214,0.14), 0 0 48px rgba(0,234,255,0.06)",
        }}
      >
        <div className="absolute inset-0 opacity-80" style={{ background: profile.ambientGradient }} />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,43,214,0.78)_50%,transparent_100%)]" />
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[9px] font-black uppercase tracking-[0.26em] text-accent/75">
                {profile.threatLabel}
              </div>
              <div className="mt-1 text-base font-black uppercase tracking-[0.06em] text-white sm:text-lg">
                {battle.name}
              </div>
            </div>
            <span className="rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.22em] text-accent">
              {statusLabel}
            </span>
          </div>

          <div className="relative mx-auto mt-4 flex h-[152px] items-center justify-center rounded-[24px] border border-white/10 bg-black/28 sm:h-[200px] sm:rounded-[28px]">
            <div
              className="absolute inset-4 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(255,43,214,0.22) 0%, rgba(0,234,255,0.08) 42%, transparent 72%)",
              }}
            />
            <div className="absolute inset-[18%] rounded-full border border-white/8" />
            <div className="absolute inset-[28%] rounded-full border border-accent/22" />
            <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-black/42 shadow-[0_0_36px_rgba(255,43,214,0.18)] sm:h-28 sm:w-28">
              <BossIcon bossId={battle.id} size={72} color={profile.accentPrimary} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
