import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VaultIcon } from "./VaultIcons";

export function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55 }}
      className="mx-auto w-full max-w-[280px] sm:max-w-[330px]"
    >
      <div className="relative rounded-[44px] border border-white/20 bg-black p-3 shadow-[0_26px_90px_rgba(0,0,0,0.6)]">
        <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-black z-20" />
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-bg relative h-[640px] flex flex-col">
          <MiniAppPreview />
        </div>
      </div>
    </motion.div>
  );
}

function MiniAppPreview() {
  const [screen, setScreen] = useState<
    "home" | "vault" | "grid" | "reveal" | "result"
  >("home");

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        setScreen("home");
        await wait(2500);
        setScreen("vault");
        await wait(1500);
        setScreen("grid");
        await wait(1500);
        setScreen("reveal");
        await wait(2000);
        setScreen("result");
        await wait(3500);
      }
    };
    sequence();
  }, []);

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white font-sans overflow-hidden relative">
      {/* Status Bar Mock */}
      <div className="h-12 flex items-center justify-between px-6 pt-2 z-20">
        <span className="text-[10px] font-bold text-white/50">9:41</span>
        <div className="flex gap-1.5">
          <div className="w-4 h-2.5 bg-white/20 rounded-[1px]" />
          <div className="w-4 h-2.5 bg-white/20 rounded-[1px]" />
          <div className="w-6 h-2.5 bg-white/50 rounded-[1px]" />
        </div>
      </div>

      {/* Nav */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-white/5 z-20 bg-bg/95 backdrop-blur-md">
        <div className="font-black italic text-sm tracking-tighter">
          VAULTED
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-surface-elevated rounded-full border border-white/10 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[8px] font-mono text-accent">$1,240</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {screen === "home" && <HomeScreen key="home" />}
          {screen === "vault" && <VaultScreen key="vault" />}
          {screen === "grid" && <GridScreen key="grid" />}
          {screen === "reveal" && <RevealScreen key="reveal" />}
          {screen === "result" && <ResultScreen key="result" />}
        </AnimatePresence>
      </div>

      {/* Bottom Nav Mock */}
      <div className="h-16 border-t border-white/5 bg-surface-elevated/50 backdrop-blur-md flex items-center justify-around px-6 z-20">
        <div className="w-6 h-6 bg-white/20 rounded-md" />
        <div className="w-6 h-6 bg-white/5 rounded-md" />
        <div className="w-6 h-6 bg-white/5 rounded-md" />
        <div className="w-6 h-6 bg-white/5 rounded-md" />
      </div>
    </div>
  );
}

function HomeScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-4 space-y-4 h-full overflow-y-auto pb-20"
    >
      <div className="h-32 w-full shrink-0 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-900/20 border border-accent/30 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,45,149,0.2),transparent)]" />
        <div className="text-center z-10">
          <div className="text-[10px] text-accent font-bold uppercase tracking-widest mb-1">
            New Arrival
          </div>
          <div className="text-2xl font-black italic tracking-tighter">
            PRISMA CASE
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { name: "Bronze", color: "#cd7f32", price: "$24" },
          { name: "Gold", color: "#ffd700", price: "$54" },
          { name: "Platinum", color: "#79b5db", price: "$68" },
          { name: "Diamond", color: "#b9f2ff", price: "$86" }
        ].map((tier) => (
          <div
            key={tier.name}
            className="h-32 rounded-xl bg-surface-elevated border border-white/5 p-3 flex flex-col justify-end relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
            <div className="scale-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <VaultIcon name={tier.name} color={tier.color} />
            </div>
            <div className="relative z-10">
              <div className="text-[10px] font-bold text-white uppercase">
                {tier.name}
              </div>
              <div className="text-[8px] text-text-dim font-mono">
                {tier.price}
              </div>
            </div>
            {tier.name === "Diamond" && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 0.5, delay: 1.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full z-50 pointer-events-none"
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function VaultScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col items-center justify-center p-6 bg-[#0a0a0f]"
    >
      <div className="w-40 h-40 rounded-full border-4 border-[#b9f2ff] shadow-[0_0_40px_rgba(185,242,255,0.2)] flex items-center justify-center relative mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, ease: "linear", repeat: Infinity }}
          className="absolute inset-2 border-2 border-dashed border-white/20 rounded-full"
        />
        <div className="scale-75">
          <VaultIcon name="Diamond" color="#b9f2ff" />
        </div>
      </div>
      <h3 className="text-2xl font-black uppercase text-white mb-2">Diamond</h3>
      <p className="text-[10px] text-text-muted text-center mb-8 uppercase tracking-widest">
        Reinforced probability for <br /> Tier-1 legendary loot.
      </p>
      <div className="w-full bg-[#b9f2ff] text-black font-bold text-xs uppercase tracking-widest py-4 rounded-xl text-center shadow-lg relative overflow-hidden">
        Unlock - $86
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full z-50 pointer-events-none"
        />
      </div>
    </motion.div>
  );
}

function GridScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="h-full p-6 flex flex-col items-center justify-center"
    >
      <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-white/30">
        Select Containment Unit
      </div>
      <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`aspect-square rounded-lg border flex items-center justify-center relative overflow-hidden ${i === 4 ? "bg-[#b9f2ff]/20 border-[#b9f2ff] shadow-[0_0_15px_rgba(185,242,255,0.3)]" : "bg-surface-elevated border-white/10"}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={i === 4 ? "text-[#b9f2ff]" : "text-white/10"}
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            {i === 4 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full z-50 pointer-events-none"
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function RevealScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col items-center justify-center p-6"
    >
      <motion.div
        animate={{
          rotate: [0, -5, 5, -5, 5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="mb-8 filter drop-shadow-[0_0_30px_rgba(185,242,255,0.4)]"
      >
        <div className="scale-125">
          <VaultIcon name="Diamond" color="#b9f2ff" />
        </div>
      </motion.div>
      <div className="text-[10px] font-mono text-[#b9f2ff] tracking-[0.4em] animate-pulse">
        OPENING...
      </div>
    </motion.div>
  );
}

function ResultScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col items-center justify-center p-6 text-center relative"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(185,242,255,0.15),transparent)] pointer-events-none" />
      <div className="w-32 h-32 rounded-2xl bg-[#0a0a0f] border-2 border-[#b9f2ff] shadow-[0_0_30px_rgba(185,242,255,0.2)] flex items-center justify-center mb-6 relative z-10">
        <div className="scale-75">
          <VaultIcon name="Diamond" color="#b9f2ff" />
        </div>
        <div className="absolute -bottom-2 px-3 py-1 bg-neon-green/20 rounded-full border border-neon-green/50 text-[6px] font-black uppercase tracking-widest text-neon-green">
          Mint Condition
        </div>
      </div>

      <h3 className="text-2xl font-black italic text-white mb-1 relative z-10 tracking-tighter">
        LEGENDARY PULL
      </h3>
      <p className="text-[#b9f2ff] font-bold text-sm mb-8 relative z-10">
        $284.00
      </p>

      <div className="flex flex-col gap-2 w-full max-w-[200px] relative z-10">
        <div className="flex gap-2">
          <div className="flex-1 py-2.5 rounded-lg bg-surface-elevated border border-white/10 text-[8px] font-bold uppercase text-white/50">
            Ship
          </div>
          <div className="flex-1 py-2.5 rounded-lg bg-surface-elevated border border-white/10 text-[8px] font-bold uppercase text-white/50">
            Hold
          </div>
        </div>
        <div className="w-full py-2.5 rounded-lg bg-[#b9f2ff] text-[8px] font-bold uppercase text-black shadow-lg relative overflow-hidden">
          Cash Out
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 0.5, delay: 2.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full z-50 pointer-events-none"
          />
        </div>
      </div>
    </motion.div>
  );
}
