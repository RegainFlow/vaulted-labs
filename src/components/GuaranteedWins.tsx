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
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">
                        <span className="text-white">Every Vault</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">Pays Out</span>
                    </h2>
                    <p className="text-text-muted mt-4 text-lg">
                        No empty boxes. No rug pulls. Just legendary loot.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        title="100% Win Rate"
                        desc="Every vault contains an item worth at least 50% of the entry price, with chances for 100x returns."
                        icon="💎"
                    />
                    <FeatureCard
                        title="Instant Liquidity"
                        desc="Don't want the item? Sell it back to the house instantly for platform credits."
                        icon="⚡"
                    />
                    <FeatureCard
                        title="Provably Fair"
                        desc="All odds are verified on-chain. What you see is exactly what you get."
                        icon="🔒"
                    />
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl bg-bg border border-white/5 hover:border-accent/40 transition-colors group"
        >
            <div className="text-4xl mb-6 bg-surface-elevated w-16 h-16 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">{title}</h3>
            <p className="text-text-muted leading-relaxed">
                {desc}
            </p>
        </motion.div>
    )
}
