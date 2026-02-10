import { motion } from "motion/react";

interface HeroProps {
  onAccessKeyInsert: () => void;
}

export function Hero({ onAccessKeyInsert }: HeroProps) {
  const handleKeyInsert = () => {
    document.getElementById("protocol")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      onAccessKeyInsert();
    }, 800);
  };

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-bg">

      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000_100%)]">
        {/* Animated Grid overlay */}
        <div
          className="absolute inset-0 opacity-15 animate-pulse"
          style={{
            backgroundImage: "linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: "perspective(500px) rotateX(60deg) translateY(0) translateZ(-100px)"
          }}
        />

        {/* Floating Particles (CSS) */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-neon-cyan/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* === VAULT DOOR VISUAL === */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
        <div className="relative w-[350px] h-[350px] md:w-[500px] md:h-[500px] mt-[-5vh]">

          {/* Outer ring with tick marks */}
          <div className="absolute inset-0 rounded-full animate-vault-spin-slow">
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2 6" />       
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" strokeDasharray="1 12" />      
            </svg>
          </div>

          {/* Middle ring ΓÇö metallic radial gradient */}
          <div
            className="absolute inset-8 rounded-full border border-white/5"
            style={{ background: "radial-gradient(circle, transparent 55%, rgba(255,45,149,0.04) 80%, rgba(0,240,255,0.03) 100%)" }}        
          />

          {/* Inner combination dial */}
          <motion.div
            className="absolute inset-16 rounded-full border-[3px] border-white/[0.07]"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          >
            {/* Tick markers around dial */}
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-0 w-px origin-bottom"
                style={{
                  height: i % 6 === 0 ? "12px" : "6px",
                  backgroundColor: i % 6 === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
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
              boxShadow: "inset 0 0 80px rgba(255,45,149,0.08), inset 0 0 120px rgba(0,240,255,0.05)"
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
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <div className="w-9 h-9 md:w-10 md:h-10 border border-neon-cyan/20 rounded bg-surface/30 backdrop-blur-sm flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.15)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neon-cyan/40">
            <path d="M6 3h12l4 6-10 13L2 9z" />
          </svg>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-[30%] right-[10%] md:right-[18%] z-[6] pointer-events-none"
        animate={{ y: [-6, 10], x: [0, 4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <div className="w-8 h-8 border border-vault-gold/20 rounded bg-surface/30 backdrop-blur-sm flex items-center justify-center shadow-[0_0_10px_rgba(255,215,0,0.1)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-vault-gold/40">
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
          <h1 className="text-4xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 tracking-tighter filter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
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

      {/* Access Key Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        // Adjusted top margin to increase spacing from the subheading text
        className="absolute bottom-16 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-10 mt-12"
        id="hero-access"
      >
        <motion.button
          onClick={handleKeyInsert}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group relative w-full overflow-hidden cursor-pointer"
        >
          {/* Key Card Shape */}
          <div className="relative bg-surface-elevated border-2 border-accent/50 rounded-2xl py-5 px-8 shadow-[0_0_25px_rgba(255,45,149,0.15)] group-hover:shadow-[0_0_40px_rgba(255,45,149,0.3)] group-hover:border-accent/80 transition-all duration-300">

            {/* Notch at top */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-16 h-1.5 bg-accent/30 rounded-b-full" />

            {/* Chip pattern (like a card chip) */}
            <div className="absolute top-3 left-5 w-7 h-5 rounded-sm border border-vault-gold/30 bg-vault-gold/5">
              <div className="w-full h-px bg-vault-gold/20 absolute top-1/2" />
              <div className="h-full w-px bg-vault-gold/20 absolute left-1/3" />
              <div className="h-full w-px bg-vault-gold/20 absolute left-2/3" />
            </div>

            {/* Main text */}
            <div className="flex items-center justify-center gap-3 text-lg md:text-xl tracking-[0.12em] font-black text-accent uppercase">  
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
              <span className="drop-shadow-sm">INSERT ACCESS KEY</span>
            </div>

            <div className="text-center mt-1.5 text-[10px] font-mono text-text-dim tracking-[0.25em]">
              SECURITY CLEARANCE REQUIRED
            </div>

            {/* Gloss sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl" />
          </div>
        </motion.button>

        <div className="text-center mt-3 text-xs font-mono text-accent/50 tracking-[0.2em] animate-pulse">
          TAP TO AUTHORIZE
        </div>
      </motion.div>
    </section>
  );
}
