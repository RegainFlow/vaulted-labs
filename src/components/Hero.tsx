import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-bg">

      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000_100%)]">
        {/* Animated Grid overlay */}
        <div
          className="absolute inset-0 opacity-20 animate-pulse"
          style={{
            backgroundImage: "linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: "perspective(500px) rotateX(60deg) translateY(0) translateZ(-100px)"
          }}
        />

        {/* Floating Particles (CSS) */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-neon-cyan/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-[-10vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative inline-block"
        >
          <h1 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 tracking-tighter filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            UNBOX THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-500 to-accent animate-gradient bg-300% text-glow">EXTRAORDINARY</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-xl md:text-2xl text-text-muted max-w-2xl mx-auto font-medium"
        >
          The world's first <span className="text-white font-bold">Gamified Commerce</span> platform.
          Crack the vault, reveal your loot, and decide your destiny.
        </motion.p>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full max-w-sm px-4"
      >
        <button
          onClick={() => document.getElementById("protocol")?.scrollIntoView({ behavior: "smooth" })}
          className="w-full group relative overflow-hidden bg-accent border-2 border-accent hover:bg-accent/90 text-white font-black py-6 px-8 skew-x-[-10deg] hover:shadow-[0_0_50px_rgba(255,45,149,0.6)] hover:scale-105 transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <div className="skew-x-[10deg] flex items-center justify-center gap-3 text-2xl tracking-widest relative z-10">
            <span className="drop-shadow-md">PLAY NOW</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="animate-pulse"><path d="M8 5v14l11-7z" /></svg>
          </div>

          {/* Gloss effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
        </button>

        <div className="text-center mt-4 text-xs font-mono text-accent/80 tracking-[0.2em] animate-pulse">
          PRESS PLAY NOW
        </div>
      </motion.div>
    </section>
  );
}
