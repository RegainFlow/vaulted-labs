import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { track } from "@vercel/analytics";
import type { Vault } from "../data/vaults";
import { RARITY_CONFIG, pickRarity, pickValue, pickProduct } from "../data/vaults";
import { VaultIcon } from "./VaultIcons";

type Stage = "paying" | "picking" | "revealing" | "result";

interface VaultOverlayProps {
    tier: Vault;
    balance: number;
    onClose: () => void;
    onClaim: (amount: number) => void;
    onStore: () => void;
}

export function VaultOverlay({ tier, balance, onClose, onClaim, onStore }: VaultOverlayProps) {
    const [stage, setStage] = useState<Stage>("paying");
    const [boxState, setBoxState] = useState<"closed" | "opening" | "open">("closed");

    // Pick a random rarity outcome, value within range, and product type
    const wonRarity = useMemo(() => pickRarity(tier.rarities), [tier]);
    const product = useMemo(() => pickProduct(), [tier]);
    const rarityConfig = RARITY_CONFIG[wonRarity];
    const resultValue = useMemo(() => pickValue(tier.price, rarityConfig), [tier, rarityConfig]);
    const isLoss = resultValue < tier.price;
    const net = resultValue - tier.price;
    // balance is already post-deduction (vault cost already subtracted)
    const preBalance = balance + tier.price;
    const postBalance = balance + resultValue;

    // Track vault open event
    useEffect(() => {
        track("vault_opened", { tier: tier.name, rarity: wonRarity });
    }, [tier.name, wonRarity]);

    // Auto-advance payment
    useEffect(() => {
        if (stage === "paying") {
            const timer = setTimeout(() => setStage("picking"), 2000); 
            return () => clearTimeout(timer);
        }
    }, [stage]);

    const pickBox = (_index: number) => {
        setStage("revealing");
        
        // Revealing Sequence
        setTimeout(() => setBoxState("opening"), 1200);
        setTimeout(() => setBoxState("open"), 1500);
        setTimeout(() => setStage("result"), 2500); 
    };

    const scrollToWaitlist = () => {
        onClose();
        document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
    };

    const handleClaim = () => {
        onClaim(resultValue);
        scrollToWaitlist();
    }

    const handleStore = () => {
        onStore();
        scrollToWaitlist();
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-bg/95 backdrop-blur-xl">
            <button
                onClick={onClose}
                className="fixed top-6 right-6 text-text-muted hover:text-white transition-colors cursor-pointer z-[60] p-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="min-h-full flex items-center justify-center p-4 py-12">
                <AnimatePresence mode="wait">

                    {/* STAGE 1: PAYING / UNLOCKING */}
                    {stage === "paying" && (
                        <motion.div
                            key="paying"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            className="flex flex-col items-center gap-8"
                        >
                            <div className="relative w-48 h-48">
                                {/* Vault Wheel Animation */}
                                <motion.div
                                    animate={{ rotate: [0, 90, -45, 180, 360] }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                    className="w-full h-full rounded-full border-8 border-white/10 flex items-center justify-center bg-surface-elevated shadow-2xl relative"
                                    style={{ borderColor: `${tier.color}20` }}
                                >
                                    {/* Wheel Spokes */}
                                    <div className="absolute inset-2 border-4 border-dashed border-white/20 rounded-full" />
                                    <div className="w-4 h-full bg-white/10 absolute rounded-full" />
                                    <div className="h-4 w-full bg-white/10 absolute rounded-full" />
                                    <div className="w-8 h-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] z-10" style={{ backgroundColor: tier.color }} />
                                </motion.div>
                            </div>

                            <div className="space-y-2 text-center">
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
                            className="space-y-12 w-full max-w-lg"
                        >
                            <div className="space-y-4 text-center">
                                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Initialize Retrieval</h2>
                                <p className="text-text-muted max-w-lg mx-auto text-sm md:text-base">
                                    Scanning sector 7. Select a containment unit to unseal.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-3 md:gap-6 perspective-[1000px]">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.05, translateZ: 20, borderColor: tier.color, boxShadow: `0 0 20px ${tier.color}30` }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => pickBox(i)}
                                        className="aspect-square relative rounded-xl border flex items-center justify-center shadow-lg group overflow-hidden cursor-pointer transition-all duration-300"
                                        style={{
                                            borderColor: `${tier.color}40`,
                                            backgroundColor: `${tier.color}08`,
                                            boxShadow: `0 0 10px ${tier.color}10`,
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Box Icon */}
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white filter drop-shadow-md group-hover:text-white transition-colors md:w-8 md:h-8">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                            <line x1="12" y1="22.08" x2="12" y2="12" />
                                        </svg>

                                        <div className="absolute bottom-1 right-1 text-[6px] md:text-[8px] font-mono group-hover:opacity-80" style={{ color: `${tier.color}60` }}>
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
                            className="flex flex-col items-center justify-center"
                        >
                            <div className="relative mb-12">
                                <AnimatePresence mode="wait">
                                    {boxState === "closed" && (
                                        <motion.div
                                            key="closed"
                                            animate={{
                                                rotate: [0, -5, 5, -5, 5, 0],
                                                scale: [1, 1.05, 1]
                                            }}
                                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.1 }}
                                            className="filter drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                                        >
                                            {/* Box Closed */}
                                            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white md:w-32 md:h-32">
                                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                                <line x1="12" y1="22.08" x2="12" y2="12" />
                                            </svg>
                                        </motion.div>
                                    )}
                                    
                                    {(boxState === "opening" || boxState === "open") && (
                                        <motion.div
                                            key="open"
                                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                                            animate={{ scale: 1.2, opacity: 1, y: 0 }}
                                            transition={{ type: "spring", damping: 12 }}
                                            className="filter drop-shadow-[0_0_80px_rgba(255,255,255,0.6)]"
                                        >
                                             {/* Box Open - Reveal the Tier Icon inside */}
                                             <div className="relative w-32 h-32 flex items-center justify-center">
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.2, type: "spring" }}
                                                >
                                                    <VaultIcon name={tier.name} color={tier.color} />
                                                </motion.div>
                                                
                                                {/* Light Rays */}
                                                <div className="absolute inset-0 animate-spin-slow">
                                                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                                                        <circle cx="50" cy="50" r="45" stroke={tier.color} strokeWidth="1" strokeDasharray="4 8" opacity="0.5" />
                                                    </svg>
                                                </div>
                                             </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="text-xl md:text-3xl font-black tracking-[0.3em] uppercase animate-pulse text-center break-words max-w-xs" style={{ color: tier.color }}>
                                {boxState === "closed" ? "Decompressing..." : "Sequence Complete"}
                            </div>
                        </motion.div>
                    )}

                    {/* STAGE 4: RESULT & OPTIONS */}
                    {stage === "result" && (
                        <motion.div
                            key="result"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", damping: 20 }}
                            className="space-y-8 relative w-full max-w-4xl flex flex-col items-center"
                        >
                            {/* Confetti — fewer particles for losses */}
                            <ConfettiParticles color={rarityConfig.color} count={isLoss ? 12 : 40} />

                            {/* Product type badge */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="z-10"
                            >
                                <span className="inline-block px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">
                                    {product}
                                </span>
                            </motion.div>

                            <div className="relative inline-block group z-10">
                                <div className="absolute inset-0 blur-[100px] animate-pulse transition-colors opacity-40" style={{ backgroundColor: rarityConfig.color }} />
                                <div className="relative flex items-center justify-center bg-surface-elevated rounded-3xl border-2 shadow-[0_0_60px_rgba(0,0,0,0.5)] w-64 h-64 md:w-80 md:h-80 mx-auto" style={{ borderColor: rarityConfig.color }}>
                                    {/* Tier Icon Large */}
                                    <div className="transform scale-150 filter drop-shadow-2xl">
                                        <VaultIcon name={tier.name} color={rarityConfig.color} />
                                    </div>

                                    <div className="absolute bottom-6 left-0 w-full text-center">
                                        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border" style={{ backgroundColor: `${rarityConfig.color}10`, borderColor: `${rarityConfig.color}40`, color: rarityConfig.color }}>
                                            Mint Condition
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 z-10 relative text-center">
                                <h3 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter">
                                    {rarityConfig.label}{rarityConfig.exclaim}
                                </h3>
                                <p className="text-lg md:text-xl text-text-muted">Estimated Market Value: <span className="font-black" style={{ color: rarityConfig.color }}>${resultValue}.00</span></p>
                            </div>

                            {/* Balance Breakdown */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="z-10 w-full max-w-md px-4"
                            >
                                <div className="bg-surface/80 backdrop-blur-xl rounded-xl border border-white/10 p-4 font-mono text-sm">
                                    <div className="flex items-center justify-between py-1.5">
                                        <span className="text-text-dim text-xs uppercase tracking-wider">Credits</span>
                                        <span className="text-white font-bold">${preBalance.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5">
                                        <span className="text-text-dim text-xs uppercase tracking-wider">{tier.name} Vault</span>
                                        <span className="text-error font-bold">-${tier.price.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5">
                                        <span className="text-text-dim text-xs uppercase tracking-wider">Item Value</span>
                                        <span className="font-bold" style={{ color: rarityConfig.color }}>+${resultValue.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-white/10 mt-1.5 pt-2.5 flex items-center justify-between">
                                        <span className="text-text-muted text-xs uppercase tracking-wider font-bold">New Balance</span>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-black px-2 py-0.5 rounded ${isLoss ? "bg-error/10 text-error" : "bg-neon-green/10 text-neon-green"}`}>
                                                {net >= 0 ? "+" : ""}{net.toFixed(2)}
                                            </span>
                                            <span className="text-white font-black text-base">${postBalance.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full px-4 z-10 relative">
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
                                    tierColor={tier.color}
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
                                    action={`Get $${resultValue} Credits`}
                                    onClick={handleClaim}
                                />
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}

interface OptionCardProps {
    title: string;
    desc: string;
    icon: React.ReactNode;
    action: string;
    onClick: () => void;
    highlight?: boolean;
    tierColor?: string;
}

function OptionCard({ title, desc, icon, action, onClick, highlight = false, tierColor }: OptionCardProps) {
    return (
        <button
            onClick={onClick}
            className={`p-5 md:p-6 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col h-full bg-surface-elevated/50 backdrop-blur-sm group ${highlight
                ? ""
                : "border-white/5 hover:border-white/20"
                }`}
            style={highlight ? { borderColor: tierColor, boxShadow: `0 0 20px ${tierColor}10` } : {}}
        >
            <div className="text-2xl md:text-3xl mb-3 md:mb-4 text-white group-hover:scale-110 transition-transform origin-left">{icon}</div>
            <h4 className="text-base md:text-lg font-black text-white mb-1 md:mb-2 uppercase tracking-wide">{title}</h4>
            <p className="text-text-muted text-xs leading-relaxed mb-4 flex-1">{desc}</p>
            <div className="mt-auto pt-3 md:pt-4 border-t border-white/5 w-full">
                <span className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2`} style={highlight ? { color: tierColor } : { color: 'white' }}>
                    {action} <span>&rarr;</span>
                </span>
            </div>
        </button>
    )
}

function ConfettiParticles({ color, count = 40 }: { color: string; count?: number }) {
    // Generate random particles
    const particles = Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 400 - 200, 
        y: Math.random() * 400 - 200, 
        color: Math.random() > 0.5 ? color : "#ffffff",
        scale: Math.random() * 0.8 + 0.2,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-0">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                    animate={{
                        opacity: 0,
                        x: p.x,
                        y: p.y,
                        rotate: Math.random() * 720,
                        scale: p.scale
                    }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute w-2 h-2 rounded-sm"
                    style={{ backgroundColor: p.color }}
                />
            ))}
        </div>
    );
}
