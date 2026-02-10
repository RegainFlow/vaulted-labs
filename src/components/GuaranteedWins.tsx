import { motion } from "motion/react";

export function GuaranteedWins() {
    return (
        <section className="py-24 bg-surface border-y border-white/5 relative overflow-hidden">
            {/* Background Beams */}
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center mb-16 relative"
                >
                    {/* Guaranteed Payout Circle */}
                    <div className="relative w-40 h-40 md:w-64 md:h-64 mb-10">
                        {/* Rotating Rings */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-4 border-dashed border-accent/30 rounded-full"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-4 border-2 border-white/10 rounded-full"
                        />

                        {/* Central Badge */}
                        <div className="absolute inset-8 bg-surface-elevated rounded-full border-4 border-accent shadow-[0_0_50px_rgba(255,45,149,0.4)] flex flex-col items-center justify-center text-center p-4">
                             {/* Gem Icon from image */}
                             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-1">
                                <path d="M6 3h12l4 6-10 13L2 9z" fill="url(#gem-gradient)" />
                                <defs>
                                    <linearGradient id="gem-gradient" x1="2" y1="3" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#00f0ff" />
                                        <stop offset="1" stopColor="#a855f7" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <h3 className="text-sm md:text-lg font-black text-white leading-tight uppercase tracking-tighter italic"> 
                                Guaranteed <br/> <span className="text-accent">Payout</span>
                            </h3>
                            <div className="mt-2 px-2 py-0.5 bg-accent/20 border border-accent/40 rounded text-[8px] font-black text-accent uppercase tracking-widest">
                                Verified Secure
                            </div>
                        </div>
                    </div>

                    {/* Popover Animation */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute top-0 right-[20%] md:right-[35%] bg-surface border border-white/10 p-3 rounded-lg shadow-xl rotate-6"
                    >
                        <span className="text-xs font-bold text-white uppercase italic tracking-widest">100% Success</span>
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">
                        <span className="text-white">Every Vault</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">Pays Out</span>
                    </h2>
                    <p className="text-text-muted mt-4 text-lg max-w-2xl">
                        No empty boxes. No rug pulls. Just legendary loot. 
                        Every vault contains an item worth at least 50% of the entry price.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        title="100% Win Rate"
                        desc="Every vault contains an item. No dead drops. Win rate is mathematically 100%."
                        icon={
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                <path d="M6 3h12l4 6-10 13L2 9z" fill="url(#feature-gem)" />
                                <defs>
                                    <linearGradient id="feature-gem" x1="2" y1="3" x2="22" y2="22">
                                        <stop stopColor="#00f0ff" />
                                        <stop offset="1" stopColor="#00bfff" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        }
                    />
                    <FeatureCard
                        title="Instant Liquidity"
                        desc="Don't want the item? Sell it back to the house instantly for platform credits."
                        icon={
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#feature-bolt)" />
                                <defs>
                                    <linearGradient id="feature-bolt" x1="3" y1="2" x2="21" y2="22">
                                        <stop stopColor="#ff8a00" />
                                        <stop offset="1" stopColor="#ff2d95" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        }
                    />
                    <FeatureCard
                        title="Provably Fair"
                        desc="All odds are verified on-chain. What you see is exactly what you get."
                        icon={
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="url(#feature-lock)" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="url(#feature-lock)" strokeWidth="2" />
                                <defs>
                                    <linearGradient id="feature-lock" x1="3" y1="7" x2="21" y2="22">
                                        <stop stopColor="#ffc700" />
                                        <stop offset="1" stopColor="#ff8a00" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        }
                    />
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl bg-bg border border-white/5 hover:border-accent/40 transition-colors group"
        >
            <div className="text-4xl mb-6 bg-surface-elevated w-20 h-20 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">{title}</h3>
            <p className="text-text-muted leading-relaxed">
                {desc}
            </p>
        </motion.div>
    )
}