import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import Typed from "typed.js";
import { PlayNowButton } from "./PlayNowButton";

export function Hero() {
  const typedEl = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const typed = new Typed(typedEl.current!, {
      strings: [
        "Real collectibles. Real value. Pick a vault and win.",
      ],
      typeSpeed: 40,
      showCursor: true,
      cursorChar: "|",
      startDelay: 800,
    });

    return () => typed.destroy();
  }, []);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-bg">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000_100%)]">
        {/* Animated Grid overlay */}
        <div
          className="absolute inset-0 opacity-15 animate-pulse"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform:
              "perspective(500px) rotateX(60deg) translateY(0) translateZ(-100px)"
          }}
        />

        {/* Floating Particles (CSS) */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent/10 rounded-full blur-[100px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-neon-cyan/5 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* === VAULT DOOR VISUAL === */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
        <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] mt-[-5vh]">
          {/* Outer ring with tick marks */}
          <div className="absolute inset-0 rounded-full animate-vault-spin-slow">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="96"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.5"
                strokeDasharray="2 6"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.3"
                strokeDasharray="1 12"
              />
            </svg>
          </div>

          {/* Middle ring */}
          <div
            className="absolute inset-8 rounded-full border border-white/5"
            style={{
              background:
                "radial-gradient(circle, transparent 55%, rgba(255,45,149,0.04) 80%, rgba(0,240,255,0.03) 100%)"
            }}
          />

          {/* Inner combination dial */}
          <motion.div
            className="absolute inset-16 rounded-full border-[3px] border-white/[0.07]"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-0 w-px origin-bottom"
                style={{
                  height: i % 6 === 0 ? "12px" : "6px",
                  backgroundColor:
                    i % 6 === 0
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(255,255,255,0.06)",
                  transform: `translateX(-50%) rotate(${i * 15}deg)`,
                  transformOrigin: `center ${250 / 2}px`
                }}
              />
            ))}
          </motion.div>

          {/* Center handle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-surface-elevated/50 border-2 border-white/[0.08] relative"
              animate={{ rotate: [0, 90, -45, 180, 270, 360] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-full h-px bg-white/10 absolute top-1/2" />
              <div className="h-full w-px bg-white/10 absolute left-1/2" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-accent/40 shadow-[0_0_15px_rgba(255,45,149,0.4)]" />
              </div>
            </motion.div>
          </div>

          {/* Neon glow seeping through cracks */}
          <div
            className="absolute inset-0 rounded-full animate-vault-glow-pulse pointer-events-none"
            style={{
              boxShadow:
                "inset 0 0 80px rgba(255,45,149,0.08), inset 0 0 120px rgba(0,240,255,0.05)"
            }}
          />
        </div>
      </div>

      {/* Floating mystery items */}
      <motion.div
        className="absolute top-[18%] left-[8%] md:left-[15%] z-[6] pointer-events-none"
        animate={{ y: [-8, 8], rotate: [0, 8, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-10 h-10 md:w-12 md:h-12 border border-accent/20 rounded-lg bg-surface/30 backdrop-blur-sm flex items-center justify-center shadow-[0_0_12px_rgba(255,45,149,0.15)] text-accent/40 text-lg font-bold">
          ?
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-[22%] right-[8%] md:right-[14%] z-[6] pointer-events-none"
        animate={{ y: [8, -8], rotate: [0, -6, 6, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <div className="w-9 h-9 md:w-10 md:h-10 border border-neon-cyan/20 rounded bg-surface/30 backdrop-blur-sm flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.15)]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-neon-cyan/40"
          >
            <path d="M6 3h12l4 6-10 13L2 9z" />
          </svg>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-[30%] right-[10%] md:right-[18%] z-[6] pointer-events-none"
        animate={{ y: [-6, 10], x: [0, 4, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <div className="w-8 h-8 border border-vault-gold/20 rounded bg-surface/30 backdrop-blur-sm flex items-center justify-center shadow-[0_0_10px_rgba(255,215,0,0.1)]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-vault-gold/40"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-[-10vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative inline-block"
        >
          <h1 className="relative text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter">
            {/* Neon stroke layer behind */}
            <span
              aria-hidden="true"
              className="absolute inset-0 text-transparent"
              style={{
                WebkitTextStroke: "1.5px #ff2d95",
                textShadow:
                  "0 0 10px rgba(255,45,149,0.6), 0 0 30px rgba(255,45,149,0.3), 0 0 60px rgba(255,45,149,0.15)"
              }}
            >
              EXPLORE VAULTS
              <br />
              <span
                className="text-3xl sm:text-4xl md:text-7xl"
                style={{ WebkitTextStroke: "0px transparent" }}
              >
                {"\u00A0"}
              </span>
            </span>
            {/* Gradient fill text on top */}
            <span className="relative text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              EXPLORE VAULTS
            </span>
            <br />
            <span className="text-3xl sm:text-4xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-500 to-accent animate-gradient bg-300% text-glow-magenta">
              WIN REAL PRIZES
            </span>
          </h1>
        </motion.div>

        <div className="mt-6 sm:mt-8 text-base sm:text-xl md:text-2xl text-text-muted max-w-2xl mx-auto font-medium h-[2em]">
          <span ref={typedEl} />
        </div>

        {/* Play Now CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-10"
        >
          <PlayNowButton location="hero" />
        </motion.div>
      </div>
    </section>
  );
}
