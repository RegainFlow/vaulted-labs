import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Vault } from "../data/vaults";

type Stage = "paying" | "picking" | "revealing" | "result";

interface VaultOverlayProps {
    tier: Vault;
    onClose: () => void;
    onClaim: (amount: number) => void;
    onStore: () => void;
}

export function VaultOverlay({ tier, onClose, onClaim, onStore }: VaultOverlayProps) {
    const [stage, setStage] = useState<Stage>("paying");

    // Auto-advance payment
    useEffect(() => {
        if (stage === "paying") {
            const timer = setTimeout(() => setStage("picking"), 2000); // Slightly longer for wheel animation
            return () => clearTimeout(timer);
        }
    }, [stage]);

    const pickBox = (_index: number) => {
        setStage("revealing");
        setTimeout(() => setStage("result"), 2500); // Reveal delay
    };

    const scrollToWaitlist = () => {
        onClose();
        document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
    };

    const handleClaim = () => {
        onClaim(tier.price * 10);
        scrollToWaitlist();
    }

    const handleStore = () => {
        onStore();
        scrollToWaitlist();
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 backdrop-blur-xl p-4 overflow-y-auto"
        >
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors cursor-pointer z-50 p-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="w-full max-w-4xl text-center py-12 relative">
                <AnimatePresence mode="wait">

                    {/* STAGE 1: PAYING / UNLOCKING */}
                    {stage === "paying" && (
                        <motion.div
                            key="paying"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            className="flex flex-col items-center gap-8 py-20"
                        >
                            <div className="relative w-48 h-48">
                                {/* Vault Wheel Animation */}
                                <motion.div
                                    animate={{ rotate: [0, 90, -45, 180, 360] }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                    className="w-full h-full rounded-full border-8 border-white/10 flex items-center justify-center bg-surface-elevated shadow-2xl relative"
                                >
                                    {/* Wheel Spokes */}
                                    <div className="absolute inset-2 border-4 border-dashed border-white/20 rounded-full" />
                                    <div className="w-4 h-full bg-white/10 absolute rounded-full" />
                                    <div className="h-4 w-full bg-white/10 absolute rounded-full" />
                                    <div className="w-8 h-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] z-10" style={{ backgroundColor: tier.color }} />
                                </motion.div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-white uppercase tracking-widest">
                                    Authenticating
                                </h2>
                                <p className="text-text-muted font-mono text-sm">Verifying on-chain credentials...</p>
                            </div>
                        </motion.div>
                    )}

                    {/* STAGE 2: PICKING (High Tech Boxes) */}
                    {stage === "picking" && (
                        <motion.div
                            key="picking"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="space-y-12"
                        >
                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black text-white uppercase">Initialize Retrieval</h2>
                                <p className="text-text-muted max-w-lg mx-auto">
                                    Scanning sector 7. Select a containment unit to unseal.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto perspective-[1000px]">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.05, translateZ: 20 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => pickBox(i)}
                                        className="aspect-square relative rounded-lg bg-surface-elevated border border-white/10 flex items-center justify-center shadow-lg group overflow-hidden cursor-pointer"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {/* Scanning line effect */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/20 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000" />

                                        {/* Box Icon */}
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white filter drop-shadow-md">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                            <line x1="12" y1="22.08" x2="12" y2="12" />
                                        </svg>

                                        <div className="absolute bottom-1 right-1 text-[8px] font-mono text-white/30">
                                            UNIT-0{i + 1}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STAGE 3: REVEALING */}
                    {stage === "revealing" && (
                        <motion.div
                            key="revealing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, -10, 10, -10, 10, 0],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{ duration: 2, times: [0, 0.2, 0.4, 0.6, 0.8, 1], repeat: Infinity }}
                                className="mb-12 filter drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                            >
                                {/* Box Icon Large */}
                                <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                    <line x1="12" y1="22.08" x2="12" y2="12" />
                                </svg>
                            </motion.div>
                            <div className="text-2xl text-accent font-bold tracking-[0.5em] uppercase animate-pulse">
                                Decompressing
                            </div>
                        </motion.div>
                    )}

                    {/* STAGE 4: RESULT & OPTIONS */}
                    {stage === "result" && (
                        <motion.div
                            key="result"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", damping: 12 }}
                            className="space-y-12 relative"
                        >
                            {/* Confetti Explosion */}
                            <ConfettiParticles />

                            <div className="relative inline-block group z-10">
                                <div className="absolute inset-0 bg-neon-green/40 blur-3xl animate-pulse group-hover:bg-neon-green/60 transition-colors" />
                                <div className="relative flex items-center justify-center bg-surface-elevated rounded-2xl border-4 border-neon-green shadow-[0_0_60px_rgba(57,255,20,0.4)] w-64 h-64 md:w-80 md:h-80">
                                    {/* Gem Icon Large */}
                                    <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white">
                                        <path d="M6 3h12l4 6-10 13L2 9z" />
                                    </svg>
                                    <div className="absolute bottom-4 left-0 w-full text-center">
                                        <span className="inline-block px-3 py-1 bg-neon-green/20 border border-neon-green/50 rounded text-xs font-bold text-neon-green uppercase tracking-wider">
                                            Mint Condition
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 z-10 relative">
                                <h3 className="text-4xl md:text-5xl font-black text-white">
                                    <span className="text-neon-green text-glow-green">Legendary</span> Pull!
                                </h3>
                                <p className="text-xl text-text-muted">Estimated Market Value: <span className="text-white font-bold">${tier.price * 10}.00</span></p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto px-4 z-10 relative">
                                <OptionCard
                                    title="Store to Vault"
                                    desc="Keep it secure in your digital portfolio."
                                    icon={
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        </svg>
                                    }
                                    action="Build Collection"
                                    onClick={handleStore}
                                />
                                <OptionCard
                                    title="Ship to Home"
                                    desc="We'll mail the physical item to you globally."
                                    icon={
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="1" y="3" width="15" height="13" />
                                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                            <circle cx="5.5" cy="18.5" r="2.5" />
                                            <circle cx="18.5" cy="18.5" r="2.5" />
                                        </svg>
                                    }
                                    action="Get It Shipped"
                                    onClick={scrollToWaitlist}
                                    highlight
                                />
                                <OptionCard
                                    title="Claim Credits"
                                    desc="Instant sellback for platform credits."
                                    icon={
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="2" y="5" width="20" height="14" rx="2" />
                                            <line x1="2" y1="10" x2="22" y2="10" />
                                        </svg>
                                    }
                                    action={`Get $${tier.price * 10} Credits`}
                                    onClick={handleClaim}
                                />
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </motion.div>
    );
}

function OptionCard({ title, desc, icon, action, onClick, highlight = false }: any) {
    return (
        <button
            onClick={onClick}
            className={`p-6 rounded-xl border text-left transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer flex flex-col h-full bg-surface ${highlight
                ? "border-accent/50 shadow-[0_0_20px_rgba(255,45,149,0.1)] hover:border-accent"
                : "border-white/10 hover:border-white/30"
                }`}
        >
            <div className="text-3xl mb-4 text-white">{icon}</div>
            <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
            <p className="text-text-muted text-sm mb-6 flex-1">{desc}</p>
            <div className="mt-auto pt-4 border-t border-white/5 w-full">
                <span className={`text-sm font-bold uppercase tracking-wider ${highlight ? "text-accent" : "text-white"}`}>
                    {action} &rarr;
                </span>
            </div>
        </button>
    )
}

function ConfettiParticles() {
    // Generate random particles
    const particles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 200 - 100, // Spread X
        y: Math.random() * 200 - 150, // Spread Y (upward bias)
        color: Math.random() > 0.5 ? "var(--color-neon-green)" : "var(--color-accent)",
        scale: Math.random() * 0.5 + 0.5,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                    animate={{
                        opacity: 0,
                        z: 100,
                        x: p.x * 3,
                        y: p.y * 3,
                        rotate: Math.random() * 360,
                        scale: p.scale
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute w-3 h-3 rounded-full"
                    style={{ backgroundColor: p.color }}
                />
            ))}
        </div>
    );
}