import { motion } from "motion/react";
export function ForgeCrucible({
  phase,
  selectedCount,
  reducedMotion,
}: {
  phase: "dissolve" | "crucible" | "materialize" | null;
  selectedCount: number;
  reducedMotion: boolean;
}) {
  const status =
    phase === "dissolve"
      ? "Dissolving"
      : phase === "crucible"
        ? "Compressing"
        : phase === "materialize"
          ? "Materializing"
          : selectedCount === 3
            ? "Ready"
            : "Awaiting inputs";

  return (
    <div className="module-card relative flex h-[156px] w-full flex-col items-center justify-center overflow-hidden px-4 py-3.5 sm:h-[192px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(255,43,214,0.2)_0%,transparent_42%),radial-gradient(circle_at_50%_68%,rgba(0,234,255,0.14)_0%,transparent_46%)]" />
      <div className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(0,234,255,0.28)_30%,rgba(255,43,214,0.3)_70%,transparent_100%)]" />
      <div className="absolute inset-x-10 top-[30%] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)]" />
      <motion.div
        className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-accent/25 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.16)_0%,rgba(255,43,214,0.12)_22%,rgba(0,0,0,0.32)_62%,rgba(0,0,0,0.64)_100%)] shadow-[0_0_32px_rgba(255,43,214,0.18),0_0_48px_rgba(0,234,255,0.12)] sm:h-32 sm:w-32"
        animate={
          reducedMotion
            ? undefined
            : phase
              ? { scale: [1, 1.05, 1], rotate: [0, 6, -6, 0] }
              : { scale: [1, 1.02, 1] }
        }
        transition={{
          duration: phase ? 1.3 : 2.6,
          repeat: reducedMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute inset-3 rounded-full border border-white/10" />
        <div className="absolute inset-6 rounded-full border border-accent/20" />
        <div className="absolute inset-[32%] rounded-full bg-accent/18 blur-xl" />
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="relative z-10 text-accent sm:h-10 sm:w-10">
          <path d="M12 3l3 4.5L21 9l-4.5 3L18 18l-6-3-6 3 1.5-6L3 9l6-1.5L12 3z" fill="currentColor" />
        </svg>
      </motion.div>

      <div className="relative z-10 mt-2.5 text-center">
        <div className="text-[10px] font-black uppercase tracking-[0.28em] text-white/42">
          Crucible Status
        </div>
        <div className="mt-1.5 text-sm font-black uppercase tracking-[0.14em] text-white sm:text-base">
          {status}
        </div>
        <div className="mt-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
          {selectedCount}/3 inputs linked
        </div>
      </div>
    </div>
  );
}
