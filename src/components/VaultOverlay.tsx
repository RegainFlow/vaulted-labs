import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

type VaultTier = {
    name: string;
    price: number;
    color: string;
};

type Stage = "paying" | "picking" | "revealing" | "result";

interface VaultOverlayProps {
    tier: VaultTier;
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
                                    <div className="w-8 h-8 rounded-full shadow-2xl z-10" style={{ backgroundColor: tier.color, boxShadow: `0 0 20px ${tier.color}` }} />
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
                                        <div 
                                          className="absolute inset-0 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000" 
                                          style={{ backgroundImage: `linear-gradient(to bottom, transparent, ${tier.color}40, transparent)` }}
                                        />

                                        <span className="text-4xl filter drop-shadow-md">📦</span>      

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
                                className="text-9xl mb-12 filter drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                            >
                                📦
                            </motion.div>
                            <div className="text-2xl font-bold tracking-[0.5em] uppercase animate-pulse" style={{ color: tier.color }}>
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
                            <ConfettiParticles tierColor={tier.color} />

                            <div className="relative inline-block group z-10">
                                <div className="absolute inset-0 blur-3xl animate-pulse opacity-50 transition-colors" style={{ backgroundColor: tier.color }} />
                                <div className="relative flex items-center justify-center bg-surface-elevated rounded-2xl border-4 shadow-2xl w-64 h-64 md:w-80 md:h-80" style={{ borderColor: tier.color, boxShadow: `0 0 60px ${tier.color}40` }}>
                                    <span className="text-8xl">💎</span>
                                    <div className="absolute bottom-4 left-0 w-full text-center">
                                        <span className="inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: `${tier.color}20`, border: `1px solid ${tier.color}50`, color: tier.color }}>
                                            Mint Condition
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 z-10 relative">
                                <h3 className="text-4xl md:text-5xl font-black text-white">
                                    <span style={{ color: tier.color }}>Legendary</span> Pull!
                                </h3>
                                <p className="text-xl text-text-muted">Estimated Market Value: <span className="text-white font-bold">${tier.price * 10}.00</span></p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto px-4 z-10 relative">
                                <OptionCard
                                    title="Store to Vault"
                                    desc="Keep it secure in your digital portfolio."
                                    icon="🔒"
                                    action="Build Collection"
                                    onClick={handleStore}
                                    tierColor={tier.color}
                                />
                                <OptionCard
                                    title="Ship to Home"
                                    desc="We'll mail the physical item to you globally."
                                    icon="🚚"
                                    action="Get It Shipped"
                                    onClick={scrollToWaitlist}
                                    tierColor={tier.color}
                                    highlight
                                />
                                <OptionCard
                                    title="Claim Credits"
                                    desc="Instant sellback for platform credits."
                                    icon="💳"
                                    action={`Get $${tier.price * 10} Credits`}
                                    onClick={handleClaim}
                                    tierColor={tier.color}
                                />
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </motion.div>
    );
}

function OptionCard({ title, desc, icon, action, onClick, tierColor, highlight = false }: any) {
    return (
        <button
            onClick={onClick}
            className={`p-6 rounded-xl border text-left transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer flex flex-col h-full bg-surface ${highlight
                ? "shadow-[0_0_20px_rgba(255,45,149,0.1)]"
                : "border-white/10 hover:border-white/30"
                }`}
            style={{ 
                borderColor: highlight ? tierColor : undefined,
            }}
        >
            <div className="text-3xl mb-4">{icon}</div>
            <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
            <p className="text-text-muted text-sm mb-6 flex-1">{desc}</p>
            <div className="mt-auto pt-4 border-t border-white/5 w-full">
                <span className="text-sm font-bold uppercase tracking-wider" style={{ color: highlight ? tierColor : 'white' }}>
                    {action} →
                </span>
            </div>
        </button>
    )
}

function ConfettiParticles({ tierColor }: { tierColor: string }) {
    // Generate random particles
    const particles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 200 - 100, // Spread X
        y: Math.random() * 200 - 150, // Spread Y (upward bias)
        color: Math.random() > 0.5 ? tierColor : "var(--color-accent)",
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