import { motion, useAnimation } from "motion/react";
import { useState } from "react";

interface HeroProps {
  onUnlock: () => void;
  isUnlocked: boolean;
}

export function Hero({ onUnlock, isUnlocked }: HeroProps) {
  const [isInserting, setIsInserting] = useState(false);
  const controls = useAnimation();

  const handlePlay = async () => {
    if (isUnlocked || isInserting) return;
    setIsInserting(true);

    try {
        // Animation sequence: Float up, tilt, then slide UP into slot
        await controls.start({
          y: [0, -20, -100],
          rotateX: [0, -20, 0],
          scale: [1, 1.05, 0.8],
          opacity: [1, 1, 0],
          transition: { duration: 0.8, ease: "backIn" }
        });
        onUnlock();
    } catch (e) {
        console.error("Animation failed", e);
        onUnlock(); // Fallback unlock
    } finally {
        setIsInserting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden bg-bg">

      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000_100%)]">
        <div
          className="absolute inset-0 opacity-20 animate-pulse"
          style={{
            backgroundImage: "linear-gradient(rgba(255, 45, 149, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 45, 149, 0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: "perspective(500px) rotateX(60deg) translateY(0) translateZ(-100px)"
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center gap-16">
        {/* Text Group */}
        <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative inline-block"
            >
              {/* Note: Removing filter: drop-shadow here and using text-glow-white/magenta instead for Firefox compatibility */}
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">     
                <span className="text-white text-glow-white">UNBOX THE</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-500 to-accent animate-gradient bg-300% text-glow-magenta">EXTRAORDINARY</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto font-medium"
            >
              The world's first <span className="text-white font-bold">Gamified Commerce</span> platform.     
              Crack the vault, reveal your loot, and decide your destiny.
            </motion.p>
        </div>

        {/* Badge/Key Interface */}
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col items-center gap-12 relative"
        >
            {!isUnlocked ? (
                <div className="flex flex-col items-center gap-10">
                    {/* The Slot */}
                    <div className="w-40 h-8 bg-black border-2 border-white/10 rounded-lg shadow-[inset_0_0_20px_rgba(0,0,0,1)] relative flex items-center justify-center overflow-hidden">
                        <motion.div 
                            animate={{ x: [-100, 100] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-20 h-full bg-accent/20 blur-md" 
                        />
                        <div className="absolute -top-6 text-[8px] font-mono text-accent tracking-[0.4em] uppercase whitespace-nowrap">
                        Reader Active: Insert Card
                        </div>
                    </div>

                    {/* The Badge/Key */}
                    <div className="relative group">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-accent blur-2xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
                        
                        <motion.div
                            animate={controls}
                            whileHover={{ scale: 1.05, y: -10 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handlePlay}
                            className="w-28 h-40 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-xl border border-white/20 flex flex-col items-center p-4 shadow-2xl cursor-pointer relative overflow-hidden z-30"
                        >
                            <div className="w-full h-8 bg-white/5 rounded-md mb-4 flex items-center px-2 gap-2 border border-white/5">
                                <div className="w-4 h-4 rounded-full bg-accent/30 border border-accent/50" />
                                <div className="flex-1 space-y-1">
                                    <div className="w-full h-1 bg-white/10 rounded-full" />
                                    <div className="w-1/2 h-1 bg-white/5 rounded-full" />
                                </div>
                            </div>
                            
                            <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center border border-white/10 mb-4">
                                <span className="text-accent text-xl font-black italic">V</span>
                            </div>

                            <div className="text-[7px] font-mono text-white/40 uppercase tracking-[0.2em] text-center leading-relaxed">
                                AUTHORIZED ACCESS<br/>VAULT-SECURE
                            </div>
                            
                            <div className="absolute right-0 top-0 w-1.5 h-full bg-black/40" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </motion.div>
                    </div>
                    
                    <div className="text-center text-xs font-mono text-white/50 tracking-[0.3em] uppercase animate-bounce cursor-pointer" onClick={handlePlay}>
                        Click Badge to Start
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="px-10 py-4 bg-accent/10 border-2 border-accent rounded-xl text-accent font-black text-xl tracking-[0.2em] uppercase shadow-[0_0_50px_rgba(255,45,149,0.5)]">
                        System Online
                    </div>
                    <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] animate-pulse">
                        Accessing Containment Units
                    </div>
                </motion.div>
            )}
        </motion.div>
      </div>
    </section>
  );
}