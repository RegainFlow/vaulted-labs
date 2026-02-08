import { motion } from "motion/react";

export function Hero() {
  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px] opacity-40 mix-blend-screen animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[100px] opacity-30 mix-blend-screen" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-4xl">
        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-accent backdrop-blur-sm"
        >
          Limited Early Access
        </motion.span>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
          className="text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl"
        >
          Unbox the <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-accent via-purple-500 to-neon-cyan text-glow-magenta">
            Extraordinary
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-xl text-lg text-text-muted md:text-xl"
        >
          The world's premier mystery vault marketplace. <br />
          Authentic collectibles, verified odds, and instant liquidity.
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={scrollToWaitlist}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-accent px-8 py-4 font-bold text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer glow-magenta"
          >
            <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="relative">Claim Your Spot</span>
          </button>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xs px-4"
      >
        <button
          onClick={() => document.getElementById("protocol")?.scrollIntoView({ behavior: "smooth" })}
          className="w-full group relative overflow-hidden bg-accent/10 border border-accent/50 hover:bg-accent/20 text-accent font-black py-4 px-8 rounded-none skew-x-[-10deg] hover:shadow-[0_0_30px_rgba(255,45,149,0.3)] transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <div className="skew-x-[10deg] flex items-center justify-center gap-2">
            <span className="tracking-[0.2em] animate-pulse">INITIALIZE PROTOCOL</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="translate-y-[1px] group-hover:translate-y-1 transition-transform"><path d="M7 13l5 5 5-5M7 6l5 5 5-5" /></svg>
          </div>

          {/* Tech deco */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent opacity-50" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent opacity-50" />
        </button>
      </motion.div>
    </section>
  );
}
