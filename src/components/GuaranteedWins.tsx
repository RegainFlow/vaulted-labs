import { motion } from "motion/react";

export function GuaranteedWins() {
    return (
        <section className="py-32 bg-bg relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    {/* Left Side: Bold Badge Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex-1 relative"
                    >
                        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
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
                            <div className="absolute inset-8 bg-surface-elevated rounded-full border-4 border-accent shadow-[0_0_50px_rgba(255,45,149,0.4)] flex flex-col items-center justify-center text-center p-6">
                                <span className="text-5xl mb-2">💎</span>
                                <h3 className="text-2xl md:text-3xl font-black text-white leading-tight uppercase tracking-tighter italic">
                                    Guaranteed <br/> <span className="text-accent">Payout</span>
                                </h3>
                                <div className="mt-4 px-3 py-1 bg-accent/20 border border-accent/40 rounded text-[10px] font-black text-accent uppercase tracking-widest">
                                    Verified Secure
                                </div>
                            </div>
                        </div>

                        {/* Floating elements around badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -top-4 -right-4 bg-surface border border-white/10 p-3 rounded-lg shadow-xl"
                        >
                            <span className="text-xs font-bold text-white uppercase italic tracking-widest">100% Success</span>
                        </motion.div>
                    </motion.div>

                    {/* Right Side: Features */}
                    <div className="flex-[1.5] space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-6">
                                RUG-PROOF <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500 text-glow-magenta">LIQUIDITY PROTOCOL</span>
                            </h2>
                            <p className="text-text-muted text-lg max-w-xl">
                                We've eliminated the "empty box" problem. Every interaction with our vaults results in tangible value, guaranteed by our smart contract liquidity pool.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <SmallFeature
                                title="No Dead Drops"
                                desc="Every vault contains an item or credits. Win rate is mathematically 100%."
                                icon="📦"
                            />
                            <SmallFeature
                                title="Instant Buyback"
                                desc="Cash out your items for platform credits instantly. Zero wait time."
                                icon="💰"
                            />
                            <SmallFeature
                                title="On-Chain Odds"
                                desc="Our RNG is provably fair and verifiable on the public ledger."      
                                icon="🔗"
                            />
                            <SmallFeature
                                title="Global Shipping"
                                desc="Physical items are vault-secured and shipped with priority tracking."
                                icon="✈️"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SmallFeature({ title, desc, icon }: { title: string; desc: string; icon: string }) {
    return (
        <div className="p-6 rounded-xl bg-surface/50 border border-white/5 hover:border-white/10 transition-colors">
            <div className="text-2xl mb-4">{icon}</div>
            <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wide italic">{title}</h4> 
            <p className="text-text-muted text-xs leading-relaxed">
                {desc}
            </p>
        </div>
    )
}