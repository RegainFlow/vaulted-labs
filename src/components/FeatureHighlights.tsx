import { motion } from "motion/react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    title: "Collection",
    description: "Manage collectibles, ship or cashout items, and prep your squad.",
    href: "/collection",
    color: "#00f0ff",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    )
  },
  {
    title: "Arena",
    description: "Fight bosses with your squad and convert wins into shards and XP.",
    href: "/arena",
    color: "#ff2d95",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
        <path d="M12 18v-6M9 15l3-3 3 3" />
      </svg>
    )
  },
  {
    title: "Rank Up",
    description: "Level through XP, unlock tougher encounters, and prestige for better odds.",
    href: "/arena",
    color: "#ffd700",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  },
  {
    title: "Forge + Quests",
    description: "Forge stronger items and clear quests to accelerate long-term progression.",
    href: "/arena",
    color: "#39ff14",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v5" />
        <path d="M5.5 8.5l3.5 3.5" />
        <path d="M2 15h5" />
        <path d="M19 15h3" />
        <path d="M15 8l2-2" />
        <path d="M12 22a6.5 6.5 0 100-13 6.5 6.5 0 000 13z" />
      </svg>
    )
  }
];

export function FeatureHighlights() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 bg-bg">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                to={feature.href}
                className="block p-5 sm:p-6 rounded-2xl bg-surface border border-white/5 hover:border-white/15 transition-all duration-300 group h-full"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                >
                  {feature.icon}
                </div>
                <h3
                  className="text-sm font-black uppercase tracking-wide mb-1"
                  style={{ color: feature.color }}
                >
                  {feature.title}
                </h3>
                <p className="text-text-muted text-xs leading-relaxed mb-3">
                  {feature.description}
                </p>
                <span
                  className="text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1 transition-transform group-hover:translate-x-1"
                  style={{ color: feature.color }}
                >
                  Explore
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
